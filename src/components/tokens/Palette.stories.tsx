import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { useTheme, useColorScheme } from "@mui/material/styles";

// Import all theme color palettes
import * as wileyColors from "../../themes/wiley/colors";
import * as sageColors from "../../themes/sage/colors";
import * as researchexchangeColors from "../../themes/researchexchange/brandColors";
import { designTokens as phenomDesignTokens } from "../../themes/phenom/brandTokens";
import * as wiley2025Colors from "../../themes/wiley2025/colors";
import * as muiColors from "@mui/material/colors";

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

// Component for displaying full color palettes from colors.ts files
const FullColorPalette = ({
  colors,
  title,
}: {
  colors: Record<string, unknown>;
  title: string;
}) => {
  const renderColorGroup = (
    colorName: string,
    colorObject: Record<string, unknown>
  ) => {
    if (!colorObject || typeof colorObject !== "object") return null;

    // Handle different color object structures
    const colorEntries = Object.entries(colorObject).filter(
      ([key, value]) => typeof value === "string" && key !== "contrastText"
    );

    if (colorEntries.length === 0) return null;

    // Sort entries to show main shades first (50-900), then accent colors (A100-A700)
    const sortedEntries = colorEntries.sort(([a], [b]) => {
      // Handle accent colors (A100, A200, etc.)
      const aIsAccent = a.startsWith("A");
      const bIsAccent = b.startsWith("A");

      if (aIsAccent && !bIsAccent) return 1; // Accent colors come after main colors
      if (!aIsAccent && bIsAccent) return -1;

      if (aIsAccent && bIsAccent) {
        // Sort accent colors numerically
        return parseInt(a.slice(1)) - parseInt(b.slice(1));
      }

      // Sort main colors numerically
      return parseInt(a) - parseInt(b);
    });

    return (
      <Box key={colorName} sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textTransform: "capitalize" }}>
          {colorName}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 1,
          }}
        >
          {sortedEntries.map(([shade, color]) => (
            <ColorSwatch
              key={`${colorName}-${shade}`}
              color={color as string}
              label={`${colorName}[${shade}]`}
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {Object.entries(colors)
        .filter(
          ([key, value]) =>
            key !== "default" && typeof value === "object" && value !== null
        )
        .map(([colorName, colorObject]) =>
          renderColorGroup(colorName, colorObject as Record<string, unknown>)
        )}
    </Box>
  );
};

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

// Individual Theme Full Palette Stories
export const DefaultFullPalette: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Default (Material-UI) - Full Color Palette
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Complete Material Design color palette (2014) with all 19 color hues and
        shades 50-900, plus accent colors A100-A700. These are the standard
        colors available in @mui/material/colors.
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Available Color Hues:
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, fontFamily: "monospace" }}>
        red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal,
        green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey,
        blueGrey
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Each hue includes shades: 50, 100, 200, 300, 400, 500 (main), 600, 700,
        800, 900
        <br />
        Most hues also include accent colors: A100, A200, A400, A700
      </Typography>

      <FullColorPalette
        colors={muiColors}
        title="Material-UI Standard Colors"
      />
    </Box>
  ),
};

export const WileyFullPalette: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Wiley Theme - Full Color Palette
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Custom Wiley theme colors with brand-specific blue, green, red, pink,
        and orange palettes. Includes custom overrides alongside standard MUI
        colors.
      </Typography>
      <FullColorPalette colors={wileyColors} title="Wiley Theme Colors" />
    </Box>
  ),
};

export const SageFullPalette: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sage Theme - Full Color Palette
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Nature-inspired palette with green and brown color families designed for
        organic/natural brands.
      </Typography>
      <FullColorPalette colors={sageColors} title="Sage Theme Colors" />
    </Box>
  ),
};

export const ResearchExchangeFullPalette: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Research Exchange Theme - Full Color Palette
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Clean, modern palette optimized for research and academic exchange
        platforms.
      </Typography>
      <FullColorPalette
        colors={researchexchangeColors}
        title="Research Exchange Theme Colors"
      />
    </Box>
  ),
};

export const PhenomFullPalette: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Phenom Theme - Full Color Palette
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Comprehensive palette from design tokens with primary blue, dark blue,
        green variants, and system colors (error, warning, success, etc.).
      </Typography>
      <FullColorPalette
        colors={phenomDesignTokens.colorPrimitives}
        title="Phenom Theme Colors"
      />
    </Box>
  ),
};

export const Wiley2025FullPalette: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Wiley 2025 Theme - Full Color Palette
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        2025 brand refresh colors for Wiley with updated palette and styling.
      </Typography>
      <FullColorPalette
        colors={wiley2025Colors}
        title="Wiley 2025 Theme Colors"
      />
    </Box>
  ),
};
