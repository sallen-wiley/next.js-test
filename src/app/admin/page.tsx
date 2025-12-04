"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Button,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArticleIcon from "@mui/icons-material/Article";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AdminUserManager from "@/components/auth/AdminUserManager";
import RoleManager from "@/components/auth/RoleManager";
import ManuscriptUserManager from "@/components/auth/ManuscriptUserManager";
import ReviewerMatchManager from "@/components/auth/ReviewerMatchManager";
import { useRoleAccess } from "@/hooks/useRoles";

export default function AdminPage() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { hasPermission, profile } = useRoleAccess();

  useEffect(() => {
    // Check if auth is enabled in environment
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";
    setAuthEnabled(isAuthEnabled);
  }, []);

  if (!authEnabled) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <SettingsIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Authentication is currently disabled. Set
            NEXT_PUBLIC_ENABLE_AUTH=true in your environment to access admin
            features.
          </Alert>
          <Typography variant="body1" color="text.secondary">
            Current settings:
          </Typography>
          <Box sx={{ mt: 1, fontFamily: "monospace", fontSize: "0.875rem" }}>
            <div>
              NEXT_PUBLIC_ENABLE_AUTH ={" "}
              {process.env.NEXT_PUBLIC_ENABLE_AUTH || "false"}
            </div>
            <div>
              NEXT_PUBLIC_AUTH_TYPE ={" "}
              {process.env.NEXT_PUBLIC_AUTH_TYPE || "undefined"}
            </div>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage users, roles, and system settings
        </Typography>
        {profile && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Logged in as: <strong>{profile.full_name || profile.email}</strong>{" "}
            ({profile.role})
          </Alert>
        )}
      </Box>

      {!showAdmin ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <SettingsIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Administration Tools
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
            Access user management, role assignment, and system administration
            tools.
          </Typography>

          {hasPermission("canManageUsers") ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowAdmin(true)}
              startIcon={<SettingsIcon />}
            >
              Access Admin Tools
            </Button>
          ) : (
            <Alert severity="warning">
              You don&apos;t have permission to access admin tools. Contact an
              administrator to request access.
            </Alert>
          )}
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                icon={<PersonAddIcon />}
                label="User Management"
                iconPosition="start"
              />
              <Tab
                icon={<PeopleIcon />}
                label="Role Management"
                iconPosition="start"
              />
              <Tab
                icon={<ArticleIcon />}
                label="Manuscript Assignments"
                iconPosition="start"
              />
              <Tab
                icon={<PsychologyIcon />}
                label="Reviewer Matches"
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {activeTab === 0 && <AdminUserManager />}
          {activeTab === 1 && <RoleManager />}
          {activeTab === 2 && <ManuscriptUserManager />}
          {activeTab === 3 && <ReviewerMatchManager />}
        </Box>
      )}
    </Container>
  );
}
