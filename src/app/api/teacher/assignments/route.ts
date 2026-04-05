import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";
import { sendAssignmentEmail } from "@/lib/email";

/** POST /api/teacher/assignments — create an assignment */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    title: string;
    category: string;
    level?: string;
    slug?: string;
    exerciseNo?: number;
    dueDate?: string;
    prompt?: string;
    minWords?: number;
    targets: Array<{ studentId?: string; classId?: string }>;
    skipEmail?: boolean;
  };

  if (!body.title?.trim() || !body.category) {
    return NextResponse.json({ ok: false, error: "title and category are required" }, { status: 400 });
  }
  const isEssay = body.category === "essay";
  const slug = isEssay
    ? body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)
    : body.slug;
  if (!isEssay && !slug) {
    return NextResponse.json({ ok: false, error: "slug is required for exercise assignments" }, { status: 400 });
  }

  // Create the assignment
  const { data: assignment, error: aErr } = await supabase
    .from("teacher_assignments")
    .insert({
      teacher_id: user.id,
      title: body.title.trim(),
      category: body.category,
      level: body.level ?? null,
      slug: slug!,
      exercise_no: body.exerciseNo ?? null,
      due_date: body.dueDate ?? null,
      prompt: body.prompt?.trim() || null,
      min_words: body.minWords ?? null,
    })
    .select("id, title, category, level, slug, exercise_no, due_date, prompt, min_words, created_at")
    .single();

  if (aErr || !assignment) return NextResponse.json({ ok: false, error: aErr?.message }, { status: 500 });

  // Insert targets
  const targetStudentIds: string[] = [];
  const targetClassIds: string[] = [];
  if (body.targets?.length) {
    const targetRows = body.targets.map((t) => ({
      assignment_id: assignment.id,
      student_id: t.studentId ?? null,
      class_id: t.classId ?? null,
    }));
    const { error: tErr } = await supabase.from("assignment_targets").insert(targetRows);
    if (tErr) return NextResponse.json({ ok: false, error: tErr.message }, { status: 500 });
    body.targets.forEach((t) => {
      if (t.studentId) targetStudentIds.push(t.studentId);
      if (t.classId) targetClassIds.push(t.classId);
    });
  }

  // ── Send email notifications (fire-and-forget) ───────────────────────────
  if (!body.skipEmail) {
    void (async () => {
      try {
        // Get teacher name from profiles
        const { data: teacherProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();
        const teacherName = teacherProfile?.full_name || "";

        // Build the list of student IDs to notify
        let studentIds: string[] = [...targetStudentIds];

        // Resolve class targets → student IDs
        if (targetClassIds.length > 0) {
          const { data: classMembers } = await supabase
            .from("class_members")
            .select("student_id")
            .in("class_id", targetClassIds);
          if (classMembers) {
            studentIds = [...new Set([...studentIds, ...classMembers.map((m) => m.student_id as string)])];
          }
        }

        // "Everyone" → all active students of this teacher
        if (body.targets?.length === 0) {
          const { data: allLinks } = await supabase
            .from("teacher_students")
            .select("student_id")
            .eq("teacher_id", user.id)
            .eq("status", "active")
            .not("student_id", "is", null);
          if (allLinks) studentIds = allLinks.map((r) => r.student_id as string);
        }

        if (studentIds.length === 0) return;

        // Fetch invite_email from teacher_students (for contact info)
        // Filter by status=active and deduplicate by student_id to avoid multiple emails
        const { data: rawLinks } = await supabase
          .from("teacher_students")
          .select("student_id, invite_email")
          .eq("teacher_id", user.id)
          .eq("status", "active")
          .in("student_id", studentIds);

        // Deduplicate by email — one email per address, period
        const seenEmails = new Set<string>();
        const studentLinks = (rawLinks ?? []).filter((l) => {
          const email = l.invite_email as string | null;
          if (!email || seenEmails.has(email)) return false;
          seenEmails.add(email);
          return true;
        });

        if (!studentLinks.length) return;

        // Fetch student profile names from profiles table
        const profileIds = studentLinks.map((l) => l.student_id as string).filter(Boolean);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", profileIds);
        const profileMap = new Map((profiles ?? []).map((p) => [p.id as string, p.full_name as string | null]));

        // Parse instructions/resourceUrl from prompt
        let instructions: string | null = null;
        let resourceUrl: string | null = null;
        if (body.prompt) {
          try {
            const parsed = JSON.parse(body.prompt) as { text?: string; url?: string };
            instructions = parsed.text || null;
            resourceUrl = parsed.url || null;
          } catch {
            instructions = body.prompt;
          }
        }

        const href = !isEssay && body.category !== "homework" && body.category !== "quiz"
          ? `/${body.category}${body.level ? `/${body.level}` : ""}/${slug}`
          : "/account";

        for (const link of studentLinks) {
          const email = link.invite_email as string | null;
          if (!email) continue;
          const studentName = profileMap.get(link.student_id as string) ?? null;
          await sendAssignmentEmail({
            to: email,
            studentName,
            teacherName,
            assignmentTitle: assignment.title,
            assignmentType: body.category,
            dueDate: body.dueDate ?? null,
            instructions,
            resourceUrl,
            href,
          });
        }
      } catch (e) {
        console.error("[email] error:", e);
      }
    })();
  }

  return NextResponse.json({
    ok: true,
    assignment: {
      id: assignment.id,
      title: assignment.title,
      category: assignment.category,
      level: assignment.level,
      slug: assignment.slug,
      exerciseNo: assignment.exercise_no,
      dueDate: assignment.due_date,
      prompt: assignment.prompt,
      minWords: assignment.min_words,
      createdAt: assignment.created_at,
      targetStudentIds,
      targetClassIds,
    },
  });
}

/** DELETE /api/teacher/assignments?assignmentId=xxx */
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return NextResponse.json({ ok: false, error: "assignmentId required" }, { status: 400 });

  const { error } = await supabase
    .from("teacher_assignments")
    .delete()
    .eq("id", assignmentId)
    .eq("teacher_id", user.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
