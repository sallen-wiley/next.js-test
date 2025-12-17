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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { createClient } from "@/utils/supabase/client";

interface TestUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null | undefined;
  last_sign_in_at: string | null | undefined;
  role?: string;
  full_name?: string;
  is_active?: boolean;
}

export default function AdminUserManager() {
  const [users, setUsers] = useState<TestUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const supabase = createClient();

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use user_profiles table instead of admin API
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Failed to load users: ${error.message}`);
      } else {
        // Convert user_profiles to TestUser format
        const users: TestUser[] = data.map((profile) => ({
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          email_confirmed_at: profile.created_at, // We don't have email confirmation in profiles
          last_sign_in_at: profile.last_login,
          role: profile.role,
          full_name: profile.full_name,
          is_active: profile.is_active,
        }));
        setUsers(users);
      }
    } catch (err) {
      setError("Failed to load users");
      console.error("Error loading users:", err);
    }

    setLoading(false);
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setError("Please provide both email and password");
      return;
    }

    setLoading(true);
    setError(null);

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
        loadUsers();
      }
    } catch (err) {
      setError("Failed to create user");
      console.error("Error creating user:", err);
    }

    setLoading(false);
  };

  const generatePassword = () => {
    // Simple password for testing: "test" + 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setNewUserPassword(`test${randomDigits}`);
  };

  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            User Account Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage test user accounts
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Test User
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
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.email}
                      </Typography>
                      {user.full_name && (
                        <Typography variant="caption" color="text.secondary">
                          {user.full_name}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role || "guest"}
                      color={
                        user.role === "admin"
                          ? "error"
                          : user.role === "editor"
                          ? "primary"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? "Active" : "Inactive"}
                      color={user.is_active ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
      <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Quick Test Accounts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For quick testing, create accounts with these simple credentials:
        </Typography>
        <Box sx={{ mt: 1, fontFamily: "monospace", fontSize: "0.875rem" }}>
          <div>designer@test.com / test1234</div>
          <div>product@test.com / test1234</div>
          <div>reviewer@test.com / test1234</div>
        </Box>
      </Box>
    </Box>
  );
}
