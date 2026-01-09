"use client";

import React, { useState } from "react";
import {
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAdminActionsContext } from "@/contexts/AdminActionsContext";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Global Admin Actions FAB
 * Displays page-specific admin actions registered via useAdminActions hook
 * Positioned vertically centered on the right side, below the theme switcher FAB
 */
export default function AdminActionsFab() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { actions } = useAdminActionsContext();
  const { user, signOut } = useAuth();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = async (action: (typeof actions)[0]) => {
    handleClose();
    await action.onClick();
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
  };

  // Always render if user is logged in (for logout), or if there are actions
  if (!user && actions.length === 0) {
    return null;
  }

  return (
    <RoleGuard requiredRole={["admin", "designer"]} showFallback={false}>
      <Tooltip title="Admin Actions" placement="left">
        <Fab
          color="secondary"
          aria-label="admin actions"
          onClick={handleClick}
          sx={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(calc(-50% + 72px))", // 72px offset (56px FAB + 16px gap)
            zIndex: 1000,
          }}
        >
          <SettingsIcon />
        </Fab>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
          >
            {action.icon && (
              <ListItemIcon sx={{ minWidth: 36 }}>{action.icon}</ListItemIcon>
            )}
            <ListItemText
              primary={action.label}
              secondary={action.tooltip}
              secondaryTypographyProps={{
                variant: "caption",
              }}
            />
          </MenuItem>
        ))}

        {/* Logout Option */}
        {user && actions.length > 0 && <Divider />}
        {user && (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              secondary={user.email}
              secondaryTypographyProps={{
                variant: "caption",
              }}
            />
          </MenuItem>
        )}
      </Menu>
    </RoleGuard>
  );
}
