import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useColorScheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {
  defaultTheme,
  sageTheme,
  wileyTheme,
  wiley2025Theme,
  phenomTheme,
  techTheme,
} from "../src/themes";

// Component that handles color scheme switching using MUI's useColorScheme hook
const ColorSchemeHandler: React.FC<{
  colorMode: string;
  children: React.ReactNode;
}> = ({ colorMode, children }) => {
  const { setMode } = useColorScheme();

  React.useEffect(() => {
    const validMode =
      colorMode === "system" ? "system" : (colorMode as "light" | "dark");
    setMode(validMode);
  }, [colorMode, setMode]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        padding: 2,
      }}
    >
      {children}
    </Box>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable the default background selector since we're using MUI themes
    },
    docs: {
      story: {
        inline: true,
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "wiley",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default Theme" },
          { value: "sage", title: "Sage Theme" },
          { value: "wiley", title: "Wiley Theme" },
          { value: "wiley2025", title: "Wiley 2025 Theme" },
          { value: "phenom", title: "Phenom Theme" },
          { value: "tech", title: "Tech Theme" },
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      description: "Color mode for MUI theme",
      defaultValue: "light",
      toolbar: {
        title: "Color Mode",
        icon: "contrast",
        items: [
          { value: "light", icon: "sun", title: "Light mode" },
          { value: "dark", icon: "moon", title: "Dark mode" },
          { value: "system", icon: "circle", title: "System mode" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme || "wiley";
      const colorMode = context.globals.colorMode || "light";

      // Select the theme based on the global
      const themes = {
        default: defaultTheme,
        sage: sageTheme,
        wiley: wileyTheme,
        wiley2025: wiley2025Theme,
        phenom: phenomTheme,
        tech: techTheme,
      };

      const selectedTheme =
        themes[themeName as keyof typeof themes] || wileyTheme;

      return (
        <ThemeProvider theme={selectedTheme}>
          <CssBaseline enableColorScheme />
          <ColorSchemeHandler colorMode={colorMode}>
            <Story />
          </ColorSchemeHandler>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
