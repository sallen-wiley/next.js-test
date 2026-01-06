"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AdminLoadingStateProps {
  /** Message to display below the spinner */
  message?: string;
  /** Minimum height for the loading container (default: 400px) */
  minHeight?: number | string;
}

/**
 * Standardized loading state component for admin interface
 * Provides consistent loading experience across all admin components
 */
export default function AdminLoadingState({
  message = "Loading...",
  minHeight = 400,
}: AdminLoadingStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
