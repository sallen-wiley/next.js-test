"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "@/lib/supabase";
import type { ReviewInvitationWithReviewer } from "@/lib/supabase";
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";

export default function ReviewInvitationManager() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<
    ReviewInvitationWithReviewer[]
  >([]);
  const [manuscripts, setManuscripts] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [reviewers, setReviewers] = useState<
    Array<{ id: string; name: string; affiliation?: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvitation, setEditingInvitation] =
    useState<ReviewInvitationWithReviewer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    manuscript_id: "",
    reviewer_id: "",
    invited_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "pending",
    response_date: "",
    queue_position: undefined as number | undefined,
    invitation_round: 1,
    reminder_count: 0,
    estimated_completion_date: "",
    invitation_expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    report_invalidated_date: "",
    notes: "",
  });

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canAssignReviewers) {
      fetchData();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canAssignReviewers]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch invitations
      const { data: invitationsData, error: invError } = await supabase
        .from("review_invitations")
        .select("*")
        .order("invited_date", { ascending: false });

      if (invError) throw invError;

      // Fetch manuscripts
      const { data: manuscriptsData, error: manError } = await supabase
        .from("manuscripts")
        .select("id, title")
        .order("submission_date", { ascending: false });

      if (manError) throw manError;

      // Fetch reviewers
      const { data: reviewersData, error: revError } = await supabase
        .from("potential_reviewers")
        .select("id, name, affiliation")
        .order("name");

      if (revError) throw revError;

      // Join invitation data with reviewer info
      const enrichedInvitations = (invitationsData || []).map((inv) => {
        const reviewer = (reviewersData || []).find(
          (r) => r.id === inv.reviewer_id,
        );
        return {
          ...inv,
          reviewer_name: reviewer?.name || "Unknown",
          reviewer_affiliation: reviewer?.affiliation,
        };
      });

      setInvitations(enrichedInvitations);
      setManuscripts(manuscriptsData || []);
      setReviewers(reviewersData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (invitation?: ReviewInvitationWithReviewer) => {
    if (invitation) {
      setEditingInvitation(invitation);
      setFormData({
        manuscript_id: invitation.manuscript_id || "",
        reviewer_id: invitation.reviewer_id || "",
        invited_date: invitation.invited_date
          ? new Date(invitation.invited_date).toISOString().split("T")[0]
          : "",
        due_date: invitation.due_date
          ? new Date(invitation.due_date).toISOString().split("T")[0]
          : "",
        status: invitation.status || "pending",
        response_date: invitation.response_date
          ? new Date(invitation.response_date).toISOString().split("T")[0]
          : "",
        queue_position: (invitation as unknown as Record<string, unknown>)
          .queue_position as number | undefined,
        invitation_round:
          ((invitation as unknown as Record<string, unknown>)
            .invitation_round as number) || 1,
        reminder_count:
          ((invitation as unknown as Record<string, unknown>)
            .reminder_count as number) || 0,
        estimated_completion_date: invitation.estimated_completion_date
          ? new Date(invitation.estimated_completion_date)
              .toISOString()
              .split("T")[0]
          : "",
        invitation_expiration_date: invitation.invitation_expiration_date
          ? new Date(invitation.invitation_expiration_date)
              .toISOString()
              .split("T")[0]
          : "",
        report_invalidated_date: invitation.report_invalidated_date
          ? new Date(invitation.report_invalidated_date)
              .toISOString()
              .split("T")[0]
          : "",
        notes: invitation.notes || "",
      });
    } else {
      setEditingInvitation(null);
      setFormData({
        manuscript_id: "",
        reviewer_id: "",
        invited_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "pending",
        response_date: "",
        queue_position: undefined,
        invitation_round: 1,
        reminder_count: 0,
        estimated_completion_date: "",
        invitation_expiration_date: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        report_invalidated_date: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingInvitation(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        manuscript_id: formData.manuscript_id,
        reviewer_id: formData.reviewer_id,
        invited_date: formData.invited_date
          ? new Date(formData.invited_date).toISOString()
          : null,
        due_date: formData.due_date
          ? new Date(formData.due_date).toISOString()
          : null,
        status: formData.status,
        response_date: formData.response_date
          ? new Date(formData.response_date).toISOString()
          : null,
        queue_position: formData.queue_position || null,
        invitation_round: formData.invitation_round,
        reminder_count: formData.reminder_count,
        estimated_completion_date: formData.estimated_completion_date || null,
        invitation_expiration_date: formData.invitation_expiration_date
          ? new Date(formData.invitation_expiration_date).toISOString()
          : null,
        report_invalidated_date: formData.report_invalidated_date
          ? new Date(formData.report_invalidated_date).toISOString()
          : null,
        notes: formData.notes || null,
      };

      if (editingInvitation) {
        const { error } = await supabase
          .from("review_invitations")
          .update(submitData)
          .eq("id", editingInvitation.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("review_invitations")
          .insert([submitData]);

        if (error) throw error;
      }

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) return;

    try {
      const { error } = await supabase
        .from("review_invitations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "declined":
        return "error";
      case "completed":
      case "report_submitted":
        return "info";
      default:
        return "default";
    }
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading invitations..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canAssignReviewers"
      skipCheck={true}
      permissions={permissions}
      profile={profile}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Review Invitations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage reviewer invitations and responses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Invitation
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Manuscript</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Invited Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Response Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitations.map((invitation) => {
                const manuscript = manuscripts.find(
                  (m) => m.id === invitation.manuscript_id,
                );
                return (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: 200,
                          color: "primary.main",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() =>
                          router.push(
                            `/reviewer-dashboard/manage-reviewers?manuscriptId=${invitation.manuscript_id}`,
                          )
                        }
                      >
                        {manuscript?.title || "Unknown Manuscript"}
                      </Typography>
                    </TableCell>
                    <TableCell>{invitation.reviewer_name}</TableCell>
                    <TableCell>
                      {invitation.invited_date
                        ? new Date(invitation.invited_date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {invitation.due_date
                        ? new Date(invitation.due_date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invitation.status}
                        color={getStatusColor(invitation.status || "pending")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {invitation.response_date
                        ? new Date(
                            invitation.response_date,
                          ).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(invitation)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(invitation.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingInvitation ? "Edit Invitation" : "Add New Invitation"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Manuscript</InputLabel>
                <Select
                  value={formData.manuscript_id}
                  onChange={(e) =>
                    setFormData({ ...formData, manuscript_id: e.target.value })
                  }
                  label="Manuscript"
                >
                  {manuscripts.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Reviewer</InputLabel>
                <Select
                  value={formData.reviewer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewer_id: e.target.value })
                  }
                  label="Reviewer"
                >
                  {reviewers.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name} {r.affiliation && `(${r.affiliation})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Invited Date"
                type="date"
                value={formData.invited_date}
                onChange={(e) =>
                  setFormData({ ...formData, invited_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Due Date"
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                  <MenuItem value="report_submitted">Report Submitted</MenuItem>
                  <MenuItem value="invalidated">Invalidated</MenuItem>
                  <MenuItem value="revoked">Revoked</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Response Date"
                type="date"
                value={formData.response_date}
                onChange={(e) =>
                  setFormData({ ...formData, response_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Queue Position"
                  type="number"
                  value={formData.queue_position || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      queue_position: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  fullWidth
                  helperText="Position in invitation queue (optional)"
                />
                <TextField
                  label="Invitation Round"
                  type="number"
                  value={formData.invitation_round}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invitation_round: parseInt(e.target.value) || 1,
                    })
                  }
                  fullWidth
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Reminder Count"
                  type="number"
                  value={formData.reminder_count}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reminder_count: parseInt(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Stack>

              <TextField
                label="Estimated Completion Date"
                type="date"
                value={formData.estimated_completion_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_completion_date: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Invitation Expiration Date"
                type="date"
                value={formData.invitation_expiration_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    invitation_expiration_date: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
                helperText="Date when pending invitation expires (typically 14 days)"
              />

              <TextField
                label="Report Invalidated Date"
                type="date"
                value={formData.report_invalidated_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    report_invalidated_date: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
                helperText="Only set when status is 'invalidated'"
              />

              <TextField
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                fullWidth
                helperText="Free-form notes for status changes, reasons, etc."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingInvitation ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleGuard>
  );
}
