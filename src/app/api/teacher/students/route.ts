import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/** PATCH /api/teacher/students — remove a student */
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { studentLinkId } = await req.json() as { studentLinkId: string };

  const { error } = await supabase
    .from("teacher_students")
    .update({ status: "removed" })
    .eq("id", studentLinkId)
    .eq("teacher_id", user.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** PUT /api/teacher/students — set custom nickname */
export async function PUT(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { studentLinkId, nickname, notes } = await req.json() as { studentLinkId: string; nickname?: string; notes?: string };
  if (!studentLinkId) return NextResponse.json({ ok: false, error: "studentLinkId required" }, { status: 400 });

  const update: Record<string, string | null> = {};
  if (nickname !== undefined) update.nickname = nickname?.trim() || null;
  if (notes !== undefined) update.notes = notes?.trim() || null;

  if (Object.keys(update).length === 0) return NextResponse.json({ ok: true });

  const { error } = await supabase
    .from("teacher_students")
    .update(update)
    .eq("id", studentLinkId)
    .eq("teacher_id", user.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
