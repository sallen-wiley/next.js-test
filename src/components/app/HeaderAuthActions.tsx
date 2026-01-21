"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserProfile } from "@/hooks/useRoles";
import { useRouter } from "next/navigation";

/**
 * HeaderAuthActions component provides login/logout CTAs for the global header
 * Integrates with Supabase authentication system
 * Shows Admin button for users with admin role
 */
const HeaderAuthActions: React.FC = React.memo(() => {
  const { user, signOut, loading } = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  const handleAdminPanel = () => {
    router.push("/admin");
  };

  if (loading) {
    return null;
  }

  const isAdmin = profile?.role === "admin";

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {user ? (
        <>
          {isAdmin && (
            <Button
              startIcon={<AdminPanelSettingsIcon />}
              onClick={handleAdminPanel}
              color="secondary"
            >
              Admin
            </Button>
          )}
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            color="primary"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          startIcon={<LoginIcon />}
          onClick={handleSignIn}
          color="primary"
        >
          Sign In
        </Button>
      )}
    </Box>
  );
});

HeaderAuthActions.displayName = "HeaderAuthActions";

export default HeaderAuthActions;
