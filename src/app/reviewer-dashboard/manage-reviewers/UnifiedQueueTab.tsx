import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
} from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { ReviewerWithStatus, QueueControlState } from "@/lib/supabase";

interface QueueInvitationsTabProps {
  reviewersWithStatus: ReviewerWithStatus[];
  queueControl: QueueControlState | null;
  onToggleQueue: () => void;
  onActionMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus
  ) => void;
}

export default function QueueInvitationsTab({
  reviewersWithStatus,
  queueControl,
  onToggleQueue,
  onActionMenuOpen,
}: QueueInvitationsTabProps) {
  // Separate sent invitations from queued invitations
  const sentInvitations = reviewersWithStatus.filter(
    (r) => r.invitation_status && r.invitation_status !== "queued"
  );
  const queuedInvitations = reviewersWithStatus.filter(
    (r) => r.invitation_status === "queued"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "declined":
        return "error";
      case "expired":
        return "default";
      case "completed":
        return "info";
      case "report_submitted":
        return "success";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon fontSize="small" />;
      case "pending":
        return <PendingIcon fontSize="small" />;
      case "declined":
        return <CancelIcon fontSize="small" />;
      case "report_submitted":
        return <AssignmentTurnedInIcon fontSize="small" />;
      default:
        return <MailOutlineIcon fontSize="small" />;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Sent Invitations Table */}
      <Grid size={12}>
        <Paper sx={{ p: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <MailOutlineIcon color="primary" />
            Sent Invitations ({sentInvitations.length})
          </Typography>

          {sentInvitations.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reviewer</TableCell>
                    <TableCell>Invited Date</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell>Response Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentInvitations.map((reviewer) => (
                    <TableRow key={reviewer.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "0.875rem",
                            }}
                          >
                            {reviewer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {reviewer.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {reviewer.affiliation}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.invited_date
                            ? new Date(
                                reviewer.invited_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={getStatusIcon(reviewer.invitation_status || "")}
                          label={reviewer.invitation_status || "Unknown"}
                          color={
                            getStatusColor(reviewer.invitation_status || "") as
                              | "success"
                              | "warning"
                              | "error"
                              | "info"
                              | "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.response_date
                            ? new Date(
                                reviewer.response_date
                              ).toLocaleDateString()
                            : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.due_date
                            ? new Date(reviewer.due_date).toLocaleDateString()
                            : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => onActionMenuOpen(e, reviewer)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No invitations have been sent yet
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Queue Table */}
      <Grid size={12}>
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <QueueIcon color="primary" />
              Invitation Queue ({queuedInvitations.length})
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={queueControl?.queue_active || false}
                    onChange={onToggleQueue}
                    color="success"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {queueControl?.queue_active ? "Active" : "Paused"}
                  </Typography>
                }
              />
              <Chip
                icon={
                  queueControl?.queue_active ? <PlayArrowIcon /> : <PauseIcon />
                }
                label={queueControl?.queue_active ? "Running" : "Paused"}
                color={queueControl?.queue_active ? "success" : "default"}
                size="small"
              />
            </Box>
          </Box>

          {queuedInvitations.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={80}>Position</TableCell>
                    <TableCell>Reviewer</TableCell>
                    <TableCell align="center">Match Score</TableCell>
                    <TableCell>Scheduled Send</TableCell>
                    <TableCell align="center">Priority</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queuedInvitations
                    .sort(
                      (a, b) =>
                        (a.queue_position || 0) - (b.queue_position || 0)
                    )
                    .map((reviewer) => (
                      <TableRow key={reviewer.id} hover>
                        <TableCell>
                          <Chip
                            label={reviewer.queue_position}
                            color="primary"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: "0.875rem",
                              }}
                            >
                              {reviewer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {reviewer.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {reviewer.affiliation}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${reviewer.match_score}%`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {reviewer.scheduled_send_date
                              ? new Date(
                                  reviewer.scheduled_send_date
                                ).toLocaleDateString()
                              : "Not scheduled"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={reviewer.priority || "normal"}
                            size="small"
                            color={
                              reviewer.priority === "high"
                                ? "error"
                                : reviewer.priority === "low"
                                ? "default"
                                : "warning"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => onActionMenuOpen(e, reviewer)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <HourglassEmptyIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                No reviewers queued for invitation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Add reviewers from the &quot;Potential Reviewers&quot; tab
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
