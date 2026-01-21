"use client";
import * as React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import {
  ButtonsSection,
  TypographySection,
  InputsSection,
  ControlsSection,
  DataDisplaySection,
  NavigationSection,
  TableSection,
} from "@/components/kitchen-sink";

export default function KitchenSink() {
  useHeaderConfig({
    logoAffix: "Component Library",
    containerProps: { maxWidth: "lg" },
  });

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          {/* Header */}
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Kitchen Sink - Component Showcase
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">
              A comprehensive demonstration of Material-UI components with
              optimized performance. Each section is isolated to prevent
              unnecessary re-renders.
            </Typography>
          </Grid>

          {/* All sections are memoized and manage their own state */}
          <TypographySection />
          <ButtonsSection />
          <InputsSection />
          <ControlsSection />
          <DataDisplaySection />
          <NavigationSection />
          <TableSection />
        </Grid>
      </Container>
    </Box>
  );
}
