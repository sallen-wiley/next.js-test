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
import type { ReviewerWithStatus } from "@/lib/supabase";

interface ReviewerActionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  selectedReviewer: ReviewerWithStatus | null;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemoveFromQueue: () => void;
  onRevokeInvitation: () => void;
  onReadReport: () => void;
  onViewProfile: () => void;
}

export default function ReviewerActionMenu({
  anchorEl,
  open,
  onClose,
  selectedReviewer,
  onMoveUp,
  onMoveDown,
  onRemoveFromQueue,
  onRevokeInvitation,
  onReadReport,
  onViewProfile,
}: ReviewerActionMenuProps) {
  if (!selectedReviewer) return null;

  const isQueued = selectedReviewer.invitation_status === "queued";
  const isPending = selectedReviewer.invitation_status === "pending";
  const isReportSubmitted = selectedReviewer.invitation_status === "report_submitted";
  const isFirstInQueue = selectedReviewer.queue_position === 1;

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {isQueued && (
        <>
          <MenuItem onClick={onMoveUp} disabled={isFirstInQueue}>
            <ListItemIcon>
              <ArrowUpwardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move Up</ListItemText>
          </MenuItem>
          <MenuItem onClick={onMoveDown}>
            <ListItemIcon>
              <ArrowDownwardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move Down</ListItemText>
          </MenuItem>
          <MenuItem onClick={onRemoveFromQueue}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove from Queue</ListItemText>
          </MenuItem>
          <Divider />
        </>
      )}
      {isPending && (
        <>
          <MenuItem onClick={onRevokeInvitation}>
            <ListItemIcon>
              <BlockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Revoke Invitation</ListItemText>
          </MenuItem>
          <Divider />
        </>
      )}
      {isReportSubmitted && (
        <>
          <MenuItem onClick={onReadReport}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Read Report</ListItemText>
          </MenuItem>
          <Divider />
        </>
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
