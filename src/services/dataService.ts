// Data service for reviewer invitation system
import { supabase } from "@/lib/supabase";
import {
  Manuscript,
  PotentialReviewer,
  ReviewInvitation,
  ReviewInvitationWithReviewer,
  InvitationQueueItem,
  UserManuscript,
  ManuscriptWithUserRole,
  PotentialReviewerWithMatch,
} from "@/lib/supabase";
import type { UserProfile } from "@/types/roles";
import { calculateReviewerStats, toBasicStats } from "@/utils/reviewerStats";
import {
  isInstitutionalEmail,
  calculateAcceptanceRate,
  daysSince,
  countSoloAuthored,
  countRecentPublications,
  countRelatedPublications,
} from "@/utils/reviewerMetrics";

/**
 * Helper function to check if a user has admin role
 * @param userId - The user UUID
 * @returns true if user is admin, false otherwise
 */
async function isUserAdmin(userId: string): Promise<boolean> {
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
async function getEditorsForManuscripts(
  manuscriptIds: string[]
): Promise<Map<string, UserProfile[]>> {
  if (manuscriptIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("user_manuscripts")
    .select(
      `
      manuscript_id,
      user_profiles (*)
    `
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
async function enrichManuscriptsWithEditors<T extends Manuscript>(
  manuscripts: T[]
): Promise<T[]> {
  const editorMap = await getEditorsForManuscripts(
    manuscripts.map((m) => m.id)
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

// ============================================================================
// User Manuscript Assignment Functions
// ============================================================================

// ============================================================================
// User Manuscript Assignment Functions
// ============================================================================

/**
 * Fetch manuscripts assigned to a specific user
 * @param userId - The user's UUID from auth
 * @param activeOnly - Return only active assignments
 */
export async function getUserManuscripts(
  userId: string,
  activeOnly: boolean = true
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
      ])
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
    `
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
 * Fetch potential reviewers for a specific manuscript with match scores
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptReviewers(
  manuscriptId: string
): Promise<PotentialReviewerWithMatch[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      match_score,
      conflicts_of_interest,
      potential_reviewers (*)
    `
    )
    .eq("manuscript_id", manuscriptId)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("Error fetching manuscript reviewers:", error);
    throw error;
  }

  // Get unique reviewer IDs
  const reviewerIds = (data || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => item.potential_reviewers.id
  );

  // Fetch publications for all reviewers in parallel
  const { data: publications } = await supabase
    .from("reviewer_publications")
    .select("id, reviewer_id, authors, publication_date")
    .in("reviewer_id", reviewerIds);

  // Fetch related publications for this manuscript
  const { data: relatedPublications } = await supabase
    .from("manuscript_publication_matches")
    .select("publication_id")
    .eq("manuscript_id", manuscriptId);

  const relatedPublicationIds = new Set(
    (relatedPublications || []).map((m) => m.publication_id)
  );

  // Group publications by reviewer_id
  const publicationsByReviewer = new Map<
    string,
    Array<{
      authors: string[] | null;
      publication_date: string | null;
      is_related: boolean;
    }>
  >();

  (publications || []).forEach((pub) => {
    const existing = publicationsByReviewer.get(pub.reviewer_id) || [];
    existing.push({
      authors: pub.authors,
      publication_date: pub.publication_date,
      is_related: relatedPublicationIds.has(pub.id), // Check if related to this manuscript
    });
    publicationsByReviewer.set(pub.reviewer_id, existing);
  });

  // Transform the nested structure to include match_score, conflicts, and calculated fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((item: any) => {
    const reviewer = item.potential_reviewers;
    const reviewerPubs = publicationsByReviewer.get(reviewer.id) || [];

    return {
      ...reviewer,
      match_score: item.match_score,
      conflicts_of_interest: item.conflicts_of_interest || "",
      email_is_institutional: isInstitutionalEmail(reviewer.email),
      acceptance_rate: calculateAcceptanceRate(
        reviewer.total_acceptances || 0,
        reviewer.total_invitations || 0
      ),
      related_publications_count: countRelatedPublications(reviewerPubs),
      solo_authored_count: countSoloAuthored(reviewerPubs),
      publications_last_5_years: countRecentPublications(reviewerPubs, 5),
      days_since_last_review: daysSince(reviewer.last_review_completed),
    };
  });
}

/**
 * Fetch all potential reviewers (for browsing/searching entire database)
 * Returns reviewers without match scores
 */
