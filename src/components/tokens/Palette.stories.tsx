import * as React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import * as colors from "../../theme/palette/colors";
import { WileyColors } from "../../theme/palette/WileyColors";
import theme from "../../theme";

export default {
  title: "Tokens/Palette",
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
  "background",
  "action",
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

export const WileyBrandColors = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Wiley Brand Colors
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Core brand colors that form the foundation of our design system. These
        are the primary colors used across Wiley products.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 3,
        }}
      >
        {Object.entries(WileyColors).map(([colorName, shades]) => (
          <Box key={colorName} sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "capitalize", mb: 2, fontWeight: "bold" }}
            >
              {colorName}
            </Typography>
            {Object.entries(shades).map(([shade, color]) => (
              <ColorSwatch key={shade} color={color} label={shade} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const ColorUsageExamples = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Color Usage Examples
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Practical examples showing how to use theme colors in components with
        proper syntax.
      </Typography>

      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Primary Colors in Action
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Chip
              label="Primary Main"
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            />
            <Chip
              label="Primary Light"
              sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
            />
            <Chip
              label="Primary Dark"
              sx={{ bgcolor: "primary.dark", color: "primary.contrastText" }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
          >
            sx=&#123;&#123; bgcolor: &apos;primary.main&apos;, color:
            &apos;primary.contrastText&apos; &#125;&#125;
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Semantic Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Chip
              label="Success"
              sx={{ bgcolor: "success.main", color: "success.contrastText" }}
            />
            <Chip
              label="Warning"
              sx={{ bgcolor: "warning.main", color: "warning.contrastText" }}
            />
            <Chip
              label="Error"
              sx={{ bgcolor: "error.main", color: "error.contrastText" }}
            />
            <Chip
              label="Info"
              sx={{ bgcolor: "info.main", color: "info.contrastText" }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
          >
            sx=&#123;&#123; bgcolor: &apos;success.main&apos;, color:
            &apos;success.contrastText&apos; &#125;&#125;
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Text Colors
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body1" sx={{ color: "text.primary", mb: 1 }}>
              Primary Text (text.primary)
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              Secondary Text (text.secondary)
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Disabled Text (text.disabled)
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
          >
            sx=&#123;&#123; color: &apos;text.primary&apos; &#125;&#125;
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

ThemePalette.storyName = "Theme Palette Colors";
AllAvailableColors.storyName = "Extended Palette Colors";
ColorUsageExamples.storyName = "Usage Examples";
