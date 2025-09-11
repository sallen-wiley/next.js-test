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
    fullWidth: false,
    autoWidth: false,
    width: "300px",
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
  width?: string | number;
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
  width,
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
          sx={{
            m: 1,
            minWidth: 120,
            ...(width && !fullWidth && { width }),
          }}
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
        "If true, the FormControl (and thus the select input) will take up the full width of its container. This is a FormControl prop, not a Select prop.",
      defaultValue: false,
    },
    autoWidth: {
      control: "boolean",
      description:
        "If true, the width of the dropdown menu will automatically be set according to the items inside the menu, otherwise it will be at least the width of the select input. This is a Select prop that controls the menu, not the input width.",
      defaultValue: false,
    },
    width: {
      control: "text",
      description:
        "Custom width for the FormControl (and thus the select input). Use string values with units (e.g., 300px, 50%, 20rem) or fractional numbers (e.g., 0.5 for 50%). Numbers > 1 are passed directly to CSS without units and may not work. Only applies when fullWidth is false. Note: autoWidth controls the dropdown menu width, not the input width.",
      defaultValue: "300px",
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
    fullWidth: false,
    autoWidth: false,
    width: "300px",
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
    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        Color Variations - Focus States
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Click on each select to see how the color affects the focus state
        (border/underline color). Colors only show when the field is focused,
        has content, or is in an error state.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {COLOR_OPTIONS.map((color) => (
          <Box key={color} sx={{ minWidth: 200 }}>
            <Typography variant="caption" display="block" gutterBottom>
              {color}
            </Typography>
            <SelectDemo
              {...args}
              color={color}
              label={`${color}`}
              value="journal-short"
              fullWidth={false}
              width="180px"
            />
          </Box>
        ))}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        <strong>Note:</strong> Some custom theme colors (black, white, neutral)
        may not show visible differences if they&apos;re not properly defined in
        your theme&apos;s palette.
      </Typography>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Demonstrates how different color props affect the Select component's focus states. The color primarily controls the border/underline color when the field is focused or active, not the default appearance.",
      },
    },
  },
};

export const AutoWidthDemo: Story = {
  render: (args) => {
    const shortOptions = [
      { value: "", label: "None" },
      { value: "a", label: "A" },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
      { value: "d", label: "D" },
    ];

    const longOptions = [
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
    ];

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            autoWidth: {args.autoWidth ? "true" : "false"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Toggle the autoWidth control to see how it affects the dropdown menu
            width.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Short Options
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="short-options-label">Select</InputLabel>
              <Select
                labelId="short-options-label"
                id="short-options"
                value=""
                label="Select"
                autoWidth={args.autoWidth}
              >
                {shortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Long Options
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="long-options-label">Select</InputLabel>
              <Select
                labelId="long-options-label"
                id="long-options"
                value=""
                label="Select"
                autoWidth={args.autoWidth}
              >
                {longOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>autoWidth={args.autoWidth ? "true" : "false"}:</strong>{" "}
            {args.autoWidth
              ? "Menu width adjusts to fit the content of the menu items."
              : "Menu width is at least as wide as the select input (200px in this case)."}
          </Typography>
        </Box>
      </Box>
    );
  },
  args: {
    autoWidth: false,
  },
  argTypes: {
    autoWidth: {
      control: "boolean",
      description:
        "Toggle to see how autoWidth affects the dropdown menu width",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how the autoWidth prop affects the dropdown menu width. With short options, autoWidth=true makes the menu narrower. With long options, autoWidth=true makes the menu wider to accommodate the content.",
      },
    },
  },
};

export const MenuWidthMatching: Story = {
  render: () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Menu Width Matching Examples
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Best practices for making the dropdown menu width match the input
            width exactly.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 4, flexDirection: "column" }}>
          {/* Default behavior - shows the problem */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              1. Default Behavior (Problem)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Menu width adapts to content length - wider for long items,
              inconsistent with input.
            </Typography>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="default-problem-label">Journal</InputLabel>
              <Select
                labelId="default-problem-label"
                id="default-problem-select"
                value=""
                label="Journal"
                autoWidth={false}
              >
                {OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Best practice solution */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              2. Fixed Width Solution (Best Practice)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Menu width exactly matches input (300px). Long text is properly
              truncated.
            </Typography>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="fixed-width-label">Journal</InputLabel>
              <Select
                labelId="fixed-width-label"
                id="fixed-width-select"
                value=""
                label="Journal"
                autoWidth={false}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      width: 300, // Match the FormControl width exactly
                    },
                  },
                }}
              >
                {OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Typography noWrap sx={{ width: "100%" }}>
                      {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Percentage-based solution */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              3. Percentage-Based Solution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Using width: &quot;100%&quot; when you want the menu to fill
              available space.
            </Typography>
            <Box sx={{ width: 400, border: "1px dashed #ccc", p: 2 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Container: 400px wide
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="percentage-label">Journal</InputLabel>
                <Select
                  labelId="percentage-label"
                  id="percentage-select"
                  value=""
                  label="Journal"
                  autoWidth={false}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: "100%", // Menu matches the full container width
                      },
                    },
                  }}
                >
                  {OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Typography noWrap sx={{ width: "100%" }}>
                        {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Comparison with autoWidth */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              4. AutoWidth=true (Comparison)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Menu width varies with content - not suitable when you want
              consistent menu width.
            </Typography>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="auto-width-comparison-label">Journal</InputLabel>
              <Select
                labelId="auto-width-comparison-label"
                id="auto-width-comparison-select"
                value=""
                label="Journal"
                autoWidth={true}
              >
                {OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.value === "" ? <em>{opt.label}</em> : opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Answer:</strong> Use MenuProps.PaperProps.sx.width with a
            specific value (option #2) or &quot;100%&quot; (option #3). Always
            wrap MenuItem content in Typography with noWrap for proper text
            truncation. Avoid autoWidth=true when you want consistent menu
            width.
          </Typography>
        </Box>
      </Box>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Demonstrates the best practices for making dropdown menu width match the input width exactly. Shows the problem with default behavior and provides clear solutions using MenuProps.",
      },
    },
  },
};
