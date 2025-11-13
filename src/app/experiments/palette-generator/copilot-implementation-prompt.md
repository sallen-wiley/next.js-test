# Configurable Shade System Implementation

## Context
This is a palette generator that uses HSV color space to create Material-UI style color palettes. Currently, it's hardcoded to use 10 shades with MUI standard values (50, 100, 200, 300, 400, 500, 600, 700, 800, 900). We need to make the shade count configurable (1-20 shades) and allow users to customize the labels for each shade.

## Key Architecture Notes
- **Index-based system**: The D3 visualization and all interpolation logic work on array indices, NOT shade values
- **Shade labels are display-only**: Labels like "50", "100" or "Lightest", "Base" are purely for display and export keys
- **No changes needed to**: D3 visualization, interpolation logic, Gaussian falloff, or extrapolation algorithms (all index-based)

---

## STAGE 1: Data Structure Updates

### Files to modify: `page.tsx`

### Task 1.1: Add new interfaces
Add these interfaces near the existing TypeScript interfaces (around line 45):

```typescript
interface ShadeConfiguration {
  id: string;        // "1", "2", "3"... (sequential IDs)
  label: string;     // "50", "100" or "Lightest", "Base" etc. (user editable)
}
```

### Task 1.2: Update HueSet interface
Find the `HueSet` interface (around line 71) and add:

```typescript
interface HueSet {
  id: string;
  name: string;
  muiName: string;
  shades: ShadeDefinition[];
  extrapolationMode: "functional" | "functional-saturated" | "expressive";
  shadeConfig: ShadeConfiguration[];  // ADD THIS LINE
}
```

### Task 1.3: Update ShadeDefinition interface
In the `ShadeDefinition` interface (around line 58), change:

```typescript
// BEFORE:
value: number; // MUI shade value: 50, 100, 200, ..., 900

// AFTER:
label: string; // Display label: "50", "Lightest", etc.
```

### Task 1.4: Create default shade configuration
Add this constant after the other constants (around line 405, after MUI_SHADE_VALUES):

```typescript
const DEFAULT_SHADE_CONFIG: ShadeConfiguration[] = [
  { id: "1", label: "50" },
  { id: "2", label: "100" },
  { id: "3", label: "200" },
  { id: "4", label: "300" },
  { id: "5", label: "400" },
  { id: "6", label: "500" },
  { id: "7", label: "600" },
  { id: "8", label: "700" },
  { id: "9", label: "800" },
  { id: "10", label: "900" },
];
```

### Task 1.5: Update DEFAULT_HUE constant
Find `DEFAULT_HUE` (around line 443) and update it to:

```typescript
const DEFAULT_HUE: HueSet = {
  id: "1",
  name: "primary",
  muiName: "primary",
  extrapolationMode: "functional",
  shadeConfig: DEFAULT_SHADE_CONFIG,
  shades: DEFAULT_SHADE_CONFIG.map((config, index) => {
    const color = DEFAULT_PALETTE_COLORS[config.label] || "#808080";
    const hsv = hexToHsv(color);
    return {
      id: `shade-${config.id}`,
      label: config.label,
      color,
      locked: false,
      hsv,
      selectedForH: true,
      selectedForS: true,
      selectedForV: true,
    };
  }),
};
```

### Task 1.6: Update ShadeCard display
Find the ShadeCard component (around line 879) and update the shade value display (around line 1014):

```typescript
// BEFORE:
<Typography variant="h5" component="div" sx={{ color: textColor, mb: 1 }}>
  {shade.value}
</Typography>

// AFTER:
<Typography variant="h5" component="div" sx={{ color: textColor, mb: 1 }}>
  {shade.label}
</Typography>
```

### Verification for Stage 1:
- The app should still compile and run
- All shades should display their labels ("50", "100", etc.) instead of numeric values
- No functional changes yet - everything works exactly as before

---

## STAGE 2: Update Color Name Suggestion

### Files to modify: `page.tsx`

### Task 2.1: Update color name helper text
Find the TextField for "Hue Name" in the HueEditor component (around line 727) and update the helperText:

```typescript
// BEFORE:
helperText={`Suggested: ${getColorName({
  h: hue.shades.find((s) => s.value === 500)?.hsv.h ?? 0,
  s: hue.shades.find((s) => s.value === 500)?.hsv.s ?? 0,
  v: hue.shades.find((s) => s.value === 500)?.hsv.v ?? 0,
})}`}

// AFTER:
helperText={`Suggested: ${(() => {
  const medianIndex = Math.floor(hue.shades.length / 2);
  const medianShade = hue.shades[medianIndex];
  return getColorName(medianShade.hsv);
})()}`}
```

