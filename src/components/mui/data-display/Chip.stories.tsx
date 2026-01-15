import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip, Stack, Typography, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";

const meta = {
  title: "MUI Components/Data Display/Chip",
  component: Chip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
MUI Chip component with automatic Pills vs Tags styling in the Phenom theme.

## Phenom Design System Mapping

The Phenom theme automatically styles chips differently based on interactivity:

### Pills (Interactive)
- **Usage**: Filters, selections, user actions
- **Styling**: 24px height, 12px border radius, normal text
- **Color**: Always use \`color="neutral"\` for Phenom Pills
- **Behavior**: Must have \`onClick\` or \`onDelete\` handlers
- **Variants**: \`outlined\` or \`filled\`

### Tags (Display Only)  
- **Usage**: Status badges, labels, metadata
- **Styling**: 20px height (16px small), 2px border radius, uppercase text
- **Colors**: Semantic colors (\`primary\`, \`secondary\`, \`error\`, \`success\`, etc.)
- **Behavior**: No handlers (display only)
- **Variants**: \`outlined\`, \`filled\`, or \`solid-light\` (custom)

The theme detects interactivity automatically—no wrapper components or sx props needed!
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "The content of the chip",
    },
    variant: {
      control: "select",
      options: ["filled", "outlined", "solid-light"],
      description: "The variant to use",
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "error",
        "warning",
        "info",
        "success",
        "neutral",
      ],
      description: "The color of the component",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "The size of the component (Tags only - Pills ignore this)",
    },
    onDelete: {
      action: "deleted",
      description: "Callback fired when delete icon is clicked",
    },
    onClick: {
      action: "clicked",
      description: "Callback fired when chip is clicked",
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Story
export const Default: Story = {
  args: {
    label: "Default Chip",
  },
};

// Pills (Interactive) - Phenom Design System
export const Pills: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Pills (Interactive) - Outlined
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Phenom Pills: 24px height, rounded corners, neutral color, normal text
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="Filter: Available"
            color="neutral"
            variant="outlined"
            onDelete={() => console.log("Delete clicked")}
          />
          <Chip
            label="Country: USA"
            color="neutral"
            variant="outlined"
            onDelete={() => console.log("Delete clicked")}
          />
          <Chip
            label="Reviews ≥ 5"
            color="neutral"
            variant="outlined"
            onDelete={() => console.log("Delete clicked")}
          />
          <Chip
            label="Clear All"
            color="neutral"
            variant="outlined"
            onClick={() => console.log("Clicked")}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Pills (Interactive) - Filled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Filled variant for selected/active states
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="Active Filter"
            color="neutral"
            variant="filled"
            onDelete={() => console.log("Delete clicked")}
          />
          <Chip
            label="Selected Item"
            color="neutral"
            variant="filled"
            onClick={() => console.log("Clicked")}
          />
          <Chip
            label="With Icon"
            color="neutral"
            variant="filled"
            icon={<DoneIcon />}
            onClick={() => console.log("Clicked")}
          />
        </Stack>
      </Box>
    </Stack>
  ),
};

// Tags (Display Only) - Phenom Design System
export const Tags: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Tags (Display Only) - Outlined
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Phenom Tags: 20px height, 2px radius, uppercase, no handlers
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="DRAFT" color="default" variant="outlined" />
          <Chip label="PENDING" color="warning" variant="outlined" />
          <Chip label="APPROVED" color="success" variant="outlined" />
          <Chip label="REJECTED" color="error" variant="outlined" />
          <Chip label="IN REVIEW" color="info" variant="outlined" />
          <Chip label="PUBLISHED" color="primary" variant="outlined" />
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Tags (Display Only) - Filled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Solid backgrounds for high contrast
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="URGENT" color="error" variant="filled" />
          <Chip label="IMPORTANT" color="warning" variant="filled" />
          <Chip label="COMPLETE" color="success" variant="filled" />
          <Chip label="NEW" color="info" variant="filled" />
          <Chip label="FEATURED" color="primary" variant="filled" />
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Tags (Display Only) - Solid Light
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Custom Phenom variant: light background with colored text
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="SCHEDULED" color="primary" variant="solid-light" />
          <Chip label="OPTIONAL" color="info" variant="solid-light" />
          <Chip label="CAUTION" color="warning" variant="solid-light" />
          <Chip label="ARCHIVED" color="default" variant="solid-light" />
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Tags (Display Only) - Small Size
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          16px height for compact displays
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="BETA" color="info" variant="outlined" size="small" />
          <Chip label="NEW" color="success" variant="filled" size="small" />
          <Chip
            label="ALPHA"
            color="warning"
            variant="solid-light"
            size="small"
          />
          <Chip label="LIVE" color="error" variant="filled" size="small" />
        </Stack>
      </Box>
    </Stack>
  ),
};

// Comparison: Pills vs Tags
export const PillsVsTags: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Pills vs Tags Comparison
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The Phenom theme automatically styles chips based on whether they have
          interaction handlers
        </Typography>
      </Box>

      <Stack direction="row" spacing={4}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
          >
            Pills (Interactive)
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Has onDelete handler
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="Active Filter"
                  color="neutral"
                  variant="outlined"
                  onDelete={() => {}}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Has onClick handler
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="Clear All"
                  color="neutral"
                  variant="filled"
                  onClick={() => {}}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ pt: 1 }}>
              ✓ 24px height
              <br />
              ✓ 12px border radius (rounded)
              <br />
              ✓ Normal text (not uppercase)
              <br />
              ✓ Always neutral color
              <br />✓ Interactive (clickable/deletable)
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 2, color: "success.main" }}
          >
            Tags (Display Only)
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                No handlers (display only)
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label="APPROVED" color="success" variant="outlined" />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Small size available
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label="BETA" color="info" variant="filled" size="small" />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ pt: 1 }}>
              ✓ 20px height (16px small)
              <br />
              ✓ 2px border radius (minimal)
              <br />
              ✓ Uppercase text
              <br />
              ✓ Semantic colors
              <br />✓ Non-interactive (static)
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  ),
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    label: "Click or Delete Me",
    color: "neutral",
    variant: "outlined",
    onDelete: () => console.log("Deleted!"),
    onClick: () => console.log("Clicked!"),
  },
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Pills with Icons
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="Success"
            icon={<DoneIcon />}
            color="neutral"
            variant="outlined"
            onClick={() => {}}
          />
          <Chip
            label="Delete"
            deleteIcon={<DeleteIcon />}
            color="neutral"
            variant="filled"
            onDelete={() => {}}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Tags with Icons (rare but supported)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="VERIFIED" icon={<DoneIcon />} color="success" />
        </Stack>
      </Box>
    </Stack>
  ),
};

// Real-World Example: Filter Chips
export const FilterChips: Story = {
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Active Filters Example
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Real-world usage: Reviewer search filters
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          label="Availability: Available"
          color="neutral"
          variant="outlined"
          onDelete={() => console.log("Clear availability filter")}
        />
        <Chip
          label="Response Time: ≤7 days"
          color="neutral"
          variant="outlined"
          onDelete={() => console.log("Clear response time filter")}
        />
        <Chip
          label="Reviews (12mo): ≥5"
          color="neutral"
          variant="outlined"
          onDelete={() => console.log("Clear reviews filter")}
        />
        <Chip
          label="Clear All Filters"
          color="neutral"
          variant="filled"
          onClick={() => console.log("Clear all")}
        />
      </Stack>
    </Box>
  ),
};

// Real-World Example: Status Tags
export const StatusTags: Story = {
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manuscript Status Tags
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Real-world usage: Document status indicators
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="SUBMITTED" color="info" variant="outlined" />
          <Typography variant="body2">Initial submission</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="PEER REVIEW" color="warning" variant="filled" />
          <Typography variant="body2">Currently being reviewed</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="ACCEPTED" color="success" variant="filled" />
          <Typography variant="body2">Approved for publication</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="REJECTED" color="error" variant="outlined" />
          <Typography variant="body2">Not approved</Typography>
        </Stack>
      </Stack>
    </Box>
  ),
};
