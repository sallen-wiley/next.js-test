"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useThemeContext, ThemeName } from "@/contexts/ThemeContext";

// Theme metadata for better UX
const themeMetadata: Record<
  ThemeName,
  { label: string; description: string; color: string }
> = {
  sage: {
    label: "Sage",
    description: "Nature-inspired with serif headings",
    color: "#2E8B57",
  },
  wiley: {
    label: "Wiley",
    description: "Professional academic theme",
    color: "#1976D2",
  },
  tech: {
    label: "Tech",
    description: "Developer-focused monospace",
    color: "#00C853",
  },
};

interface ThemeSwitcherProps {
  variant?: "select" | "chips";
  showDescription?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = "select",
  showDescription = true,
}) => {
  const { currentTheme, setTheme, availableThemes } = useThemeContext();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const themeName = event.target.value as ThemeName;
    setTheme(themeName);
  };

  const handleChipClick = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  if (variant === "chips") {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Choose Theme:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {availableThemes.map((themeName) => {
            const meta = themeMetadata[themeName];
            return (
              <Chip
                key={themeName}
                label={meta.label}
                onClick={() => handleChipClick(themeName)}
                color={currentTheme === themeName ? "primary" : "default"}
                variant={currentTheme === themeName ? "filled" : "outlined"}
                sx={{
                  borderColor:
                    currentTheme === themeName ? meta.color : undefined,
                  "&:hover": {
                    backgroundColor:
                      currentTheme === themeName
                        ? undefined
                        : `${meta.color}20`,
                  },
                }}
              />
            );
          })}
        </Box>
        {showDescription && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {themeMetadata[currentTheme].description}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={currentTheme}
          label="Theme"
          onChange={handleSelectChange}
        >
          {availableThemes.map((themeName) => {
            const meta = themeMetadata[themeName];
            return (
              <MenuItem key={themeName} value={themeName}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: meta.color,
                    }}
                  />
                  <Box>
                    <Typography variant="body2">{meta.label}</Typography>
                    {showDescription && (
                      <Typography variant="caption" color="text.secondary">
                        {meta.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ThemeSwitcher;
