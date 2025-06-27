import { ThemeOptions } from "@mui/material/styles";
// This client theme should include all recommended overrides for a client-specific theme.
// It can be extended or modified by each client as needed.
const clientTheme: ThemeOptions = {
  palette: {
    primary: {
      main: "#1976d2", // Custom client primary color
      dark: "#115293", // Custom client primary dark color
    },
    secondary: {
      main: "#ff4081", // Custom client secondary color
    },
  },
  shape: {
    borderRadius: 8, // Custom client border radius
  },
  // Add more client-specific overrides here
};

export default clientTheme;
