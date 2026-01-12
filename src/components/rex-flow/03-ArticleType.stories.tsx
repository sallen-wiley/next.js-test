import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 03 - Article Type Selection
 *
 * First step in submission flow: select manuscript type and category.
 *
 * ## Key Features
 * - Article type radio selection
 * - Category dropdown
 * - Progress stepper
 * - Next/Back navigation
 *
 * ## MUI Components
 * - RadioGroup (article type)
 * - Select (category dropdown)
 * - Stepper (progress)
 * - Button (navigation)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const ArticleTypePlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        03 - Article Type Selection
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/3 - Article Type/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof ArticleTypePlaceholder> = {
  title: "ReX Flow/03 - Article Type",
  component: ArticleTypePlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArticleTypePlaceholder>;

export const Placeholder: Story = {};
