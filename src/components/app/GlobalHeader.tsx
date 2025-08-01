"use client";
import React from "react";
import { Box, Container, Divider, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PrimaryLogo from "../product/PrimaryLogo";

export interface GlobalHeaderProps {
  logoAffix?: string;
  fixed?: boolean;
  containerProps?: {
    maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
    fixed?: boolean;
  };
  rightSlot?: React.ReactNode;
  onMenuClick?: () => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  logoAffix,
  fixed = true,
  containerProps = { maxWidth: false },
  rightSlot,
  onMenuClick,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        width: "100%",
        px: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "normal",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        position: fixed ? "fixed" : "relative",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Container {...containerProps}>
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
          {onMenuClick && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onMenuClick}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <PrimaryLogo affix={logoAffix} />
          <Box>{rightSlot}</Box>
        </Box>
      </Container>
      <Divider />
    </Box>
  );
};

export default GlobalHeader;
