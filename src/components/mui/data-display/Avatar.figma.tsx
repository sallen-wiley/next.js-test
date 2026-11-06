import React from "react";
import { Avatar } from "@mui/material";
import figma from "@figma/code-connect";

const avatarNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6587%3A47403";

// Icon content: design locks Avatar Size ↔ nested Icon Size
// (40→Large/35, 32→Medium/24, 24→Small/20, 18→Inherit/16).
// Snippets treat Avatar as the size authority: emit box size + fontSize, nest
// the icon for glyph identity, and prefer fontSize="inherit" on the icon so it
// follows Avatar. Nested SVG Code Connect still only resolves at Medium; Font
// Icon may still emit its own Size token, which matches these pixel sizes.

figma.connect(Avatar, avatarNode, {
  variant: {
    Content: "Icon",
    Size: "40px",
  },

  props: {
    variant: figma.enum("Variant", {
      Circular: undefined,
      Rounded: "rounded",
      Square: "square",
    }),
    children: figma.children("<Icon>"),
  },

  example: ({ variant, children }) => (
    <Avatar variant={variant} sx={{ fontSize: 35 }}>
      {/* Check the design: use fontSize="inherit" on the icon so it follows Avatar fontSize (35 / large). */}
      {children}
    </Avatar>
  ),

  links: [
    {
      name: "MUI Avatar API",
      url: "https://mui.com/material-ui/api/avatar/",
    },
  ],
});

figma.connect(Avatar, avatarNode, {
  variant: {
    Content: "Icon",
    Size: "32px",
  },

  props: {
    variant: figma.enum("Variant", {
      Circular: undefined,
      Rounded: "rounded",
      Square: "square",
    }),
    children: figma.children("<Icon>"),
  },

  example: ({ variant, children }) => (
    <Avatar
      variant={variant}
      sx={{ width: 32, height: 32, fontSize: 24 }}
    >
      {/* Check the design: use fontSize="inherit" on the icon so it follows Avatar fontSize (24 / medium). */}
      {children}
    </Avatar>
  ),

  links: [
    {
      name: "MUI Avatar API",
      url: "https://mui.com/material-ui/api/avatar/",
    },
  ],
});

figma.connect(Avatar, avatarNode, {
  variant: {
    Content: "Icon",
    Size: "24px",
  },

  props: {
    variant: figma.enum("Variant", {
      Circular: undefined,
      Rounded: "rounded",
      Square: "square",
    }),
    children: figma.children("<Icon>"),
  },

  example: ({ variant, children }) => (
    <Avatar
      variant={variant}
      sx={{ width: 24, height: 24, fontSize: 20 }}
    >
      {/* Check the design: use fontSize="inherit" on the icon so it follows Avatar fontSize (20 / small). */}
      {children}
    </Avatar>
  ),

  links: [
    {
      name: "MUI Avatar API",
      url: "https://mui.com/material-ui/api/avatar/",
    },
  ],
});

figma.connect(Avatar, avatarNode, {
  variant: {
    Content: "Icon",
    Size: "18px",
  },

  props: {
    variant: figma.enum("Variant", {
      Circular: undefined,
      Rounded: "rounded",
      Square: "square",
    }),
    children: figma.children("<Icon>"),
  },

  example: ({ variant, children }) => (
    <Avatar
      variant={variant}
      sx={{ width: 18, height: 18, fontSize: 16 }}
    >
      {/* Check the design: use fontSize="inherit" on the icon so it follows Avatar fontSize (16). */}
      {children}
    </Avatar>
  ),

  links: [
    {
      name: "MUI Avatar API",
      url: "https://mui.com/material-ui/api/avatar/",
    },
  ],
});

figma.connect(Avatar, avatarNode, {
  variant: {
    Content: "Text",
  },

  props: {
    variant: figma.enum("Variant", {
      Circular: undefined,
      Rounded: "rounded",
      Square: "square",
    }),

    sx: figma.enum("Size", {
      "40px": undefined,
      "32px": { width: 32, height: 32 },
      "24px": { width: 24, height: 24 },
      "18px": { width: 18, height: 18 },
    }),

    children: figma.string("Initials"),
  },

  example: ({ variant, sx, children }) => (
    <Avatar variant={variant} sx={sx}>
      {children}
    </Avatar>
  ),

  links: [
    {
      name: "MUI Avatar API",
      url: "https://mui.com/material-ui/api/avatar/",
    },
  ],
});

figma.connect(Avatar, avatarNode, {
  variant: {
    Content: "Image",
  },

  props: {
    variant: figma.enum("Variant", {
      Circular: undefined,
      Rounded: "rounded",
      Square: "square",
    }),

    sx: figma.enum("Size", {
      "40px": undefined,
      "32px": { width: 32, height: 32 },
      "24px": { width: 24, height: 24 },
      "18px": { width: 18, height: 18 },
    }),
  },

  example: ({ variant, sx }) => (
    <Avatar variant={variant} sx={sx} src="/path/to/image.jpg" alt="" />
  ),

  links: [
    {
      name: "MUI Avatar API",
      url: "https://mui.com/material-ui/api/avatar/",
    },
  ],
});
