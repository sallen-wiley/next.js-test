"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Autocomplete,
  TextField,
  createFilterOptions,
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
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";

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
    custom_id?: string;
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
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedManuscriptId, setSelectedManuscriptId] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "editor" | "author" | "collaborator" | "reviewer"
  >("editor");
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );

  const loadData = React.useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canEditManuscripts) {
      loadData();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canEditManuscripts, loadData]);

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
        selectedRole,
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
    manuscriptTitle: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to remove ${userName} from "${manuscriptTitle}"?`,
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
        err instanceof Error ? err.message : "Failed to remove assignment",
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
        selectedRole,
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
    role: string,
  ): "primary" | "secondary" | "info" | "success" => {
    const roleConfig = MANUSCRIPT_ROLES.find((r) => r.value === role);
    return roleConfig?.color || "primary";
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading manuscript assignments..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canEditManuscripts"
      skipCheck={true}
      permissions={permissions}
      profile={profile}
    >
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
                <TableCell>Custom ID</TableCell>
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
                  <TableCell colSpan={8} align="center">
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
                        <Link
                          href={`/reviewer-dashboard/${assignment.manuscript_id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              maxWidth: 300,
                              color: "primary.main",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {assignment.manuscripts.title}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {assignment.manuscripts.custom_id ? (
                          <Link
                            href={`/reviewer-dashboard/${assignment.manuscript_id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "primary.main",
                                fontFamily: "monospace",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {assignment.manuscripts.custom_id}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
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
                        {new Date(
                          assignment.assigned_date,
                        ).toLocaleDateString()}
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
                                assignment.manuscripts.title,
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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.full_name || option.email}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={users.find((u) => u.id === selectedUserId) || null}
                onChange={(_, newValue) =>
                  setSelectedUserId(newValue?.id || "")
                }
                renderOption={(props, option) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { key, ...otherProps } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
                  return (
                    <li key={option.id} {...otherProps}>
                      <Box>
                        <Typography variant="body2">
                          {option.full_name || option.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.email} • {option.role}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User"
                    placeholder="Search users..."
                  />
                )}
                fullWidth
              />

              <Autocomplete
                options={manuscripts}
                getOptionLabel={(option) => option.title}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  manuscripts.find((m) => m.id === selectedManuscriptId) || null
                }
                onChange={(_, newValue) =>
                  setSelectedManuscriptId(newValue?.id || "")
                }
                filterOptions={createFilterOptions({
                  stringify: (option) =>
                    `${option.title} ${option.custom_id || ""}`,
                })}
                renderOption={(props, option) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { key, ...otherProps } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
                  return (
                    <li key={option.id} {...otherProps}>
                      <Box>
                        <Typography variant="body2">{option.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.custom_id && `${option.custom_id} • `}
                          {option.journal} • {option.status}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Manuscript"
                    placeholder="Search by title or ID..."
                  />
                )}
                fullWidth
              />

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
                        | "reviewer",
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
                          | "reviewer",
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
    </RoleGuard>
  );
}
