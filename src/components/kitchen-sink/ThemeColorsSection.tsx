"use client";
import React from "react";
import { Box, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

const PREFERRED_VARIANT_ORDER = ["main", "light", "dark", "contrastText"];

const CSS_COLOR_VALUE_PATTERN =
  /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|color\(|var\(|[a-z]+)$/i;

type PaletteEntry = {
  variant: string;
  value: string;
};

function isCssColorValue(value: string): boolean {
  const trimmed = value.trim();
  return Boolean(trimmed) && CSS_COLOR_VALUE_PATTERN.test(trimmed);
}

function rankVariant(variant: string): number {
  const preferredIndex = PREFERRED_VARIANT_ORDER.indexOf(variant);
  return preferredIndex === -1
    ? PREFERRED_VARIANT_ORDER.length
    : preferredIndex;
}

function getPaletteEntries(group: unknown): PaletteEntry[] {
  if (!group || typeof group !== "object") {
    return [];
  }

  return Object.entries(group)
    .filter(([, value]) => typeof value === "string" && isCssColorValue(value))
    .map(([variant, value]) => ({ variant, value }))
    .sort((a, b) => {
      const rankDifference = rankVariant(a.variant) - rankVariant(b.variant);
      if (rankDifference !== 0) {
        return rankDifference;
      }

      return a.variant.localeCompare(b.variant, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
}

export const ThemeColorsSection = React.memo(() => {
  const theme = useTheme();
  const palette = theme.palette as unknown as Record<string, unknown>;

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Theme Palette Colors
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Pulled from the active MUI theme palette at runtime.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If present, light and dark shades are used in component states (for
          example: contained button and FAB hover, chip hover and focus, and
          alert standard and outlined treatments).
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If light and dark are not provided, MUI derives them from main. Many
          interaction states also use alpha overlays built from the main color.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/customization/palette/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI palette docs
          </Link>
          .
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {PALETTE_KEYS.map((key) => {
            const entries = getPaletteEntries(palette[key]);
            if (entries.length === 0) {
              return null;
            }

            return (
              <Paper key={key} variant="outlined" sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    typography: "mono" as const,
                    textTransform: "capitalize",
                  }}
                >
                  {key}
                </Typography>

                <Stack spacing={1.25}>
                  {entries.map(({ variant, value }) => (
                    <Stack
                      key={`${key}-${variant}`}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 0.5,
                          bgcolor: value,
                          border: "1px solid",
                          borderColor: "divider",
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{ typography: "mono" as const, display: "block" }}
                        >
                          {variant}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            typography: "mono" as const,
                            wordBreak: "break-all",
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    </Grid>
  );
});

ThemeColorsSection.displayName = "ThemeColorsSection";
