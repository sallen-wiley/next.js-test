// Truncation and wrapping demo stories
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Journal",
    value: "",
    variant: "outlined",
    size: "medium",
    color: "primary",
    disabled: false,
    error: false,
    required: false,
    helperText: "",
    fullWidth: true,
    autoWidth: false,
  },
};

// Truncation and wrapping demo stories
export const TruncatedMenuItems: Story = {
  render: (args) => (
    <div style={{ width: 500 }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl
          variant={args.variant}
          size={args.size}
          color={
            [
              "primary",
              "secondary",
              "error",
              "warning",
              "info",
              "success",
            ].includes(args.color)
              ? (args.color as
                  | "primary"
                  | "secondary"
                  | "error"
                  | "warning"
                  | "info"
                  | "success")
              : undefined
          }
          fullWidth={args.fullWidth}
          sx={{ m: 1, minWidth: 120 }}
        >
          <InputLabel id="trunc-select-label">Journal</InputLabel>
          <Select
            labelId="trunc-select-label"
            id="trunc-select"
            value={args.value}
            label="Journal"
            onChange={() => {}}
            autoWidth={args.autoWidth}
            MenuProps={{
              PaperProps: {
                sx: {
                  minWidth: 250,
                  maxWidth: 400,
                },
              },
            }}
          >
            {OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} title={opt.label}>
                <Typography noWrap sx={{ maxWidth: "100%" }}>
                  {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Demonstrates menu items with long journal titles being truncated with ellipsis. Hover to see full title.",
      },
    },
  },
};

export const WrappedMenuItems: Story = {
  render: (args) => (
    <div style={{ width: 500 }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl
          variant={args.variant}
          size={args.size}
          color={
            [
              "primary",
              "secondary",
              "error",
              "warning",
              "info",
              "success",
            ].includes(args.color)
              ? (args.color as
                  | "primary"
                  | "secondary"
                  | "error"
                  | "warning"
                  | "info"
                  | "success")
              : undefined
          }
          fullWidth={args.fullWidth}
          sx={{ m: 1, minWidth: 120 }}
        >
          <InputLabel id="wrap-select-label">Journal</InputLabel>
          <Select
            labelId="wrap-select-label"
            id="wrap-select"
            value={args.value}
            label="Journal"
            onChange={() => {}}
            autoWidth={args.autoWidth}
            MenuProps={{
              PaperProps: {
                sx: {
                  minWidth: 250,
                  maxWidth: 400,
                },
              },
            }}
          >
            {OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                }}
              >
                {opt.value === "" ? <em>{opt.label}</em> : opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Demonstrates menu items with long journal titles wrapping to multiple lines.",
      },
    },
  },
};
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
// ...existing code...
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const OPTIONS = [
  { value: "", label: "None" },
  { value: "journal-short", label: "Cell" },
  { value: "journal-medium", label: "Journal of Experimental Biology" },
  {
    value: "journal-long",
    label:
      "International Journal of Advanced Computational Science and Engineering",
  },
  {
    value: "journal-verylong",
    label:
      "Proceedings of the National Academy of Sciences of the United States of America (PNAS)",
  },
  {
    value: "journal-multiline",
    label:
      "The Lancet: Global Health, Medicine, and Policy in the 21st Century",
  },
  { value: "journal-special", label: "Nature – Genetics & Genomics" },
];

interface SelectStoryProps {
  label: string;
  value: string | number;
  variant: "outlined" | "filled" | "standard";
  size: "small" | "medium";
  color:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "black"
    | "white"
    | "neutral";
  disabled: boolean;
  error: boolean;
  required: boolean;
  helperText: string;
  fullWidth: boolean;
  autoWidth: boolean;
}

