import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/** GET /api/teacher/live-students — returns teacher's active students for live share */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const svc = createServiceClient();

  // Get active students with nicknames
  const { data: links } = await svc
    .from("teacher_students")
    .select("student_id, nickname, invite_email")
    .eq("teacher_id", user.id)
    .eq("status", "active")
    .not("student_id", "is", null);

  if (!links || links.length === 0) {
    return NextResponse.json({ ok: true, students: [] });
  }

  // Fetch real names from auth.users via admin API
  const studentIds = links.map((l) => l.student_id as string);
  const profileResults = await Promise.all(
    studentIds.map((id) => svc.auth.admin.getUserById(id))
  );

  const metaById = new Map<string, { name: string; avatarUrl: string | null }>();
  for (const { data } of profileResults) {
    if (data?.user) {
      const m = data.user.user_metadata ?? {};
      metaById.set(data.user.id, {
        name: (m.full_name ?? m.name ?? "") as string,
        avatarUrl: (m.avatar_url ?? m.picture ?? null) as string | null,
      });
    }
  }

  const students = links.map((link) => {
    const sid = link.student_id as string;
    const meta = metaById.get(sid);
    const nickname = link.nickname as string | null;
    const email = link.invite_email as string | null;
    const rawName = meta?.name || "";
    const displayName = nickname || rawName || (email ? email.split("@")[0] : "Student");
    return {
      id: sid,
      name: displayName,
      avatarUrl: meta?.avatarUrl ?? null,
    };
  });

  return NextResponse.json({ ok: true, students });
}
