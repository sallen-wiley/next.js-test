"use client";

import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PaletteIcon from "@mui/icons-material/Palette";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import {
  Box,
  Button,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { ColorMode, ThemeName, useThemeContext } from "@/contexts/ThemeContext";

type ThemeMeta = {
  label: string;
  description: string;
  color: string;
};

const themeMetadata: Partial<Record<ThemeName, ThemeMeta>> = {
  default: {
    label: "Default",
    description: "Standard Material UI baseline",
    color: "#1976D2",
  },
  sage: {
    label: "Sage",
    description: "Nature-inspired with serif headings",
    color: "#2E8B57",
  },
  wiley: {
    label: "Wiley",
    description: "Professional academic theme",
    color: "#123D80",
  },
  wiley2025: {
    label: "Wiley 2025",
    description: "2025 brand refresh",
    color: "#1E3A8A",
  },
  phenom: {
    label: "Phenom",
    description: "Modern, vibrant theme",
    color: "#0F172A",
  },
  phenomXResearchExchange: {
    label: "Phenom X Research Exchange",
    description: "Combined Phenom and Research Exchange tokens",
    color: "#0A7388",
  },
  researchexchange: {
    label: "Research Exchange",
    description: "Clean, modern research platform",
    color: "#00A89F",
  },
  rpm: {
    label: "RPM",
    description: "Research and Publishing Management",
    color: "#0056B6",
  },
};

const modeMetadata: Record<
  ColorMode,
  { label: string; description: string; icon: React.ReactNode }
> = {
  light: {
    label: "Light",
    description: "Always use light mode",
    icon: <LightModeIcon />,
  },
  dark: {
    label: "Dark",
    description: "Always use dark mode",
    icon: <DarkModeIcon />,
  },
  system: {
    label: "System",
    description: "Follow system preference",
    icon: <SettingsBrightnessIcon />,
  },
};

function getThemeMeta(themeName: ThemeName): ThemeMeta {
  return (
    themeMetadata[themeName] ?? {
      label: themeName,
      description: "Custom theme",
      color: "#1976D2",
    }
  );
}

export const ThemeModeSwitcherPanel = React.memo(() => {
  const { currentTheme, setTheme, availableThemes } = useThemeContext();
  const { mode, setMode, systemMode } = useColorScheme();

  const [themeAnchorEl, setThemeAnchorEl] = React.useState<HTMLElement | null>(
    null,
  );
  const [modeAnchorEl, setModeAnchorEl] = React.useState<HTMLElement | null>(
    null,
  );

  const resolvedMode = (mode ?? "system") as ColorMode;
  const currentThemeMeta = getThemeMeta(currentTheme);
  const currentModeLabel =
    resolvedMode === "system"
      ? `System (${systemMode ?? "loading"})`
      : modeMetadata[resolvedMode].label;

  return (
    <Grid size={12}>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ typography: "mono" as const }}>
          Appearance Controls
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Switch theme and color mode on-page. Logo switching remains available
          only through authenticated controls.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            startIcon={<PaletteIcon />}
            onClick={(event) => setThemeAnchorEl(event.currentTarget)}
          >
            Theme: {currentThemeMeta.label}
          </Button>

          <Button
            variant="outlined"
            startIcon={modeMetadata[resolvedMode].icon}
            onClick={(event) => setModeAnchorEl(event.currentTarget)}
          >
            Mode: {currentModeLabel}
          </Button>
        </Stack>
      </Paper>

      <Menu
        anchorEl={themeAnchorEl}
        open={Boolean(themeAnchorEl)}
        onClose={() => setThemeAnchorEl(null)}
      >
        {availableThemes.map((themeName) => {
          const meta = getThemeMeta(themeName);
          const isSelected = themeName === currentTheme;

          return (
            <MenuItem
              key={themeName}
              onClick={() => {
                setTheme(themeName);
                setThemeAnchorEl(null);
              }}
              selected={isSelected}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: meta.color,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={meta.label}
                secondary={meta.description}
                slotProps={{ primary: { fontWeight: isSelected ? 600 : 400 } }}
              />
              {isSelected && (
                <CheckIcon sx={{ color: "primary.main", ml: 1 }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>

      <Menu
        anchorEl={modeAnchorEl}
        open={Boolean(modeAnchorEl)}
        onClose={() => setModeAnchorEl(null)}
      >
        {(Object.keys(modeMetadata) as ColorMode[]).map((modeName) => {
          const meta = modeMetadata[modeName];
          const isSelected = modeName === resolvedMode;

          return (
            <MenuItem
              key={modeName}
              onClick={() => {
                setMode(modeName);
                setModeAnchorEl(null);
              }}
              selected={isSelected}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{meta.icon}</ListItemIcon>
              <ListItemText
                primary={meta.label}
                secondary={meta.description}
                slotProps={{ primary: { fontWeight: isSelected ? 600 : 400 } }}
              />
              {isSelected && (
                <CheckIcon sx={{ color: "primary.main", ml: 1 }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Grid>
  );
});

ThemeModeSwitcherPanel.displayName = "ThemeModeSwitcherPanel";
