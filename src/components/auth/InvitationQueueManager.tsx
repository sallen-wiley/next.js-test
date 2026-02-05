"use client";

import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  TextField,
  Stack,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createClient } from "@/utils/supabase/client";
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";

interface QueueItem {
  id: string;
  manuscript_id: string | null;
  reviewer_id: string | null;
  queue_position: number;
  created_date: string;
  scheduled_send_date: string;
  priority: "high" | "normal" | "low";
  notes: string | null;
  sent: boolean;
  sent_at: string | null;
  manuscript_title?: string;
  reviewer_name?: string;
}

interface Manuscript {
  id: string;
  title: string;
}

interface Reviewer {
  id: string;
  name: string;
  affiliation: string;
}

const priorityOptions = [
  { value: "high", label: "High", color: "error" as const },
  { value: "normal", label: "Normal", color: "default" as const },
  { value: "low", label: "Low", color: "info" as const },
];

export default function InvitationQueueManager() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    manuscript_id: "",
    reviewer_id: "",
    queue_position: 1,
    scheduled_send_date: new Date().toISOString().split("T")[0],
    priority: "normal" as "high" | "normal" | "low",
    notes: "",
    sent: false,
  });

  const supabase = createClient();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [queueRes, manuscriptRes, reviewerRes] = await Promise.all([
        supabase
          .from("invitation_queue")
          .select("*")
          .order("queue_position", { ascending: true }),
        supabase.from("manuscripts").select("id, title"),
        supabase.from("potential_reviewers").select("id, name, affiliation"),
      ]);

      if (queueRes.error) throw queueRes.error;
      if (manuscriptRes.error) throw manuscriptRes.error;
      if (reviewerRes.error) throw reviewerRes.error;

      // Enrich queue items with manuscript and reviewer names
      const enrichedQueue = (queueRes.data || []).map((item) => {
        const manuscript = manuscriptRes.data?.find(
          (m) => m.id === item.manuscript_id,
        );
        const reviewer = reviewerRes.data?.find(
          (r) => r.id === item.reviewer_id,
        );
        return {
          ...item,
          manuscript_title: manuscript?.title,
          reviewer_name: reviewer?.name,
        };
      });

      setQueueItems(enrichedQueue);
      setManuscripts(manuscriptRes.data || []);
      setReviewers(reviewerRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canAssignReviewers) {
      loadData();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canAssignReviewers, loadData]);

  const handleOpenDialog = (item?: QueueItem) => {
    if (item) {
      setEditMode(true);
      setSelectedItem(item);
      setFormData({
        manuscript_id: item.manuscript_id || "",
        reviewer_id: item.reviewer_id || "",
        queue_position: item.queue_position,
        scheduled_send_date: new Date(item.scheduled_send_date)
          .toISOString()
          .split("T")[0],
        priority: item.priority,
        notes: item.notes || "",
        sent: item.sent,
      });
    } else {
      setEditMode(false);
      setSelectedItem(null);
      setFormData({
        manuscript_id: "",
        reviewer_id: "",
        queue_position:
          queueItems.length > 0
            ? Math.max(...queueItems.map((q) => q.queue_position)) + 1
            : 1,
        scheduled_send_date: new Date().toISOString().split("T")[0],
        priority: "normal",
        notes: "",
        sent: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedItem(null);
  };

  const handleSubmit = async () => {
    if (!formData.manuscript_id || !formData.reviewer_id) {
      showSnackbar("Please select both manuscript and reviewer", "error");
      return;
    }

    try {
      const submitData = {
        manuscript_id: formData.manuscript_id,
        reviewer_id: formData.reviewer_id,
        queue_position: formData.queue_position,
        scheduled_send_date: new Date(
          formData.scheduled_send_date,
        ).toISOString(),
        priority: formData.priority,
        notes: formData.notes || null,
        sent: formData.sent,
      };

      if (editMode && selectedItem) {
        const { error } = await supabase
          .from("invitation_queue")
          .update(submitData)
          .eq("id", selectedItem.id);

        if (error) throw error;
        showSnackbar("Queue item updated successfully", "success");
      } else {
        const { error } = await supabase
          .from("invitation_queue")
          .insert([submitData]);

        if (error) throw error;
        showSnackbar("Queue item added successfully", "success");
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error("Error saving queue item:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save queue item",
        "error",
      );
    }
  };

  const handleDelete = async (id: string, reviewerName?: string) => {
    if (
      !confirm(
        `Are you sure you want to remove ${
          reviewerName || "this item"
        } from the queue?`,
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("invitation_queue")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showSnackbar("Queue item removed successfully", "success");
      loadData();
    } catch (error) {
      console.error("Error deleting queue item:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to delete queue item",
        "error",
      );
    }
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading queue..." />;
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
              Invitation Queue
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage queued reviewer invitations waiting to be sent
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add to Queue
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Manuscript</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Scheduled</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queueItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">
                      Queue is empty
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                queueItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Chip label={item.queue_position} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.manuscript_title || "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.reviewer_name || "Unknown"}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.priority}
                        size="small"
                        color={
                          priorityOptions.find((p) => p.value === item.priority)
                            ?.color
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(item.scheduled_send_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {item.sent ? (
                        <Chip
                          label={`Sent ${new Date(
                            item.sent_at!,
                          ).toLocaleDateString()}`}
                          size="small"
                          color="success"
                        />
                      ) : (
                        <Chip label="Pending" size="small" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(item)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDelete(item.id, item.reviewer_name)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
            {editMode ? "Edit Queue Item" : "Add to Queue"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Manuscript</InputLabel>
                <Select
                  value={formData.manuscript_id}
                  onChange={(e) =>
                    setFormData({ ...formData, manuscript_id: e.target.value })
                  }
                  label="Manuscript"
                >
                  {manuscripts.map((manuscript) => (
                    <MenuItem key={manuscript.id} value={manuscript.id}>
                      {manuscript.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Reviewer</InputLabel>
                <Select
                  value={formData.reviewer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewer_id: e.target.value })
                  }
                  label="Reviewer"
                >
                  {reviewers.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.name} ({reviewer.affiliation})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Queue Position"
                type="number"
                value={formData.queue_position}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    queue_position: parseInt(e.target.value) || 1,
                  })
                }
                required
                fullWidth
                inputProps={{ min: 1 }}
              />

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as "high" | "normal" | "low",
                    })
                  }
                  label="Priority"
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Scheduled Send Date"
                type="date"
                value={formData.scheduled_send_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduled_send_date: e.target.value,
                  })
                }
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
              />

              {editMode && (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.sent ? "sent" : "pending"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sent: e.target.value === "sent",
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editMode ? "Update" : "Add"} Queue Item
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </RoleGuard>
  );
}
