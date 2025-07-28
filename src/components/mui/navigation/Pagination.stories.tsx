import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const meta: Meta<typeof Pagination> = {
  title: "MUI Components/Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pagination allows the user to select a specific page from a range of pages. Useful for navigation in large data sets or lists.",
      },
    },
  },
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 50 },
      description: "Total number of pages.",
      defaultValue: 10,
    },
    page: {
      control: { type: "number", min: 1, max: 50 },
      description: "Current page.",
      defaultValue: 1,
    },
    variant: {
      control: { type: "select" },
      options: ["text", "outlined"],
      description: "The variant to use.",
      defaultValue: "text",
    },
    shape: {
      control: { type: "select" },
      options: ["circular", "rounded"],
      description: "The shape of the pagination items.",
      defaultValue: "circular",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "The size of the component.",
      defaultValue: "medium",
    },
    color: {
      control: { type: "select" },
      options: ["primary", "secondary", "standard"],
      description: "The color of the component.",
      defaultValue: "primary",
    },
    disabled: {
      control: { type: "boolean" },
      description: "If true, the component is disabled.",
      defaultValue: false,
    },
    showFirstButton: {
      control: { type: "boolean" },
      description: "Show the first-page button.",
      defaultValue: false,
    },
    showLastButton: {
      control: { type: "boolean" },
      description: "Show the last-page button.",
      defaultValue: false,
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 5 },
      description:
        "Number of always visible pages before/after the current page.",
      defaultValue: 1,
    },
    boundaryCount: {
      control: { type: "number", min: 0, max: 5 },
      description: "Number of always visible pages at the beginning and end.",
      defaultValue: 1,
    },
    onChange: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    classes: { table: { disable: true } },
    sx: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 10,
    page: 1,
    variant: "text",
    shape: "circular",
    size: "medium",
    color: "primary",
    disabled: false,
    showFirstButton: false,
    showLastButton: false,
    siblingCount: 1,
    boundaryCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default Pagination component. Use the controls to explore different props.",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination in a disabled state.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <Stack spacing={2}>
      <Pagination {...args} variant="text" />
      <Pagination {...args} variant="outlined" />
    </Stack>
  ),
  args: {
    ...Default.args,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shows both 'text' and 'outlined' variants.",
      },
    },
  },
};

export const AllShapes: Story = {
  render: (args) => (
    <Stack spacing={2}>
      <Pagination {...args} shape="circular" />
      <Pagination {...args} shape="rounded" />
    </Stack>
  ),
  args: {
    ...Default.args,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shows both 'circular' and 'rounded' shapes.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <Stack spacing={2} direction="row">
      <Pagination {...args} size="small" />
      <Pagination {...args} size="medium" />
      <Pagination {...args} size="large" />
    </Stack>
  ),
  args: {
    ...Default.args,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shows all size options.",
      },
    },
  },
};

export const Basic: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination count={10} />
      <Pagination count={10} color="primary" />
      <Pagination count={10} color="secondary" />
      <Pagination count={10} disabled />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Basic pagination examples with different colors and disabled state.",
      },
    },
  },
};

export const Outlined: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination count={10} variant="outlined" />
      <Pagination count={10} variant="outlined" color="primary" />
      <Pagination count={10} variant="outlined" color="secondary" />
      <Pagination count={10} variant="outlined" disabled />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Outlined pagination examples with different colors and disabled state.",
      },
    },
  },
};

export const Rounded: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination count={10} shape="rounded" />
      <Pagination count={10} variant="outlined" shape="rounded" />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Rounded and outlined-rounded pagination examples.",
      },
    },
  },
};

export const Size: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination count={10} size="small" />
      <Pagination count={10} />
      <Pagination count={10} size="large" />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Pagination in small, medium (default), and large sizes.",
      },
    },
  },
};

export const Buttons: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination count={10} showFirstButton showLastButton />
      <Pagination count={10} hidePrevButton hideNextButton />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Pagination with first/last and hide prev/next buttons.",
      },
    },
  },
};

import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const CustomIcons: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination
        count={10}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Pagination with custom previous/next icons.",
      },
    },
  },
};

export const Ranges: Story = {
  render: () => (
    <Stack spacing={2}>
      <Pagination count={11} defaultPage={6} siblingCount={0} />
      <Pagination count={11} defaultPage={6} />
      <Pagination
        count={11}
        defaultPage={6}
        siblingCount={0}
        boundaryCount={2}
      />
      <Pagination count={11} defaultPage={6} boundaryCount={2} />
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Pagination with different sibling and boundary count ranges.",
      },
    },
  },
};

import Typography from "@mui/material/Typography";
import * as React from "react";

export const Controlled: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
    return (
      <Stack spacing={2}>
        <Typography>Page: {page}</Typography>
        <Pagination count={10} page={page} onChange={handleChange} />
      </Stack>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Controlled pagination with current page state.",
      },
    },
  },
};

// Router integration example is not included by default as it requires react-router and setup.

export const WithFirstAndLastButtons: Story = {
  args: {
    ...Default.args,
    showFirstButton: true,
    showLastButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination with first and last page buttons enabled.",
      },
    },
  },
};
