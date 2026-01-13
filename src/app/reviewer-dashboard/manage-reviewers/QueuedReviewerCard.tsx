import * as React from "react";
import { Paper, Box, Typography, IconButton, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import type { ReviewerWithStatus } from "@/lib/supabase";

interface QueuedReviewerCardProps {
  reviewer: ReviewerWithStatus;
  onActionMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus
  ) => void;
  onMoveUp?: (reviewer: ReviewerWithStatus) => void;
  onMoveDown?: (reviewer: ReviewerWithStatus) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function QueuedReviewerCard({
  reviewer,
  onActionMenuOpen,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}: QueuedReviewerCardProps) {
  // For queued reviewers that may have "pending" status if moved from invitations
  const isPending = reviewer.invitation_status === "pending";

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateTimeLeft = (expirationDate: string) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        p: 0.125,
        position: "relative",
      }}
    >
      {/* Left: Drag controls column */}
      <Box
        sx={{
          width: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        {/* Up arrow */}
        <IconButton
          size="small"
          onClick={() => onMoveUp?.(reviewer)}
          sx={{ p: 0, width: 16, height: 16 }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Drag handle */}
        <Box
          {...dragHandleProps}
          sx={{
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            "&:active": { cursor: "grabbing" },
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: 16, color: "action.active" }} />
        </Box>

        {/* Down arrow */}
        <IconButton
          size="small"
          onClick={() => onMoveDown?.(reviewer)}
          sx={{ p: 0, width: 16, height: 16 }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Main content area */}
      <Box sx={{ flex: 1, minWidth: 0, p: 1, display: "flex" }}>
        {/* Left: Reviewer info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Status badge if pending */}
          {isPending && (
            <Box sx={{ mb: 0.5 }}>
              <Chip
                label="Pending Response"
                color="info"
                size="small"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              />
            </Box>
          )}

          {/* Reviewer name */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            {reviewer.name}
          </Typography>

          {/* Two-column stats layout */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Left stats column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="body1" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Currently reviewing:
                </Box>{" "}
                {reviewer.current_review_load || 0}
              </Typography>

              {isPending ? (
                <>
                  <Typography variant="body1" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Invited:
                    </Box>{" "}
                    {formatDate(reviewer.invited_date)}
                  </Typography>
                  {reviewer.invitation_expiration_date && (
                    <Typography variant="body1" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        Time left to respond:
                      </Box>{" "}
                      {calculateTimeLeft(reviewer.invitation_expiration_date)}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body1" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Pending invitations:
                    </Box>{" "}
                    {/* This would need to be calculated from database */}1
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Completed reviews:
                    </Box>{" "}
                    {reviewer.completed_reviews || 0}
                  </Typography>
                </>
              )}
            </Box>

            {/* Right stats column - Invitation email type */}
            {!isPending && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body1" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Invitation email:
                    </Box>{" "}
                    Default
                  </Typography>
                  <IconButton size="small" sx={{ p: 0.5 }}>
                    <EditIcon sx={{ fontSize: 16, color: "primary.main" }} />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right: 3-dot menu */}
        <Box sx={{ alignSelf: "flex-start" }}>
          <IconButton
            size="small"
            onClick={(e) => onActionMenuOpen(e, reviewer)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
