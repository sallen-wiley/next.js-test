"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verify user has valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
      } else {
        setValidSession(true);
      }
      setCheckingSession(false);
    });
  }, [router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  if (checkingSession) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <CircularProgress />
            <Typography>Verifying session...</Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!validSession) {
    return null; // Router will redirect
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <LockResetIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h4" component="h1" textAlign="center">
            Reset Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter your new password below
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: "100%" }}>
              Password reset successful! Redirecting...
            </Alert>
          )}

          {!success && (
            <Box component="form" onSubmit={handleReset} sx={{ width: "100%" }}>
              <Stack spacing={3}>
                <TextField
                  type="password"
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  fullWidth
                  autoFocus
                  helperText="Minimum 6 characters"
                  disabled={loading}
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  fullWidth
                  disabled={loading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