### Verification for Stage 2:
- Color name suggestion should work with any number of shades
- It should suggest based on the middle shade, not a hardcoded "500" value

---

## STAGE 3: Update Export Function

### Files to modify: `page.tsx`

### Task 3.1: Update exportPalette function
Find the `exportPalette` function in PaletteGenerator (around line 498) and update:

```typescript
// BEFORE:
hues.forEach((hue) => {
  const colorSet: Record<number, string> = {};
  hue.shades.forEach((shade) => {
    colorSet[shade.value] = shade.color;
  });
  muiTheme.palette[hue.muiName || hue.name] = colorSet;
});

// AFTER:
hues.forEach((hue) => {
  const colorSet: Record<string, string> = {};
  hue.shades.forEach((shade) => {
    colorSet[shade.label] = shade.color;
  });
  muiTheme.palette[hue.muiName || hue.name] = colorSet;
});
```

### Verification for Stage 3:
- Exported JSON should use labels as keys instead of numeric values
- Export format: `{ "primary": { "50": "#f5fafa", "100": "#dfeef0", ... } }`

---

## STAGE 4: Update Anchor Point Calculations

### Files to modify: `page.tsx`

### Task 4.1: Simplify extrapolateWithAnchors
Find the `extrapolateWithAnchors` function (around line 298) and update the anchor calculation logic:

```typescript
// BEFORE (lines 305-311):
const minShade = shadeValues[0]; // 50
const maxShade = shadeValues[shadeValues.length - 1]; // 900
const range = maxShade - minShade; // 850

// Calculate virtual indices for pure white (shade 0) and pure black (shade 1000)
const whiteIndex = (-minShade / range) * (shadeValues.length - 1);
const blackIndex = ((1000 - minShade) / range) * (shadeValues.length - 1);

// AFTER:
// Calculate virtual indices for pure white and pure black anchors
// These are positioned just outside the actual shade range
const whiteIndex = -0.5; // Just before first shade (lighter than lightest)
const blackIndex = shadeValues.length - 0.5; // Just after last shade (darker than darkest)
```

### Verification for Stage 4:
- Extrapolation with anchors should still work correctly
- The "Generate Missing Shades" button should produce valid colors in all three modes
- No console errors about invalid color values

---

## STAGE 5: Create Shade Configuration Dialog

### Files to modify: `page.tsx`

### Task 5.1: Create ShadeConfigurationDialog component
Add this new component after the ShadeCard component (around line 1165):

