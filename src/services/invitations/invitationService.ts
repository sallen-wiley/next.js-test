// Review invitation management service
import { supabase } from "../shared/supabaseClient";
import type {
  ReviewInvitation,
  ReviewInvitationWithReviewer,
} from "@/lib/supabase";

/**
 * Fetch review invitations for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptInvitations(
  manuscriptId: string,
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
 * Send an invitation immediately to a reviewer
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @returns The created invitation
 */
export async function sendInvitation(
  manuscriptId: string,
  reviewerId: string,
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
      "Cannot send invitation: Reviewer is already in the queue for this manuscript",
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

/**
 * Update the status of a review invitation
 * @param invitationId - The invitation UUID
 * @param status - The new status
 */
export async function updateInvitationStatus(
  invitationId: string,
  status: import("@/lib/supabase").ReviewInvitation["status"],
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
  addBackToQueue: boolean = false,
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
    const { addToQueue } = await import("../queue/queueService");
    await addToQueue(
      invitation.manuscript_id,
      invitation.reviewer_id,
      "normal",
    );
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
  reason?: string,
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
  expirationDate?: string,
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
