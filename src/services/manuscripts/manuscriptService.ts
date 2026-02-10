// Manuscript management service
import { supabase } from "../shared/supabaseClient";
import {
  enrichManuscriptsWithEditors,
  getEditorsForManuscripts,
} from "../shared/helpers";
import type { Manuscript } from "@/lib/supabase";
import type { UserProfile } from "@/types/roles";
import { calculateReviewerStats, toBasicStats } from "@/utils/reviewerStats";

/**
 * Fetch all manuscripts
 * @returns All manuscripts from the database
 */
export async function getAllManuscripts(): Promise<Manuscript[]> {
  const { data, error } = await supabase
    .from("manuscripts")
    .select("*")
    .order("submission_date", { ascending: false });

  if (error) {
    console.error("Error fetching manuscripts:", error);
    throw error;
  }

  return enrichManuscriptsWithEditors(data || []);
}

/**
 * Fetch a single manuscript by ID
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptById(
  manuscriptId: string,
): Promise<Manuscript | null> {
  const { data, error } = await supabase
    .from("manuscripts")
    .select("*")
    .eq("id", manuscriptId)
    .single();

  if (error) {
    console.error("Error fetching manuscript by ID:", error);
    return null;
  }

  // Note: Access control checking removed - admins have implicit access to all manuscripts
  // If needed, implement explicit access check here for non-admin users
  // For now, returning manuscript if it exists (auth/access checked at route level)
  if (!data) return null;

  const [enriched] = await enrichManuscriptsWithEditors([data]);
  return enriched;
}

/**
 * Fetch invitation statistics for multiple manuscripts in a single query
 * Returns a map of manuscriptId -> stats for efficient lookup
 * @param manuscriptIds - Array of manuscript UUIDs
 */
export async function getManuscriptInvitationStats(
  manuscriptIds: string[],
): Promise<Map<string, import("@/utils/reviewerStats").ReviewerStats>> {
  if (manuscriptIds.length === 0) {
    return new Map();
  }

  // Fetch invitations
  const { data, error } = await supabase
    .from("review_invitations")
    .select("*")
    .in("manuscript_id", manuscriptIds);

  if (error) {
    console.error("Error fetching invitation stats:", error);
    return new Map();
  }

  // Fetch queue counts
  const { data: queueData, error: queueError } = await supabase
    .from("invitation_queue")
    .select("manuscript_id")
    .in("manuscript_id", manuscriptIds)
    .eq("sent", false);

  if (queueError) {
    console.error("Error fetching queue stats:", queueError);
  }

  // Count queue items per manuscript
  const queueCountMap = new Map<string, number>();
  manuscriptIds.forEach((id) => queueCountMap.set(id, 0));
  (queueData || []).forEach((item) => {
    const count = queueCountMap.get(item.manuscript_id) || 0;
    queueCountMap.set(item.manuscript_id, count + 1);
  });

  // Build stats map using calculateReviewerStats
  const statsMap = new Map<
    string,
    import("@/utils/reviewerStats").ReviewerStats
  >();

  // Group invitations by manuscript
  const invitationsByManuscript = new Map<string, typeof data>();
  manuscriptIds.forEach((id) => {
    invitationsByManuscript.set(id, []);
  });

  data?.forEach((invitation) => {
    const invitations = invitationsByManuscript.get(invitation.manuscript_id);
    if (invitations) {
      invitations.push(invitation);
    }
  });

  // Calculate stats for each manuscript
  invitationsByManuscript.forEach((invitations, manuscriptId) => {
    const extendedStats = calculateReviewerStats(invitations);
    extendedStats.queued = queueCountMap.get(manuscriptId) || 0;
    const basicStats = toBasicStats(extendedStats);
    statsMap.set(manuscriptId, basicStats);
  });

  return statsMap;
}

/**
 * Create a new manuscript
 * @param manuscript - Manuscript data (without id)
 */
export async function createManuscript(
  manuscript: Omit<
    Manuscript,
    "id" | "assignedEditors" | "assignedEditorIds"
  > & {
    editorIds?: string[];
  },
): Promise<Manuscript> {
  const { editorIds = [], ...insertData } = manuscript;

  const { data, error } = await supabase
    .from("manuscripts")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error creating manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to create manuscripts.",
      );
    }

    if (error.code === "23502" && error.message?.includes("editor_id")) {
      throw new Error(
        "Database still requires manuscripts.editor_id. Apply migration database/remove_editor_id_from_manuscripts.sql or make editor_id nullable.",
      );
    }

    throw new Error(
      `Failed to create manuscript: ${
        error.message || error.code || "Unknown error"
      }`,
    );
  }

  if (!data) {
    throw new Error("No data returned after creating manuscript");
  }

  const [enriched] = await enrichManuscriptsWithEditors([data as Manuscript]);

  const assignedEditors = await syncManuscriptEditors(enriched.id, editorIds);

  return {
    ...enriched,
    assignedEditors,
    assignedEditorIds: assignedEditors.map((e) => e.id),
  };
}

/**
 * Update an existing manuscript
 * @param id - Manuscript UUID
 * @param updates - Partial manuscript data to update
 */
