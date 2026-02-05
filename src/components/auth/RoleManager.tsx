"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import { createClient } from "@/utils/supabase/client";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from "@/types/roles";
import RoleGuard from "./RoleGuard";
import AdminLoadingState from "./AdminLoadingState";
import { useRoleAccess } from "@/hooks/useRoles";

export default function RoleManager() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      console.log(`Attempting to update user ${userId} to role ${newRole}`);

      const { data, error } = await supabase
        .from("user_profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select(); // Add select to see what was actually updated

      console.log("Update result:", { data, error });

      if (error) {
        console.error("Supabase error details:", error);
        setError(`Failed to update role: ${error.message}`);
      } else if (!data || data.length === 0) {
        setError("No rows were updated. Check permissions or policies.");
      } else {
        setSuccess(`Role updated successfully to ${newRole}`);
        // Only update local state if database update succeeded
        setProfiles(
          profiles.map((p) => (p.id === userId ? { ...p, role: newRole } : p)),
        );
      }
    } catch (err) {
      console.error("Error updating role:", err);
      setError(
        `Failed to update role: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading user roles..." />;
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
              User Role Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage user roles and permissions
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadProfiles}
            disabled={loading}
          >
            Refresh
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

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Current Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile) => (
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
                    <TableCell>{formatDate(profile.created_at)}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Change Role</InputLabel>
                        <Select
                          value=""
                          label="Change Role"
                          onChange={(e) =>
                            updateUserRole(
                              profile.id,
                              e.target.value as UserRole,
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
                            ),
                          )}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {profiles.length === 0 && (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <PersonIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No User Profiles Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User profiles will appear here when users sign up.
            </Typography>
          </Paper>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
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
      </Box>
    </RoleGuard>
  );
}
