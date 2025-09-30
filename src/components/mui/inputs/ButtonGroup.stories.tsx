import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import SaveIcon from "@mui/icons-material/Save";

const meta: Meta<typeof ButtonGroup> = {
  title: "MUI Components/Inputs/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "MUI ButtonGroup component for grouping related buttons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["contained", "outlined", "text"],
      description: "The variant to use.",
    },
    color: {
      control: "radio",
      options: ["primary", "secondary", "error", "info", "success", "warning"],
      description: "The color of the component.",
    },
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "The size of the component.",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "The orientation of the button group.",
    },
    disableElevation: {
      control: "boolean",
      description: "If true, no drop shadow is used.",
    },
    sx: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Basic: Story = {
  args: {
    variant: "contained",
    sx: { m: 1 },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": { m: 1 },
      }}
    >
      <ButtonGroup variant="outlined">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="text">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Box>
  ),
};

const buttons = [
  <Button key="one">One</Button>,
  <Button key="two">Two</Button>,
  <Button key="three">Three</Button>,
];

export const SizesAndColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": { m: 1 },
      }}
    >
      <ButtonGroup size="small">{buttons}</ButtonGroup>
      <ButtonGroup color="secondary">{buttons}</ButtonGroup>
      <ButtonGroup size="large">{buttons}</ButtonGroup>
    </Box>
  ),
};

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box sx={{ display: "flex", "& > *": { m: 1 } }}>
      <ButtonGroup orientation="vertical">{buttons}</ButtonGroup>
      <ButtonGroup orientation="vertical" variant="contained">
        {buttons}
      </ButtonGroup>
      <ButtonGroup orientation="vertical" variant="text">
        {buttons}
      </ButtonGroup>
    </Box>
  ),
};

export const SplitButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const options = [
      "Create a merge commit",
      "Squash and merge",
      "Rebase and merge",
    ];
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      index: number
    ) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }
      setOpen(false);
    };

    return (
      <React.Fragment>
        <ButtonGroup variant="contained" ref={anchorRef}>
          <Button onClick={handleClick}>{options[selectedIndex]}</Button>
          <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    );
  },
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ButtonGroup variant="outlined">
      <Button>Submit</Button>
      <Button>Fetch data</Button>
      <Button loading loadingPosition="start" startIcon={<SaveIcon />}>
        Save
      </Button>
    </ButtonGroup>
  ),
};
