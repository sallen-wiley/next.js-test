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
  onActionMenuOpen: (event: React.MouseEvent<HTMLElement>, reviewer: ReviewerWithStatus) => void;
}

export default function QueueInvitationsTab({
  reviewersWithStatus,
  queueControl,
  onToggleQueue,
  onActionMenuOpen,
}: QueueInvitationsTabProps) {
  const queuedReviewers = reviewersWithStatus.filter(r => r.invitation_status === "queued");
  const pendingReviewers = reviewersWithStatus.filter(r => r.invitation_status === "pending");
  const acceptedReviewers = reviewersWithStatus.filter(r => r.invitation_status === "accepted");
  const reportSubmittedReviewers = reviewersWithStatus.filter(r => r.invitation_status === "report_submitted");
  const declinedReviewers = reviewersWithStatus.filter(r => r.invitation_status === "declined");

  const hasAnyReviewers = reviewersWithStatus.filter(r => r.invitation_status).length > 0;

  return (
    <Grid container spacing={3}>
      {/* Queue Control Toggle */}
      <Grid size={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <QueueIcon color="primary" />
              <Typography variant="h6">Auto-Send Queue</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={queueControl?.queue_active || false}
                    onChange={onToggleQueue}
                    color="success"
                  />
                }
                label={queueControl?.queue_active ? "Active" : "Paused"}
              />
              <Chip
                icon={queueControl?.queue_active ? <PlayArrowIcon /> : <PauseIcon />}
                label={queueControl?.queue_active ? "Running" : "Paused"}
                color={queueControl?.queue_active ? "success" : "default"}
                size="small"
              />
            </Box>
            {queueControl?.next_scheduled_send && (
              <Typography variant="caption" color="text.secondary">
                Next send: {new Date(queueControl.next_scheduled_send).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>

      {/* QUEUED REVIEWERS */}
      {queuedReviewers.length > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HourglassEmptyIcon color="warning" />
              Queued Reviewers ({queuedReviewers.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={80}>Position</TableCell>
                    <TableCell>Reviewer</TableCell>
                    <TableCell align="center">Match</TableCell>
                    <TableCell>Scheduled Send</TableCell>
                    <TableCell align="center">Priority</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queuedReviewers
                    .sort((a, b) => (a.queue_position || 0) - (b.queue_position || 0))
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
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                              {reviewer.name.split(" ").map(n => n[0]).join("")}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>{reviewer.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{reviewer.affiliation}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${reviewer.match_score}%`} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {reviewer.scheduled_send_date ? new Date(reviewer.scheduled_send_date).toLocaleDateString() : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={reviewer.priority || "normal"} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={(e) => onActionMenuOpen(e, reviewer)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}

      {/* PENDING INVITATIONS */}
      {pendingReviewers.length > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PendingIcon color="info" />
              Pending Response ({pendingReviewers.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reviewer</TableCell>
                    <TableCell>Invited</TableCell>
                    <TableCell align="center">Reminders</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReviewers.map((reviewer) => (
                    <TableRow key={reviewer.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                            {reviewer.name.split(" ").map(n => n[0]).join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{reviewer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{reviewer.affiliation}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.invited_date ? new Date(reviewer.invited_date).toLocaleDateString() : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="0" size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => onActionMenuOpen(e, reviewer)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}

      {/* ACCEPTED - REVIEWING */}
      {acceptedReviewers.length > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon color="success" />
              Accepted - Reviewing ({acceptedReviewers.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reviewer</TableCell>
                    <TableCell>Accepted</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acceptedReviewers.map((reviewer) => (
                    <TableRow key={reviewer.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                            {reviewer.name.split(" ").map(n => n[0]).join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{reviewer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{reviewer.affiliation}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.response_date ? new Date(reviewer.response_date).toLocaleDateString() : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.due_date ? new Date(reviewer.due_date).toLocaleDateString() : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => onActionMenuOpen(e, reviewer)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}

      {/* REPORT SUBMITTED */}
      {reportSubmittedReviewers.length > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2, bgcolor: "success.50" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AssignmentTurnedInIcon color="success" />
              Report Submitted ({reportSubmittedReviewers.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reviewer</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportSubmittedReviewers.map((reviewer) => (
                    <TableRow key={reviewer.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem", bgcolor: "success.main" }}>
                            {reviewer.name.split(" ").map(n => n[0]).join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{reviewer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{reviewer.affiliation}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.response_date ? new Date(reviewer.response_date).toLocaleDateString() : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => onActionMenuOpen(e, reviewer)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}

      {/* DECLINED */}
      {declinedReviewers.length > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CancelIcon color="error" />
              Declined ({declinedReviewers.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reviewer</TableCell>
                    <TableCell>Declined Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {declinedReviewers.map((reviewer) => (
                    <TableRow key={reviewer.id} hover sx={{ opacity: 0.6 }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem", bgcolor: "grey.400" }}>
                            {reviewer.name.split(" ").map(n => n[0]).join("")}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{reviewer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{reviewer.affiliation}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {reviewer.response_date ? new Date(reviewer.response_date).toLocaleDateString() : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => onActionMenuOpen(e, reviewer)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}

      {/* Empty State */}
      {!hasAnyReviewers && (
        <Grid size={12}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <QueueIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Reviewers in Queue or Invited
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add reviewers from the "Potential Reviewers" tab to get started
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