```typescript
interface ShadeConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  currentConfig: ShadeConfiguration[];
  onSave: (newConfig: ShadeConfiguration[]) => void;
}

function ShadeConfigurationDialog({
  open,
  onClose,
  currentConfig,
  onSave,
}: ShadeConfigurationDialogProps) {
  const [count, setCount] = useState(currentConfig.length);
  const [configs, setConfigs] = useState(currentConfig);

  // Update configs array when count changes
  const handleCountChange = (newCount: number) => {
    if (newCount < 1 || newCount > 20) return;
    
    if (newCount > configs.length) {
      // Add new configs with smart defaults
      const newConfigs = [...configs];
      for (let i = configs.length; i < newCount; i++) {
        newConfigs.push({
          id: String(i + 1),
          label: String((i + 1) * 100), // Smart default: 100, 200, 300, etc.
        });
      }
      setConfigs(newConfigs);
    } else {
      // Remove from end
      setConfigs(configs.slice(0, newCount));
    }
    setCount(newCount);
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], label: newLabel };
    setConfigs(newConfigs);
  };

  const handleSave = () => {
    onSave(configs);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure Shades</DialogTitle>
      <DialogContent>
        <TextField
          label="Number of Shades"
          type="number"
          value={count}
          onChange={(e) => handleCountChange(Number(e.target.value))}
          inputProps={{ min: 1, max: 20 }}
          fullWidth
          sx={{ mb: 3, mt: 1 }}
          helperText="Choose between 1 and 20 shades"
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Shade Labels (from lightest to darkest)
        </Typography>

        <Stack spacing={1} sx={{ maxHeight: 400, overflowY: "auto" }}>
          {configs.map((config, index) => (
            <TextField
              key={config.id}
              label={`Shade ${index + 1}`}
              value={config.label}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              size="small"
              fullWidth
              helperText={index === 0 ? "Lightest shade" : index === configs.length - 1 ? "Darkest shade" : ""}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Task 5.2: Add SettingsIcon import
Add to the icon imports at the top of the file (around line 36):

```typescript
import SettingsIcon from "@mui/icons-material/Settings";
```

### Verification for Stage 5:
- Dialog should compile without errors
- We'll wire it up in the next stage

---

## STAGE 6: Wire Up Configuration Dialog to UI

### Files to modify: `page.tsx`

### Task 6.1: Add state for dialog in HueEditor
Find the HueEditor component (around line 593) and add state at the top:

```typescript
function HueEditor({ hue, onUpdate, onRemove, canRemove }: HueEditorProps) {
  const [anchorDialogOpen, setAnchorDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false); // ADD THIS LINE
```

### Task 6.2: Add configuration change handler
Add this function in HueEditor component (around line 615, before generateShades):

```typescript
const handleConfigChange = (newConfig: ShadeConfiguration[]) => {
  // Create new shades array matching new config length
  const newShades = newConfig.map((config, newIndex) => {
    // Try to find corresponding old shade by proportional index
    const oldIndex = Math.round(
      (newIndex / Math.max(1, newConfig.length - 1)) * Math.max(1, hue.shades.length - 1)
    );
    const oldShade = hue.shades[oldIndex];

    return {
      id: `shade-${config.id}`,
      label: config.label,
      color: oldShade?.color || "#808080",
      locked: false, // Unlock everything when restructuring
      hsv: oldShade?.hsv || hexToHsv("#808080"),
      selectedForH: true,
      selectedForS: true,
      selectedForV: true,
    };
  });

  onUpdate({ shadeConfig: newConfig, shades: newShades });
};
```

### Task 6.3: Add settings button to UI
Find the "Generate Missing Shades" button in HueEditor (around line 813) and add a settings button next to it:

```typescript
<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
  <Button
    variant="contained"
    color="primary"
    onClick={generateShades}
    sx={{ alignSelf: "flex-start" }}
  >
    Generate Missing Shades
  </Button>
  <Button
    variant="outlined"
    startIcon={<SettingsIcon />}
    onClick={() => setConfigDialogOpen(true)}
    sx={{ alignSelf: "flex-start" }}
  >
    Configure Shades
  </Button>
</Stack>
```

### Task 6.4: Add dialog component to HueEditor render
Add the dialog at the end of the HueEditor return statement (around line 856, after the Anchor Warning Dialog):

```typescript
{/* Anchor Warning Dialog */}
<Dialog ... >
  ...
</Dialog>

{/* Shade Configuration Dialog */}
<ShadeConfigurationDialog
  open={configDialogOpen}
  onClose={() => setConfigDialogOpen(false)}
  currentConfig={hue.shadeConfig}
  onSave={handleConfigChange}
/>
```

### Verification for Stage 6:
- "Configure Shades" button should appear next to "Generate Missing Shades"
- Clicking it should open the configuration dialog
- Changing the number of shades should add/remove shade cards
- Changing labels should update the display on shade cards
- Existing locked shades should be preserved at proportional positions

---

## STAGE 7: Add Migration for Backward Compatibility

### Files to modify: `page.tsx`

### Task 7.1: Add migration function
Add this function in the PaletteGenerator component, before the useState hooks (around line 464):

```typescript
// Migration function for old palette format
const migrateHueSet = (hue: HueSet): HueSet => {
  // If already has shadeConfig, no migration needed
  if (hue.shadeConfig) {
    return hue;
  }

  // Migrate from old format (shades with .value) to new format (shadeConfig)
  const shadeConfig = hue.shades.map((shade, index) => ({
    id: String(index + 1),
    // @ts-ignore - old format might have .value property
    label: String(shade.value || (index + 1) * 100),
  }));

  return {
    ...hue,
    shadeConfig,
    shades: hue.shades.map((shade, index) => ({
      ...shade,
      // @ts-ignore - old format might have .value property
      label: String(shade.value || (index + 1) * 100),
    })),
  };
};
```

### Task 7.2: Apply migration when adding new hues
Find the `addHue` function (around line 470) and update:

```typescript
const addHue = () => {
  const newId = String(Date.now());
  const migratedDefaultHue = migrateHueSet(DEFAULT_HUE); // ADD THIS
  const newHue = {
    ...migratedDefaultHue, // CHANGE THIS
    id: newId,
    name: `hue-${hues.length + 1}`,
    muiName: "",
    shades: migratedDefaultHue.shades.map((s) => ({ // CHANGE THIS
      ...s,
      id: `${newId}-${s.id}`,
    })),
  };
  setHues([...hues, newHue]);
  setActiveHueId(newId);
};
```

### Task 7.3: Apply migration to initial state
Find the useState initialization (around line 465) and update if you want to support loading old palettes from localStorage or imports:

```typescript
const [hues, setHues] = useState<HueSet[]>(() => {
  // If you're loading from localStorage or URL params, apply migration here
  const initialHues = [DEFAULT_HUE];
  return initialHues.map(migrateHueSet);
});
```

### Verification for Stage 7:
- Old palette formats should automatically migrate to new format
- No data loss during migration
- Exported palettes should work when re-imported

---

## STAGE 8: Update D3CurveVisualization Component (Optional Enhancement)

### Files to modify: `D3CurveVisualization.tsx`

### Task 8.1: Update ShadeDefinition interface
Find the ShadeDefinition interface (around line 18) and update:

```typescript
interface ShadeDefinition {
  id: string;
  label: string; // CHANGE from: value: number;
  color: string;
  locked: boolean;
  hsv: HSV;
  selectedForH: boolean;
  selectedForS: boolean;
  selectedForV: boolean;
  extrapolationMethod?: "interpolated" | "linear" | "adjusted";
  generationMode?: "functional" | "functional-saturated" | "expressive";
}
```

### Verification for Stage 8:
- D3 visualization should continue working exactly as before
- No visual changes needed since everything is already index-based
- Type consistency between page.tsx and D3CurveVisualization.tsx

---

## STAGE 9: Testing & Polish

### Manual Testing Checklist:

1. **Default behavior** (10 shades):
   - ✓ App loads with standard MUI labels (50, 100, 200...900)
   - ✓ All features work as before

2. **Configuration changes**:
   - ✓ Change to 5 shades - verify grid layout adjusts
   - ✓ Change to 15 shades - verify all shades display
   - ✓ Change to 20 shades - verify performance is acceptable
   - ✓ Change to 1 shade - verify no errors

3. **Custom labels**:
   - ✓ Change labels to "Lightest", "Light", "Base", "Dark", "Darkest"
   - ✓ Verify labels appear on shade cards
   - ✓ Verify export uses custom labels as keys

4. **Shade generation**:
   - ✓ Lock two shades, generate missing - verify interpolation works
   - ✓ Try all three extrapolation modes with different shade counts
   - ✓ Verify no console errors about invalid colors

5. **D3 Visualization**:
   - ✓ Drag points on curves - should work with any shade count
   - ✓ Gaussian falloff should work
   - ✓ Lock/unlock by clicking points should work

6. **Export/Import**:
   - ✓ Export palette with custom labels
   - ✓ Verify JSON structure uses labels as keys
   - ✓ (Future) Import should preserve configuration

### Optional Polish Tasks:

1. **Add preset configurations**:
   - Add a dropdown with presets: "MUI (10)", "Tailwind (11)", "5-point", "Custom"

2. **Responsive grid**:
   - Adjust Grid `size` props dynamically based on shade count for optimal layout

3. **Validation**:
   - Prevent duplicate labels
   - Warn if labels contain special characters that might break CSS variable names

4. **Performance**:
   - Add React.memo to ShadeCard if rendering 20 shades feels slow

---

## Common Pitfalls to Avoid

1. **Don't confuse index with label**: Array index is the position (0-19), label is the display string
2. **Preserve the index-based math**: All interpolation uses indices, not label values
3. **Update all instances of `shade.value`**: Search the codebase for `.value` and replace with `.label`
4. **Type safety**: TypeScript may complain about the old `.value` property - that's expected

---

## Success Criteria

When complete, the user should be able to:
- Click "Configure Shades" button
- Choose any number from 1-20 shades
- Customize the label for each shade (numeric or text)
- Generate palettes that work with any shade configuration
- Export palettes with custom labels as keys
- All existing functionality (D3 visualization, locking, extrapolation modes) continues to work

---

## Architecture Validation

Before implementing, verify these assumptions:
- ✓ D3 visualization uses `xScale(i)` where `i` is the array index
- ✓ Interpolation functions accept `targetIndices` which are array positions
- ✓ Gaussian falloff operates on distance between array indices
- ✓ Anchor calculations only need to know `shades.length`

If any of these are false, the approach needs adjustment.
