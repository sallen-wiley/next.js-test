"use client";

import { useState, useEffect, lazy, Suspense, memo, useCallback } from "react";
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
import ArticleIcon from "@mui/icons-material/Article";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QueueIcon from "@mui/icons-material/Queue";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useRoleAccess } from "@/hooks/useRoles";
import { useHeaderConfig } from "@/contexts/HeaderContext";

// Lazy load manager components for better performance
const UserManagement = lazy(() => import("@/components/auth/UserManagement"));
const ManuscriptUserManager = lazy(
  () => import("@/components/auth/ManuscriptUserManager"),
);
const ReviewerMatchManager = lazy(
  () => import("@/components/auth/ReviewerMatchManager"),
);
const ReviewerManager = lazy(() => import("@/components/auth/ReviewerManager"));
const ManuscriptManager = lazy(
  () => import("@/components/auth/ManuscriptManager"),
);
const ReviewInvitationManager = lazy(
  () => import("@/components/auth/ReviewInvitationManager"),
);
const InvitationQueueManager = lazy(
  () => import("@/components/auth/InvitationQueueManager"),
);
const PublicationsManager = lazy(
  () => import("@/components/auth/PublicationsManager"),
);
const RetractionsManager = lazy(
  () => import("@/components/auth/RetractionsManager"),
);

const DRAWER_WIDTH = 280;

// Memoized sidebar to prevent re-renders when profile loads
const AdminSidebar = memo(
  ({
    activeTab,
    onTabChange,
  }: {
    activeTab: number;
    onTabChange: (tab: number) => void;
  }) => {
    return (
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
            onClick={() => onTabChange(0)}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItemButton>
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            selected={activeTab === 1}
            onClick={() => onTabChange(1)}
          >
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Manuscript Assignments" />
          </ListItemButton>
          <ListItemButton
            selected={activeTab === 2}
            onClick={() => onTabChange(2)}
          >
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText primary="Reviewer Matches" />
          </ListItemButton>
          <ListItemButton
            selected={activeTab === 3}
            onClick={() => onTabChange(3)}
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Reviewer Database" />
          </ListItemButton>
          <ListItemButton
            selected={activeTab === 4}
            onClick={() => onTabChange(4)}
          >
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Manuscript Database" />
          </ListItemButton>
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            selected={activeTab === 5}
            onClick={() => onTabChange(5)}
          >
            <ListItemIcon>
              <MailOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Review Invitations" />
          </ListItemButton>
          <ListItemButton
            selected={activeTab === 6}
            onClick={() => onTabChange(6)}
          >
            <ListItemIcon>
              <QueueIcon />
            </ListItemIcon>
            <ListItemText primary="Invitation Queue" />
          </ListItemButton>
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            selected={activeTab === 7}
            onClick={() => onTabChange(7)}
          >
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Publications" />
          </ListItemButton>
          <ListItemButton
            selected={activeTab === 8}
            onClick={() => onTabChange(8)}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Retractions" />
          </ListItemButton>
        </List>
      </Paper>
    );
  },
);

AdminSidebar.displayName = "AdminSidebar";

export default function AdminPage() {
  const [authEnabled, setAuthEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { hasPermission, profile, loading } = useRoleAccess();

  // Memoize tab change handler
  const handleTabChange = useCallback((tab: number) => {
    setActiveTab(tab);
  }, []);

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
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            {activeTab === 0 && <UserManagement />}
            {activeTab === 1 && <ManuscriptUserManager />}
            {activeTab === 2 && <ReviewerMatchManager />}
            {activeTab === 3 && <ReviewerManager />}
            {activeTab === 4 && <ManuscriptManager />}
            {activeTab === 5 && <ReviewInvitationManager />}
            {activeTab === 6 && <InvitationQueueManager />}
            {activeTab === 7 && <PublicationsManager />}
            {activeTab === 8 && <RetractionsManager />}
          </Suspense>
        </Box>
      </Box>
    </Container>
  );
}
