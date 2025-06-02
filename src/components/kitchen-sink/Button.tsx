import React from "react";
import { Box, Grid, Typography, Stack, Button, Divider } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const buttonVariants = ["contained", "text", "outlined"] as const;
const buttonColors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "black",
  "white",
] as const;
const buttonSizes = ["small", "medium", "large"] as const;

const ButtonShowcase = () => {
  return (
    <Box sx={{ p: 3, maxWidth: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Button Showcase
      </Typography>

      <Stack spacing={6}>
        {/* Color Variants Table */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Button Colors by Variant
          </Typography>

          {/* Header Row */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={2}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Color
              </Typography>
            </Grid>
            {buttonVariants.map((variant) => (
              <Grid key={variant} size={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Color Rows */}
          {buttonColors.map((color) => (
            <Grid container spacing={2} key={color} sx={{ mb: 1 }}>
              <Grid size={2} sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Typography>
              </Grid>
              {buttonVariants.map((variant) => (
                <Grid
                  key={`${color}-${variant}`}
                  size={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant={variant}
                    color={color}
                    startIcon={<ArrowBackRoundedIcon />}
                    endIcon={<ArrowForwardRoundedIcon />}
                    disableRipple
                    sx={{ minWidth: 140 }}
                  >
                    Button
                  </Button>
                  <Button color="black">Button</Button>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>

        {/* Size Variants Table */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Button Sizes
          </Typography>

          {/* Header Row */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={2}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Size
              </Typography>
            </Grid>
            {buttonSizes.map((size) => (
              <Grid key={size} size={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Size Row */}
          <Grid container spacing={2}>
            <Grid size={2} sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Contained
              </Typography>
            </Grid>
            {buttonSizes.map((size) => (
              <Grid
                key={`size-${size}`}
                size={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  size={size}
                  startIcon={<ArrowBackRoundedIcon />}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ minWidth: 140 }}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* States Table */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Button States
          </Typography>

          <Grid container spacing={3}>
            <Grid size={3}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="h6">Normal</Typography>
                <Button variant="contained" color="primary">
                  Click Me
                </Button>
              </Stack>
            </Grid>
            <Grid size={3}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="h6">Disabled</Typography>
                <Button variant="contained" color="primary" disabled>
                  Disabled
                </Button>
              </Stack>
            </Grid>
            <Grid size={3}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="h6">Loading</Typography>
                <Button variant="contained" color="primary" disabled>
                  Loading...
                </Button>
              </Stack>
            </Grid>
            <Grid size={3}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="h6">No Ripple</Typography>
                <Button variant="contained" color="primary" disableRipple>
                  No Ripple
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default ButtonShowcase;
