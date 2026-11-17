import React from "react";
import { TextField } from "@mui/material";
import figma from "@figma/code-connect";

const textFieldNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6570%3A48313";

// Has Value was removed from the Figma TextField set (aligned with Select, 2026-11-17).
// Value? toggles the Value layer; labels stay outside/shrunk in all variants.

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

  type: figma.boolean("Type: number?", {
    true: "number",
    false: undefined,
  }),

  placeholder: figma.boolean("Placeholder?", {
    true: figma.string("↳ Placeholder"),
    false: undefined,
  }),

  startAdornment: figma.boolean("Adorn. Start?", {
    true: figma.instance("↳ Start Instance"),
    false: undefined,
  }),

  endAdornment: figma.boolean("Adorn. End?", {
    true: figma.instance("↳ End Instance"),
    false: undefined,
  }),
};

const links = [
  {
    name: "MUI TextField API",
    url: "https://mui.com/material-ui/api/text-field/",
  },
];

figma.connect(TextField, textFieldNode, {
  variant: {
    "Helper?": true,
    "Value?": true,
  },

  props: {
    ...sharedProps,

    defaultValue: figma.string("↳ Value"),

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
    type,
    defaultValue,
    placeholder,
    helper,
    startAdornment,
    endAdornment,
  }) => (
    <TextField
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      helperText={helper.text}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
        },
      }}
    />
  ),

  links,
});

figma.connect(TextField, textFieldNode, {
  variant: {
    "Helper?": true,
    "Value?": false,
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
    type,
    placeholder,
    helper,
    startAdornment,
    endAdornment,
  }) => (
    <TextField
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      type={type}
      placeholder={placeholder}
      helperText={helper.text}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
        },
      }}
    />
  ),

  links,
});

figma.connect(TextField, textFieldNode, {
  variant: {
    "Helper?": false,
    "Value?": true,
  },

  props: {
    ...sharedProps,

    defaultValue: figma.string("↳ Value"),
  },

  example: ({
    label,
    variant,
    size,
    disabled,
    error,
    type,
    defaultValue,
    placeholder,
    startAdornment,
    endAdornment,
  }) => (
    <TextField
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
        },
      }}
    />
  ),

  links,
});

figma.connect(TextField, textFieldNode, {
  variant: {
    "Helper?": false,
    "Value?": false,
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
    type,
    placeholder,
    startAdornment,
    endAdornment,
  }) => (
    <TextField
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      type={type}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
        },
      }}
    />
  ),

  links,
});

const multilineNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=7551%3A51690";

// Multiline wraps nested <TextField> instances — Value? / Placeholder? live there.
figma.connect(TextField, multilineNode, {
  props: {
    variant: figma.enum("Variant", {
      Standard: "standard",
      Filled: "filled",
      Outlined: undefined,
    }),

    field: figma.nestedProps("<TextField>", {
      label: figma.string("Label"),

      defaultValue: figma.boolean("Value?", {
        true: figma.string("↳ Value"),
        false: undefined,
      }),

      placeholder: figma.boolean("Placeholder?", {
        true: figma.string("↳ Placeholder"),
        false: undefined,
      }),
    }),

    minRows: figma.boolean("Min Rows", {
      true: figma.enum("Rows", {
        Flexible: undefined,
        "4": 4,
        "6": 6,
        "8": 8,
      }),
      false: undefined,
    }),

    maxRows: figma.boolean("Max Rows", {
      true: figma.enum("Rows", {
        Flexible: undefined,
        "4": 4,
        "6": 6,
        "8": 8,
      }),
      false: undefined,
    }),
  },

  example: ({ variant, field, minRows, maxRows }) => (
    <TextField
      multiline
      label={field.label}
      variant={variant}
      defaultValue={field.defaultValue}
      placeholder={field.placeholder}
      minRows={minRows}
      maxRows={maxRows}
    />
  ),

  links: [
    {
      name: "MUI Multiline TextField",
      url: "https://mui.com/material-ui/react-text-field/#multiline",
    },
  ],
});