export async function getAllReviewers(): Promise<PotentialReviewer[]> {
  const { data, error } = await supabase
    .from("potential_reviewers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all reviewers:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch review invitations for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptInvitations(
  manuscriptId: string
): Promise<ReviewInvitationWithReviewer[]> {
  // Fetch invitations without join
  const { data, error } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .order("invited_date", { ascending: false });

  if (error) {
    console.error("Error fetching manuscript invitations:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique reviewer IDs
  const reviewerIds = [...new Set(data.map((inv) => inv.reviewer_id))];

  // Fetch reviewer details for all reviewer IDs
  const { data: reviewers } = await supabase
    .from("potential_reviewers")
    .select("id, name, affiliation")
    .in("id", reviewerIds);

  // Create a map of reviewer data
  const reviewerMap = new Map((reviewers || []).map((r) => [r.id, r]));

  // Combine invitation data with reviewer details
  const invitations: ReviewInvitationWithReviewer[] = data.map((item) => {
    const reviewer = reviewerMap.get(item.reviewer_id);
    return {
      id: item.id,
      manuscript_id: item.manuscript_id,
      reviewer_id: item.reviewer_id,
      invited_date: item.invited_date,
      due_date: item.due_date,
      status: item.status,
      response_date: item.response_date,
      queue_position: item.queue_position,
      invitation_round: item.invitation_round,
      notes: item.notes,
      reminder_count: item.reminder_count,
      estimated_completion_date: item.estimated_completion_date,
      invitation_expiration_date: item.invitation_expiration_date,
      report_invalidated_date: item.report_invalidated_date,
      reviewer_name: reviewer?.name || "Unknown Reviewer",
      reviewer_affiliation: reviewer?.affiliation,
    };
  });

  return invitations;
}

/**
 * Fetch invitation statistics for multiple manuscripts in a single query
 * Returns a map of manuscriptId -> stats for efficient lookup
 * @param manuscriptIds - Array of manuscript UUIDs
 */
export async function getManuscriptInvitationStats(
  manuscriptIds: string[]
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
 * Fetch a single manuscript by ID
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptById(
  manuscriptId: string
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
 * Fetch invitation queue for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptQueue(
  manuscriptId: string
): Promise<InvitationQueueItem[]> {
  // Fetch queue items without join
  const { data, error } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: true });

  if (error) {
    console.error("Error fetching manuscript queue:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique reviewer IDs
  const reviewerIds = [...new Set(data.map((item) => item.reviewer_id))];

  // Fetch reviewer details for all reviewer IDs
  const { data: reviewers } = await supabase
    .from("potential_reviewers")
    .select("id, name, affiliation")
    .in("id", reviewerIds);

  // Create a map of reviewer data
  const reviewerMap = new Map((reviewers || []).map((r) => [r.id, r]));

  // Combine queue data with reviewer details
  const queueItems: InvitationQueueItem[] = data.map((item) => {
    const reviewer = reviewerMap.get(item.reviewer_id);
    return {
      id: item.id,
      manuscript_id: item.manuscript_id,
      reviewer_id: item.reviewer_id,
      queue_position: item.queue_position,
      created_date: item.created_date,
      scheduled_send_date: item.scheduled_send_date,
      priority: item.priority,
      notes: item.notes,
      reviewer_name: reviewer?.name || "Unknown Reviewer",
      reviewer_affiliation: reviewer?.affiliation,
    };
  });

  return queueItems;
}

/**
 * Add a reviewer to the invitation queue
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @param priority - Queue priority level
 */
export async function addToQueue(
  manuscriptId: string,
  reviewerId: string,
  priority: "high" | "normal" | "low" = "normal"
): Promise<InvitationQueueItem | null> {
  // Check if reviewer already has an invitation
  const { data: existingInvitation } = await supabase
    .from("review_invitations")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingInvitation) {
    throw new Error(
      "Cannot add to queue: Reviewer already has an invitation for this manuscript"
    );
  }

  // Check if reviewer is already in queue
  const { data: existingQueueItem } = await supabase
    .from("invitation_queue")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingQueueItem) {
    throw new Error("Reviewer is already in the queue for this manuscript");
  }

  // Get current max position for this manuscript
  const { data: existingQueue } = await supabase
    .from("invitation_queue")
    .select("queue_position")
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: false })
    .limit(1);

  const nextPosition =
    existingQueue && existingQueue.length > 0
      ? existingQueue[0].queue_position + 1
      : 1;

  // Calculate scheduled send date (weekly intervals)
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + nextPosition * 7);

  const { data, error } = await supabase
    .from("invitation_queue")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      queue_position: nextPosition,
      scheduled_send_date: scheduledDate.toISOString(),
      priority,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding to queue:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    throw new Error(
      `Failed to add to queue: ${error.message || JSON.stringify(error)}`
    );
  }

  if (!data) {
    return null;
  }

  // Fetch reviewer details
  const { data: reviewer } = await supabase
    .from("potential_reviewers")
    .select("name, affiliation")
    .eq("id", reviewerId)
    .single();

  // Return with reviewer details
  return {
    ...data,
    reviewer_name: reviewer?.name || "Unknown Reviewer",
    reviewer_affiliation: reviewer?.affiliation,
  };
}

