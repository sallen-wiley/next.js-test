import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme/index";

// Load Open Sans font for Storybook since we don't have Next.js font optimization
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ fontFamily: "Open Sans, sans-serif" }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ padding: "1rem" }}>
              <Story />
            </div>
          </ThemeProvider>
        </div>
      );
    },
  ],
};

export default preview;
