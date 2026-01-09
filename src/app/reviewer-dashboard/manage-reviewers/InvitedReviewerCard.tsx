import * as React from "react";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  type ChipProps,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import type { ReviewerWithStatus } from "@/lib/supabase";

interface InvitedReviewerCardProps {
  reviewer: ReviewerWithStatus;
  onActionMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus
  ) => void;
}

export function InvitedReviewerCard({
  reviewer,
  onActionMenuOpen,
}: InvitedReviewerCardProps) {
  // Map status to badge color and label (consistent with existing app patterns)
  const getStatusConfig = (
    status: string
  ): { color: ChipProps["color"]; label: string } => {
    switch (status.toLowerCase()) {
      case "report_submitted":
        return { color: "success", label: "Report Submitted" };
      case "accepted":
        return { color: "primary", label: "Accepted" };
      case "pending":
        return { color: "info", label: "Pending Response" };
      case "declined":
        return { color: "warning", label: "Declined" };
      case "invalidated":
        return { color: "error", label: "Invalidated" };
      case "revoked":
        return { color: "default", label: "Revoked" };
      default:
        return {
          color: "default",
          label: status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        };
    }
  };

  const statusConfig = getStatusConfig(reviewer.invitation_status || "");
  const isReportSubmitted = reviewer.invitation_status === "report_submitted";
  const isAccepted = reviewer.invitation_status === "accepted";
  const isPending = reviewer.invitation_status === "pending";
  const isDeclined = reviewer.invitation_status === "declined";

  // Check for overdue/expired conditions
  const isOverdue =
    isAccepted && reviewer.due_date && new Date(reviewer.due_date) < new Date();

  const isExpired =
    isPending &&
    reviewer.invitation_expiration_date &&
    new Date(reviewer.invitation_expiration_date) < new Date();

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
        p: 1,
        position: "relative",
      }}
    >
      {/* Content wrapper with flex layout */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Reviewer info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Status badge */}
          <Box sx={{ mb: 0.5 }}>
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              sx={{ textTransform: "uppercase", fontWeight: 700 }}
            />
            {isOverdue && (
              <Chip
                label="Overdue"
                color="warning"
                size="small"
                sx={{
                  ml: 0.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              />
            )}
            {isExpired && (
              <Chip
                label="Expired"
                color="error"
                size="small"
                sx={{
                  ml: 0.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              />
            )}
          </Box>

          {/* Reviewer name */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            {reviewer.name}
          </Typography>

          {/* Event timeline */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {isReportSubmitted && reviewer.response_date && (
              <Typography variant="body1" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Submitted:
                </Box>{" "}
                {formatDate(reviewer.response_date)}
              </Typography>
            )}

            <Typography variant="body1" color="text.secondary">
              <Box component="span" sx={{ fontWeight: 700 }}>
                Invited:
              </Box>{" "}
              {formatDate(reviewer.invited_date)}
            </Typography>

            {isAccepted && reviewer.response_date && (
              <Typography variant="body1" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Accepted:
                </Box>{" "}
                {formatDate(reviewer.response_date)}
              </Typography>
            )}

            {isDeclined && reviewer.response_date && (
              <Typography variant="body1" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Declined:
                </Box>{" "}
                {formatDate(reviewer.response_date)}
              </Typography>
            )}

            {isPending && reviewer.invitation_expiration_date && (
              <Typography variant="body1" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Time left to respond:
                </Box>{" "}
                {calculateTimeLeft(reviewer.invitation_expiration_date)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right: Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* Top: 3-dot menu */}
          <IconButton
            size="small"
            onClick={(e) => onActionMenuOpen(e, reviewer)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          {/* Bottom: Read Report button (conditional) */}
          {isReportSubmitted && (
            <Button
              variant="outlined"
              color="neutral"
              size="small"
              startIcon={<DescriptionOutlinedIcon />}
              onClick={(e) => onActionMenuOpen(e, reviewer)}
              sx={{ minWidth: 72 }}
            >
              Read report
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
