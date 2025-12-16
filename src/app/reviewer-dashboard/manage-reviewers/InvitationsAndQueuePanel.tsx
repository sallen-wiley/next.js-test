import * as React from "react";
import { Box } from "@mui/material";
import UnifiedQueueTab from "./UnifiedQueueTab";
import { MetricsWidget } from "./MetricsWidget";
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
    reviewer: ReviewerWithStatus
  ) => void;
}

export function InvitationsAndQueuePanel({
  reviewersWithStatus,
  queueControl,
  invitations,
  queue,
  highMatchCount,
  onToggleQueue,
  onActionMenuOpen,
}: InvitationsAndQueuePanelProps) {
  const acceptedCount = invitations.filter(
    (i) => i.status === "accepted"
  ).length;
  const pendingCount = invitations.filter((i) => i.status === "pending").length;
  const queuedCount = queue.length;

  return (
    <Box sx={{ width: 400, pl: 3 }}>
      {/* Summary Metrics */}
      <MetricsWidget
        highMatchCount={highMatchCount}
        acceptedCount={acceptedCount}
        pendingCount={pendingCount}
        queuedCount={queuedCount}
      />

      {/* Queue & Invitations - Unified View */}
      <UnifiedQueueTab
        reviewersWithStatus={reviewersWithStatus}
        queueControl={queueControl}
        onToggleQueue={onToggleQueue}
        onActionMenuOpen={onActionMenuOpen}
      />
    </Box>
  );
}
