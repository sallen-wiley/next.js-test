import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography, Paper, Grid, useTheme, Chip } from "@mui/material";

// ReX Color Palette - extracted from Proposed.tokens.json
const rexColors = {
  neutral: {
    main: "#005274",
    background: "#D8F0FA",
  },
  success: {
    main: "#115C36",
    background: "#E8FFF2",
  },
  attention: {
    main: "#CC4E00",
    background: "#FFE8D6",
  },
  danger: {
    main: "#BA0517",
    background: "#FBE0E1",
  },
  warning: {
    main: "#734D00",
    background: "#FFF2CC",
  },
  information: {
    main: "#005274",
    background: "#D8F0FA",
  },
  gray: {
    darker: "#1A1A1A",
    dark: "#595959",
    light: "#CCCCCC",
    lighter: "#EFEFF0",
    background: "#FFFFFF",
  },
  brands: {
    OA: "#611D69",
    "ORCID iD": "#A6CE39",
  },
};

const ColorSwatchCard = ({
  title,
  mainColor,
  backgroundColor,
  description,
}: {
  title: string;
  mainColor: string;
  backgroundColor?: string;
  description?: string;
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Main color */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: mainColor,
          borderRadius: 1,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Chip
          label={mainColor}
          size="small"
          sx={{
            bgcolor: "white",
            color: "text.primary",
            fontFamily: "monospace",
          }}
        />
      </Box>

      {/* Background color if available */}
      {backgroundColor && (
        <>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Background Variant
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 60,
              bgcolor: backgroundColor,
              borderRadius: 1,
              mb: 1,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Chip
              label={backgroundColor}
              size="small"
              sx={{
                bgcolor: "white",
                color: "text.primary",
                fontFamily: "monospace",
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </>
      )}

      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: "auto" }}>
          {description}
        </Typography>
      )}
    </Paper>
  );
};

const GrayscaleRow = ({ label, color }: { label: string; color: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 1,
      }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          bgcolor: color,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontFamily: "monospace" }}>
          {color}
        </Typography>
      </Box>
    </Box>
  );
};

const RexColorPaletteDemo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 4, maxWidth: 1400 }}>
      <Typography variant="h3" gutterBottom>
        ReX Components - Color Palette
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Design tokens extracted from Figma ReX Components (Proposed mode)
      </Typography>

      {/* Semantic Colors */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Semantic Colors
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ColorSwatchCard
              title="Neutral"
              mainColor={rexColors.neutral.main}
              backgroundColor={rexColors.neutral.background}
              description="Primary brand color for neutral actions and UI elements"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ColorSwatchCard
              title="Success"
              mainColor={rexColors.success.main}
              backgroundColor={rexColors.success.background}
              description="Positive feedback, confirmations, and successful states"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ColorSwatchCard
              title="Attention"
              mainColor={rexColors.attention.main}
              backgroundColor={rexColors.attention.background}
              description="Important notices requiring user attention"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ColorSwatchCard
              title="Danger"
              mainColor={rexColors.danger.main}
              backgroundColor={rexColors.danger.background}
              description="Errors, destructive actions, and critical warnings"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ColorSwatchCard
              title="Warning"
              mainColor={rexColors.warning.main}
              backgroundColor={rexColors.warning.background}
              description="Caution messages and potential issues"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ColorSwatchCard
              title="Information"
              mainColor={rexColors.information.main}
              backgroundColor={rexColors.information.background}
              description="Informational messages and helpful tips"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Grayscale */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Grayscale
        </Typography>
        <Paper sx={{ p: 3, maxWidth: 600 }}>
          <GrayscaleRow label="Darker" color={rexColors.gray.darker} />
          <GrayscaleRow label="Dark" color={rexColors.gray.dark} />
          <GrayscaleRow label="Light" color={rexColors.gray.light} />
          <GrayscaleRow label="Lighter" color={rexColors.gray.lighter} />
          <GrayscaleRow label="Background" color={rexColors.gray.background} />
        </Paper>
      </Box>

      {/* Brand Colors */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Brand Colors
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ColorSwatchCard
              title="Open Access (OA)"
              mainColor={rexColors.brands.OA}
              description="Open Access indicator color"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ColorSwatchCard
              title="ORCID iD"
              mainColor={rexColors.brands["ORCID iD"]}
              description="ORCID identifier badge color"
            />
          </Grid>
        </Grid>
      </Box>

      {/* MUI Theme Colors */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Current Theme Colors (MUI)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Live colors from the active MUI theme. Switch to &quot;rex&quot; theme
          to see ReX colors applied.
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}>
              <Typography variant="subtitle2" gutterBottom>
                Primary
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {theme.palette.primary.main}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}>
              <Typography variant="subtitle2" gutterBottom>
                Secondary
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {theme.palette.secondary.main}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
              }}>
              <Typography variant="subtitle2" gutterBottom>
                Error
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {theme.palette.error.main}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
              }}>
              <Typography variant="subtitle2" gutterBottom>
                Success
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {theme.palette.success.main}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const meta: Meta<typeof RexColorPaletteDemo> = {
  title: "ReX Components/Color Palette",
  component: RexColorPaletteDemo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete color palette for ReX Components design system, including semantic colors, grayscale, and brand colors.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
