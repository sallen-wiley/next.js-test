import type {
  ReviewInvitationWithReviewer,
  ReviewInvitation,
} from "@/lib/supabase";

/**
 * Extended reviewer statistics including all invitation states
 */
export interface ReviewerStatsExtended {
  /** Total invitations sent */
  invited: number;
  /** Invitations accepted (status: accepted) */
  agreed: number;
  /** Invitations declined (status: declined) */
  declined: number;
  /** Reports submitted (status: report_submitted) */
  submitted: number;
  /** Invitations pending response (status: pending) */
  pending: number;
  /** Expired invitations (derived: pending AND invitation_expiration_date < now) */
  expired: number;
  /** Overdue reviews (derived: accepted AND due_date < now) */
  overdue: number;
  /** Reports invalidated by editor (status: invalidated) */
  invalidated: number;
  /** Invitations revoked/cancelled (status: revoked) */
  revoked: number;
}

/**
 * Basic reviewer statistics for ArticleCard component
 */
export interface ReviewerStats {
  invited?: number;
  agreed?: number;
  declined?: number;
  submitted?: number;
}

/**
 * Calculate reviewer statistics from invitation data
 * @param invitations - Array of review invitations (with or without reviewer details)
 * @returns Extended statistics object with counts for each status
 */
export function calculateReviewerStats(
  invitations: ReviewInvitationWithReviewer[] | ReviewInvitation[]
): ReviewerStatsExtended {
  const now = new Date();

  const stats: ReviewerStatsExtended = {
    invited: invitations.length,
    agreed: 0,
    declined: 0,
    submitted: 0,
    pending: 0,
    expired: 0,
    overdue: 0,
    invalidated: 0,
    revoked: 0,
  };

  invitations.forEach((invitation) => {
    switch (invitation.status) {
      case "accepted":
        stats.agreed++;
        // Check if overdue (accepted AND past due_date)
        if (invitation.due_date && new Date(invitation.due_date) < now) {
          stats.overdue++;
        }
        break;
      case "declined":
        stats.declined++;
        break;
      case "report_submitted":
        stats.submitted++;
        break;
      case "pending":
        stats.pending++;
        // Check if expired (pending AND past invitation_expiration_date)
        if (
          invitation.invitation_expiration_date &&
          new Date(invitation.invitation_expiration_date) < now
        ) {
          stats.expired++;
        }
        break;
      case "invalidated":
        stats.invalidated++;
        break;
      case "revoked":
        stats.revoked++;
        break;
    }
  });

  return stats;
}

/**
 * Convert extended stats to basic stats for ArticleCard component
 * @param stats - Extended reviewer statistics
 * @returns Basic stats object compatible with ArticleCard
 */
export function toBasicStats(stats: ReviewerStatsExtended): ReviewerStats {
  return {
    invited: stats.invited,
    agreed: stats.agreed,
    declined: stats.declined,
    submitted: stats.submitted,
  };
}
