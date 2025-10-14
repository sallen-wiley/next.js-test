"use client";

import React, { useState } from "react";
import {
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
} from "@mui/material";
// Individual icon imports to avoid loading entire icon library
import PaletteIcon from "@mui/icons-material/Palette";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import SettingsBrightness from "@mui/icons-material/SettingsBrightness";
import Check from "@mui/icons-material/Check";
import { useThemeContext, ThemeName, ColorMode } from "@/contexts/ThemeContext";
import { useColorScheme } from "@mui/material/styles";
import { useLogoContext } from "@/contexts/LogoContext";
import type { TenantType } from "@/components/product/PrimaryLogo";

// Theme metadata for better UX
const themeMetadata: Record<
  ThemeName,
  { label: string; description: string; color: string; icon: string }
> = {
  default: {
    label: "Default",
    description: "Standard Material-UI theme",
    color: "#1976D2",
    icon: "🎨",
  },
  sage: {
    label: "Sage",
    description: "Nature-inspired with serif headings",
    color: "#2E8B57",
    icon: "🌿",
  },
  wiley: {
    label: "Wiley",
    description: "Professional academic theme",
    color: "#3F51B5",
    icon: "📚",
  },
  tech: {
    label: "Tech",
    description: "Developer-focused monospace",
    color: "#00C853",
    icon: "💻",
  },
};

const modeMetadata: Record<
  ColorMode,
  { label: string; icon: React.ReactNode; description: string }
> = {
  light: {
    label: "Light",
    icon: <LightMode />,
    description: "Always use light mode",
  },
  dark: {
    label: "Dark",
    icon: <DarkMode />,
    description: "Always use dark mode",
  },
  system: {
    label: "System",
    icon: <SettingsBrightness />,
    description: "Follow system preference",
  },
};

const tenantMetadata: Record<
  TenantType,
  { label: string; description: string; color: string; icon: string }
> = {
  wiley: {
    label: "Wiley",
    description: "Professional academic publishing",
    color: "#3F51B5",
    icon: "📚",
  },
  wiley2025: {
    label: "Wiley 2025",
    description: "New Wiley brand identity",
    color: "#00d975",
    icon: "✨",
  },
  sage: {
    label: "Sage",
    description: "Research and educational content",
    color: "#2E8B57",
    icon: "🌿",
  },
  ieee: {
    label: "IEEE",
    description: "Electrical and electronics engineering",
    color: "#295FA3",
    icon: "⚡",
  },
  default: {
    label: "Default",
    description: "Standard brand logo",
    color: "#1976D2",
    icon: "🎨",
  },
};

export const FabThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useThemeContext();
  const { mode, setMode, systemMode } = useColorScheme();
  const { currentTenant, setTenant, availableTenants } = useLogoContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  const handleModeChange = (newMode: ColorMode) => {
    setMode(newMode);
  };

  const handleTenantChange = (tenant: TenantType) => {
    setTenant(tenant);
  };

  const getCurrentModeDescription = () => {
    if (mode === "system") {
      return `System (${systemMode})`;
    }
    return mode ? modeMetadata[mode].label : "Loading";
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="theme settings"
        onClick={handleClick}
        sx={{
          position: "fixed",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
        }}
      >
        <PaletteIcon />
      </Fab>

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
        slotProps={{
          paper: {
            sx: {
              minWidth: 280,
              maxWidth: 320,
            },
          },
        }}
      >
        {/* Theme Selection Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Theme
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Current: {themeMetadata[currentTheme].label}
          </Typography>
        </Box>

        {availableThemes.map((themeName) => {
          const meta = themeMetadata[themeName];
          const isSelected = currentTheme === themeName;

          return (
            <MenuItem
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              sx={{
                mx: 1,
                borderRadius: 1,
                backgroundColor: isSelected ? "action.selected" : "transparent",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: meta.color,
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {meta.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={meta.label}
                secondary={meta.description}
                primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
              />
              {isSelected && <Check sx={{ color: "primary.main", ml: 1 }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1 }} />

        {/* Color Mode Selection Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Color Mode
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Current: {getCurrentModeDescription()}
          </Typography>
        </Box>

        {(Object.keys(modeMetadata) as ColorMode[]).map((modeName) => {
          const meta = modeMetadata[modeName];
          const isSelected = mode === modeName;

          return (
            <MenuItem
              key={modeName}
              onClick={() => handleModeChange(modeName)}
              sx={{
                mx: 1,
                borderRadius: 1,
                backgroundColor: isSelected ? "action.selected" : "transparent",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{meta.icon}</ListItemIcon>
              <ListItemText
                primary={meta.label}
                secondary={meta.description}
                primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
              />
              {isSelected && <Check sx={{ color: "primary.main", ml: 1 }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1 }} />

        {/* Logo Selection Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Logo
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Current: {tenantMetadata[currentTenant].label}
          </Typography>
        </Box>

        {availableTenants.map((tenant) => {
          const meta = tenantMetadata[tenant];
          const isSelected = currentTenant === tenant;

          return (
            <MenuItem
              key={tenant}
              onClick={() => handleTenantChange(tenant)}
              sx={{
                mx: 1,
                borderRadius: 1,
                backgroundColor: isSelected ? "action.selected" : "transparent",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: meta.color,
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {meta.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={meta.label}
                secondary={meta.description}
                primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
              />
              {isSelected && <Check sx={{ color: "primary.main", ml: 1 }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1 }} />

        {/* Status Information */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Active Mode:
            <Chip
              label={mode || "loading"}
              size="small"
              sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
            />
          </Typography>
          {mode === "system" && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              System Preference: {systemMode}
            </Typography>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default FabThemeSwitcher;
