import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PublishIcon from "@mui/icons-material/Publish";
import ErrorIcon from "@mui/icons-material/Error";
import RestoreIcon from "@mui/icons-material/Restore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import type { ReviewerWithStatus } from "@/lib/supabase";

interface ReviewerActionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  selectedReviewer: ReviewerWithStatus | null;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemoveFromQueue: () => void;
  onInviteFromQueue: () => void;
  onRevokeInvitation: () => void;
  onRemoveInvitation: () => void;
  onForceAccept: () => void;
  onForceDecline: () => void;
  onReadReport: () => void;
  onViewProfile: () => void;
  onSubmitReport: () => void;
  onInvalidateReport: () => void;
  onReinstateReport: () => void;
  onCancelReview: () => void;
}

export default function ReviewerActionMenu({
  anchorEl,
  open,
  onClose,
  selectedReviewer,
  onMoveUp,
  onMoveDown,
  onRemoveFromQueue,
  onInviteFromQueue,
  onRevokeInvitation,
  onRemoveInvitation,
  onForceAccept,
  onForceDecline,
  onReadReport,
  onViewProfile,
  onSubmitReport,
  onInvalidateReport,
  onReinstateReport,
  onCancelReview,
}: ReviewerActionMenuProps) {
  if (!selectedReviewer) return null;

  const isQueued = selectedReviewer.invitation_status === "queued";
  const isPending = selectedReviewer.invitation_status === "pending";
  const isAccepted = selectedReviewer.invitation_status === "accepted";
  const isDeclined = selectedReviewer.invitation_status === "declined";
  const isReportSubmitted =
    selectedReviewer.invitation_status === "report_submitted";
  const isInvalidated = selectedReviewer.invitation_status === "invalidated";
  const isRevoked = selectedReviewer.invitation_status === "revoked";
  const hasInvitation =
    selectedReviewer.invitation_status &&
    selectedReviewer.invitation_status !== "queued";
  const isFirstInQueue = selectedReviewer.queue_position === 1;

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {isQueued && [
        <MenuItem key="invite-now" onClick={onInviteFromQueue}>
          <ListItemIcon>
            <MailOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Invite Now</ListItemText>
        </MenuItem>,
        <Divider key="divider-invite" />,
        <MenuItem key="move-up" onClick={onMoveUp} disabled={isFirstInQueue}>
          <ListItemIcon>
            <ArrowUpwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move Up</ListItemText>
        </MenuItem>,
        <MenuItem key="move-down" onClick={onMoveDown}>
          <ListItemIcon>
            <ArrowDownwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move Down</ListItemText>
        </MenuItem>,
        <MenuItem key="remove" onClick={onRemoveFromQueue}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Remove from Queue</ListItemText>
        </MenuItem>,
        <Divider key="divider-queue" />,
      ]}
      {hasInvitation &&
        !isQueued && [
          // Testing: Submit Report for accepted reviewers
          isAccepted && (
            <MenuItem key="submit-report" onClick={onSubmitReport}>
              <ListItemIcon>
                <PublishIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Submit Report (Testing)</ListItemText>
            </MenuItem>
          ),
          // Show Force Accept for declined/pending reviewers
          !isAccepted && !isReportSubmitted && !isInvalidated && !isRevoked && (
            <MenuItem key="force-accept" onClick={onForceAccept}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Force Accept</ListItemText>
            </MenuItem>
          ),
          // Show Force Decline for accepted/pending reviewers
          !isDeclined && !isReportSubmitted && !isInvalidated && !isRevoked && (
            <MenuItem key="force-decline" onClick={onForceDecline}>
              <ListItemIcon>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Force Decline</ListItemText>
            </MenuItem>
          ),
          (isAccepted || isPending || isDeclined) && (
            <Divider key="divider-force" />
          ),
        ]}
      {/* Revoke invitation for pending OR declined */}
      {(isPending || isDeclined) && (
        <MenuItem key="revoke" onClick={onRevokeInvitation}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Revoke Invitation</ListItemText>
        </MenuItem>
      )}
      {(isPending || isDeclined) && <Divider key="divider-pending" />}
      {/* Report actions */}
      {isReportSubmitted && [
        <MenuItem key="read-report" onClick={onReadReport}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Read Report</ListItemText>
        </MenuItem>,
        <MenuItem key="invalidate-report" onClick={onInvalidateReport}>
          <ListItemIcon>
            <ErrorIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Invalidate Report</ListItemText>
        </MenuItem>,
        <Divider key="divider-report" />,
      ]}
      {isInvalidated && [
        <MenuItem key="reinstate-report" onClick={onReinstateReport}>
          <ListItemIcon>
            <RestoreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reinstate Report</ListItemText>
        </MenuItem>,
        <Divider key="divider-invalidated" />,
      ]}
      {/* Cancel review for invalidated/revoked */}
      {(isInvalidated || isRevoked) && (
        <MenuItem key="cancel-review" onClick={onCancelReview}>
          <ListItemIcon>
            <RemoveCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancel Review</ListItemText>
        </MenuItem>
      )}
      {(isInvalidated || isRevoked) && <Divider key="divider-cancel" />}
      {hasInvitation && !isPending && !isReportSubmitted && !isInvalidated && (
        <MenuItem onClick={onRemoveInvitation}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Remove Invitation</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={onViewProfile}>
        <ListItemIcon>
          <VisibilityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>View Profile</ListItemText>
      </MenuItem>
    </Menu>
  );
}
