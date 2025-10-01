import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { useTheme, useColorScheme } from "@mui/material/styles";

// Create a wrapper component for the stories
const PaletteDemo = () => null;

const meta: Meta<typeof PaletteDemo> = {
  title: "Tokens/Palette",
  component: PaletteDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Demonstrates the theme palette colors available in the current MUI theme.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper: Standard MUI palette keys to display
const PALETTE_KEYS = [
  "primary",
  "secondary",
  "error",
  "warning",
  "info",
  "success",
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
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {color}
    </Typography>
  </Box>
);

export const ThemePalette: Story = {
  render: () => {
    const theme = useTheme();
    const palette = theme.palette;

    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Theme Palette Colors
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          These colors are sourced from the actual MUI theme object, including
          any custom overrides applied to your theme.
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
            if (!value || typeof value !== "object") return null;

            return (
              <Box key={key} sx={{ minWidth: 180, mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, textTransform: "capitalize" }}
                >
                  {key}
                </Typography>
                {Object.entries(value).map(([variant, color]) => {
                  // Only show string color values
                  if (typeof color !== "string") return null;
                  return (
                    <ColorSwatch key={variant} color={color} label={variant} />
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  },
};

export const ColorUsageExamples: Story = {
  render: () => (
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
  ),
};

export const ColorModeComparison: Story = {
  render: () => {
    const { mode, systemMode } = useColorScheme();

    // Handle system mode by checking systemMode when mode is 'system'
    const currentMode = mode === "system" ? systemMode : mode;

    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Light/Dark Mode Demo
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Use the Color Mode toolbar above to switch between light and dark
          modes and see how the theme colors adapt.
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Current Mode Colors
            </Typography>
            <Box
              sx={{
                p: 3,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" sx={{ color: "text.primary", mb: 1 }}>
                Primary Text on Default Background
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Secondary Text on Default Background
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  Text on Paper Background
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="Primary"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                />
                <Chip
                  label="Secondary"
                  sx={{
                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Theme Detection
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", mb: 1 }}>
              Current mode: {currentMode || "loading..."}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", mb: 1 }}>
              Selected mode: {mode || "system"}
            </Typography>
            {mode === "system" && (
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                System preference: {systemMode || "detecting..."}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  },
};