export async function updateManuscript(
  id: string,
  updates: Partial<
    Omit<Manuscript, "assignedEditors" | "assignedEditorIds"> & {
      editorIds?: string[];
    }
  >,
): Promise<Manuscript> {
  // Strip non-column fields from updates
  const {
    id: _id, // eslint-disable-line @typescript-eslint/no-unused-vars
    assignedEditors, // eslint-disable-line @typescript-eslint/no-unused-vars
    assignedEditorIds, // eslint-disable-line @typescript-eslint/no-unused-vars
    editorIds,
    ...updateData
  } = updates as Manuscript & { editorIds?: string[] };

  const { data, error } = await supabase
    .from("manuscripts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to update manuscripts.",
      );
    }

    if (error.code === "23502" && error.message?.includes("editor_id")) {
      throw new Error(
        "Database still requires manuscripts.editor_id. Apply migration database/remove_editor_id_from_manuscripts.sql or make editor_id nullable.",
      );
    }

    throw new Error(
      `Failed to update manuscript: ${
        error.message || error.code || "Unknown error"
      }`,
    );
  }
  if (!data) {
    throw new Error("No data returned after updating manuscript");
  }

  const [enriched] = await enrichManuscriptsWithEditors([data as Manuscript]);

  if (editorIds !== undefined) {
    const assignedEditors = await syncManuscriptEditors(id, editorIds);
    return {
      ...enriched,
      assignedEditors,
      assignedEditorIds: assignedEditors.map((e) => e.id),
    };
  }

  return enriched;
}

/**
 * Delete a manuscript from the database
 * Note: This will fail if the manuscript has associated records (matches, invitations, assignments, etc.)
 * @param manuscriptId - The manuscript's UUID
 */
export async function deleteManuscript(manuscriptId: string): Promise<void> {
  const { error } = await supabase
    .from("manuscripts")
    .delete()
    .eq("id", manuscriptId);

  if (error) {
    console.error("Error deleting manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });

    // Provide user-friendly error message for foreign key constraint
    if (error.code === "23503") {
      throw new Error(
        "Cannot delete manuscript: it has existing matches, invitations, or assignments. Remove those first.",
      );
    }

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to delete manuscripts.",
      );
    }

    throw error;
  }
}

/**
 * Clear all invitations and queue items for a manuscript
 * Removes all pending/sent invitations and queued reviewer entries
 * @param manuscriptId - The manuscript's UUID
 * @returns Object with counts of removed invitations and queue items
 */
export async function clearManuscriptReviewers(manuscriptId: string): Promise<{
  removedInvitations: number;
  removedQueueItems: number;
}> {
  // Delete all invitations (regardless of status)
  const { data: invitations, error: invitationsError } = await supabase
    .from("review_invitations")
    .delete()
    .eq("manuscript_id", manuscriptId)
    .select();

  if (invitationsError) {
    console.error("Error clearing invitations:", {
      message: invitationsError.message,
      details: invitationsError.details,
      hint: invitationsError.hint,
      code: invitationsError.code,
    });
    throw new Error(`Failed to clear invitations: ${invitationsError.message}`);
  }

  // Delete all queue items
  const { data: queueItems, error: queueError } = await supabase
    .from("invitation_queue")
    .delete()
    .eq("manuscript_id", manuscriptId)
    .select();

  if (queueError) {
    console.error("Error clearing queue:", {
      message: queueError.message,
      details: queueError.details,
      hint: queueError.hint,
      code: queueError.code,
    });
    throw new Error(`Failed to clear queue: ${queueError.message}`);
  }

  return {
    removedInvitations: invitations?.length || 0,
    removedQueueItems: queueItems?.length || 0,
  };
}

/**
 * Synchronize editor assignments for a manuscript based on desired editor IDs.
 * Adds missing editors (reactivating if previously inactive) and deactivates removed ones.
 */
export async function syncManuscriptEditors(
  manuscriptId: string,
  editorIds: string[],
): Promise<UserProfile[]> {
  const desiredEditors = Array.from(new Set(editorIds.filter(Boolean)));

  const { data: existingEditors, error: fetchError } = await supabase
    .from("user_manuscripts")
    .select("id, user_id, is_active")
    .eq("manuscript_id", manuscriptId)
    .eq("role", "editor");

  if (fetchError) {
    console.error("Error fetching existing editor assignments:", fetchError);
    throw fetchError;
  }

  const toDeactivate = (existingEditors || []).filter(
    (row) => row.is_active && !desiredEditors.includes(row.user_id),
  );

  if (toDeactivate.length > 0) {
    const { error: deactivateError } = await supabase
      .from("user_manuscripts")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .in(
        "id",
        toDeactivate.map((row) => row.id),
      );

    if (deactivateError) {
      console.error("Error deactivating editor assignments:", deactivateError);
      throw deactivateError;
    }
  }

  const toAdd = desiredEditors.filter(
    (editorId) =>
      !(existingEditors || []).some(
        (row) => row.user_id === editorId && row.is_active,
      ),
  );

  // Import addUserToManuscript locally to avoid circular dependency
  const { addUserToManuscript } = await import(
    "../assignments/assignmentService"
  );

  for (const editorId of toAdd) {
    await addUserToManuscript(editorId, manuscriptId, "editor");
  }

  const editorMap = await getEditorsForManuscripts([manuscriptId]);
  return editorMap.get(manuscriptId) || [];
}
