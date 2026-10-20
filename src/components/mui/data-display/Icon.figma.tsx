// src/components/mui/data-display/Icon.figma.tsx
import React from "react";
import Icon from "@mui/material/Icon";
import SvgIcon from "@mui/material/SvgIcon";
import figma from "@figma/code-connect";

const figmaNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6594%3A47648";

// SVG instance swaps resolve through the generated IconCatalog mappings. Restrict
// this mapping to Medium because Code Connect cannot pass the wrapper's Size prop
// into an arbitrary swapped React component without generating misleading JSX.
// Color is intentionally not filtered or emitted. It exists so a parent can recolor
// the glyph in Figma without a fill override; MUI inherits that color from the parent.
figma.connect(SvgIcon, figmaNode, {
  variant: {
    Type: "SVG Icon",
    Size: "Medium",
  },

  // The example forwards the swapped icon directly, so do not emit an unused
  // relative SvgIcon import. The nested catalog mapping supplies its own import.
  imports: [],

  props: {
    icon: figma.instance("Icon Instance"),
  },

  // A fragment is required: returning the intrinsic directly parses but drops
  // it from nested parent snippets.
  example: ({ icon }) => <>{icon}</>,

  links: [
    {
      name: "MUI Material Icons",
      url: "https://mui.com/material-ui/material-icons/",
    },
  ],
});

// Font icons carry a real ligature string, so all Figma sizes map cleanly.
// Color is omitted here too. A parent IconButton supplies it in Figma, and MUI
// inherits the button color rather than setting it on the icon.
figma.connect(Icon, figmaNode, {
  variant: {
    Type: "Font Icon",
  },

  props: {
    fontSize: figma.enum("Size", {
      Small: "small",
      Medium: undefined,
      Large: "large",
      Inherit: "inherit",
    }),

    children: figma.string("Icon name"),
  },

  example: ({ fontSize, children }) => (
    <Icon baseClassName="material-symbols-rounded" fontSize={fontSize}>
      {/* Requires the Material Symbols Rounded font stylesheet. Prefer a mapped SVG icon import when available. */}
      {children}
    </Icon>
  ),

  links: [
    {
      name: "MUI Icon",
      url: "https://mui.com/material-ui/icons/",
    },
  ],
});