/**
 * Remove a reviewer from the invitation queue
 * @param queueItemId - The queue item UUID
 */
export async function removeFromQueue(queueItemId: string): Promise<void> {
  // First, get the item being removed to know its position and manuscript
  const { data: itemToRemove, error: fetchError } = await supabase
    .from("invitation_queue")
    .select("queue_position, manuscript_id")
    .eq("id", queueItemId)
    .single();

  if (fetchError) {
    console.error("Error fetching queue item:", fetchError);
    throw fetchError;
  }

  // Delete the item
  const { error: deleteError } = await supabase
    .from("invitation_queue")
    .delete()
    .eq("id", queueItemId);

  if (deleteError) {
    console.error("Error removing from queue:", deleteError);
    throw deleteError;
  }

  // Renumber remaining items with higher positions
  // Get all items with higher positions in the same manuscript queue
  const { data: itemsToRenumber, error: renumberFetchError } = await supabase
    .from("invitation_queue")
    .select("id, queue_position")
    .eq("manuscript_id", itemToRemove.manuscript_id)
    .gt("queue_position", itemToRemove.queue_position)
    .order("queue_position", { ascending: true });

  if (renumberFetchError) {
    console.error("Error fetching items to renumber:", renumberFetchError);
    throw renumberFetchError;
  }

  // Update positions (decrement each by 1)
  if (itemsToRenumber && itemsToRenumber.length > 0) {
    const updates = itemsToRenumber.map((item) => ({
      id: item.id,
      queue_position: item.queue_position - 1,
    }));

    await updateQueuePositions(updates);
  }
}

/**
 * Remove a review invitation completely
 * This resets the reviewer back to potential reviewers list
 * @param invitationId - The invitation UUID
 */
export async function removeInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from("review_invitations")
    .delete()
    .eq("id", invitationId);

  if (error) {
    console.error("Error removing invitation:", error);
    throw error;
  }
}

/**
 * Update queue positions (for drag-and-drop reordering)
 * @param updates - Array of {id, newPosition} objects
 */
export async function updateQueuePositions(
  updates: Array<{ id: string; queue_position: number }>
): Promise<void> {
  // Update each item's position
  const promises = updates.map(({ id, queue_position }) =>
    supabase.from("invitation_queue").update({ queue_position }).eq("id", id)
  );

  const results = await Promise.all(promises);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Error updating queue positions:", errors);
    throw new Error("Failed to update queue positions");
  }
}

/**
 * Get reviewers with their current status in the invitation workflow
 * Combines data from invitation_queue, review_invitations, and potential_reviewers
 * @param manuscriptId - The manuscript UUID
 */
