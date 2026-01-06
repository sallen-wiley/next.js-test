"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import { createClient } from "@/utils/supabase/client";
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from "@/types/roles";

export default function UserManagement() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const {
    loading: permissionsLoading,
    permissions,
    profile: profileFromHook,
  } = useRoleAccess();
  const supabase = createClient();

  const loadProfiles = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Failed to load user profiles: ${error.message}`);
      } else {
        setProfiles(data || []);
      }
    } catch (err) {
      setError("Failed to load user profiles");
      console.error("Error loading profiles:", err);
    }

    setLoading(false);
  }, [supabase]);

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select();

      if (error) {
        setError(`Failed to update role: ${error.message}`);
      } else if (!data || data.length === 0) {
        setError("No rows were updated. Check permissions or policies.");
      } else {
        setSuccess(`Role updated successfully to ${ROLE_DEFINITIONS[newRole].name}`);
        setProfiles(
          profiles.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
        );
      }
    } catch (err) {
      console.error("Error updating role:", err);
      setError(
        `Failed to update role: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setError("Please provide both email and password");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (error) {
        setError(`Failed to create user: ${error.message}`);
      } else {
        setSuccess(
          `User created: ${newUserEmail} with password: ${newUserPassword}`
        );
        setNewUserEmail("");
        setNewUserPassword("");
        setCreateDialogOpen(false);
        loadProfiles();
      }
    } catch (err) {
      setError("Failed to create user");
      console.error("Error creating user:", err);
    }
  };

  const generatePassword = () => {
    // Simple password for testing: "test" + 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setNewUserPassword(`test${randomDigits}`);
  };

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canManageUsers) {
      loadProfiles();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canManageUsers, loadProfiles]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading users..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canManageUsers"
      skipCheck={true}
      permissions={permissions}
      profile={profileFromHook}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create user accounts and manage roles and permissions
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadProfiles}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create User
            </Button>
          </Box>
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

        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <PersonIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          No User Profiles Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          User profiles will appear here when users sign up, or you can create test users.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon color="action" />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {profile.full_name || "Unnamed User"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {profile.id.slice(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={ROLE_DEFINITIONS[profile.role].name}
                          color={ROLE_DEFINITIONS[profile.role].color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{profile.department || "Not set"}</TableCell>
                      <TableCell>
                        <Chip
                          label={profile.is_active ? "Active" : "Inactive"}
                          color={profile.is_active ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(profile.created_at)}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 140, mr: 1 }}>
                          <InputLabel>Change Role</InputLabel>
                          <Select
                            value=""
                            label="Change Role"
                            onChange={(e) =>
                              updateUserRole(
                                profile.id,
                                e.target.value as UserRole
                              )
                            }
                          >
                            {Object.entries(ROLE_DEFINITIONS).map(
                              ([role, def]) => (
                                <MenuItem
                                  key={role}
                                  value={role}
                                  disabled={profile.role === role}
                                >
                                  {def.name}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                        <IconButton size="small" color="error" title="Delete user">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Create User Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create Test User</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="designer@example.com"
              />
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Password for testing"
                />
                <Button variant="outlined" onClick={generatePassword}>
                  Generate
                </Button>
              </Box>
              <Alert severity="info">
                <Typography variant="body2">
                  For testing purposes, passwords will be shared in plain text.
                  Consider using simple passwords like &quot;test1234&quot; for
                  demo accounts.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={createUser} variant="contained" disabled={loading}>
              Create User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Info Boxes */}
        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 300, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Role Definitions
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.entries(ROLE_DEFINITIONS).map(([role, def]) => (
                <Chip
                  key={role}
                  label={`${def.name}: ${def.description}`}
                  color={def.color}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Quick Test Accounts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              For quick testing, create accounts with these simple credentials:
            </Typography>
            <Box sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
              <div>designer@test.com / test1234</div>
              <div>product@test.com / test1234</div>
              <div>reviewer@test.com / test1234</div>
            </Box>
          </Box>
        </Box>
      </Box>
    </RoleGuard>
  );
}
