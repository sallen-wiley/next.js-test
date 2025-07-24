"use client";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Button,
  Alert,
  Chip,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import theme from "@/theme/index";
import wiley2025ThemeOptions from "../../../theme/wiley2025Theme";

const wiley2025Theme = createTheme(wiley2025ThemeOptions);

function SampleComponents() {
  const colors = [
    "primary",
    "secondary",
    "error",
    "warning",
    "info",
    "success",
    "neutral",
    "black",
    "white",
  ];
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Heading
      </Typography>
      <Typography variant="body1" gutterBottom>
        Body text example for theme comparison.
      </Typography>
      <Typography variant="h6" sx={{ mt: 3 }}>
        Button Variants & Colors
      </Typography>
      {(
        ["text", "contained", "outlined"] as Array<
          "text" | "contained" | "outlined"
        >
      ).map((variant) => (
        <div key={variant} style={{ marginBottom: 16 }}>
          <Typography variant="subtitle1" gutterBottom>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Typography>
          {colors.map((color) => (
            <Button
              key={color + variant}
              variant={variant}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              color={color as any}
              sx={{ mr: 2, mb: 1 }}
            >
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </div>
      ))}
      <Alert severity="info" sx={{ my: 2 }}>
        Info Alert
      </Alert>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sample Chips
        </Typography>
        {(["filled", "outlined"] as Array<"filled" | "outlined">).map(
          (variant) => (
            <Box key={variant} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Variant
              </Typography>
              <Grid container spacing={2}>
                {[
                  "primary",
                  "secondary",
                  "error",
                  "warning",
                  "info",
                  "success",
                  "neutral",
                  "black",
                  "white",
                ].map((color) => [
                  <Grid
                    key={color + variant + "medium"}
                    size={{ xs: 12, sm: 6, md: "auto" }}
                  >
                    <Chip
                      label={`${
                        color.charAt(0).toUpperCase() + color.slice(1)
                      } Chip`}
                      color={color as any}
                      variant={variant}
                      size="medium"
                    />
                  </Grid>,
                  <Grid
                    key={color + variant + "small"}
                    size={{ xs: 12, sm: 6, md: "auto" }}
                  >
                    <Chip
                      label={`Small ${
                        color.charAt(0).toUpperCase() + color.slice(1)
                      }`}
                      color={color as any}
                      variant={variant}
                      size="small"
                    />
                  </Grid>,
                ])}
              </Grid>
            </Box>
          )
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sample TextField
        </Typography>
        <TextField label="Text Field" variant="outlined" fullWidth />
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sample Checkbox
        </Typography>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Checkbox"
        />
      </Box>
    </>
  );
}

export default function ThemeComparePage() {
  return (
    <Grid container sx={{ minHeight: "100vh" }} columns={12}>
      <Grid size={6} sx={{ borderRight: { md: "2px solid #eee" }, p: 4 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Typography variant="h5" gutterBottom>
            Current Wiley Theme
          </Typography>
          <SampleComponents />
        </ThemeProvider>
      </Grid>
      <Grid size={6} sx={{ p: 4 }}>
        <ThemeProvider theme={wiley2025Theme}>
          <CssBaseline />
          <Typography variant="h5" gutterBottom>
            Wiley2025 Theme
          </Typography>
          <SampleComponents />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
}
