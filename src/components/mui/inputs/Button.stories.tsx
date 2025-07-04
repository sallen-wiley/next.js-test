import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const meta: Meta<typeof Button> = {
  title: "MUI Components/Inputs/Button",
  component: Button,
  tags: ["autodocs"],
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
    disableElevation: {
      control: { type: "boolean" },
    },
    startIcon: {
      control: { type: "boolean" },
      description: "Show Add icon at start",
    },
    endIcon: {
      control: { type: "boolean" },
      description: "Show Delete icon at end",
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
    startIcon: false,
    endIcon: false,
  },
  render: (args) => (
    <Button
      {...args}
      startIcon={args.startIcon ? <AddIcon /> : undefined}
      endIcon={args.endIcon ? <DeleteIcon /> : undefined}
    >
      {args.children}
    </Button>
  ),
};

export const WileyBranding: Story = {
  args: {
    children: "Wiley Blue",
    variant: "contained",
    color: "primary",
    startIcon: false,
    endIcon: false,
  },
  render: (args) => (
    <Button
      {...args}
      startIcon={args.startIcon ? <AddIcon /> : undefined}
      endIcon={args.endIcon ? <DeleteIcon /> : undefined}
    >
      {args.children}
    </Button>
  ),
};

export const CustomColors: Story = {
  args: {
    children: "Neutral Color",
    variant: "contained",
    color: "neutral",
    startIcon: false,
    endIcon: false,
  },
  render: (args) => (
    <Button
      {...args}
      startIcon={args.startIcon ? <AddIcon /> : undefined}
      endIcon={args.endIcon ? <DeleteIcon /> : undefined}
    >
      {args.children}
    </Button>
  ),
};

export const TextWithUnderline: Story = {
  args: {
    children: "Text Button (with underline)",
    variant: "text",
    color: "primary",
    startIcon: false,
    endIcon: false,
  },
  render: (args) => (
    <Button
      {...args}
      startIcon={args.startIcon ? <AddIcon /> : undefined}
      endIcon={args.endIcon ? <DeleteIcon /> : undefined}
    >
      {args.children}
    </Button>
  ),
};
