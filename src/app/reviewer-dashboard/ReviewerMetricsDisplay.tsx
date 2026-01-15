import * as React from "react";
import { Typography, Stack, Box } from "@mui/material";
import type { ReviewerStatsExtended } from "@/utils/reviewerStats";

/**
 * Shared component for displaying reviewer metrics in a consistent format
 * Used across Dashboard, Article Details, and Manage Reviewers pages
 */

interface ReviewerMetricsDisplayProps {
  stats: ReviewerStatsExtended;
  queuedCount?: number;
  variant?: "inline" | "grouped";
  showLabels?: boolean;
}

/**
 * Display reviewer metrics in a consistent format
 * @param stats - Extended reviewer statistics
 * @param queuedCount - Optional queued count (if not in stats)
 * @param variant - Display style: "inline" (all in one line) or "grouped" (separated by category)
 * @param showLabels - Whether to show section labels (Reports, Invitations, Reviewers)
 */
export function ReviewerMetricsDisplay({
  stats,
  queuedCount,
  variant = "grouped",
  showLabels = true,
}: ReviewerMetricsDisplayProps) {
  const queued = queuedCount ?? stats.queued;

  if (variant === "inline") {
    return (
      <Typography variant="body1" color="text.secondary">
        <strong>{stats.agreed}</strong> accepted,{" "}
        <strong>{stats.declined}</strong> declined,{" "}
        <strong>{stats.pending}</strong> pending, <strong>{queued}</strong>{" "}
        queued | <strong>{stats.submitted}</strong> submitted,{" "}
        <strong>{stats.overdue}</strong> overdue,{" "}
        <strong>{stats.invalidated}</strong> invalidated |{" "}
        <strong>{stats.expired}</strong> expired,{" "}
        <strong>{stats.revoked}</strong> revoked
      </Typography>
    );
  }

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
    >
      {/* Reports Section */}
      <Typography variant="body1" color="text.secondary">
        {showLabels && <strong>Reports: </strong>}
        <strong>{stats.submitted}</strong> Submitted,{" "}
        <strong>{stats.overdue}</strong> Overdue,{" "}
        <strong>{stats.invalidated}</strong> Invalidated
      </Typography>

      {/* Invitations Section */}
      <Typography variant="body1" color="text.secondary">
        {showLabels && <strong>Invitations: </strong>}
        <strong>{stats.expired}</strong> Expired,{" "}
        <strong>{stats.revoked}</strong> Revoked
      </Typography>

      {/* Reviewers Section */}
      <Typography variant="body1" color="text.secondary">
        {showLabels && <strong>Reviewers: </strong>}
        <strong>{stats.agreed}</strong> Accepted,{" "}
        <strong>{stats.declined}</strong> Declined,{" "}
        <strong>{stats.pending}</strong> Pending, <strong>{queued}</strong>{" "}
        Queued
      </Typography>
    </Box>
  );
}

/**
 * Render a single metric stat (for ArticleCard inline display)
 * @param value - The count value
 * @param label - The label text
 * @param suffix - Optional suffix (typically comma)
 * @returns React node with the metric, or null if value is undefined
 * Note: Shows 0 values for consistency with MetricsWidget and Article Details displays
 */
export function renderMetricStat(
  value: number | undefined,
  label: string,
  suffix?: string
): React.ReactNode {
  if (value === undefined) return null;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography variant="body1" color="text.secondary" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {label}
        {suffix || ""}
      </Typography>
    </Stack>
  );
}