export async function getReviewersWithStatus(
  manuscriptId: string
): Promise<import("@/lib/supabase").ReviewerWithStatus[]> {
  // Get all potential reviewers with match scores
  const { data: matchedReviewers, error: matchError } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      match_score,
      potential_reviewers (*)
    `
    )
    .eq("manuscript_id", manuscriptId);

  if (matchError) {
    console.error("Error fetching matched reviewers:", matchError);
    throw matchError;
  }

  // Get queue items for this manuscript
  const { data: queueItems, error: queueError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .eq("sent", false);

  if (queueError) {
    console.error("Error fetching queue:", queueError);
    throw queueError;
  }

  // Get invitations for this manuscript
  const { data: invitations, error: invitationError } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("manuscript_id", manuscriptId);

  if (invitationError) {
    console.error("Error fetching invitations:", invitationError);
    throw invitationError;
  }

  // Collect all unique reviewer IDs from queue and invitations
  const reviewerIdsInWorkflow = new Set<string>();
  (queueItems || []).forEach((q) => reviewerIdsInWorkflow.add(q.reviewer_id));
  (invitations || []).forEach((i) => reviewerIdsInWorkflow.add(i.reviewer_id));

  // Get reviewer IDs from matches
  const matchedReviewerIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (matchedReviewers || []).map((m: any) => m.potential_reviewers.id)
  );

  // Find reviewer IDs that are in workflow but not in matches
  const unmatchedReviewerIds = Array.from(reviewerIdsInWorkflow).filter(
    (id) => !matchedReviewerIds.has(id)
  );

  // Fetch unmatched reviewers from potential_reviewers table
  let unmatchedReviewers = [];
  if (unmatchedReviewerIds.length > 0) {
    const { data: additionalReviewers } = await supabase
      .from("potential_reviewers")
      .select("*")
      .in("id", unmatchedReviewerIds);
    unmatchedReviewers = additionalReviewers || [];
  }

  // Build lookup maps
  const queueMap = new Map((queueItems || []).map((q) => [q.reviewer_id, q]));
  const invitationMap = new Map(
    (invitations || []).map((i) => [i.reviewer_id, i])
  );

  // Process matched reviewers
  const matchedReviewersWithStatus = (matchedReviewers || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => {
      const reviewer = item.potential_reviewers;
      const queueItem = queueMap.get(reviewer.id);
      const invitation = invitationMap.get(reviewer.id);

      // Determine status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let invitation_status: any = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let additionalFields: any = {};

      if (queueItem) {
        invitation_status = "queued";
        additionalFields = {
          queue_position: queueItem.queue_position,
          queue_id: queueItem.id,
          priority: queueItem.priority,
          scheduled_send_date: queueItem.scheduled_send_date,
        };
      } else if (invitation) {
        invitation_status = invitation.status;
        additionalFields = {
          invitation_id: invitation.id,
          invited_date: invitation.invited_date,
          response_date: invitation.response_date,
          due_date: invitation.due_date,
        };
      }

      return {
        ...reviewer,
        match_score: item.match_score,
        invitation_status,
        ...additionalFields,
      };
    }
  );

  // Process unmatched reviewers (those in queue/invitations but not in matches)
  const unmatchedReviewersWithStatus = unmatchedReviewers.map((reviewer) => {
    const queueItem = queueMap.get(reviewer.id);
    const invitation = invitationMap.get(reviewer.id);

    // Determine status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let invitation_status: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let additionalFields: any = {};

    if (queueItem) {
      invitation_status = "queued";
      additionalFields = {
        queue_position: queueItem.queue_position,
        queue_id: queueItem.id,
        priority: queueItem.priority,
        scheduled_send_date: queueItem.scheduled_send_date,
      };
    } else if (invitation) {
      invitation_status = invitation.status;
      additionalFields = {
        invitation_id: invitation.id,
        invited_date: invitation.invited_date,
        response_date: invitation.response_date,
        due_date: invitation.due_date,
      };
    }

    return {
      ...reviewer,
      match_score: 0, // No match score for unmatched reviewers
      invitation_status,
      ...additionalFields,
    };
  });

  // Combine both sets
  return [...matchedReviewersWithStatus, ...unmatchedReviewersWithStatus];
}

/**
 * Update the status of a review invitation
 * @param invitationId - The invitation UUID
 * @param status - The new status
 */
export async function updateInvitationStatus(
  invitationId: string,
  status: import("@/lib/supabase").ReviewInvitation["status"]
): Promise<void> {
  const { error } = await supabase
    .from("review_invitations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invitationId);

  if (error) {
    console.error("Error updating invitation status:", error);
    throw error;
  }
}

/**
 * Revoke a pending invitation
 * Marks the invitation as expired and optionally adds it back to queue
 * @param invitationId - The invitation UUID
 * @param addBackToQueue - Whether to add reviewer back to queue
 */
export async function revokeInvitation(
  invitationId: string,
  addBackToQueue: boolean = false
): Promise<void> {
  // Get the invitation details first
  const { data: invitation, error: fetchError } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("id", invitationId)
    .single();

  if (fetchError || !invitation) {
    console.error("Error fetching invitation:", fetchError);
    throw fetchError || new Error("Invitation not found");
  }

  // Update status to revoked
  const { error: updateError } = await supabase
    .from("review_invitations")
    .update({
      status: "revoked",
      updated_at: new Date().toISOString(),
      notes: (invitation.notes || "") + " [Revoked by editor]",
    })
    .eq("id", invitationId);

  if (updateError) {
    console.error("Error revoking invitation:", updateError);
    throw updateError;
  }

  // Optionally add back to queue
  if (addBackToQueue) {
    await addToQueue(
      invitation.manuscript_id,
      invitation.reviewer_id,
      "normal"
    );
  }
}

/**
 * Submit a review report (for testing purposes)
 * Updates invitation status to report_submitted
 * @param invitationId - The invitation UUID
 */
export async function submitReport(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from("review_invitations")
    .update({
      status: "report_submitted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", invitationId);

  if (error) {
    console.error("Error submitting report:", error);
    throw error;
  }
}

/**
 * Invalidate a submitted review report
 * Updates invitation status to invalidated and records invalidation date
 * @param invitationId - The invitation UUID
 * @param reason - Optional reason for invalidation
 */
export async function invalidateReport(
  invitationId: string,
  reason?: string
): Promise<void> {
  const now = new Date().toISOString();

  // Get current notes if any
  const { data: invitation } = await supabase
    .from("review_invitations")
    .select("notes")
    .eq("id", invitationId)
    .single();

  const notes = invitation?.notes || "";
  const updatedNotes = reason
    ? `${notes} [Invalidated: ${reason}]`
    : `${notes} [Invalidated by editor]`;

  const { error } = await supabase
    .from("review_invitations")
    .update({
      status: "invalidated",
      report_invalidated_date: now,
      updated_at: now,
      notes: updatedNotes,
    })
    .eq("id", invitationId);

  if (error) {
    console.error("Error invalidating report:", error);
    throw error;
  }
}

/**
 * Reinstate an invalidated review report
 * Updates invitation status back to report_submitted and clears invalidation date
 * @param invitationId - The invitation UUID
 */
export async function uninvalidateReport(invitationId: string): Promise<void> {
  const now = new Date().toISOString();

  // Get current notes
  const { data: invitation } = await supabase
    .from("review_invitations")
    .select("notes")
    .eq("id", invitationId)
    .single();

  const notes = (invitation?.notes || "") + " [Report reinstated]";

  const { error } = await supabase
    .from("review_invitations")
    .update({
      status: "report_submitted",
      report_invalidated_date: null,
      updated_at: now,
      notes,
    })
    .eq("id", invitationId);

  if (error) {
    console.error("Error reinstating report:", error);
    throw error;
  }
}

/**
 * Cancel a review (for invalidated or revoked invitations)
 * Completely removes the invitation from the database
 * @param invitationId - The invitation UUID
 */
export async function cancelReview(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from("review_invitations")
    .delete()
    .eq("id", invitationId);

  if (error) {
    console.error("Error cancelling review:", error);
    throw error;
  }
}

/**
 * Set or update invitation expiration date
 * @param invitationId - The invitation UUID
 * @param expirationDate - ISO date string for when invitation expires (default: 14 days from now)
 */
export async function setInvitationExpiration(
  invitationId: string,
  expirationDate?: string
): Promise<void> {
  const expiration =
    expirationDate ||
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("review_invitations")
    .update({
      invitation_expiration_date: expiration,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invitationId);

  if (error) {
    console.error("Error setting invitation expiration:", error);
    throw error;
  }
}

/**
 * Move a queued reviewer up or down in the queue
 * @param queueItemId - The queue item UUID
 * @param direction - 'up' or 'down'
 */
export async function moveInQueue(
  queueItemId: string,
  direction: "up" | "down"
): Promise<void> {
  // Get the current item
  const { data: currentItem, error: fetchError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("id", queueItemId)
    .single();

  if (fetchError || !currentItem) {
    console.error("Error fetching queue item:", fetchError);
    throw fetchError || new Error("Queue item not found");
  }

  const currentPosition = currentItem.queue_position;
  const newPosition =
    direction === "up" ? currentPosition - 1 : currentPosition + 1;

  // Can't move beyond bounds
  if (newPosition < 1) {
    throw new Error("Cannot move higher - already at top of queue");
  }

  // Get the item at the target position
  const { data: targetItem, error: targetError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", currentItem.manuscript_id)
    .eq("queue_position", newPosition)
    .single();

  if (targetError && targetError.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error fetching target item:", targetError);
    throw targetError;
  }

  if (!targetItem) {
    throw new Error(
      `Cannot move ${direction} - no item at position ${newPosition}`
    );
  }

  // Swap positions
  await updateQueuePositions([
    { id: currentItem.id, queue_position: newPosition },
    { id: targetItem.id, queue_position: currentPosition },
  ]);
}

/**
 * Get or create queue control state for a manuscript
 * Note: This is a demo function - queue_active is not yet in database
 * @param manuscriptId - The manuscript UUID
 */
export async function getQueueControlState(
  manuscriptId: string
): Promise<import("@/lib/supabase").QueueControlState> {
  // TODO: When queue_active is added to manuscripts table, fetch from there
  // For now, return demo data based on queue existence

  const { data: queueItems } = await supabase
    .from("invitation_queue")
    .select("scheduled_send_date")
    .eq("manuscript_id", manuscriptId)
    .order("scheduled_send_date", { ascending: true })
    .limit(1);

  return {
    manuscript_id: manuscriptId,
    queue_active: false, // Demo: always false for now
    next_scheduled_send: queueItems?.[0]?.scheduled_send_date,
  };
}

/**
 * Toggle queue active state for a manuscript
 * Note: This is a demo function - queue_active is not yet in database
 * @param manuscriptId - The manuscript UUID
 * @param active - Whether queue should be active
 */
export async function toggleQueueActive(
  manuscriptId: string,
  active: boolean
): Promise<void> {
  // TODO: When queue_active is added to manuscripts table, update it here
  console.log(
    `Demo: Queue for manuscript ${manuscriptId} set to ${
      active ? "active" : "paused"
    }`
  );

  // For now, this is just a demo function
  // In production, this would:
  // 1. Update manuscripts.queue_active = active
  // 2. Trigger/pause automated queue processing
}

/**
 * Send an invitation immediately to a reviewer
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @returns The created invitation
 */
export async function sendInvitation(
  manuscriptId: string,
  reviewerId: string
): Promise<ReviewInvitation> {
  // Check if reviewer is already in queue
  const { data: existingQueueItem } = await supabase
    .from("invitation_queue")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingQueueItem) {
    throw new Error(
      "Cannot send invitation: Reviewer is already in the queue for this manuscript"
    );
  }

  // Check if reviewer already has an invitation
  const { data: existingInvitation } = await supabase
    .from("review_invitations")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingInvitation) {
    throw new Error("Reviewer already has an invitation for this manuscript");
  }

  // Set due date to 14 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  // Set invitation expiration to 14 days from now
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 14);

  const { data, error } = await supabase
    .from("review_invitations")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      invited_date: new Date().toISOString(),
      due_date: dueDate.toISOString(),
      invitation_expiration_date: expirationDate.toISOString(),
      status: "pending",
      invitation_round: 1,
      reminder_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending invitation:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data) {
    throw new Error("No data returned after sending invitation");
  }

  return data as ReviewInvitation;
}

// ============================================================================
// Reviewer-Manuscript Match Management Functions
// ============================================================================

/**
 * Get all reviewer-manuscript matches with details
 * @returns All matches with reviewer and manuscript information
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllReviewerMatches(): Promise<any[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      id,
      manuscript_id,
      reviewer_id,
      match_score,
      calculated_at,
      potential_reviewers (
        name,
        email,
        affiliation,
        expertise_areas
      ),
      manuscripts (
        title,
        journal,
        subject_area,
        status
      )
    `
    )
    .order("calculated_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviewer matches:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get matches for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getMatchesForManuscript(
  manuscriptId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      id,
      reviewer_id,
      match_score,
      calculated_at,
      potential_reviewers (
        name,
        email,
        affiliation,
        expertise_areas
      )
    `
    )
    .eq("manuscript_id", manuscriptId)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("Error fetching matches for manuscript:", error);
    throw error;
  }

  return data || [];
}

/**
 * Add a reviewer-manuscript match
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @param matchScore - Match score (0-1, will be displayed as percentage)
 * @param isInitialSuggestion - Whether this is an AI-generated initial suggestion
 * @param conflictsOfInterest - Free-form text describing any conflicts
 */
export async function addReviewerMatch(
  manuscriptId: string,
  reviewerId: string,
  matchScore: number,
  isInitialSuggestion: boolean = false,
  conflictsOfInterest: string = ""
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // Validate match score
  if (matchScore < 0 || matchScore > 1) {
    throw new Error("Match score must be between 0 and 1");
  }

  // Check if match already exists
  const { data: existing } = await supabase
    .from("reviewer_manuscript_matches")
    .select("id, match_score")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existing) {
    throw new Error(
      `Match already exists with score ${existing.match_score}. Use update instead.`
    );
  }

  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      match_score: matchScore,
      calculated_at: new Date().toISOString(),
      is_initial_suggestion: isInitialSuggestion,
      conflicts_of_interest: conflictsOfInterest || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding reviewer match:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    throw new Error(
      error.message ||
        error.hint ||
        `Failed to add reviewer match: ${JSON.stringify(error)}`
    );
  }

  return data;
}

/**
 * Update match score for an existing reviewer-manuscript match
 * @param matchId - The match UUID
 * @param matchScore - New match score (0-1)
 * @param isInitialSuggestion - Whether this is an AI-generated initial suggestion
 * @param conflictsOfInterest - Free-form text describing any conflicts
 */
export async function updateReviewerMatch(
  matchId: string,
  matchScore: number,
  isInitialSuggestion?: boolean,
  conflictsOfInterest?: string
): Promise<void> {
  // Validate match score
  if (matchScore < 0 || matchScore > 1) {
    throw new Error("Match score must be between 0 and 1");
  }

  const updateData: {
    match_score: number;
    calculated_at: string;
    is_initial_suggestion?: boolean;
    conflicts_of_interest?: string | null;
  } = {
    match_score: matchScore,
    calculated_at: new Date().toISOString(),
  };

  if (isInitialSuggestion !== undefined) {
    updateData.is_initial_suggestion = isInitialSuggestion;
  }

  if (conflictsOfInterest !== undefined) {
    updateData.conflicts_of_interest = conflictsOfInterest || null;
  }

  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .update(updateData)
    .eq("id", matchId);

  if (error) {
    console.error("Error updating match:", error);
    throw error;
  }
}

/**
 * @deprecated Use updateReviewerMatch instead
 */
export async function updateReviewerMatchScore(
  matchId: string,
  matchScore: number
): Promise<void> {
  return updateReviewerMatch(matchId, matchScore);
}

/**
 * Remove a reviewer-manuscript match
 * @param matchId - The match UUID
 */
export async function removeReviewerMatch(matchId: string): Promise<void> {
  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .delete()
    .eq("id", matchId);

  if (error) {
    console.error("Error removing reviewer match:", error);
    throw error;
  }
}

/**
 * Bulk add matches for a manuscript with auto-calculated scores
 * @param manuscriptId - The manuscript UUID
 * @param reviewerIds - Array of reviewer UUIDs
 * @param baseScore - Starting score for the first reviewer (decrements by 1 for each subsequent)
 */
export async function bulkAddReviewerMatches(
  manuscriptId: string,
  reviewerIds: string[],
  baseScore: number = 95
): Promise<void> {
  const matches = reviewerIds.map((reviewerId, index) => ({
    manuscript_id: manuscriptId,
    reviewer_id: reviewerId,
    match_score: Math.max(50, baseScore - index), // Decrement score, minimum 50
    calculated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .insert(matches);

  if (error) {
    console.error("Error bulk adding matches:", error);
    throw error;
  }
}

// ============================================================================
// User Profile and Manuscript Assignment Functions
// ============================================================================

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
        journal,
        status
      )
    `
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
  role: "editor" | "author" | "collaborator" | "reviewer" = "editor"
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
  manuscriptId: string
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
  role: "editor" | "author" | "collaborator" | "reviewer"
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

/**
 * Synchronize editor assignments for a manuscript based on desired editor IDs.
 * Adds missing editors (reactivating if previously inactive) and deactivates removed ones.
 */
export async function syncManuscriptEditors(
  manuscriptId: string,
  editorIds: string[]
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
    (row) => row.is_active && !desiredEditors.includes(row.user_id)
  );

  if (toDeactivate.length > 0) {
    const { error: deactivateError } = await supabase
      .from("user_manuscripts")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .in(
        "id",
        toDeactivate.map((row) => row.id)
      );

    if (deactivateError) {
      console.error("Error deactivating editor assignments:", deactivateError);
      throw deactivateError;
    }
  }

  const toAdd = desiredEditors.filter(
    (editorId) =>
      !(existingEditors || []).some(
        (row) => row.user_id === editorId && row.is_active
      )
  );

  for (const editorId of toAdd) {
    await addUserToManuscript(editorId, manuscriptId, "editor");
  }

  const editorMap = await getEditorsForManuscripts([manuscriptId]);
  return editorMap.get(manuscriptId) || [];
}

