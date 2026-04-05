import type { SupabaseClient } from "@supabase/supabase-js";

export interface StudentStatus {
  isStudent: boolean;
  teacherIds: string[];
  /** Pending teacher invites waiting for student confirmation */
  pendingLinks: Array<{ linkId: string; teacherId: string }>;
  /** Active link IDs by teacher (for unlink) */
  activeLinkByTeacher: Record<string, string>;
}

export async function getStudentStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentStatus> {
  const { data: rows } = await supabase
    .from("teacher_students")
    .select("id, teacher_id, status")
    .eq("student_id", userId)
    .in("status", ["active", "pending_student"]);

  const activeRows = (rows ?? []).filter((r) => r.status === "active");
  const pendingRows = (rows ?? []).filter((r) => r.status === "pending_student");

  const teacherIds = activeRows.map((r) => r.teacher_id as string);
  const pendingLinks = pendingRows.map((r) => ({ linkId: r.id as string, teacherId: r.teacher_id as string }));
  const activeLinkByTeacher: Record<string, string> = {};
  for (const r of activeRows) {
    activeLinkByTeacher[r.teacher_id as string] = r.id as string;
  }

  return {
    isStudent: teacherIds.length > 0,
    teacherIds,
    pendingLinks,
    activeLinkByTeacher,
  };
}
