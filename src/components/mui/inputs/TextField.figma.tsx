import React from "react";
import { TextField } from "@mui/material";
import figma from "@figma/code-connect";

const textFieldNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6570%3A48313";

figma.connect(TextField, textFieldNode, {
  variant: {
    "Helper?": true,
  },

  props: {
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

    defaultValue: figma.enum("Has Value", {
      True: figma.boolean("Value?", {
        true: figma.string("↳ Value"),
        false: undefined,
      }),
      False: undefined,
    }),

    placeholder: figma.boolean("Placeholder?", {
      true: figma.string("↳ Placeholder"),
      false: undefined,
    }),

    helper: figma.nestedProps("<FormHelperText>", {
      text: figma.string("Value"),
    }),

    startAdornment: figma.boolean("Adorn. Start?", {
      true: figma.instance("↳ Start Instance"),
      false: undefined,
    }),

    endAdornment: figma.boolean("Adorn. End?", {
      true: figma.instance("↳ End Instance"),
      false: undefined,
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

  links: [
    {
      name: "MUI TextField API",
      url: "https://mui.com/material-ui/api/text-field/",
    },
  ],
});

figma.connect(TextField, textFieldNode, {
  variant: {
    "Helper?": false,
  },

  props: {
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

    defaultValue: figma.enum("Has Value", {
      True: figma.boolean("Value?", {
        true: figma.string("↳ Value"),
        false: undefined,
      }),
      False: undefined,
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

  links: [
    {
      name: "MUI TextField API",
      url: "https://mui.com/material-ui/api/text-field/",
    },
  ],
});

const multilineNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=7551%3A51690";

figma.connect(TextField, multilineNode, {
  props: {
    variant: figma.enum("Variant", {
      Standard: "standard",
      Filled: "filled",
      Outlined: undefined,
    }),

    field: figma.nestedProps("<TextField>", {
      label: figma.string("Label"),

      defaultValue: figma.enum("Has Value", {
        True: figma.boolean("Value?", {
          true: figma.string("↳ Value"),
          false: undefined,
        }),
        False: undefined,
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
