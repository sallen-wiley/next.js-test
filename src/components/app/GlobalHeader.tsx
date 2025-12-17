"use client";
import type {} from "@mui/material/themeCssVarsAugmentation";
import React from "react";
import {
  Box,
  Container,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PrimaryLogo from "../product/PrimaryLogo";
import HeaderAuthActions from "./HeaderAuthActions";

export interface GlobalHeaderProps {
  /** Text to display next to the logo */
  logoAffix?: string;
  /** Whether the header should be fixed to the top */
  fixed?: boolean;
  /** Container configuration */
  containerProps?: {
    maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
    fixed?: boolean;
  };
  /** Custom content for the right side. If not provided, defaults to auth actions */
  rightSlot?: React.ReactNode;
  /** Callback for menu button click (typically for mobile drawer) */
  onMenuClick?: () => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  logoAffix = "Publishing Platforms UX",
  fixed = false,
  containerProps = { maxWidth: false },
  rightSlot,
  onMenuClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={(theme) => ({
        bgcolor: (theme.vars || theme).palette.background.paper,
        width: "100%",
        px: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "normal",
        // Only apply z-index when fixed; keep it below drawers (1200) but above content
        zIndex: fixed ? theme.zIndex.appBar : undefined,
        position: fixed ? "fixed" : "relative",
        top: 0,
        left: 0,
        right: 0,
      })}
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
          <Box display="flex" alignItems="center" gap={2}>
            {onMenuClick && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onMenuClick}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            )}
            <PrimaryLogo affix={isMobile ? undefined : logoAffix} />
          </Box>
          <Box>{rightSlot || <HeaderAuthActions />}</Box>
        </Box>
      </Container>
      <Divider />
    </Box>
  );
};

export default GlobalHeader;
