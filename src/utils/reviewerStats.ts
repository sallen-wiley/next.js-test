import type { ReviewInvitationWithReviewer, ReviewInvitation } from "@/lib/supabase";

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
  /** Reports submitted (status: report_submitted or completed) */
  submitted: number;
  /** Invitations pending response (status: pending) */
  pending: number;
  /** Expired invitations (status: expired) */
  expired: number;
  /** Overdue reviews (status: overdue) */
  overdue: number;
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
  const stats: ReviewerStatsExtended = {
    invited: invitations.length,
    agreed: 0,
    declined: 0,
    submitted: 0,
    pending: 0,
    expired: 0,
    overdue: 0,
  };

  invitations.forEach((invitation) => {
    switch (invitation.status) {
      case "accepted":
        stats.agreed++;
        break;
      case "declined":
        stats.declined++;
        break;
      case "report_submitted":
      case "completed":
        stats.submitted++;
        break;
      case "pending":
        stats.pending++;
        break;
      case "expired":
        stats.expired++;
        break;
      case "overdue":
        stats.overdue++;
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
