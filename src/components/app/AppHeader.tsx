"use client";
import type {} from "@mui/material/themeCssVarsAugmentation";
import React from "react";
import { Box, Container, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PrimaryLogo from "../product/PrimaryLogo";

interface AppHeaderProps {
  /** The title text to show next to the logo. If not provided, defaults to "Publishing Platforms UX" */
  title?: string;
}

// AppHeader component renders the application header with the primary logo and a divider
export default function AppHeader({
  title = "Publishing Platforms UX",
}: AppHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    // Box component to control the background color and header positioning
    <Box
      sx={{
        bgcolor: (theme.vars || theme).palette.background.paper,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "normal",
      }}
    >
      {/* Container to control the maximum width of the header content across breakpoints. Should be aligned with body container usage - i.e. set to fixed or fluid with the max width set appropriately */}
      <Container maxWidth={false}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 80,
          }}
        >
          <PrimaryLogo affix={isMobile ? undefined : title} />
        </Box>
      </Container>
      <Divider />
    </Box>
  );
}
