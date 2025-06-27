import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@mui/material";

const meta: Meta<typeof Button> = {
  title: "MUI Components/Inputs/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["text", "outlined", "contained"],
    },
    color: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "neutral",
        "black",
        "white",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "contained",
    color: "primary",
  },
};

export const WileyBranding: Story = {
  args: {
    children: "Wiley Blue",
    variant: "contained",
    color: "primary",
  },
};

export const CustomColors: Story = {
  args: {
    children: "Neutral Color",
    variant: "contained",
    color: "neutral",
  },
};

export const TextWithUnderline: Story = {
  args: {
    children: "Text Button (with underline)",
    variant: "text",
    color: "primary",
  },
};

export const NoRipple: Story = {
  args: {
    children: "No Ripple Effect",
    variant: "contained",
    color: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Buttons have ripple disabled by default in this theme.",
      },
    },
  },
};
