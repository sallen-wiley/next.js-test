import React from "react";
import { Grid } from "@mui/material";
import ShadeCard from "./ShadeCard";
import type { ShadeDefinition } from "../types";

export interface ShadeGridProps {
  shades: ShadeDefinition[];
  onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
  contrastTargetColor?: string | null;
}

// Wrapper component to memoize the onUpdate callback per shade
const ShadeCardWrapper = React.memo(
  function ShadeCardWrapper({
    shade,
    onShadeUpdate,
    contrastTargetColor,
  }: {
    shade: ShadeDefinition;
    onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
    contrastTargetColor?: string | null;
  }) {
    const handleUpdate = React.useCallback(
      (updates: Partial<ShadeDefinition>) => {
        onShadeUpdate(shade.id, updates);
      },
      [shade.id, onShadeUpdate],
    );

    return (
      <ShadeCard
        shade={shade}
        onUpdate={handleUpdate}
        contrastTargetColor={contrastTargetColor}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if shade actually changed
    return (
      prevProps.shade === nextProps.shade &&
      prevProps.onShadeUpdate === nextProps.onShadeUpdate
    );
  },
);

export default function ShadeGrid({
  shades,
  onShadeUpdate,
  contrastTargetColor,
}: ShadeGridProps) {
  return (
    <Grid container spacing={2}>
      {shades.map((shade: ShadeDefinition) => (
        <Grid key={shade.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <ShadeCardWrapper
            shade={shade}
            onShadeUpdate={onShadeUpdate}
            contrastTargetColor={contrastTargetColor}
          />
        </Grid>
      ))}
    </Grid>
  );
}
