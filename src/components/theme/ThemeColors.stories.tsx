import * as React from "react";
import { Box, Typography, Paper } from "@mui/material";
import * as colors from "../../theme/palette/colors";
import theme from "../../theme";

export default {
  title: "Theme/Colors",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Demonstrates the theme palette colors and the full set of available colors (including MUI and custom overrides).",
      },
    },
  },
};

// Helper: Known palette keys to display
const PALETTE_KEYS = [
  "primary",
  "secondary",
  "error",
  "warning",
  "info",
  "success",
  "neutral",
  "black",
  "white",
  "text",
] as const;

const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Paper
      variant="outlined"
      sx={{
        width: 40,
        height: 40,
        bgcolor: color,
        border: "1px solid #ccc",
        mr: 2,
      }}
    />
    <Typography variant="body2" sx={{ minWidth: 120 }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ color: "#666" }}>
      {color}
    </Typography>
  </Box>
);

// Use theme.palette for the theme colors
export const ThemePalette = () => {
  const palette = theme.palette;
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Theme Palette Colors (from ThemeProvider)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        These colors are sourced from the actual theme object, including any
        client or runtime overrides.
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 4,
        }}
      >
        {PALETTE_KEYS.map((key) => {
          const value = palette[key];
          if (!value) return null;
          if (key === "text") {
            return (
              <Box key={key} sx={{ minWidth: 180, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  text
                </Typography>
                {Object.entries(value).map(([variant, color]) => (
                  <ColorSwatch
                    key={variant}
                    color={color as string}
                    label={variant}
                  />
                ))}
              </Box>
            );
          }
          return (
            <Box key={key} sx={{ minWidth: 180, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {key}
              </Typography>
              {Object.entries(value).map(([variant, color]) =>
                typeof color === "string" ? (
                  <ColorSwatch key={variant} color={color} label={variant} />
                ) : null
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// Type-safe color group check
function isColorGroup(obj: unknown): obj is Record<string, string | number> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.values(obj).some((v) => typeof v === "string")
  );
}

export const AllAvailableColors = () => {
  return (
    <Box mt={6}>
      <Typography variant="h5" gutterBottom>
        All Available Colors (MUI + Custom Overrides)
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 4,
        }}
      >
        {Object.entries(colors).map(([group, value]) => {
          if (!isColorGroup(value)) return null;
          return (
            <Box key={group} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ textTransform: "capitalize", mb: 1 }}
              >
                {group}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(value).map(([shade, color]) => (
                  <ColorSwatch
                    key={shade}
                    color={color as string}
                    label={shade}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

ThemePalette.storyName = "Theme Palette Colors";
AllAvailableColors.storyName = "All Available Colors (MUI + Custom)";
