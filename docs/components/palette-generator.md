# HSV Palette Generator

A sophisticated color palette generator built with Next.js 15, Material-UI v7, and advanced HSV interpolation algorithms.

## Features

- **HSV Color Space**: Generate harmonious color palettes using HSV (Hue, Saturation, Value) color model
- **Spline Interpolation**: Advanced mathematical curves for smooth color transitions between locked anchor points
- **MUI Integration**: Direct export to Material-UI compatible palette structure
- **WCAG Accessibility**: Real-time contrast ratio validation (AA/AAA compliance)
- **Interactive Charts**: Visual HSV channel curves with clickable selection points
- **Lock & Unlock**: Pin specific colors as anchor points for interpolation
- **Responsive Design**: Fully responsive grid layout using MUI Grid system
- **Theme Aware**: Integrates seamlessly with your app's theme system

## Technology Stack

- **Next.js 15** - App Router with React 19
- **Material-UI v7** - Component library and theming
- **TypeScript** - Full type safety
- **Recharts** - Interactive chart visualization
- **HSV Color Model** - Superior color harmony generation

## Usage

1. **Add Hue Sets**: Create multiple color families (primary, secondary, etc.)
2. **Lock Anchor Colors**: Select specific shades to serve as interpolation anchor points
3. **Configure Channels**: Choose which HSV channels (H/S/V) each anchor affects
4. **Generate Interpolation**: Fill in missing shades with mathematically smooth transitions
5. **Export**: Download as JSON for direct integration into MUI themes

## Color Science

The generator uses **Catmull-Rom spline interpolation** in HSV color space to create smooth, natural color transitions. This approach produces more harmonious palettes than linear RGB interpolation.

### Why HSV?

- **Hue (H)**: Color family (0-360°)
- **Saturation (S)**: Color intensity (0-100%)
- **Value (V)**: Brightness (0-100%)

HSV more closely matches human color perception, making it ideal for generating visually pleasing color schemes.

## Accessibility

- Real-time WCAG contrast ratio calculation
- AA/AAA compliance indicators
- Automatic text color selection for readability
- Color-blind friendly interface

## Export Format

```json
{
  "version": "1.0",
  "generatedAt": "2025-01-01T00:00:00.000Z",
  "colorSpace": "hsv",
  "muiTheme": {
    "palette": {
      "primary": {
        "50": "#e3f2fd",
        "100": "#bbdefb",
        // ... more shades
        "900": "#0d47a1"
      }
    }
  },
  "fullData": [
    // Complete palette data including HSV values and settings
  ]
}
```

## Integration with MUI Themes

The exported palette can be directly imported into your MUI theme:

```typescript
import { createTheme } from "@mui/material/styles";
import paletteData from "./generated-palette.json";

const theme = createTheme({
  palette: {
    primary: paletteData.muiTheme.palette.primary,
    secondary: paletteData.muiTheme.palette.secondary,
    // ... other colors
  },
});
```

## Future Enhancements

- Database persistence (Supabase integration)
- Palette sharing and collaboration
- Advanced color harmony rules (triadic, analogous, etc.)
- Import from existing design systems
- Figma plugin integration
- Color blindness simulation
