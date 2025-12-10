import type { ReviewInvitation } from "@/lib/supabase";

/**
 * Status display configuration for a review invitation
 */
export interface StatusDisplay {
  /** Primary status to display */
  primaryStatus: ReviewInvitation["status"];
  /** Optional badge status (e.g., "overdue" for accepted invitations past due date) */
  badgeStatus?: "overdue" | "expired";
  /** Human-readable label for primary status */
  primaryLabel: string;
  /** Human-readable label for badge status */
  badgeLabel?: string;
  /** Color for primary status chip */
  primaryColor: "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success";
  /** Color for badge chip */
  badgeColor?: "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

/**
 * Get display configuration for a review invitation status
 * Handles derived states (overdue, expired) based on dates
 * @param invitation - The review invitation
 * @returns Status display configuration
 */
export function getStatusDisplay(invitation: ReviewInvitation): StatusDisplay {
  const now = new Date();
  
  // Base display for primary status
  const displays: Record<ReviewInvitation["status"], Omit<StatusDisplay, "badgeStatus" | "badgeLabel" | "badgeColor">> = {
    pending: {
      primaryStatus: "pending",
      primaryLabel: "Pending",
      primaryColor: "default",
    },
    accepted: {
      primaryStatus: "accepted",
      primaryLabel: "Accepted",
      primaryColor: "primary",
    },
    declined: {
      primaryStatus: "declined",
      primaryLabel: "Declined",
      primaryColor: "default",
    },
    report_submitted: {
      primaryStatus: "report_submitted",
      primaryLabel: "Submitted",
      primaryColor: "success",
    },
    invalidated: {
      primaryStatus: "invalidated",
      primaryLabel: "Invalidated",
      primaryColor: "error",
    },
    revoked: {
      primaryStatus: "revoked",
      primaryLabel: "Revoked",
      primaryColor: "default",
    },
  };

  const display = displays[invitation.status];

  // Check for derived badge states
  if (invitation.status === "accepted" && invitation.due_date) {
    // Overdue: accepted AND past due date
    if (new Date(invitation.due_date) < now) {
      return {
        ...display,
        badgeStatus: "overdue",
        badgeLabel: "Overdue",
        badgeColor: "warning",
      };
    }
  }

  if (invitation.status === "pending" && invitation.invitation_expiration_date) {
    // Expired: pending AND past expiration date
    if (new Date(invitation.invitation_expiration_date) < now) {
      return {
        ...display,
        badgeStatus: "expired",
        badgeLabel: "Expired",
        badgeColor: "error",
      };
    }
  }

  return display;
}

/**
 * Get color for a status (for backwards compatibility)
 * @param status - The invitation status
 * @returns MUI chip color
 */
export function getStatusColor(
  status: ReviewInvitation["status"]
): "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success" {
  const colorMap: Record<ReviewInvitation["status"], StatusDisplay["primaryColor"]> = {
    pending: "default",
    accepted: "primary",
    declined: "default",
    report_submitted: "success",
    invalidated: "error",
    revoked: "default",
  };

  return colorMap[status];
}

/**
 * Get label for a status (for backwards compatibility)
 * @param status - The invitation status
 * @returns Human-readable label
 */
export function getStatusLabel(status: ReviewInvitation["status"]): string {
  const labelMap: Record<ReviewInvitation["status"], string> = {
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    report_submitted: "Submitted",
    invalidated: "Invalidated",
    revoked: "Revoked",
  };

  return labelMap[status];
}
