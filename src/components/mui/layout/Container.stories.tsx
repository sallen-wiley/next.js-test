import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Container from "@mui/material/Container";

const meta: Meta<typeof Container> = {
  title: "MUI Components/Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Container centers your content horizontally. It's the most basic layout element in MUI, providing fixed or fluid width and optional gutters.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100vw",
          minWidth: 0,
          margin: 0,
          padding: 0,
          background: "#f5f5f5", // gutters background
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disableGutters: {
      control: "boolean",
      description:
        "If true, disables the default left and right padding (gutters).",
    },
    fixed: {
      control: "boolean",
      description: "If true, sets a fixed max-width.",
    },
    maxWidth: {
      control: {
        type: "text",
      },
      description: "Determine the max-width of the container.",
      table: { defaultValue: { summary: "lg" } },
    },
    sx: {
      control: "object",
      description: "The system prop for custom styles.",
    },
    children: {
      control: false,
      table: { disable: true },
    },
  },
  args: {
    maxWidth: "lg",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disableGutters: false,
    fixed: false,
    sx: { bgcolor: "#e6d377ff" }, // container background
    children: (
      <div
        style={{
          minHeight: 100,
          textAlign: "center",
          background: "#649bc2ff",
          padding: 16,
        }}
      >
        <strong>Container</strong> content goes here.
      </div>
    ),
  },
  render: (args) => <Container {...args} />,
};

export const AllMaxWidths: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Container key={size} maxWidth={size} sx={{ ...args.sx, mb: 2 }}>
          <div style={{ minHeight: 60, textAlign: "center" }}>
            maxWidth = <strong>{size}</strong>
          </div>
        </Container>
      ))}
    </>
  ),
  args: {
    disableGutters: false,
    fixed: false,
    sx: { bgcolor: "#e3f2fd" },
  },
};
