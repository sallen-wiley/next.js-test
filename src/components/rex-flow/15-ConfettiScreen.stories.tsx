import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 15 - Confetti Screen
 *
 * Success celebration screen with animation.
 *
 * ## Key Features
 * - Confetti animation (Lottie)
 * - Success message
 * - Action buttons (view submission, new submission)
 *
 * ## MUI Components
 * - Box (container)
 * - Typography (success message)
 * - Button (actions)
 * - Custom Lottie animation component
 *
 * **Status:** Placeholder - awaiting implementation
 */
const ConfettiScreenPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        15 - Confetti Screen 🎉
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/15 - Confetti Screen/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof ConfettiScreenPlaceholder> = {
  title: "ReX Flow/15 - Confetti Screen",
  component: ConfettiScreenPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfettiScreenPlaceholder>;

export const Placeholder: Story = {};
