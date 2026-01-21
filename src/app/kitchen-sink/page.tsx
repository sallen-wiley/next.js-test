"use client";
import * as React from "react";
import { Box, Container, Typography, Paper, Slider } from "@mui/material";
import { useHeaderConfig } from "@/contexts/HeaderContext";

export default function KitchenSink() {
  const [sliderValue, setSliderValue] = React.useState(30);

  const handleSliderChange = React.useCallback(
    (_event: Event, newValue: number | number[]) => {
      setSliderValue(newValue as number);
    },
    [],
  );

  useHeaderConfig({
    logoAffix: "Component Library",
    containerProps: { maxWidth: "lg" },
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kitchen Sink - Slider Test
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary">
        Testing slider performance with isolated state management.
      </Typography>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Slider Component
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>Current Value: {sliderValue}</Typography>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            color="primary"
          />
        </Box>
      </Paper>
    </Container>
  );
}
