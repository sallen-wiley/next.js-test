import * as React from "react";
import { Box } from "@mui/material";
import UnifiedQueueTab from "./UnifiedQueueTab";
import { MetricsWidget } from "./MetricsWidget";
import { calculateReviewerStats } from "@/utils/reviewerStats";
import type {
  ReviewerWithStatus,
  QueueControlState,
  ReviewInvitation,
  InvitationQueueItem,
} from "@/lib/supabase";

interface InvitationsAndQueuePanelProps {
  reviewersWithStatus: ReviewerWithStatus[];
  queueControl: QueueControlState | null;
  invitations: ReviewInvitation[];
  queue: InvitationQueueItem[];
  highMatchCount: number;
  onToggleQueue: () => void;
  onActionMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus,
  ) => void;
}

export function InvitationsAndQueuePanel({
  reviewersWithStatus,
  queueControl,
  invitations,
  queue,
  onToggleQueue,
  onActionMenuOpen,
}: InvitationsAndQueuePanelProps) {
  // Calculate all metrics using shared utility
  const stats = calculateReviewerStats(invitations);
  stats.queued = queue.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Summary Metrics - background.paper */}
      <Box sx={{ bgcolor: "background.paper", p: 2 }}>
        <MetricsWidget
          submittedCount={stats.submitted}
          overdueCount={stats.overdue}
          invalidatedCount={stats.invalidated}
          expiredCount={stats.expired}
          revokedCount={stats.revoked}
          acceptedCount={stats.agreed}
          declinedCount={stats.declined}
          pendingCount={stats.pending}
          queuedCount={stats.queued}
        />
      </Box>

      {/* Invitation Log Container - background.default */}
      <Box sx={{ bgcolor: "background.default", p: 2 }}>
        <UnifiedQueueTab
          reviewersWithStatus={reviewersWithStatus}
          queueControl={queueControl}
          onToggleQueue={onToggleQueue}
          onActionMenuOpen={onActionMenuOpen}
        />
      </Box>
    </Box>
  );
}
