import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

// POST — teacher creates a live session
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) {
    return NextResponse.json({ ok: false, error: "Not a teacher account" }, { status: 403 });
  }

  const { studentId, exercisePath } = await req.json() as { studentId: string; exercisePath: string };
  if (!studentId || !exercisePath) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("live_sessions")
    .insert({
      teacher_id: user.id,
      student_id: studentId,
      exercise_path: exercisePath,
    })
    .select("room_id")
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, roomId: data.room_id });
}

// GET — teacher or student fetches session info by room_id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("room");
  if (!roomId) return NextResponse.json({ ok: false, error: "Missing room" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("live_sessions")
    .select("room_id, teacher_id, student_id, exercise_path, expires_at")
    .eq("room_id", roomId)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Session not found" }, { status: 404 });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ ok: false, error: "Session expired" }, { status: 410 });
  }

  // Only teacher or student of this session may access it
  if (data.teacher_id !== user.id && data.student_id !== user.id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    roomId: data.room_id,
    teacherId: data.teacher_id,
    studentId: data.student_id,
    exercisePath: data.exercise_path,
  });
}
