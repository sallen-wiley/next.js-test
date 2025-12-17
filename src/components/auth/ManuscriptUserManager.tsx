"use client";

import { useState, useEffect } from "react";
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
  Tooltip,
  Stack,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  getAllUsers,
  getAllManuscripts,
  getAllUserManuscriptAssignments,
  addUserToManuscript,
  removeUserFromManuscript,
  updateUserManuscriptRole,
} from "@/services/dataService";
import type { Manuscript } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: string;
}

interface Assignment {
  id: string;
  user_id: string;
  manuscript_id: string;
  role: "editor" | "author" | "collaborator" | "reviewer";
  assigned_date: string;
  is_active: boolean;
  user_profiles: {
    email: string;
    full_name?: string;
  };
  manuscripts: {
    title: string;
    journal: string;
    status: string;
  };
}

const MANUSCRIPT_ROLES = [
  { value: "editor", label: "Editor", color: "primary" },
  { value: "author", label: "Author", color: "secondary" },
  { value: "collaborator", label: "Collaborator", color: "info" },
  { value: "reviewer", label: "Reviewer", color: "success" },
] as const;

export default function ManuscriptUserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedManuscriptId, setSelectedManuscriptId] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "editor" | "author" | "collaborator" | "reviewer"
  >("editor");
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, manuscriptsData, assignmentsData] = await Promise.all([
        getAllUsers(),
        getAllManuscripts(),
        getAllUserManuscriptAssignments(),
      ]);

      setUsers(usersData);
      setManuscripts(manuscriptsData);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async () => {
    if (!selectedUserId || !selectedManuscriptId) {
      setError("Please select both a user and a manuscript");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await addUserToManuscript(
        selectedUserId,
        selectedManuscriptId,
        selectedRole
      );
      setSuccess("User successfully assigned to manuscript");
      setDialogOpen(false);
      setSelectedUserId("");
      setSelectedManuscriptId("");
      setSelectedRole("editor");
      await loadData();
    } catch (err: unknown) {
      console.error("Error adding assignment:", err);
      setError(err instanceof Error ? err.message : "Failed to add assignment");
    }
  };

  const handleRemoveAssignment = async (
    userId: string,
    manuscriptId: string,
    userName: string,
    manuscriptTitle: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to remove ${userName} from "${manuscriptTitle}"?`
      )
    ) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await removeUserFromManuscript(userId, manuscriptId);
      setSuccess("User removed from manuscript");
      await loadData();
    } catch (err: unknown) {
      console.error("Error removing assignment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove assignment"
      );
    }
  };

  const handleOpenEditDialog = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setSelectedRole(assignment.role);
    setEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingAssignment) return;

    setError(null);
    setSuccess(null);

    try {
      await updateUserManuscriptRole(
        editingAssignment.user_id,
        editingAssignment.manuscript_id,
        selectedRole
      );
      setSuccess("Role updated successfully");
      setEditDialogOpen(false);
      setEditingAssignment(null);
      await loadData();
    } catch (err: unknown) {
      console.error("Error updating role:", err);
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const getRoleColor = (
    role: string
  ): "primary" | "secondary" | "info" | "success" => {
    const roleConfig = MANUSCRIPT_ROLES.find((r) => r.value === role);
    return roleConfig?.color || "primary";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Loading manuscript assignments...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            User-Manuscript Assignments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage which users can access and manage specific manuscripts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Assignment
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Manuscript</TableCell>
              <TableCell>Journal</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No assignments found. Click &quot;Add Assignment&quot; to
                    get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments
                .filter((a) => a.is_active)
                .map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {assignment.user_profiles.full_name ||
                            assignment.user_profiles.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.user_profiles.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {assignment.manuscripts.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.manuscripts.journal}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.role}
                        color={getRoleColor(assignment.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.manuscripts.status}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.assigned_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Role">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(assignment)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Assignment">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleRemoveAssignment(
                              assignment.user_id,
                              assignment.manuscript_id,
                              assignment.user_profiles.full_name ||
                                assignment.user_profiles.email,
                              assignment.manuscripts.title
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Assignment Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add User to Manuscript</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                label="User"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.full_name || user.email} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Manuscript</InputLabel>
              <Select
                value={selectedManuscriptId}
                onChange={(e) => setSelectedManuscriptId(e.target.value)}
                label="Manuscript"
              >
                {manuscripts.map((manuscript) => (
                  <MenuItem key={manuscript.id} value={manuscript.id}>
                    {manuscript.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(
                    e.target.value as
                      | "editor"
                      | "author"
                      | "collaborator"
                      | "reviewer"
                  )
                }
                label="Role"
              >
                {MANUSCRIPT_ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddAssignment}
            variant="contained"
            disabled={!selectedUserId || !selectedManuscriptId}
          >
            Add Assignment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          {editingAssignment && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                User:{" "}
                {editingAssignment.user_profiles.full_name ||
                  editingAssignment.user_profiles.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Manuscript: {editingAssignment.manuscripts.title}
              </Typography>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(
                      e.target.value as
                        | "editor"
                        | "author"
                        | "collaborator"
                        | "reviewer"
                    )
                  }
                  label="Role"
                >
                  {MANUSCRIPT_ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
