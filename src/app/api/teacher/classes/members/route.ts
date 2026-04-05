import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/** POST /api/teacher/classes/members — add student to class */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { classId, studentId } = await req.json() as { classId: string; studentId: string };

  // Verify the class belongs to this teacher
  const { data: cls } = await supabase
    .from("teacher_classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", user.id)
    .maybeSingle();

  if (!cls) return NextResponse.json({ ok: false, error: "Class not found" }, { status: 404 });

  // Verify the student belongs to this teacher
  const { data: link } = await supabase
    .from("teacher_students")
    .select("id")
    .eq("teacher_id", user.id)
    .eq("student_id", studentId)
    .eq("status", "active")
    .maybeSingle();

  if (!link) return NextResponse.json({ ok: false, error: "Student not in your list" }, { status: 404 });

  const { error } = await supabase
    .from("class_members")
    .upsert({ class_id: classId, student_id: studentId });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/teacher/classes/members?classId=xxx&studentId=yyy */
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const studentId = searchParams.get("studentId");
  if (!classId || !studentId) return NextResponse.json({ ok: false, error: "classId and studentId required" }, { status: 400 });

  // Verify the class belongs to this teacher
  const { data: cls } = await supabase
    .from("teacher_classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", user.id)
    .maybeSingle();

  if (!cls) return NextResponse.json({ ok: false, error: "Class not found" }, { status: 404 });

  const { error } = await supabase
    .from("class_members")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
