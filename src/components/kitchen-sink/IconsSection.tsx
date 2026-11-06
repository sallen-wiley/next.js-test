"use client";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import {
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";

const FONT_SIZES: NonNullable<SvgIconProps["fontSize"]>[] = [
  "inherit",
  "small",
  "medium",
  "large",
];

const COLORS: NonNullable<SvgIconProps["color"]>[] = [
  "inherit",
  "action",
  "disabled",
  "primary",
  "secondary",
  "error",
  "info",
  "success",
  "warning",
];

export const IconsSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Icons
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Material Icons expose the same{" "}
          <Typography component="span" variant="body2" sx={{ typography: "mono" as const }}>
            fontSize
          </Typography>{" "}
          and{" "}
          <Typography component="span" variant="body2" sx={{ typography: "mono" as const }}>
            color
          </Typography>{" "}
          props as{" "}
          <Typography component="span" variant="body2" sx={{ typography: "mono" as const }}>
            SvgIcon
          </Typography>
          .
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/icons/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Icons docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Sizes (fontSize)
            </Typography>

            <Stack spacing={2}>
              {FONT_SIZES.map((fontSize) => (
                <Stack
                  key={fontSize}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={fontSize === "inherit" ? { fontSize: 40 } : undefined}
                >
                  <HomeIcon fontSize={fontSize} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    {fontSize}
                    {fontSize === "inherit" ? " (parent 40px)" : ""}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Colors
            </Typography>

            <Stack
              direction="row"
              spacing={3}
              useFlexGap
              flexWrap="wrap"
              alignItems="center"
            >
              {COLORS.map((color) => (
                <Stack
                  key={color}
                  spacing={0.5}
                  alignItems="center"
                  sx={{ minWidth: 72 }}
                >
                  <DeleteIcon color={color} fontSize="large" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    {color}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

IconsSection.displayName = "IconsSection";
