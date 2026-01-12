import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 06 - Abstract
 *
 * Enter manuscript abstract with character limit.
 *
 * ## Key Features
 * - Multiline text area
 * - Character count display
 * - Maximum character validation
 * - Next/Back navigation
 *
 * ## MUI Components
 * - TextField (multiline)
 * - Typography (character count)
 * - Button (navigation)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const AbstractPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        06 - Abstract
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/6 - Abstract/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof AbstractPlaceholder> = {
  title: "ReX Flow/06 - Abstract",
  component: AbstractPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AbstractPlaceholder>;

export const Placeholder: Story = {};
