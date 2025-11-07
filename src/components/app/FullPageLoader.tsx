"use client";

import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

interface FullPageLoaderProps {
  /** Optional message to display below the spinner */
  message?: string;
  /** Whether to show debug information (defaults to false in production) */
  showDebug?: boolean;
}

/**
 * Full-page loading spinner component that centers itself in the viewport
 * Uses MUI theming for consistent appearance across all themes
 */
export default function FullPageLoader({
  message = "Loading...",
  showDebug = process.env.NODE_ENV === "development",
}: FullPageLoaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme.vars || theme).palette.background.default,
        zIndex: theme.zIndex.modal + 1, // Above modals
        gap: 2,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: (theme.vars || theme).palette.primary.main,
        }}
      />

      {showDebug && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            fontSize: "0.875rem",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
