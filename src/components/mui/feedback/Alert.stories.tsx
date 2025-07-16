import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "@mui/material";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";

const meta: Meta<typeof Alert> = {
  title: "MUI Components/Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "MUI Alert component for feedback messages.",
      },
    },
  },
  argTypes: {
    severity: {
      control: { type: "select" },
      options: ["success", "info", "warning", "error"],
      description: "The severity of the alert (controls color and icon).",
    },
    variant: {
      control: { type: "select" },
      options: ["standard", "filled", "outlined"],
      description: "The variant to use.",
    },
    icon: {
      control: false, // Designers can add a custom story for icon if needed
      description: "Custom icon (set in code, not via controls)",
    },
    children: {
      control: { type: "text" },
      description: "Alert message text.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    severity: "info",
    variant: "standard",
    children: "This is an info alert — check it out!",
  },
  render: (args) => <Alert {...args}>{args.children}</Alert>,
};

export const WithCustomIcon: Story = {
  args: {
    severity: "success",
    variant: "standard",
    children: "Here is a gentle confirmation that your action was successful.",
  },
  render: (args) => (
    <Alert {...args} icon={<CheckIcon fontSize="inherit" />}>{args.children}</Alert>
  ),
};