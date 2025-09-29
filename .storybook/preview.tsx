import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { wileyTheme } from "../src/themes";
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
          <ThemeProvider theme={wileyTheme} defaultMode="light">
            <CssBaseline />
            <div>
              <Story />
            </div>
          </ThemeProvider>
        </div>
      );
    },
  ],
};

export default preview;
