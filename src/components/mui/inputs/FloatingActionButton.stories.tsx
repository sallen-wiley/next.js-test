import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/AddRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import NavigationIcon from "@mui/icons-material/NavigationRounded";
import QuestionMarkIcon from "@mui/icons-material/HelpRounded";

const meta: Meta<typeof Fab> = {
  title: "MUI Components/Inputs/Floating Action Button",
  component: Fab,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A Floating Action Button (FAB) performs the primary, or most common, action on a screen. FABs come in two types: regular and extended.",
      },
    },
  },
  argTypes: {
    color: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "error",
        "warning",
        "info",
        "success",
        // To enable custom theme colors, add them here if your theme supports it:
        // "black", "white", "neutral",
      ],
    },
    variant: {
      control: { type: "select" },
      options: ["circular", "extended"],
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

type FabDemoProps = {
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  variant: "circular" | "extended";
  size: "small" | "medium" | "large";
  disabled: boolean;
  icon: "add" | "edit" | "favorite" | "navigation" | "question" | "none";
  label?: string;
  sx?: object;
};

const iconMap = {
  add: <AddIcon />,
  edit: <EditIcon />,
  favorite: <FavoriteIcon />,
  navigation: <NavigationIcon />,
  question: <QuestionMarkIcon />,
};

const FabDemo: React.FC<FabDemoProps> = ({
  color,
  variant,
  size,
  disabled,
  icon,
  label,
  sx,
}) => {
  let iconElement = null;
  if (icon !== "none") {
    const baseIcon = iconMap[icon as keyof typeof iconMap];
    // We use React.cloneElement to conditionally add margin-right (mr) to the icon
    // only when the FAB is in the 'extended' variant. This keeps the icon components
    // pure and reusable for both icon-only and extended FABs, applying spacing only
    // in the layout context where it is needed.
    iconElement =
      variant === "extended"
        ? React.cloneElement(baseIcon, {
            sx: { mr: 1, ...(baseIcon.props.sx || {}) },
          })
        : baseIcon;
  }
  return (
    <Fab
      color={color}
      variant={variant === "extended" ? "extended" : undefined}
      size={size}
      disabled={disabled}
      sx={sx}
    >
      {iconElement}
      {variant === "extended" && label}
    </Fab>
  );
};

export const Default: Story = {
  args: {
    color: "primary",
    variant: "circular",
    size: "large",
    disabled: false,
    // Custom controls for demo only:
    // @ts-expect-error: icon is not a valid prop for Fab, but used in stories
    icon: "add",
    label: "",
    sx: {},
  },
  argTypes: {
    // @ts-expect-error: icon is not a valid prop for Fab, but used in stories
    icon: {
      control: { type: "select" },
      options: ["add", "edit", "favorite", "navigation", "question", "none"],
      description: "Icon to display inside the FAB.",
    },
    label: {
      control: { type: "text" },
      description: "Label for extended variant.",
      if: { arg: "variant", eq: "extended" },
    },
    sx: {
      control: "object",
      description: "The system prop for custom styles.",
    },
  },
  render: (args) => <FabDemo {...(args as FabDemoProps)} />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab color="primary">
        <AddIcon />
      </Fab>
      <Fab color="secondary">
        <EditIcon />
      </Fab>
      <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </Fab>
      <Fab disabled>
        <FavoriteIcon />
      </Fab>
    </Box>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab size="small" color="secondary">
        <AddIcon />
      </Fab>
      <Fab size="medium" color="secondary">
        <AddIcon />
      </Fab>
      <Fab color="secondary">
        <AddIcon />
      </Fab>
    </Box>
  ),
};

export const ExtendedSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab variant="extended" size="small" color="primary">
        <NavigationIcon sx={{ mr: 1 }} />
        Extended
      </Fab>
      <Fab variant="extended" size="medium" color="primary">
        <NavigationIcon sx={{ mr: 1 }} />
        Extended
      </Fab>
      <Fab variant="extended" color="primary">
        <NavigationIcon sx={{ mr: 1 }} />
        Extended
      </Fab>
    </Box>
  ),
};

export const HelpCenter: Story = {
  args: {
    color: "primary",
    variant: "extended",
    size: "medium",
    disabled: false,
    // @ts-expect-error: icon is not a valid prop for Fab, but used in stories
    icon: "question",
    label: "Help",

    sx: {
      border: 2,
    },
  },

  argTypes: {
    // @ts-expect-error: icon is not a valid prop for Fab, but used in stories
    icon: {
      control: {
        type: "select",
      },

      options: ["add", "edit", "favorite", "navigation", "question", "none"],
      description: "Icon to display inside the FAB.",
    },

    label: {
      control: {
        type: "text",
      },

      description: "Label for extended variant.",

      if: {
        arg: "variant",
        eq: "extended",
      },
    },

    sx: {
      control: "object",
      description: "The system prop for custom styles.",
    },
  },

  render: (args) => <FabDemo {...(args as FabDemoProps)} />,
};
