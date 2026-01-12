import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 02 - Progress Board
 *
 * Kanban-style board showing submission progress across workflow stages.
 *
 * ## Key Features
 * - Drag-and-drop cards between columns
 * - Visual progress tracking
 * - Status filtering
 * - Quick actions on cards
 *
 * ## MUI Components
 * - Card (progress cards)
 * - Grid (kanban columns)
 * - Chip (status badges)
 * - IconButton (card actions)
 *
 * ## States
 * - Default: Cards distributed across columns
 * - Empty: No submissions
 *
 * **Status:** Placeholder - awaiting implementation
 */
const ProgressBoardPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        02 - Progress Board
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/2 - Progress board/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof ProgressBoardPlaceholder> = {
  title: "ReX Flow/02 - Progress Board",
  component: ProgressBoardPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProgressBoardPlaceholder>;

export const Placeholder: Story = {};
