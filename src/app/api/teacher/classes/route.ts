import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/** POST /api/teacher/classes — create a class */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { name, description, emoji } = await req.json() as { name: string; description?: string; emoji?: string };
  if (!name?.trim()) return NextResponse.json({ ok: false, error: "Class name required" }, { status: 400 });

  const { data, error } = await supabase
    .from("teacher_classes")
    .insert({ teacher_id: user.id, name: name.trim(), description: description?.trim() ?? null, emoji: emoji ?? "📚" })
    .select("id, name, description, created_at, emoji")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, class: data });
}

/** PATCH /api/teacher/classes — update class emoji */
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { classId, emoji } = await req.json() as { classId: string; emoji: string };
  if (!classId || !emoji) return NextResponse.json({ ok: false, error: "classId and emoji required" }, { status: 400 });

  const { error } = await supabase
    .from("teacher_classes")
    .update({ emoji })
    .eq("id", classId)
    .eq("teacher_id", user.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/teacher/classes?classId=xxx */
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  if (!classId) return NextResponse.json({ ok: false, error: "classId required" }, { status: 400 });

  const { error } = await supabase
    .from("teacher_classes")
    .delete()
    .eq("id", classId)
    .eq("teacher_id", user.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
