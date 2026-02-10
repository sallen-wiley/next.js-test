// Shared helper functions for data services
import { supabase } from "./supabaseClient";
import type { Manuscript } from "@/lib/supabase";
import type { UserProfile } from "@/types/roles";

/**
 * Helper function to check if a user has admin role
 * @param userId - The user UUID
 * @returns true if user is admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === "admin";
}

/**
 * Fetch active editor assignments for a set of manuscripts.
 * Editors are users with role "editor" in user_manuscripts.
 */
export async function getEditorsForManuscripts(
  manuscriptIds: string[],
): Promise<Map<string, UserProfile[]>> {
  if (manuscriptIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("user_manuscripts")
    .select(
      `
      manuscript_id,
      user_profiles (*)
    `,
    )
    .eq("role", "editor")
    .eq("is_active", true)
    .in("manuscript_id", manuscriptIds);

  if (error) {
    console.error("Error fetching manuscript editors:", error);
    throw error;
  }

  const map = new Map<string, UserProfile[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data || []).forEach((row: any) => {
    const existing = map.get(row.manuscript_id) || [];
    if (row.user_profiles) {
      existing.push(row.user_profiles as UserProfile);
    }
    map.set(row.manuscript_id, existing);
  });

  return map;
}

/**
 * Attach editor assignments (users) to manuscripts as assignedEditors / assignedEditorIds.
 */
export async function enrichManuscriptsWithEditors<T extends Manuscript>(
  manuscripts: T[],
): Promise<T[]> {
  const editorMap = await getEditorsForManuscripts(
    manuscripts.map((m) => m.id),
  );

  return manuscripts.map((manuscript) => {
    const editors = editorMap.get(manuscript.id) || [];
    return {
      ...manuscript,
      assignedEditors: editors,
      assignedEditorIds: editors.map((e) => e.id),
    };
  });
}
