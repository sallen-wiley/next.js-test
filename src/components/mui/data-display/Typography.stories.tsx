import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Typography, Box } from "@mui/material";
import React from "react";

// Custom component for the three typography layout
interface TypographyLayoutProps {
  // First component props
  variant1:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline";
  children1: string;
  color1:
    | "primary"
    | "secondary"
    | "text.primary"
    | "text.secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
  align1: "left" | "center" | "right" | "justify";
  gutterBottom1: boolean;

  // Second component props
  variant2:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline";
  children2: string;
  color2:
    | "primary"
    | "secondary"
    | "text.primary"
    | "text.secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
  align2: "left" | "center" | "right" | "justify";
  gutterBottom2: boolean;

  // Third component props
  variant3:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline";
  children3: string;
  color3:
    | "primary"
    | "secondary"
    | "text.primary"
    | "text.secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
  align3: "left" | "center" | "right" | "justify";
  gutterBottom3: boolean;
}

const TypographyLayoutComponent: React.FC<TypographyLayoutProps> = ({
  variant1,
  children1,
  color1,
  align1,
  gutterBottom1,
  variant2,
  children2,
  color2,
  align2,
  gutterBottom2,
  variant3,
  children3,
  color3,
  align3,
  gutterBottom3,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        padding: 2,
        border: "1px dashed #ccc",
        borderRadius: 1,
      }}
    >
      <Typography
        variant={variant1}
        color={color1}
        align={align1}
        gutterBottom={gutterBottom1}
      >
        {children1}
      </Typography>

      <Typography
        variant={variant2}
        color={color2}
        align={align2}
        gutterBottom={gutterBottom2}
      >
        {children2}
      </Typography>

      <Typography
        variant={variant3}
        color={color3}
        align={align3}
        gutterBottom={gutterBottom3}
      >
        {children3}
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof Typography> = {
  title: "MUI Components/Data Display/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Typography component showcasing all variants with the Wiley Open Sans font family and custom styling.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
type LayoutStory = StoryObj<typeof TypographyLayoutComponent>;

// Single interactive typography component
export const Default: Story = {
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
        "button",
        "caption",
        "overline",
      ],
    },
    align: {
      control: { type: "select" },
      options: ["left", "center", "right", "justify"],
    },
    color: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "text.primary",
        "text.secondary",
        "error",
        "warning",
        "info",
        "success",
      ],
    },
    gutterBottom: {
      control: { type: "boolean" },
    },
    noWrap: {
      control: { type: "boolean" },
    },
  },
  args: {
    variant: "h4",
    children: "Change my properties using the controls below",
    gutterBottom: true,
    align: "left",
    color: "text.primary",
  },
};

// Typography layout with full interactivity
export const TypographyLayout: LayoutStory = {
  render: (args) => <TypographyLayoutComponent {...args} />,
  argTypes: {
    // First Typography component
    variant1: {
      control: { type: "select" },
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
        "button",
        "caption",
        "overline",
      ],
      name: "1. Variant",
    },
    children1: {
      control: { type: "text" },
      name: "1. Text Content",
    },
    color1: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "text.primary",
        "text.secondary",
        "error",
        "warning",
        "info",
        "success",
      ],
      name: "1. Color",
    },
    align1: {
      control: { type: "select" },
      options: ["left", "center", "right", "justify"],
      name: "1. Alignment",
    },
    gutterBottom1: {
      control: { type: "boolean" },
      name: "1. Gutter Bottom",
    },

    // Second Typography component
    variant2: {
      control: { type: "select" },
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
        "button",
        "caption",
        "overline",
      ],
      name: "2. Variant",
    },
    children2: {
      control: { type: "text" },
      name: "2. Text Content",
    },
    color2: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "text.primary",
        "text.secondary",
        "error",
        "warning",
        "info",
        "success",
      ],
      name: "2. Color",
    },
    align2: {
      control: { type: "select" },
      options: ["left", "center", "right", "justify"],
      name: "2. Alignment",
    },
    gutterBottom2: {
      control: { type: "boolean" },
      name: "2. Gutter Bottom",
    },

    // Third Typography component
    variant3: {
      control: { type: "select" },
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
        "button",
        "caption",
        "overline",
      ],
      name: "3. Variant",
    },
    children3: {
      control: { type: "text" },
      name: "3. Text Content",
    },
    color3: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "text.primary",
        "text.secondary",
        "error",
        "warning",
        "info",
        "success",
      ],
      name: "3. Color",
    },
    align3: {
      control: { type: "select" },
      options: ["left", "center", "right", "justify"],
      name: "3. Alignment",
    },
    gutterBottom3: {
      control: { type: "boolean" },
      name: "3. Gutter Bottom",
    },
  },
  args: {
    // First component defaults (heading)
    variant1: "h3",
    children1: "Main Article Heading",
    color1: "primary",
    align1: "left",
    gutterBottom1: true,

    // Second component defaults (subtitle)
    variant2: "subtitle1",
    children2: "Supporting subtitle or author information",
    color2: "text.secondary",
    align2: "left",
    gutterBottom2: true,

    // Third component defaults (body)
    variant3: "body1",
    children3:
      "This is the main body text that would follow the heading and subtitle. You can experiment with different typography combinations to see how they work together in a real layout.",
    color3: "text.primary",
    align3: "left",
    gutterBottom3: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three interactive typography components stacked to help designers create and test typography layouts. Perfect for experimenting with heading/subtitle/body combinations. Each component has its own controls!",
      },
    },
  },
};

// Static examples for reference
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography variant="h1" gutterBottom>
        h1. Heading
      </Typography>
      <Typography variant="h2" gutterBottom>
        h2. Heading
      </Typography>
      <Typography variant="h3" gutterBottom>
        h3. Heading
      </Typography>
      <Typography variant="h4" gutterBottom>
        h4. Heading
      </Typography>
      <Typography variant="h5" gutterBottom>
        h5. Heading
      </Typography>
      <Typography variant="h6" gutterBottom>
        h6. Heading
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Quos blanditiis tenetur
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Quos blanditiis tenetur
      </Typography>
      <Typography variant="body1" gutterBottom>
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore
        consectetur, neque doloribus, cupiditate numquam dignissimos laborum
        fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="body2" gutterBottom>
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore
        consectetur, neque doloribus, cupiditate numquam dignissimos laborum
        fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="button" gutterBottom sx={{ display: "block" }}>
        button text
      </Typography>
      <Typography variant="caption" gutterBottom sx={{ display: "block" }}>
        caption text
      </Typography>
      <Typography variant="overline" gutterBottom sx={{ display: "block" }}>
        overline text
      </Typography>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Complete overview of all typography variants with Wiley theme applied.",
      },
    },
  },
};

export const WileyColors: Story = {
  render: () => (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Primary Color (Wiley Blue)
      </Typography>
      <Typography variant="h4" gutterBottom color="secondary">
        Secondary Color (Wiley Pink)
      </Typography>
      <Typography variant="h4" gutterBottom color="error">
        Error Color
      </Typography>
      <Typography variant="h4" gutterBottom color="warning">
        Warning Color
      </Typography>
      <Typography variant="h4" gutterBottom color="success">
        Success Color
      </Typography>
      <Typography variant="h4" gutterBottom color="text.primary">
        Primary text color
      </Typography>
      <Typography variant="h4" color="text.secondary">
        Secondary text color
      </Typography>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Typography showing Wiley brand colors and text color options.",
      },
    },
  },
};
