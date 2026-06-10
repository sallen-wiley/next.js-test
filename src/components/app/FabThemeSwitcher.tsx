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
import type { TenantType } from "@/components/product/logos/types";
import { useAppearanceController } from "@/hooks/useAppearanceController";
import RoleGuard from "@/components/auth/RoleGuard";

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
    color: "#123D80",
    icon: "📚",
  },
  wiley2025: {
    label: "Wiley 2025",
    description: "2025 brand refresh",
    color: "#1E3A8A",
    icon: "🚀",
  },
  phenom: {
    label: "Phenom",
    description: "Modern, vibrant theme",
    color: "#0F172A",
    icon: "⚡",
  },
  phenomXResearchExchange: {
    label: "Phenom X Research Exchange",
    description: "Combined Phenom and Research Exchange theme",
    color: "#0A7388",
    icon: "🔬⚡",
  },
  researchexchange: {
    label: "Research Exchange",
    description: "Clean, modern research platform",
    color: "#00a89f",
    icon: "🔬",
  },
  rpm: {
    label: "RPM",
    description: "Research & Publishing Management",
    color: "#0056B6",
    icon: "📊",
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
    color: "#123D80",
    icon: "📚",
  },
  wiley2025: {
    label: "Wiley 2025",
    description: "New Wiley brand identity",
    color: "#1E3A8A",
    icon: "🚀",
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
  "re-light-stacked": {
    label: "RE Light Allcaps Stacked",
    description: "Research Exchange light variant",
    color: "#000000",
    icon: "🔬",
  },
  "re-bold-stacked": {
    label: "RE Bold Allcaps Stacked",
    description: "Research Exchange bold variant",
    color: "#000000",
    icon: "🔬",
  },
  "re-light-allcaps": {
    label: "RE Light Allcaps",
    description: "Research Exchange light allcaps",
    color: "#000000",
    icon: "🔬",
  },
  "re-bold-allcaps": {
    label: "RE Bold Allcaps",
    description: "Research Exchange bold allcaps",
    color: "#000000",
    icon: "🔬",
  },
  "re-bold": {
    label: "RE Bold",
    description: "Research Exchange bold",
    color: "#000000",
    icon: "🔬",
  },
  default: {
    label: "Default",
    description: "Standard brand logo",
    color: "#1976D2",
    icon: "🎨",
  },
};

// Main component
export const FabThemeSwitcher: React.FC = () => {
  const { currentTheme, availableThemes } = useThemeContext();
  const { mode, systemMode } = useColorScheme();
  const { currentTenant, availableTenants } = useLogoContext();
  const { applyAppearance } = useAppearanceController();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeName: ThemeName) => {
    applyAppearance({ theme: themeName }, { syncUrl: true, pinParams: true });
  };

  const handleModeChange = (newMode: ColorMode) => {
    applyAppearance({ mode: newMode }, { syncUrl: true, pinParams: true });
  };

  const handleTenantChange = (tenant: TenantType) => {
    applyAppearance({ logo: tenant }, { syncUrl: true, pinParams: true });
  };

  return (
    <RoleGuard requiredRole={["admin", "designer"]} showFallback={false}>
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
              selected={isSelected}
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
                slotProps={{
                  primary: { fontWeight: isSelected ? 600 : 400 },
                }}
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
            Current:{" "}
            {mode === "system"
              ? `System (${systemMode})`
              : mode
              ? modeMetadata[mode].label
              : "Loading"}
          </Typography>
        </Box>

        {(Object.keys(modeMetadata) as ColorMode[]).map((modeName) => {
          const meta = modeMetadata[modeName];
          const isSelected = mode === modeName;

          return (
            <MenuItem
              key={modeName}
              onClick={() => handleModeChange(modeName)}
              selected={isSelected}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{meta.icon}</ListItemIcon>
              <ListItemText
                primary={meta.label}
                secondary={meta.description}
                slotProps={{
                  primary: { fontWeight: isSelected ? 600 : 400 },
                }}
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
              selected={isSelected}
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
                slotProps={{
                  primary: { fontWeight: isSelected ? 600 : 400 },
                }}
              />
              {isSelected && <Check sx={{ color: "primary.main", ml: 1 }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </RoleGuard>
  );
};

export default FabThemeSwitcher;
