// User-manuscript assignment management service
import { supabase } from "../shared/supabaseClient";
import { isUserAdmin, enrichManuscriptsWithEditors } from "../shared/helpers";
import type { ManuscriptWithUserRole, UserManuscript } from "@/lib/supabase";
import type { UserProfile } from "@/types/roles";

/**
 * Fetch manuscripts assigned to a specific user
 * @param userId - The user's UUID from auth
 * @param activeOnly - Return only active assignments
 */
export async function getUserManuscripts(
  userId: string,
  activeOnly: boolean = true,
): Promise<ManuscriptWithUserRole[]> {
  // Check if user is admin - admins see ALL manuscripts
  const isAdmin = await isUserAdmin(userId);

  if (isAdmin) {
    // For admins: Fetch ALL manuscripts AND their explicit assignments
    // This allows admins to see everything, but with their assigned role when applicable

    // 1. Get all manuscripts
    const { data: allManuscripts, error: manuscriptsError } = await supabase
      .from("manuscripts")
      .select("*")
      .order("submission_date", { ascending: false });

    if (manuscriptsError) {
      console.error("Error fetching manuscripts for admin:", manuscriptsError);
      throw manuscriptsError;
    }

    // 2. Get admin's explicit assignments
    const assignmentQuery = supabase
      .from("user_manuscripts")
      .select("manuscript_id, role, assigned_date")
      .eq("user_id", userId);

    if (activeOnly) {
      assignmentQuery.eq("is_active", true);
    }

    const { data: assignments, error: assignmentsError } =
      await assignmentQuery;

    if (assignmentsError) {
      console.error("Error fetching admin assignments:", assignmentsError);
      // Don't throw - continue with implicit access only
    }

    // 3. Create a map of explicit assignments
    const assignmentMap = new Map(
      (assignments || []).map((a) => [
        a.manuscript_id,
        { role: a.role, assigned_date: a.assigned_date },
      ]),
    );

    // 4. Merge: Use explicit role if exists, otherwise implicit 'admin' role
    const merged = (allManuscripts || []).map((manuscript) => {
      const explicitAssignment = assignmentMap.get(manuscript.id);

      if (explicitAssignment) {
        // Admin has explicit assignment - use that role (e.g., "editor", "reviewer")
        return {
          ...manuscript,
          user_role: explicitAssignment.role,
          assigned_date: explicitAssignment.assigned_date,
          is_active: true,
        };
      } else {
        // No explicit assignment - use implicit admin access
        return {
          ...manuscript,
          user_role: "admin" as const,
          assigned_date: new Date().toISOString(),
          is_active: true,
        };
      }
    });

    return enrichManuscriptsWithEditors(merged);
  }

  // Non-admin: Fetch only assigned manuscripts from user_manuscripts
  const query = supabase
    .from("user_manuscripts")
    .select(
      `
      role,
      assigned_date,
      manuscripts (*)
    `,
    )
    .eq("user_id", userId);

  if (activeOnly) {
    query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user manuscripts:", error);
    throw error;
  }

  // Transform the nested structure to flat ManuscriptWithUserRole
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped = (data || []).map((item: any) => ({
    ...item.manuscripts,
    user_role: item.role,
    assigned_date: item.assigned_date,
  }));

  return enrichManuscriptsWithEditors(mapped);
}

/**
 * Fetch all user profiles
 * @returns All user profiles from the database
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get all user-manuscript assignments
 * @returns All user-manuscript assignments with user and manuscript details
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllUserManuscriptAssignments(): Promise<any[]> {
  const { data, error } = await supabase
    .from("user_manuscripts")
    .select(
      `
      id,
      user_id,
      manuscript_id,
      role,
      assigned_date,
      is_active,
      user_profiles (
        email,
        full_name
      ),
      manuscripts (
        title,
        custom_id,
        journal,
        status
      )
    `,
    )
    .order("assigned_date", { ascending: false });

  if (error) {
    console.error("Error fetching user manuscript assignments:", error);
    throw error;
  }

  return data || [];
}

/**
 * Add a user to a manuscript
 * @param userId - The user's UUID
 * @param manuscriptId - The manuscript UUID
 * @param role - The user's role for this manuscript
 * @returns The created assignment
 */
export async function addUserToManuscript(
  userId: string,
  manuscriptId: string,
  role: "editor" | "author" | "collaborator" | "reviewer" = "editor",
): Promise<UserManuscript> {
  // Check if assignment already exists
  const { data: existing } = await supabase
    .from("user_manuscripts")
    .select("id, is_active")
    .eq("user_id", userId)
    .eq("manuscript_id", manuscriptId)
    .single();

  if (existing) {
    if (existing.is_active) {
      throw new Error("User is already assigned to this manuscript");
    } else {
      // Reactivate the existing assignment
      const { data, error } = await supabase
        .from("user_manuscripts")
        .update({ is_active: true, role, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error reactivating user manuscript assignment:", error);
        throw error;
      }

      return data as UserManuscript;
    }
  }

  // Create new assignment
  const { data, error } = await supabase
    .from("user_manuscripts")
    .insert({
      user_id: userId,
      manuscript_id: manuscriptId,
      role,
      assigned_date: new Date().toISOString(),
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding user to manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  return data as UserManuscript;
}

/**
 * Remove a user from a manuscript (soft delete by setting is_active to false)
 * @param userId - The user's UUID
 * @param manuscriptId - The manuscript UUID
 */
export async function removeUserFromManuscript(
  userId: string,
  manuscriptId: string,
): Promise<void> {
  const { error } = await supabase
    .from("user_manuscripts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("manuscript_id", manuscriptId);

  if (error) {
    console.error("Error removing user from manuscript:", error);
    throw error;
  }
}

/**
 * Update a user's role for a manuscript
 * @param userId - The user's UUID
 * @param manuscriptId - The manuscript UUID
 * @param role - The new role
 */
export async function updateUserManuscriptRole(
  userId: string,
  manuscriptId: string,
  role: "editor" | "author" | "collaborator" | "reviewer",
): Promise<void> {
  const { error } = await supabase
    .from("user_manuscripts")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("manuscript_id", manuscriptId);

  if (error) {
    console.error("Error updating user manuscript role:", error);
    throw error;
  }
}
