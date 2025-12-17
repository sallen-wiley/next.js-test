"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArticleIcon from "@mui/icons-material/Article";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QueueIcon from "@mui/icons-material/Queue";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AdminUserManager from "@/components/auth/AdminUserManager";
import RoleManager from "@/components/auth/RoleManager";
import ManuscriptUserManager from "@/components/auth/ManuscriptUserManager";
import ReviewerMatchManager from "@/components/auth/ReviewerMatchManager";
import ReviewerManager from "@/components/auth/ReviewerManager";
import ManuscriptManager from "@/components/auth/ManuscriptManager";
import ReviewInvitationManager from "@/components/auth/ReviewInvitationManager";
import InvitationQueueManager from "@/components/auth/InvitationQueueManager";
import PublicationsManager from "@/components/auth/PublicationsManager";
import RetractionsManager from "@/components/auth/RetractionsManager";
import { useRoleAccess } from "@/hooks/useRoles";
import { useHeaderConfig } from "@/contexts/HeaderContext";

const DRAWER_WIDTH = 280;

export default function AdminPage() {
  const [authEnabled, setAuthEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { hasPermission, profile, loading } = useRoleAccess();

  // Configure global header
  useHeaderConfig({
    logoAffix: "Admin",
    containerProps: { maxWidth: false },
  });

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Loading admin dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        {profile && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Logged in as: <strong>{profile.full_name || profile.email}</strong>{" "}
            ({profile.role})
          </Alert>
        )}
      </Box>

      {!hasPermission("canManageUsers") && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You don&apos;t have permission to access admin tools. Contact an
          administrator to request access.
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Left Navigation Menu */}
        <Paper
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            height: "fit-content",
            position: "sticky",
            top: 16,
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={600}>
              Admin Tools
            </Typography>
          </Box>
          <List component="nav">
            <ListItemButton
              selected={activeTab === 0}
              onClick={() => setActiveTab(0)}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItemButton>

            <ListItemButton
              selected={activeTab === 1}
              onClick={() => setActiveTab(1)}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Role Management" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton
              selected={activeTab === 2}
              onClick={() => setActiveTab(2)}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Manuscript Assignments" />
            </ListItemButton>

            <ListItemButton
              selected={activeTab === 3}
              onClick={() => setActiveTab(3)}
            >
              <ListItemIcon>
                <PsychologyIcon />
              </ListItemIcon>
              <ListItemText primary="Reviewer Matches" />
            </ListItemButton>

            <ListItemButton
              selected={activeTab === 4}
              onClick={() => setActiveTab(4)}
            >
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="Reviewer Database" />
            </ListItemButton>

            <ListItemButton
              selected={activeTab === 5}
              onClick={() => setActiveTab(5)}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Manuscript Database" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton
              selected={activeTab === 6}
              onClick={() => setActiveTab(6)}
            >
              <ListItemIcon>
                <MailOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Review Invitations" />
            </ListItemButton>

            <ListItemButton
              selected={activeTab === 7}
              onClick={() => setActiveTab(7)}
            >
              <ListItemIcon>
                <QueueIcon />
              </ListItemIcon>
              <ListItemText primary="Invitation Queue" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton
              selected={activeTab === 8}
              onClick={() => setActiveTab(8)}
            >
              <ListItemIcon>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText primary="Publications" />
            </ListItemButton>

            <ListItemButton
              selected={activeTab === 9}
              onClick={() => setActiveTab(9)}
            >
              <ListItemIcon>
                <ReportProblemIcon />
              </ListItemIcon>
              <ListItemText primary="Retractions" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {activeTab === 0 && <AdminUserManager />}
          {activeTab === 1 && <RoleManager />}
          {activeTab === 2 && <ManuscriptUserManager />}
          {activeTab === 3 && <ReviewerMatchManager />}
          {activeTab === 4 && <ReviewerManager />}
          {activeTab === 5 && <ManuscriptManager />}
          {activeTab === 6 && <ReviewInvitationManager />}
          {activeTab === 7 && <InvitationQueueManager />}
          {activeTab === 8 && <PublicationsManager />}
          {activeTab === 9 && <RetractionsManager />}
        </Box>
      </Box>
    </Container>
  );
}
