import React from "react";
import { Grid } from "@mui/material";
import ShadeCard from "./ShadeCard";
import type { ShadeDefinition } from "../types";

export interface ShadeGridProps {
  shades: ShadeDefinition[];
  onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
}

// Wrapper component to memoize the onUpdate callback per shade
const ShadeCardWrapper = React.memo(
  function ShadeCardWrapper({
    shade,
    onShadeUpdate,
  }: {
    shade: ShadeDefinition;
    onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
  }) {
    const handleUpdate = React.useCallback(
      (updates: Partial<ShadeDefinition>) => {
        onShadeUpdate(shade.id, updates);
      },
      [shade.id, onShadeUpdate]
    );

    return <ShadeCard shade={shade} onUpdate={handleUpdate} />;
  },
  (prevProps, nextProps) => {
    // Only re-render if shade actually changed
    return (
      prevProps.shade === nextProps.shade &&
      prevProps.onShadeUpdate === nextProps.onShadeUpdate
    );
  }
);

export default function ShadeGrid({ shades, onShadeUpdate }: ShadeGridProps) {
  return (
    <Grid container spacing={2}>
      {shades.map((shade: ShadeDefinition) => (
        <Grid key={shade.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <ShadeCardWrapper shade={shade} onShadeUpdate={onShadeUpdate} />
        </Grid>
      ))}
    </Grid>
  );
}
