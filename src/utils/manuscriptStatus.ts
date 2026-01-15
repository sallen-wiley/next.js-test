/**
 * Manuscript Status Utility
 *
 * Single source of truth for manuscript status display configuration.
 * Provides status labels, colors, descriptions, and helper functions.
 */

import type { ChipProps } from "@mui/material";

// All valid manuscript status values (matches database CHECK constraint)
export type ManuscriptStatus =
  | "submitted"
  | "pending_editor_assignment"
  | "awaiting_reviewers"
  | "under_review"
  | "reviews_in_progress"
  | "reviews_complete"
  | "revision_required"
  | "minor_revision"
  | "major_revision"
  | "conditionally_accepted"
  | "accepted"
  | "rejected"
  | "desk_rejected"
  | "withdrawn";

export interface StatusConfig {
  label: string;
  color: ChipProps["color"];
  description: string;
  category: "in-progress" | "action-required" | "completed" | "rejected";
}

/**
 * Status display configuration
 * Maps each status to its display properties
 */
export const MANUSCRIPT_STATUS_CONFIG: Record<ManuscriptStatus, StatusConfig> =
  {
    submitted: {
      label: "Submitted",
      color: "info",
      description: "Manuscript submitted, awaiting processing",
      category: "in-progress",
    },
    pending_editor_assignment: {
      label: "Pending Editor",
      color: "warning",
      description: "Awaiting editor assignment",
      category: "action-required",
    },
    awaiting_reviewers: {
      label: "Awaiting Reviewers",
      color: "warning",
      description: "Editor assigned, searching for reviewers",
      category: "action-required",
    },
    under_review: {
      label: "Peer Review",
      color: "warning",
      description: "In peer review process",
      category: "in-progress",
    },
    reviews_in_progress: {
      label: "Reviews In Progress",
      color: "primary",
      description: "Reviewers working on reviews",
      category: "in-progress",
    },
    reviews_complete: {
      label: "Reviews Complete",
      color: "info",
      description: "All reviews submitted, awaiting editor decision",
      category: "action-required",
    },
    revision_required: {
      label: "Revision Required",
      color: "warning",
      description: "Authors must revise and resubmit",
      category: "action-required",
    },
    minor_revision: {
      label: "Minor Revision",
      color: "warning",
      description: "Requires small changes",
      category: "action-required",
    },
    major_revision: {
      label: "Major Revision",
      color: "warning",
      description: "Requires substantial changes",
      category: "action-required",
    },
    conditionally_accepted: {
      label: "Conditionally Accepted",
      color: "success",
      description: "Accepted pending minor required changes",
      category: "action-required",
    },
    accepted: {
      label: "Accepted",
      color: "success",
      description: "Manuscript accepted for publication",
      category: "completed",
    },
    rejected: {
      label: "Rejected",
      color: "error",
      description: "Manuscript rejected after review",
      category: "rejected",
    },
    desk_rejected: {
      label: "Desk Rejected",
      color: "error",
      description: "Rejected before peer review",
      category: "rejected",
    },
    withdrawn: {
      label: "Withdrawn",
      color: "default",
      description: "Author withdrew the manuscript",
      category: "rejected",
    },
  };

/**
 * Get display label for a manuscript status
 */
export function getStatusLabel(status: string): string {
  const config = MANUSCRIPT_STATUS_CONFIG[status as ManuscriptStatus];
  return config?.label || status.replace(/_/g, " ");
}

/**
 * Get color for a manuscript status chip
 */
export function getStatusColor(status: string): ChipProps["color"] {
  const config = MANUSCRIPT_STATUS_CONFIG[status as ManuscriptStatus];
  return config?.color || "default";
}

/**
 * Get description for a manuscript status
 */
export function getStatusDescription(status: string): string {
  const config = MANUSCRIPT_STATUS_CONFIG[status as ManuscriptStatus];
  return config?.description || "";
}

/**
 * Get category for a manuscript status
 */
export function getStatusCategory(
  status: string
): StatusConfig["category"] | undefined {
  const config = MANUSCRIPT_STATUS_CONFIG[status as ManuscriptStatus];
  return config?.category;
}

/**
 * Get complete Chip props for a manuscript status
 */
export function getStatusChipProps(status: string): {
  label: string;
  color: ChipProps["color"];
  size?: ChipProps["size"];
} {
  return {
    label: getStatusLabel(status),
    color: getStatusColor(status),
    size: "small",
  };
}

/**
 * Get all statuses grouped by category
 */
export function getStatusesByCategory() {
  const grouped: Record<StatusConfig["category"], ManuscriptStatus[]> = {
    "in-progress": [],
    "action-required": [],
    completed: [],
    rejected: [],
  };

  (Object.keys(MANUSCRIPT_STATUS_CONFIG) as ManuscriptStatus[]).forEach(
    (status) => {
      const category = MANUSCRIPT_STATUS_CONFIG[status].category;
      grouped[category].push(status);
    }
  );

  return grouped;
}

/**
 * Get all available statuses as select options
 */
export function getStatusOptions(): Array<{ value: string; label: string }> {
  return (Object.keys(MANUSCRIPT_STATUS_CONFIG) as ManuscriptStatus[]).map(
    (status) => ({
      value: status,
      label: MANUSCRIPT_STATUS_CONFIG[status].label,
    })
  );
}
