"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

/**
 * HeaderAuthActions component provides login/logout CTAs for the global header
 * Integrates with Supabase authentication system
 */
const HeaderAuthActions: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  if (loading) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {user ? (
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          color="primary"
        >
          Sign Out
        </Button>
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
};

export default HeaderAuthActions;
