"use client";
import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "./AuthProvider";
import FullPageLoader from "../app/FullPageLoader";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SupabaseAuth() {
  const { signIn, signUp, loading } = useAuth();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let result;
      if (tab === 0) {
        // Sign In
        result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message || "Failed to sign in");
        }
      } else {
        // Sign Up
        result = await signUp(email, password);
        if (result.error) {
          setError(result.error.message || "Failed to sign up");
        } else {
          setSuccess("Check your email for confirmation link!");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return <FullPageLoader message="Checking authentication status..." />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <LockIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h4" component="h1" textAlign="center">
            Reviewer System
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Please sign in to access the manuscript reviewer system
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}

            <TabPanel value={tab} index={0}>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    autoFocus
                  />
                  <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </Stack>
              </Box>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    autoFocus
                  />
                  <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    helperText="Minimum 6 characters"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Contact your administrator if you need access
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
