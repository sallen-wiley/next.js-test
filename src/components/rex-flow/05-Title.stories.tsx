import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 05 - Title
 *
 * Enter manuscript title and optional subtitle.
 *
 * ## Key Features
 * - Title text field
 * - Subtitle text field (optional)
 * - Character validation
 * - Next/Back navigation
 *
 * ## MUI Components
 * - TextField (title, subtitle)
 * - Typography (character count)
 * - Button (navigation)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const TitlePlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        05 - Title
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/5 - Title/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof TitlePlaceholder> = {
  title: "ReX Flow/05 - Title",
  component: TitlePlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TitlePlaceholder>;

export const Placeholder: Story = {};
