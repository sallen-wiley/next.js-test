import React from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import figma from "@figma/code-connect";

const selectNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6570%3A41424";

// Active (open menu) is interaction-only and maps to undefined.
// Menu items are not a Figma property — placeholders match Autocomplete's floor.
// Has Value shows nested <InputValues>; the string is InputValues.Value.

const sharedProps = {
  label: figma.string("Label"),

  variant: figma.enum("Variant", {
    Standard: "standard",
    Filled: "filled",
    Outlined: undefined,
  }),

  size: figma.enum("Size", {
    Medium: undefined,
    Small: "small",
  }),

  disabled: figma.enum("State", {
    Enabled: undefined,
    Hovered: undefined,
    Focused: undefined,
    Disabled: true,
    Error: undefined,
  }),

  error: figma.enum("State", {
    Enabled: undefined,
    Hovered: undefined,
    Focused: undefined,
    Disabled: undefined,
    Error: true,
  }),

  displayEmpty: figma.boolean("Placeholder?", {
    true: true,
    false: undefined,
  }),

  startAdornment: figma.boolean("Adorn. Start?", {
    true: figma.instance("Start Instance"),
    false: undefined,
  }),
};

figma.connect(Select, selectNode, {
  variant: {
    "Helper?": true,
    "Has Value": "True",
  },

  props: {
    ...sharedProps,

    inputValues: figma.nestedProps("<InputValues>", {
      value: figma.string("Value"),
    }),

    helper: figma.nestedProps("<FormHelperText>", {
      text: figma.string("Value"),
    }),
  },

  example: ({
    label,
    variant,
    size,
    disabled,
    error,
    inputValues,
    displayEmpty,
    helper,
    startAdornment,
  }) => (
    <FormControl
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      fullWidth
    >
      <InputLabel>{label}</InputLabel>
      {/* Check the design: InputValues Presentation=Chips maps toward renderValue / Chip tags. */}
      <Select
        label={label}
        value={inputValues.value}
        displayEmpty={displayEmpty}
        startAdornment={startAdornment}
      >
        <MenuItem value="Option 1">Option 1</MenuItem>
        <MenuItem value="Option 2">Option 2</MenuItem>
      </Select>
      <FormHelperText>{helper.text}</FormHelperText>
    </FormControl>
  ),

  links: [
    {
      name: "MUI Select API",
      url: "https://mui.com/material-ui/api/select/",
    },
  ],
});

figma.connect(Select, selectNode, {
  variant: {
    "Helper?": true,
    "Has Value": "False",
  },

  props: {
    ...sharedProps,

    helper: figma.nestedProps("<FormHelperText>", {
      text: figma.string("Value"),
    }),
  },

  example: ({
    label,
    variant,
    size,
    disabled,
    error,
    displayEmpty,
    helper,
    startAdornment,
  }) => (
    <FormControl
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      fullWidth
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        displayEmpty={displayEmpty}
        startAdornment={startAdornment}
      >
        <MenuItem value="Option 1">Option 1</MenuItem>
        <MenuItem value="Option 2">Option 2</MenuItem>
      </Select>
      <FormHelperText>{helper.text}</FormHelperText>
    </FormControl>
  ),

  links: [
    {
      name: "MUI Select API",
      url: "https://mui.com/material-ui/api/select/",
    },
  ],
});

figma.connect(Select, selectNode, {
  variant: {
    "Helper?": false,
    "Has Value": "True",
  },

  props: {
    ...sharedProps,

    inputValues: figma.nestedProps("<InputValues>", {
      value: figma.string("Value"),
    }),
  },

  example: ({
    label,
    variant,
    size,
    disabled,
    error,
    inputValues,
    displayEmpty,
    startAdornment,
  }) => (
    <FormControl
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      fullWidth
    >
      <InputLabel>{label}</InputLabel>
      {/* Check the design: InputValues Presentation=Chips maps toward renderValue / Chip tags. */}
      <Select
        label={label}
        value={inputValues.value}
        displayEmpty={displayEmpty}
        startAdornment={startAdornment}
      >
        <MenuItem value="Option 1">Option 1</MenuItem>
        <MenuItem value="Option 2">Option 2</MenuItem>
      </Select>
    </FormControl>
  ),

  links: [
    {
      name: "MUI Select API",
      url: "https://mui.com/material-ui/api/select/",
    },
  ],
});

figma.connect(Select, selectNode, {
  variant: {
    "Helper?": false,
    "Has Value": "False",
  },

  props: {
    ...sharedProps,
  },

  example: ({
    label,
    variant,
    size,
    disabled,
    error,
    displayEmpty,
    startAdornment,
  }) => (
    <FormControl
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      fullWidth
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        displayEmpty={displayEmpty}
        startAdornment={startAdornment}
      >
        <MenuItem value="Option 1">Option 1</MenuItem>
        <MenuItem value="Option 2">Option 2</MenuItem>
      </Select>
    </FormControl>
  ),

  links: [
    {
      name: "MUI Select API",
      url: "https://mui.com/material-ui/api/select/",
    },
  ],
});
