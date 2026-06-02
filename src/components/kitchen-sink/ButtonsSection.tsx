"use client";
import React from "react";
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Link,
  Stack,
  Grid,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";

export const ButtonsSection = React.memo(() => {
  const buttonSizes = ["small", "medium", "large"] as const;

  const buttonShowcase = [
    {
      label: "Primary Contained",
      variant: "contained" as const,
      color: "primary" as const,
    },
    {
      label: "Primary Outlined",
      variant: "outlined" as const,
      color: "primary" as const,
    },
    {
      label: "Primary Text",
      variant: "text" as const,
      color: "primary" as const,
    },
    {
      label: "Error Contained",
      variant: "contained" as const,
      color: "error" as const,
    },
    {
      label: "Primary Contained Disabled",
      variant: "contained" as const,
      color: "primary" as const,
      disabled: true,
    },
    {
      label: "Primary Outlined Disabled",
      variant: "outlined" as const,
      color: "primary" as const,
      disabled: true,
    },
    {
      label: "Primary Text Disabled",
      variant: "text" as const,
      color: "primary" as const,
      disabled: true,
    },
  ];

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Buttons
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based button patterns using accepted variants, sizes, and icon
          button usage.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-button/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Button docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Allowed Variations
            </Typography>
            <Stack spacing={2}>
              {buttonShowcase.map(({ label, variant, color, disabled }) => (
                <Stack
                  key={label}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Typography variant="body2" sx={{ minWidth: 180 }}>
                    {label}
                  </Typography>
                  {buttonSizes.map((size) => (
                    <Button
                      key={`${label}-${size}`}
                      variant={variant}
                      color={color}
                      disabled={disabled}
                      size={size}
                      startIcon={<KeyboardArrowLeftIcon />}
                      endIcon={<KeyboardArrowRightIcon />}
                    >
                      {size}
                    </Button>
                  ))}
                </Stack>
              ))}

              <Typography
                variant="h6"
                sx={{ typography: "mono" as const, mt: 2 }}
              >
                Icon Buttons
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Primary IconButton
                </Typography>
                {buttonSizes.map((size) => (
                  <IconButton
                    key={`primary-icon-${size}`}
                    color="primary"
                    size={size}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                ))}
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Secondary IconButton
                </Typography>
                {buttonSizes.map((size) => (
                  <IconButton
                    key={`secondary-icon-${size}`}
                    color="secondary"
                    size={size}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                ))}
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Disabled IconButton
                </Typography>
                {buttonSizes.map((size) => (
                  <IconButton
                    key={`disabled-icon-${size}`}
                    color="primary"
                    disabled
                    size={size}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

ButtonsSection.displayName = "ButtonsSection";
