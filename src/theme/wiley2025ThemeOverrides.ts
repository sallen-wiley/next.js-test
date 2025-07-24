import { ThemeOptions } from "@mui/material/styles";
// This client theme should include all recommended overrides for a client-specific theme.
// It can be extended or modified by each client as needed.
const clientTheme: ThemeOptions = {
  palette: {
    primary: {
      main: "#003B44", // Custom client primary color
    },
    secondary: {
      main: "#00D875", // Custom client secondary color
      contrastText: "#003B44", // Custom client secondary contrast text color
    },
  },
  shape: {
    borderRadius: 8, // Custom client border radius
  },
  typography: {
    button: {
      fontFamily: '"IBM Plex Mono", monospace', // Use IBM Plex Mono for button text
      fontWeight: 500, // Bold text for buttons
      textTransform: "uppercase", // Enable uppercase transformation for buttons
      letterSpacing: 1, // Add letter spacing for better readability
    },
  },
  // Add more client-specific overrides here
};

export default clientTheme;
