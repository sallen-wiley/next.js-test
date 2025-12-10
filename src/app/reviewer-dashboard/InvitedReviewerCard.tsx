"use client";
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Button,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { ChipProps } from "@mui/material";

type InvitedReviewerCardProps = {
  reviewerName: string;
  affiliation?: string;
  status: string;
  invitedDate: string;
  responseDate?: string;
  dueDate: string;
  submittedDate?: string;
  timeLeftToRespond?: string;
  reportSubmissionDeadline?: string;
  daysLeft?: number;
  expirationDate?: string;
  onForceAccept?: () => void;
  onForceDecline?: () => void;
  onRevokeInvitation?: () => void;
  onRemoveInvitation?: () => void;
  onReadReport?: () => void;
  onViewProfile?: () => void;
  onExtendDeadline?: () => void;
};

export function InvitedReviewerCard({
  reviewerName,
  status,
  invitedDate,
  responseDate,
  submittedDate,
  timeLeftToRespond,
  reportSubmissionDeadline,
  daysLeft,
  expirationDate,
  onForceAccept,
  onForceDecline,
  onRevokeInvitation,
  onRemoveInvitation,
  onReadReport,
  onViewProfile,
  onExtendDeadline,
}: InvitedReviewerCardProps) {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAction = (action?: () => void) => {
    handleMenuClose();
    if (action) action();
  };
  // Map status to badge color and label
  const getStatusConfig = (
    status: string
  ): { color: ChipProps["color"]; label: string } => {
    switch (status.toLowerCase()) {
      case "completed":
      case "report_submitted":
        return { color: "success", label: "Submitted" };
      case "accepted":
        return { color: "primary", label: "Accepted" };
      case "pending":
        return { color: "info", label: "Pending" };
      case "declined":
        return { color: "warning", label: "Declined" };
      case "invalidated":
        return { color: "error", label: "Invalidated" };
      case "revoked":
        return { color: "default", label: "Revoked" };
      case "expired":
        return { color: "error", label: "Expired" };
      case "overdue":
        return { color: "warning", label: "Overdue" };
      default:
        return {
          color: "default",
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const isReportSubmitted =
    status === "report_submitted" || status === "completed";
  const isAccepted = status === "accepted";
  const isPending = status === "pending";
  const isDeclined = status === "declined";

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "divider",
        "&:hover": {
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {/* Top row: Status badge and menu */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.6875rem",
                height: 20,
              }}
            />
            <IconButton
              size="small"
              sx={{ mt: -0.5, mr: -0.5 }}
              onClick={handleMenuOpen}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Reviewer name */}
          <Typography variant="h6" component="h3" fontWeight={600}>
            {reviewerName}
          </Typography>

          {/* Metadata lines */}
          <Stack spacing={0.5}>
            {submittedDate && (
              <Typography variant="body2" color="text.secondary">
                <strong>Submitted:</strong> {submittedDate}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              <strong>Invited:</strong> {invitedDate}
            </Typography>

            {responseDate && isAccepted && (
              <Typography variant="body2" color="text.secondary">
                <strong>Accepted:</strong> {responseDate}
              </Typography>
            )}

            {responseDate && isDeclined && (
              <Typography variant="body2" color="text.secondary">
                <strong>Declined:</strong> {responseDate}
              </Typography>
            )}

            {isPending && timeLeftToRespond && (
              <Typography variant="body2" color="text.secondary">
                <strong>Time left to respond:</strong> {timeLeftToRespond}
              </Typography>
            )}

            <Typography
              variant="body2"
              color={expirationDate ? "warning.main" : "text.disabled"}
              sx={{ fontSize: "0.75rem", fontFamily: "monospace" }}
            >
              <strong>DEBUG - Expiration:</strong> {expirationDate || "NULL"}
            </Typography>

            {isAccepted && reportSubmissionDeadline && (
              <Typography variant="body2" color="text.secondary">
                <strong>Report submission deadline:</strong>{" "}
                {reportSubmissionDeadline}
                {daysLeft !== undefined && onExtendDeadline && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ ml: 1, cursor: "pointer" }}
                    onClick={onExtendDeadline}
                  >
                    ⏱ Extend Deadline
                  </Typography>
                )}
              </Typography>
            )}
          </Stack>

          {/* Action buttons */}
          {isReportSubmitted && onReadReport && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button variant="outlined" size="small" onClick={onReadReport}>
                Read Report
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>

      {/* Action Menu */}
      <Menu anchorEl={menuAnchor} open={menuOpen} onClose={handleMenuClose}>
        {/* Force Accept - show for declined/pending */}
        {!isAccepted && !isReportSubmitted && onForceAccept && (
          <MenuItem onClick={() => handleAction(onForceAccept)}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Force Accept</ListItemText>
          </MenuItem>
        )}

        {/* Force Decline - show for accepted/pending */}
        {!isDeclined && !isReportSubmitted && onForceDecline && (
          <MenuItem onClick={() => handleAction(onForceDecline)}>
            <ListItemIcon>
              <CancelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Force Decline</ListItemText>
          </MenuItem>
        )}

        {(!isAccepted || !isDeclined) && !isReportSubmitted && <Divider />}

        {/* Revoke Invitation - show for pending */}
        {isPending && onRevokeInvitation && (
          <MenuItem onClick={() => handleAction(onRevokeInvitation)}>
            <ListItemIcon>
              <BlockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Revoke Invitation</ListItemText>
          </MenuItem>
        )}

        {/* Extend Deadline - show for accepted */}
        {isAccepted && onExtendDeadline && (
          <MenuItem onClick={() => handleAction(onExtendDeadline)}>
            <ListItemIcon>
              <AccessTimeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Extend Deadline</ListItemText>
          </MenuItem>
        )}

        {(isPending || isAccepted) && <Divider />}

        {/* Read Report - show for submitted */}
        {isReportSubmitted && onReadReport && (
          <MenuItem onClick={() => handleAction(onReadReport)}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Read Report</ListItemText>
          </MenuItem>
        )}

        {isReportSubmitted && <Divider />}

        {/* Remove Invitation - show for accepted/declined/completed */}
        {!isPending && !isReportSubmitted && onRemoveInvitation && (
          <MenuItem onClick={() => handleAction(onRemoveInvitation)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove Invitation</ListItemText>
          </MenuItem>
        )}

        {/* View Profile - always show */}
        {onViewProfile && (
          <MenuItem onClick={() => handleAction(onViewProfile)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}