const SelectDemo: React.FC<SelectStoryProps> = ({
  label,
  value,
  variant,
  size,
  color,
  disabled,
  error,
  required,
  helperText,
  fullWidth,
  autoWidth,
}) => {
  const [selected, setSelected] = React.useState<string | number>(value);
  React.useEffect(() => {
    setSelected(value);
  }, [value]);
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setSelected(event.target.value as string | number);
  };
  return (
    <div style={{ width: 500 }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl
          variant={variant}
          size={size}
          color={
            [
              "primary",
              "secondary",
              "error",
              "warning",
              "info",
              "success",
            ].includes(color)
              ? (color as
                  | "primary"
                  | "secondary"
                  | "error"
                  | "warning"
                  | "info"
                  | "success")
              : undefined
          }
          disabled={disabled}
          error={error}
          required={required}
          fullWidth={fullWidth}
          sx={{ m: 1, minWidth: 120 }}
        >
          <InputLabel id="storybook-select-label">{label}</InputLabel>
          <Select
            labelId="storybook-select-label"
            id="storybook-select"
            value={selected}
            label={label}
            onChange={handleChange}
            autoWidth={autoWidth}
          >
            {OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.value === "" ? <em>{opt.label}</em> : opt.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </Box>
    </div>
  );
};

const meta: Meta<typeof SelectDemo> = {
  title: "MUI Components/Inputs/Select",
  component: SelectDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Select components are used for collecting user provided information from a list of options.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label for the select input.",
      defaultValue: "Age",
    },
    value: {
      control: { type: "select" },
      options: OPTIONS.map((o) => o.value),
      description: "Selected value.",
      defaultValue: "",
    },
    variant: {
      control: { type: "select" },
      options: ["outlined", "filled", "standard"],
      description: "The variant to use.",
      defaultValue: "outlined",
    },
    size: {
      control: { type: "select" },
      options: ["medium", "small"],
      description: "The size of the component.",
      defaultValue: "medium",
    },
    color: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "error",
        "warning",
        "info",
        "success",
        "black",
        "white",
        "neutral",
      ],
      description: "The color of the component.",
      defaultValue: "primary",
    },
    disabled: {
      control: "boolean",
      description: "If true, the component is disabled.",
      defaultValue: false,
    },
    error: {
      control: "boolean",
      description: "If true, the component is displayed in an error state.",
      defaultValue: false,
    },
    required: {
      control: "boolean",
      description:
        "If true, the label is displayed as required and the input element is required.",
      defaultValue: false,
    },
    helperText: {
      control: "text",
      description: "Helper text to display below the select.",
      defaultValue: "",
    },
    fullWidth: {
      control: "boolean",
      description:
        "If true, the select will take up the full width of its container.",
      defaultValue: true,
    },
    autoWidth: {
      control: "boolean",
      description:
        "If true, the select will automatically adjust the width to fit its content.",
      defaultValue: false,
    },
  },
  args: {
    label: "Journal",
    value: "",
    variant: "outlined",
    size: "medium",
    color: "primary",
    disabled: false,
    error: false,
    required: false,
    helperText: "",
    fullWidth: true,
    autoWidth: false,
  },
};

export default meta;

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: true,
    helperText: "Error: Please select a value.",
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the Select component in an error state.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <Box sx={{ display: "flex", gap: 2 }}>
      {(["outlined", "filled", "standard"] as const).map((variant) => (
        <SelectDemo
          key={variant}
          {...args}
          variant={variant}
          label={`Journal (${variant})`}
        />
      ))}
    </Box>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shows all Select variants side by side.",
      },
    },
  },
};

export const SizeVariations: Story = {
  render: (args) => (
    <Box sx={{ display: "flex", gap: 2 }}>
      {(["medium", "small"] as const).map((size) => (
        <SelectDemo
          key={size}
          {...args}
          size={size}
          label={`Journal (${size})`}
        />
      ))}
    </Box>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shows Select in both medium and small sizes.",
      },
    },
  },
};

const COLOR_OPTIONS: SelectStoryProps["color"][] = [
  "primary",
  "secondary",
  "error",
  "warning",
  "info",
  "success",
  "black",
  "white",
  "neutral",
];
export const ColorVariations: Story = {
  render: (args) => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {COLOR_OPTIONS.map((color) => (
        <SelectDemo
          key={color}
          {...args}
          color={color}
          label={`Journal (${color})`}
        />
      ))}
    </Box>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Shows all color options for the Select component, including custom theme colors.",
      },
    },
  },
};
