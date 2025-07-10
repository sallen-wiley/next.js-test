import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme/index";
import "./preview.css";

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