// ============================================================================
// Reviewer Management Functions
// ============================================================================

/**
 * Add a new reviewer to the potential_reviewers table
 * @param reviewer - The reviewer data (without id, created_at, updated_at)
 * @returns The created reviewer
 */
export async function addReviewer(
  reviewer: Omit<PotentialReviewer, "id" | "match_score">
): Promise<PotentialReviewer> {
  // Check if reviewer with this email already exists
  const { data: existing } = await supabase
    .from("potential_reviewers")
    .select("id, email")
    .eq("email", reviewer.email)
    .single();

  if (existing) {
    throw new Error(`Reviewer with email ${reviewer.email} already exists`);
  }

  // Prepare insert data, removing any undefined or empty string values for UUID/date fields
  const insertData = { ...reviewer };

  // Clean up the data - remove keys with undefined values
  Object.keys(insertData).forEach((key) => {
    if (insertData[key as keyof typeof insertData] === undefined) {
      delete insertData[key as keyof typeof insertData];
    }
  });

  const { data, error } = await supabase
    .from("potential_reviewers")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error adding reviewer:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(
      error.message || "Failed to add reviewer. Please check your data."
    );
  }

  return { ...data, match_score: 0 };
}

/**
 * Update an existing reviewer
 * @param reviewerId - The reviewer's UUID
 * @param updates - Fields to update
 */
