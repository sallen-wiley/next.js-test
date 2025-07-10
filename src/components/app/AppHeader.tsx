"use client";
import React from "react";
import { Box, Container, Divider } from "@mui/material";
import theme from "@/theme";
import PrimaryLogo from "../product/PrimaryLogo";

// AppHeader component renders the application header with the primary logo and a divider
export default function AppHeader() {
  return (
    // Box component to control the background color and header positioning
    <Box
      sx={{
        bgcolor: theme.palette.common.white,
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
          <PrimaryLogo affix="Publishing Platforms UX" />
        </Box>
      </Container>
      <Divider />
    </Box>
  );
}
