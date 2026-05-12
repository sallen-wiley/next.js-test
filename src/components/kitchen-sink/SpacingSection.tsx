"use client";
import React from "react";
import { Paper, Typography, Grid, Link, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const spacingValues = [
  ...Array.from({ length: 8 }, (_, index) => 0.5 + index * 0.5),
  ...Array.from({ length: 6 }, (_, index) => 5 + index),
] as const;

function parsePixelValue(value: string): number | null {
  const match = value.trim().match(/^(-?\d*\.?\d+)px$/i);
  return match ? Number(match[1]) : null;
}

function formatPixelValue(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
}

export const SpacingSection = React.memo(() => {
  const theme = useTheme();
  const borderRadius =
    typeof theme.shape.borderRadius === "number"
      ? `${theme.shape.borderRadius}px`
      : theme.shape.borderRadius;
  const [spacingBasePx, setSpacingBasePx] = React.useState<number | null>(null);

  React.useEffect(() => {
    const oneUnit = parsePixelValue(theme.spacing(1));
    const zeroUnit = parsePixelValue(theme.spacing(0));

    if (oneUnit !== null && zeroUnit !== null) {
      setSpacingBasePx(oneUnit - zeroUnit);
      return;
    }

    if (typeof window === "undefined") {
      setSpacingBasePx(null);
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const spacingVarValue = rootStyles.getPropertyValue("--mui-spacing");
    setSpacingBasePx(parsePixelValue(spacingVarValue));
  }, [theme]);

  const spacingItems = React.useMemo(() => {
    return spacingValues.map((value) => {
      const cssValue = theme.spacing(value);
      const directPixelValue = parsePixelValue(cssValue);
      const resolvedPixelValue =
        directPixelValue !== null
          ? directPixelValue
          : spacingBasePx !== null
          ? value * spacingBasePx
          : null;

      return {
        token: value,
        cssValue,
        displayCssValue:
          resolvedPixelValue !== null
            ? `${formatPixelValue(resolvedPixelValue)}px`
            : cssValue,
      };
    });
  }, [spacingBasePx, theme]);

  const visualTrackHeight = theme.spacing(
    spacingValues[spacingValues.length - 1] + 1,
  );
  const gridTemplateColumns = `72px repeat(${spacingItems.length}, minmax(56px, 1fr))`;
  const gridMinWidth = `${72 + spacingItems.length * 64}px`;

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Spacing Scale
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          This section renders directly from theme.spacing(), so values update
          automatically when theme spacing changes.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Base unit:{" "}
          {spacingBasePx !== null
            ? `${spacingBasePx}px`
            : "non-pixel spacing function"}{" "}
          (theme.spacing(1) = {theme.spacing(1)})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/customization/spacing/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI spacing docs
          </Link>
          .
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <div style={{ overflowX: "auto", paddingBottom: theme.spacing(0.5) }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns,
              minWidth: gridMinWidth,
              columnGap: theme.spacing(1),
              rowGap: theme.spacing(1.5),
              alignItems: "start",
              justifyItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ typography: "mono" as const, justifySelf: "start" }}
            >
              Token
            </Typography>
            {spacingItems.map((item) => (
              <Typography
                key={`token-${item.token}`}
                variant="body2"
                sx={{ fontFamily: "monospace" }}
              >
                {item.token}
              </Typography>
            ))}

            <Typography
              variant="subtitle2"
              sx={{ typography: "mono" as const, justifySelf: "start" }}
            >
              CSS
            </Typography>
            {spacingItems.map((item) => (
              <Typography
                key={`css-${item.token}`}
                variant="body2"
                sx={{ fontFamily: "monospace" }}
              >
                {item.displayCssValue}
              </Typography>
            ))}

            <Typography
              variant="subtitle2"
              sx={{ typography: "mono" as const, justifySelf: "start" }}
            >
              Visual
            </Typography>
            {spacingItems.map((item) => (
              <div
                key={`visual-${item.token}`}
                style={{
                  height: visualTrackHeight,
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "stretch",
                }}
              >
                <div
                  style={{
                    height: item.cssValue,
                    minHeight: "1px",
                    width: "100%",
                    borderRadius,
                    backgroundColor: theme.palette.primary.main,
                    opacity: 0.75,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </Grid>
  );
});

SpacingSection.displayName = "SpacingSection";