export async function updateReviewer(
  reviewerId: string,
  updates: Partial<Omit<PotentialReviewer, "id" | "match_score">>
): Promise<void> {
  // If email is being updated, check for duplicates
  if (updates.email) {
    const { data: existing } = await supabase
      .from("potential_reviewers")
      .select("id")
      .eq("email", updates.email)
      .neq("id", reviewerId)
      .maybeSingle();

    if (existing) {
      throw new Error(
        `Another reviewer with email ${updates.email} already exists`
      );
    }
  }

  // Ensure required fields are not set to empty strings
  const cleanedUpdates = { ...updates };

  // affiliation is NOT NULL in database, so ensure it has a value
  if ("affiliation" in cleanedUpdates && !cleanedUpdates.affiliation) {
    cleanedUpdates.affiliation = "Not specified";
  }

  // Remove any undefined or empty string values that would cause issues
  Object.keys(cleanedUpdates).forEach((key) => {
    const value = cleanedUpdates[key as keyof typeof cleanedUpdates];
    if (value === undefined || value === "") {
      delete cleanedUpdates[key as keyof typeof cleanedUpdates];
    }
  });

  console.log("Updating reviewer:", { reviewerId, updates: cleanedUpdates });

  const { data, error } = await supabase
    .from("potential_reviewers")
    .update({
      ...cleanedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewerId)
    .select();

  console.log("Update result:", {
    data,
    error: error ? JSON.stringify(error) : null,
  });

  if (error) {
    console.error("Error updating reviewer:", {
      error,
      errorString: JSON.stringify(error),
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      updates: cleanedUpdates,
    });
    throw new Error(
      error.message || "Failed to update reviewer. Please check your data."
    );
  }
}

/**
 * Delete a reviewer from the database
 * Note: This will fail if the reviewer has associated records (matches, invitations, etc.)
 * @param reviewerId - The reviewer's UUID
 */
export async function deleteReviewer(reviewerId: string): Promise<void> {
  const { error } = await supabase
    .from("potential_reviewers")
    .delete()
    .eq("id", reviewerId);

  if (error) {
    console.error("Error deleting reviewer:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    // Provide user-friendly error message for foreign key constraint
    if (error.code === "23503") {
      throw new Error(
        "Cannot delete reviewer: they have existing matches or invitations. Remove those first."
      );
    }

    throw error;
  }
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
  }
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
        "Permission denied: You must be an admin or designer to create manuscripts."
      );
    }

    if (error.code === "23502" && error.message?.includes("editor_id")) {
      throw new Error(
        "Database still requires manuscripts.editor_id. Apply migration database/remove_editor_id_from_manuscripts.sql or make editor_id nullable."
      );
    }

    throw new Error(
      `Failed to create manuscript: ${
        error.message || error.code || "Unknown error"
      }`
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
  >
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
        "Permission denied: You must be an admin or designer to update manuscripts."
      );
    }

    if (error.code === "23502" && error.message?.includes("editor_id")) {
      throw new Error(
        "Database still requires manuscripts.editor_id. Apply migration database/remove_editor_id_from_manuscripts.sql or make editor_id nullable."
      );
    }

    throw new Error(
      `Failed to update manuscript: ${
        error.message || error.code || "Unknown error"
      }`
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
        "Cannot delete manuscript: it has existing matches, invitations, or assignments. Remove those first."
      );
    }

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to delete manuscripts."
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
