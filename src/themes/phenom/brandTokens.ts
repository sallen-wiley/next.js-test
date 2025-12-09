// Design Tokens extracted from design-tokens.tokens.json
// Complete token system for the Figma MCP Component Library

export const designTokens = {
  // FONT TOKENS
  font: {
    breadcrumb: {
      regular: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        textCase: "uppercase",
      },
      hover: {
        fontSize: 14,
        textDecoration: "underline",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        textCase: "uppercase",
      },
      bold: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        textCase: "uppercase",
      },
    },
    title: {
      hero: {
        fontSize: 30,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 40,
        textCase: "none",
      },
      primary: {
        fontSize: 20,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 28,
        textCase: "none",
      },
      small: {
        fontSize: 16,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 24,
        textCase: "none",
      },
      smallUppercase: {
        fontSize: 16,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 600,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 24,
        textCase: "uppercase",
      },
    },
    button: {
      large: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "uppercase",
      },
      small: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "capitalize",
      },
      tertiaryNavigation: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "capitalize",
      },
      tertiaryRegular: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 600,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "capitalize",
      },
      link: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 600,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "none",
      },
    },
    label: {
      small: {
        fontSize: 11,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 12,
        textCase: "uppercase",
      },
      bold: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        textCase: "none",
      },
      regular: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        textCase: "none",
      },
      boldSidebar: {
        fontSize: 12,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        textCase: "capitalize",
      },
    },
    paragraph: {
      primary: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        paragraphSpacing: 8,
        textCase: "none",
      },
      message: {
        fontSize: 12,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 16,
        paragraphSpacing: 6,
        textCase: "none",
      },
      placeholder: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "italic",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "none",
      },
      bold: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        paragraphSpacing: 8,
        textCase: "none",
      },
      superscript: {
        fontSize: 15,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "none",
      },
    },
    indicator: {
      medium: {
        fontSize: 10,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 600,
        fontStyle: "normal",
        letterSpacing: -0.6,
        lineHeight: 14,
        textCase: "uppercase",
      },
      small: {
        fontSize: 9,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 600,
        fontStyle: "normal",
        letterSpacing: -0.2,
        lineHeight: 12,
        textCase: "uppercase",
      },
    },
    tables: {
      title: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "none",
      },
      dataRegular: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "none",
      },
      dataBold: {
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 20,
        textCase: "none",
      },
      dataSecondary: {
        fontSize: 12,
        textDecoration: "none",
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 18,
        textCase: "none",
      },
    },
  },

  // EFFECT TOKENS (Shadows)
  effect: {
    modal: {
      shadowType: "dropShadow",
      radius: 10,
      color: "#242424cc",
      offsetX: 0,
      offsetY: 1,
      spread: 0,
    },
    cardHover: {
      shadowType: "dropShadow",
      radius: 6,
      color: "#8d8d8d33",
      offsetX: 3,
      offsetY: 3,
      spread: 0,
    },
    backgroundCard: {
      shadowType: "dropShadow",
      radius: 8,
      color: "#3333331c",
      offsetX: 0,
      offsetY: 4,
      spread: 0,
    },
    stickyHeader: {
      shadowType: "dropShadow",
      radius: 16,
      color: "#00000014",
      offsetX: 0,
      offsetY: 6,
      spread: 0,
    },
    stickyFooter: {
      shadowType: "dropShadow",
      radius: 16,
      color: "#00000014",
      offsetX: 0,
      offsetY: -6,
      spread: 0,
    },
  },

  // COLOR PRIMITIVES
  colorPrimitives: {
    primary: {
      blue: {
        5: "#f3f8f9", // 5%
        10: "#e7f1f3", // 10%
        20: "#cee3e7", // 20%
        40: "#9dc7cf", // 40%
        60: "#6cabb8", // 60%
        80: "#3b8fa0", // 80%
        100: "#0A7388", // 100%
        "100-8": "#0A738814", // 8% opacity
        "100-15": "#0A738826", // 15% opacity
      },
      darkBlue: {
        5: "#f2f6f7", // 5%
        10: "#e6edee", // 10%
        20: "#cddbdd", // 20%
        40: "#9ab7bc", // 40%
        60: "#68929a", // 60%
        80: "#356e79", // 80%
        100: "#034A57", // 100%
      },
      green: {
        5: "#f7faf5",
        10: "#eef6ec",
        20: "#ddecd8",
        40: "#bbd9b1",
        60: "#9ac68b",
        80: "#78b364",
        100: "#56A03D",
      },
      darkGreen: {
        5: "#f5f7f4",
        10: "#ebf0ea",
        20: "#d6e0d5",
        40: "#adc2aa",
        60: "#84a380",
        80: "#5b8555",
        100: "#32662B",
      },
    },
    secondary: {
      turquoise: {
        5: "#f4fdfb",
        10: "#e8fbf7",
        20: "#d1f6ef",
        40: "#a4edde",
        60: "#76e4ce",
        80: "#49dbbd",
        100: "#1bd2ad",
      },
      brightBlue: {
        5: "#f3f8fd",
        10: "#e6f1fb",
        20: "#cde4f6",
        40: "#9bc8ed",
        60: "#69ade5",
        80: "#3791dc",
        100: "#0576d3",
      },
      skyBlue: {
        5: "#f7fcfe",
        10: "#eff9fc",
        20: "#def3fa",
        40: "#bde7f4",
        60: "#9cdcef",
        80: "#7bd0e9",
        100: "#5ac4e4",
      },
      yellow: {
        5: "#fffcf7",
        10: "#fffaef",
        20: "#fff4de",
        40: "#ffeabd",
        60: "#ffdf9d",
        80: "#ffd57c",
        100: "#ffca5b",
      },
      orange: {
        5: "#fff9f3",
        10: "#fff3e7",
        20: "#fee8cf",
        40: "#fdd09f",
        60: "#fcb96f",
        80: "#fba13f",
        100: "#fa8a0f",
      },
      warmRed: {
        5: "#fff7f6",
        10: "#ffeeed",
        20: "#ffddd a",
        40: "#ffbbb5",
        60: "#ff9991",
        80: "#ff776c",
        100: "#ff5547",
      },
    },
    system: {
      successGreen: {
        5: "#f9fcf5",
        10: "#f2f8ec",
        20: "#e6f1d9",
        40: "#cde3b3",
        60: "#b3d68c",
        80: "#9ac866",
        100: "#81ba40",
      },
      successDarkGreen: {
        5: "#f8fbf5",
        10: "#f1f6eb",
        20: "#e3edd8",
        40: "#c7dcb0",
        60: "#acca89",
        80: "#90b961",
        100: "#74a73a",
      },
      errorRed: {
        5: "#fdf2f4",
        10: "#fae6e8",
        20: "#f6ccd1",
        40: "#ec9aa4",
        60: "#e36776",
        80: "#d93549",
        100: "#d0021b",
      },
      alertYellow: {
        5: "#fffbf4",
        10: "#fff8e9",
        20: "#fef0d3",
        40: "#fee2a7",
        60: "#fdd37c",
        80: "#fdc550",
        100: "#fcb624",
      },
      alertDarkYellow: {
        5: "#fffaf3",
        10: "#fef5e7",
        20: "#feebcf",
        40: "#fcd89f",
        60: "#fbc470",
        80: "#f9b140",
        100: "#f89d10",
      },
    },
    neutral: {
      white: "#ffffff",
      grey10: "#fafafa",
      grey20: "#f5f5f5",
      grey30: "#e0e0e0",
      grey40: "#bdbdbd",
      "grey40-25": "#bdbdbd40",
      "grey40-45": "#bdbdbd73",
      grey50: "#919191",
      grey60: "#686868",
      grey70: "#4f4f4f",
      grey80: "#333333",
      grey90: "#1a1a1a",
    },
    tableRows: {
      default: "#ffffff",
      hover: "#f5f5f5",
    },
    links: {
      get default() {
        return designTokens.colorPrimitives.primary.blue[100];
      },
      get hover() {
        return designTokens.colorPrimitives.primary.darkBlue[100];
      },
    },
    overlay: {
      "white-80": "#ffffffcc",
      "black-70": "#4f4f4fb3",
    },
    buttons: {
      // Map button colors to the canonical color primitives from the palette
      get primaryDefault() {
        return designTokens.colorPrimitives.system.successGreen[100];
      },
      get primaryHover() {
        return designTokens.colorPrimitives.system.successDarkGreen[100];
      },
      // pressed state uses a slightly darker success shade (fallback to an available primitive)
      get primaryPressed() {
        return designTokens.colorPrimitives.system.successDarkGreen[80];
      },
      get secondaryDefault() {
        return designTokens.colorPrimitives.neutral.grey70;
      },
      get secondaryHover() {
        return designTokens.colorPrimitives.neutral.grey80;
      },
      get secondaryPressed() {
        return designTokens.colorPrimitives.neutral.grey90;
      },
      get tertiaryBlueDefault() {
        return designTokens.colorPrimitives.primary.blue[100];
      },
      get tertiaryBlueHover() {
        return designTokens.colorPrimitives.primary.darkBlue[100];
      },
      get tertiaryBluePressed() {
        return designTokens.colorPrimitives.primary.darkBlue[100];
      },
      get tertiaryBlueHoverBg() {
        return designTokens.colorPrimitives.primary.blue["100-8"];
      },
      get tertiaryBluePressedBg() {
        return designTokens.colorPrimitives.primary.blue["100-15"];
      },
      // Tertiary grey button colors mapped to neutral palette
      get tertiaryGreyDefault() {
        return designTokens.colorPrimitives.neutral.grey70;
      },
      get tertiaryGreyHover() {
        return designTokens.colorPrimitives.neutral.grey80;
      },
      get tertiaryGreyPressed() {
        return designTokens.colorPrimitives.neutral.grey80;
      },
      // Use existing semi-transparent variants derived from grey40
      get tertiaryGreyHoverBg() {
        return designTokens.colorPrimitives.neutral["grey40-25"];
      },
      get tertiaryGreyPressedBg() {
        return designTokens.colorPrimitives.neutral["grey40-45"];
      },
      get tertiaryDisabled() {
        return designTokens.colorPrimitives.neutral.grey50;
      },
      // Icon button colors (reuse tertiary colors for consistency)
      get iconPrimaryDefault() {
        return designTokens.colorPrimitives.primary.blue[100];
      },
      get iconPrimaryHoverBg() {
        return designTokens.colorPrimitives.primary.blue["100-8"];
      },
      get iconPrimaryPressedBg() {
        return designTokens.colorPrimitives.primary.blue["100-15"];
      },
      get iconSecondaryDefault() {
        return designTokens.colorPrimitives.neutral.grey70;
      },
      get iconSecondaryHoverBg() {
        return designTokens.colorPrimitives.neutral["grey40-25"];
      },
      get iconSecondaryPressedBg() {
        return designTokens.colorPrimitives.neutral["grey40-45"];
      },
      get iconDisabled() {
        return designTokens.colorPrimitives.neutral.grey50;
      },
    },
    inputs: {
      get default() {
        return designTokens.colorPrimitives.primary.blue[100];
      },
      get hover() {
        return designTokens.colorPrimitives.primary.darkBlue[100];
      },
      get onDisabled() {
        return designTokens.colorPrimitives.primary.blue[40];
      },
    },
    alerts: {
      error: "#d0021b",
      attention: "#fa8a0f",
      success: "#74a73a",
    },
  },

  // PRIMITIVES
  primitives: {
    spacer: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 44,
      12: 48,
      13: 52,
      14: 56,
      15: 60,
      16: 64,
    },
    radius: {
      zero: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 10,
      xxl: 12,
    },
    lineHeight: {
      3: 12,
      4: 16,
      "4-5": 18,
      5: 20,
      6: 24,
      7: 28,
      10: 40,
    },
    textVariables: {
      manuscriptTitle:
        "A Key Major Guideline for Engineering Bioactive Multicomponent Nanofunctionalization for Biomedicine and Other Applications: Fundamental Models Confirmed by Both Direct and Indirect Evidence",
    },
  },

  // FONTS
  fonts: {
    type: {
      fontFamily: "Open Sans",
      number: 0,
    },
  },
};

// CSS Custom Properties generated from design tokens
export const cssCustomProperties = `
  :root {
    /* Font Tokens */
    --font-breadcrumb-regular-size: ${designTokens.font.breadcrumb.regular.fontSize}px;
    --font-breadcrumb-regular-weight: ${designTokens.font.breadcrumb.regular.fontWeight};
    --font-breadcrumb-regular-family: '${designTokens.font.breadcrumb.regular.fontFamily}', sans-serif;
    --font-breadcrumb-regular-line-height: ${designTokens.font.breadcrumb.regular.lineHeight}px;
    --font-breadcrumb-regular-case: ${designTokens.font.breadcrumb.regular.textCase};
    
    --font-breadcrumb-hover-size: ${designTokens.font.breadcrumb.hover.fontSize}px;
    --font-breadcrumb-hover-weight: ${designTokens.font.breadcrumb.hover.fontWeight};
    --font-breadcrumb-hover-family: '${designTokens.font.breadcrumb.hover.fontFamily}', sans-serif;
    --font-breadcrumb-hover-line-height: ${designTokens.font.breadcrumb.hover.lineHeight}px;
    --font-breadcrumb-hover-case: ${designTokens.font.breadcrumb.hover.textCase};
    --font-breadcrumb-hover-decoration: ${designTokens.font.breadcrumb.hover.textDecoration};
    
    --font-breadcrumb-bold-size: ${designTokens.font.breadcrumb.bold.fontSize}px;
    --font-breadcrumb-bold-weight: ${designTokens.font.breadcrumb.bold.fontWeight};
    --font-breadcrumb-bold-family: '${designTokens.font.breadcrumb.bold.fontFamily}', sans-serif;
    --font-breadcrumb-bold-line-height: ${designTokens.font.breadcrumb.bold.lineHeight}px;
    --font-breadcrumb-bold-case: ${designTokens.font.breadcrumb.bold.textCase};
    
    --font-title-hero-size: ${designTokens.font.title.hero.fontSize}px;
    --font-title-hero-weight: ${designTokens.font.title.hero.fontWeight};
    --font-title-hero-family: '${designTokens.font.title.hero.fontFamily}', sans-serif;
    --font-title-hero-line-height: ${designTokens.font.title.hero.lineHeight}px;
    --font-title-hero-case: ${designTokens.font.title.hero.textCase};
    
    --font-title-primary-size: ${designTokens.font.title.primary.fontSize}px;
    --font-title-primary-weight: ${designTokens.font.title.primary.fontWeight};
    --font-title-primary-family: '${designTokens.font.title.primary.fontFamily}', sans-serif;
    --font-title-primary-line-height: ${designTokens.font.title.primary.lineHeight}px;
    --font-title-primary-case: ${designTokens.font.title.primary.textCase};
    
    --font-title-small-size: ${designTokens.font.title.small.fontSize}px;
    --font-title-small-weight: ${designTokens.font.title.small.fontWeight};
    --font-title-small-family: '${designTokens.font.title.small.fontFamily}', sans-serif;
    --font-title-small-line-height: ${designTokens.font.title.small.lineHeight}px;
    --font-title-small-case: ${designTokens.font.title.small.textCase};
    
    --font-title-small-uppercase-size: ${designTokens.font.title.smallUppercase.fontSize}px;
    --font-title-small-uppercase-weight: ${designTokens.font.title.smallUppercase.fontWeight};
    --font-title-small-uppercase-family: '${designTokens.font.title.smallUppercase.fontFamily}', sans-serif;
    --font-title-small-uppercase-line-height: ${designTokens.font.title.smallUppercase.lineHeight}px;
    --font-title-small-uppercase-case: ${designTokens.font.title.smallUppercase.textCase};
    
    --font-button-large-size: ${designTokens.font.button.large.fontSize}px;
    --font-button-large-weight: ${designTokens.font.button.large.fontWeight};
    --font-button-large-family: '${designTokens.font.button.large.fontFamily}', sans-serif;
    --font-button-large-line-height: ${designTokens.font.button.large.lineHeight}px;
    --font-button-large-case: ${designTokens.font.button.large.textCase};
    
    --font-button-small-size: ${designTokens.font.button.small.fontSize}px;
    --font-button-small-weight: ${designTokens.font.button.small.fontWeight};
    --font-button-small-family: '${designTokens.font.button.small.fontFamily}', sans-serif;
    --font-button-small-line-height: ${designTokens.font.button.small.lineHeight}px;
    --font-button-small-case: ${designTokens.font.button.small.textCase};
    
    --font-button-tertiary-navigation-size: ${designTokens.font.button.tertiaryNavigation.fontSize}px;
    --font-button-tertiary-navigation-weight: ${designTokens.font.button.tertiaryNavigation.fontWeight};
    --font-button-tertiary-navigation-family: '${designTokens.font.button.tertiaryNavigation.fontFamily}', sans-serif;
    --font-button-tertiary-navigation-line-height: ${designTokens.font.button.tertiaryNavigation.lineHeight}px;
    --font-button-tertiary-navigation-case: ${designTokens.font.button.tertiaryNavigation.textCase};
    
    --font-button-tertiary-regular-size: ${designTokens.font.button.tertiaryRegular.fontSize}px;
    --font-button-tertiary-regular-weight: ${designTokens.font.button.tertiaryRegular.fontWeight};
    --font-button-tertiary-regular-family: '${designTokens.font.button.tertiaryRegular.fontFamily}', sans-serif;
    --font-button-tertiary-regular-line-height: ${designTokens.font.button.tertiaryRegular.lineHeight}px;
    --font-button-tertiary-regular-case: ${designTokens.font.button.tertiaryRegular.textCase};
    
    --font-button-link-size: ${designTokens.font.button.link.fontSize}px;
    --font-button-link-weight: ${designTokens.font.button.link.fontWeight};
    --font-button-link-family: '${designTokens.font.button.link.fontFamily}', sans-serif;
    --font-button-link-line-height: ${designTokens.font.button.link.lineHeight}px;
    --font-button-link-case: ${designTokens.font.button.link.textCase};
    
    --font-label-small-size: ${designTokens.font.label.small.fontSize}px;
    --font-label-small-weight: ${designTokens.font.label.small.fontWeight};
    --font-label-small-family: '${designTokens.font.label.small.fontFamily}', sans-serif;
    --font-label-small-line-height: ${designTokens.font.label.small.lineHeight}px;
    --font-label-small-case: ${designTokens.font.label.small.textCase};
    
    --font-label-bold-size: ${designTokens.font.label.bold.fontSize}px;
    --font-label-bold-weight: ${designTokens.font.label.bold.fontWeight};
    --font-label-bold-family: '${designTokens.font.label.bold.fontFamily}', sans-serif;
    --font-label-bold-line-height: ${designTokens.font.label.bold.lineHeight}px;
    --font-label-bold-case: ${designTokens.font.label.bold.textCase};
    
    --font-label-regular-size: ${designTokens.font.label.regular.fontSize}px;
    --font-label-regular-weight: ${designTokens.font.label.regular.fontWeight};
    --font-label-regular-family: '${designTokens.font.label.regular.fontFamily}', sans-serif;
    --font-label-regular-line-height: ${designTokens.font.label.regular.lineHeight}px;
    --font-label-regular-case: ${designTokens.font.label.regular.textCase};
    
    --font-label-bold-sidebar-size: ${designTokens.font.label.boldSidebar.fontSize}px;
    --font-label-bold-sidebar-weight: ${designTokens.font.label.boldSidebar.fontWeight};
    --font-label-bold-sidebar-family: '${designTokens.font.label.boldSidebar.fontFamily}', sans-serif;
    --font-label-bold-sidebar-line-height: ${designTokens.font.label.boldSidebar.lineHeight}px;
    --font-label-bold-sidebar-case: ${designTokens.font.label.boldSidebar.textCase};
    
    --font-paragraph-primary-size: ${designTokens.font.paragraph.primary.fontSize}px;
    --font-paragraph-primary-weight: ${designTokens.font.paragraph.primary.fontWeight};
    --font-paragraph-primary-family: '${designTokens.font.paragraph.primary.fontFamily}', sans-serif;
    --font-paragraph-primary-line-height: ${designTokens.font.paragraph.primary.lineHeight}px;
    --font-paragraph-primary-case: ${designTokens.font.paragraph.primary.textCase};
    --font-paragraph-primary-spacing: ${designTokens.font.paragraph.primary.paragraphSpacing}px;
    
    --font-paragraph-message-size: ${designTokens.font.paragraph.message.fontSize}px;
    --font-paragraph-message-weight: ${designTokens.font.paragraph.message.fontWeight};
    --font-paragraph-message-family: '${designTokens.font.paragraph.message.fontFamily}', sans-serif;
    --font-paragraph-message-line-height: ${designTokens.font.paragraph.message.lineHeight}px;
    --font-paragraph-message-case: ${designTokens.font.paragraph.message.textCase};
    --font-paragraph-message-spacing: ${designTokens.font.paragraph.message.paragraphSpacing}px;
    
    --font-paragraph-placeholder-size: ${designTokens.font.paragraph.placeholder.fontSize}px;
    --font-paragraph-placeholder-weight: ${designTokens.font.paragraph.placeholder.fontWeight};
    --font-paragraph-placeholder-family: '${designTokens.font.paragraph.placeholder.fontFamily}', sans-serif;
    --font-paragraph-placeholder-line-height: ${designTokens.font.paragraph.placeholder.lineHeight}px;
    --font-paragraph-placeholder-case: ${designTokens.font.paragraph.placeholder.textCase};
    --font-paragraph-placeholder-style: ${designTokens.font.paragraph.placeholder.fontStyle};
    
    --font-paragraph-bold-size: ${designTokens.font.paragraph.bold.fontSize}px;
    --font-paragraph-bold-weight: ${designTokens.font.paragraph.bold.fontWeight};
    --font-paragraph-bold-family: '${designTokens.font.paragraph.bold.fontFamily}', sans-serif;
    --font-paragraph-bold-line-height: ${designTokens.font.paragraph.bold.lineHeight}px;
    --font-paragraph-bold-case: ${designTokens.font.paragraph.bold.textCase};
    --font-paragraph-bold-spacing: ${designTokens.font.paragraph.bold.paragraphSpacing}px;
    
    --font-paragraph-superscript-size: ${designTokens.font.paragraph.superscript.fontSize}px;
    --font-paragraph-superscript-weight: ${designTokens.font.paragraph.superscript.fontWeight};
    --font-paragraph-superscript-family: '${designTokens.font.paragraph.superscript.fontFamily}', sans-serif;
    --font-paragraph-superscript-line-height: ${designTokens.font.paragraph.superscript.lineHeight}px;
    --font-paragraph-superscript-case: ${designTokens.font.paragraph.superscript.textCase};
    
    --font-indicator-medium-size: ${designTokens.font.indicator.medium.fontSize}px;
    --font-indicator-medium-weight: ${designTokens.font.indicator.medium.fontWeight};
    --font-indicator-medium-family: '${designTokens.font.indicator.medium.fontFamily}', sans-serif;
    --font-indicator-medium-line-height: ${designTokens.font.indicator.medium.lineHeight}px;
    --font-indicator-medium-case: ${designTokens.font.indicator.medium.textCase};
    --font-indicator-medium-spacing: ${designTokens.font.indicator.medium.letterSpacing}px;
    
    --font-indicator-small-size: ${designTokens.font.indicator.small.fontSize}px;
    --font-indicator-small-weight: ${designTokens.font.indicator.small.fontWeight};
    --font-indicator-small-family: '${designTokens.font.indicator.small.fontFamily}', sans-serif;
    --font-indicator-small-line-height: ${designTokens.font.indicator.small.lineHeight}px;
    --font-indicator-small-case: ${designTokens.font.indicator.small.textCase};
    --font-indicator-small-spacing: ${designTokens.font.indicator.small.letterSpacing}px;
    
    --font-table-title-size: ${designTokens.font.tables.title.fontSize}px;
    --font-table-title-weight: ${designTokens.font.tables.title.fontWeight};
    --font-table-title-family: '${designTokens.font.tables.title.fontFamily}', sans-serif;
    --font-table-title-line-height: ${designTokens.font.tables.title.lineHeight}px;
    --font-table-title-case: ${designTokens.font.tables.title.textCase};
    
    --font-table-data-regular-size: ${designTokens.font.tables.dataRegular.fontSize}px;
    --font-table-data-regular-weight: ${designTokens.font.tables.dataRegular.fontWeight};
    --font-table-data-regular-family: '${designTokens.font.tables.dataRegular.fontFamily}', sans-serif;
    --font-table-data-regular-line-height: ${designTokens.font.tables.dataRegular.lineHeight}px;
    --font-table-data-regular-case: ${designTokens.font.tables.dataRegular.textCase};
    
    --font-table-data-bold-size: ${designTokens.font.tables.dataBold.fontSize}px;
    --font-table-data-bold-weight: ${designTokens.font.tables.dataBold.fontWeight};
    --font-table-data-bold-family: '${designTokens.font.tables.dataBold.fontFamily}', sans-serif;
    --font-table-data-bold-line-height: ${designTokens.font.tables.dataBold.lineHeight}px;
    --font-table-data-bold-case: ${designTokens.font.tables.dataBold.textCase};
    
    --font-table-data-secondary-size: ${designTokens.font.tables.dataSecondary.fontSize}px;
    --font-table-data-secondary-weight: ${designTokens.font.tables.dataSecondary.fontWeight};
    --font-table-data-secondary-family: '${designTokens.font.tables.dataSecondary.fontFamily}', sans-serif;
    --font-table-data-secondary-line-height: ${designTokens.font.tables.dataSecondary.lineHeight}px;
    --font-table-data-secondary-case: ${designTokens.font.tables.dataSecondary.textCase};

    /* Effect Tokens (Shadows) */
    --effect-modal: ${designTokens.effect.modal.offsetX}px ${designTokens.effect.modal.offsetY}px ${designTokens.effect.modal.radius}px ${designTokens.effect.modal.spread}px ${designTokens.effect.modal.color};
    --effect-card-hover: ${designTokens.effect.cardHover.offsetX}px ${designTokens.effect.cardHover.offsetY}px ${designTokens.effect.cardHover.radius}px ${designTokens.effect.cardHover.spread}px ${designTokens.effect.cardHover.color};
    --effect-background-card: ${designTokens.effect.backgroundCard.offsetX}px ${designTokens.effect.backgroundCard.offsetY}px ${designTokens.effect.backgroundCard.radius}px ${designTokens.effect.backgroundCard.spread}px ${designTokens.effect.backgroundCard.color};
    --effect-sticky-header: ${designTokens.effect.stickyHeader.offsetX}px ${designTokens.effect.stickyHeader.offsetY}px ${designTokens.effect.stickyHeader.radius}px ${designTokens.effect.stickyHeader.spread}px ${designTokens.effect.stickyHeader.color};
    --effect-sticky-footer: ${designTokens.effect.stickyFooter.offsetX}px ${designTokens.effect.stickyFooter.offsetY}px ${designTokens.effect.stickyFooter.radius}px ${designTokens.effect.stickyFooter.spread}px ${designTokens.effect.stickyFooter.color};

    /* Color Primitives */
    --color-primary-blue-5: ${designTokens.colorPrimitives.primary.blue[5]};
    --color-primary-blue-10: ${designTokens.colorPrimitives.primary.blue[10]};
    --color-primary-blue-20: ${designTokens.colorPrimitives.primary.blue[20]};
    --color-primary-blue-40: ${designTokens.colorPrimitives.primary.blue[40]};
    --color-primary-blue-60: ${designTokens.colorPrimitives.primary.blue[60]};
    --color-primary-blue-80: ${designTokens.colorPrimitives.primary.blue[80]};
    --color-primary-blue-100: ${designTokens.colorPrimitives.primary.blue[100]};
    --color-primary-blue-100-8: ${designTokens.colorPrimitives.primary.blue["100-8"]};
    --color-primary-blue-100-15: ${designTokens.colorPrimitives.primary.blue["100-15"]};
    
    --color-primary-dark-blue-5: ${designTokens.colorPrimitives.primary.darkBlue[5]};
    --color-primary-dark-blue-10: ${designTokens.colorPrimitives.primary.darkBlue[10]};
    --color-primary-dark-blue-20: ${designTokens.colorPrimitives.primary.darkBlue[20]};
    --color-primary-dark-blue-40: ${designTokens.colorPrimitives.primary.darkBlue[40]};
    --color-primary-dark-blue-60: ${designTokens.colorPrimitives.primary.darkBlue[60]};
    --color-primary-dark-blue-80: ${designTokens.colorPrimitives.primary.darkBlue[80]};
    --color-primary-dark-blue-100: ${designTokens.colorPrimitives.primary.darkBlue[100]};
    
    --color-primary-green-5: ${designTokens.colorPrimitives.primary.green[5]};
    --color-primary-green-10: ${designTokens.colorPrimitives.primary.green[10]};
    --color-primary-green-20: ${designTokens.colorPrimitives.primary.green[20]};
    --color-primary-green-40: ${designTokens.colorPrimitives.primary.green[40]};
    --color-primary-green-60: ${designTokens.colorPrimitives.primary.green[60]};
    --color-primary-green-80: ${designTokens.colorPrimitives.primary.green[80]};
    --color-primary-green-100: ${designTokens.colorPrimitives.primary.green[100]};
    
    --color-primary-dark-green-5: ${designTokens.colorPrimitives.primary.darkGreen[5]};
    --color-primary-dark-green-10: ${designTokens.colorPrimitives.primary.darkGreen[10]};
    --color-primary-dark-green-20: ${designTokens.colorPrimitives.primary.darkGreen[20]};
    --color-primary-dark-green-40: ${designTokens.colorPrimitives.primary.darkGreen[40]};
    --color-primary-dark-green-60: ${designTokens.colorPrimitives.primary.darkGreen[60]};
    --color-primary-dark-green-80: ${designTokens.colorPrimitives.primary.darkGreen[80]};
    --color-primary-dark-green-100: ${designTokens.colorPrimitives.primary.darkGreen[100]};

    --color-secondary-turquoise-5: ${designTokens.colorPrimitives.secondary.turquoise[5]};
    --color-secondary-turquoise-10: ${designTokens.colorPrimitives.secondary.turquoise[10]};
    --color-secondary-turquoise-20: ${designTokens.colorPrimitives.secondary.turquoise[20]};
    --color-secondary-turquoise-40: ${designTokens.colorPrimitives.secondary.turquoise[40]};
    --color-secondary-turquoise-60: ${designTokens.colorPrimitives.secondary.turquoise[60]};
    --color-secondary-turquoise-80: ${designTokens.colorPrimitives.secondary.turquoise[80]};
    --color-secondary-turquoise-100: ${designTokens.colorPrimitives.secondary.turquoise[100]};
    
    --color-secondary-bright-blue-5: ${designTokens.colorPrimitives.secondary.brightBlue[5]};
    --color-secondary-bright-blue-10: ${designTokens.colorPrimitives.secondary.brightBlue[10]};
    --color-secondary-bright-blue-20: ${designTokens.colorPrimitives.secondary.brightBlue[20]};
    --color-secondary-bright-blue-40: ${designTokens.colorPrimitives.secondary.brightBlue[40]};
    --color-secondary-bright-blue-60: ${designTokens.colorPrimitives.secondary.brightBlue[60]};
    --color-secondary-bright-blue-80: ${designTokens.colorPrimitives.secondary.brightBlue[80]};
    --color-secondary-bright-blue-100: ${designTokens.colorPrimitives.secondary.brightBlue[100]};
    
    --color-secondary-sky-blue-5: ${designTokens.colorPrimitives.secondary.skyBlue[5]};
    --color-secondary-sky-blue-10: ${designTokens.colorPrimitives.secondary.skyBlue[10]};
    --color-secondary-sky-blue-20: ${designTokens.colorPrimitives.secondary.skyBlue[20]};
    --color-secondary-sky-blue-40: ${designTokens.colorPrimitives.secondary.skyBlue[40]};
    --color-secondary-sky-blue-60: ${designTokens.colorPrimitives.secondary.skyBlue[60]};
    --color-secondary-sky-blue-80: ${designTokens.colorPrimitives.secondary.skyBlue[80]};
    --color-secondary-sky-blue-100: ${designTokens.colorPrimitives.secondary.skyBlue[100]};
    
    --color-secondary-yellow-5: ${designTokens.colorPrimitives.secondary.yellow[5]};
    --color-secondary-yellow-10: ${designTokens.colorPrimitives.secondary.yellow[10]};
    --color-secondary-yellow-20: ${designTokens.colorPrimitives.secondary.yellow[20]};
    --color-secondary-yellow-40: ${designTokens.colorPrimitives.secondary.yellow[40]};
    --color-secondary-yellow-60: ${designTokens.colorPrimitives.secondary.yellow[60]};
    --color-secondary-yellow-80: ${designTokens.colorPrimitives.secondary.yellow[80]};
    --color-secondary-yellow-100: ${designTokens.colorPrimitives.secondary.yellow[100]};
    
    --color-secondary-orange-5: ${designTokens.colorPrimitives.secondary.orange[5]};
    --color-secondary-orange-10: ${designTokens.colorPrimitives.secondary.orange[10]};
    --color-secondary-orange-20: ${designTokens.colorPrimitives.secondary.orange[20]};
    --color-secondary-orange-40: ${designTokens.colorPrimitives.secondary.orange[40]};
    --color-secondary-orange-60: ${designTokens.colorPrimitives.secondary.orange[60]};
    --color-secondary-orange-80: ${designTokens.colorPrimitives.secondary.orange[80]};
    --color-secondary-orange-100: ${designTokens.colorPrimitives.secondary.orange[100]};
    
    --color-secondary-warm-red-5: ${designTokens.colorPrimitives.secondary.warmRed[5]};
    --color-secondary-warm-red-10: ${designTokens.colorPrimitives.secondary.warmRed[10]};
    --color-secondary-warm-red-20: ${designTokens.colorPrimitives.secondary.warmRed[20]};
    --color-secondary-warm-red-40: ${designTokens.colorPrimitives.secondary.warmRed[40]};
    --color-secondary-warm-red-60: ${designTokens.colorPrimitives.secondary.warmRed[60]};
    --color-secondary-warm-red-80: ${designTokens.colorPrimitives.secondary.warmRed[80]};
    --color-secondary-warm-red-100: ${designTokens.colorPrimitives.secondary.warmRed[100]};

    --color-system-success-green-5: ${designTokens.colorPrimitives.system.successGreen[5]};
    --color-system-success-green-10: ${designTokens.colorPrimitives.system.successGreen[10]};
    --color-system-success-green-20: ${designTokens.colorPrimitives.system.successGreen[20]};
    --color-system-success-green-40: ${designTokens.colorPrimitives.system.successGreen[40]};
    --color-system-success-green-60: ${designTokens.colorPrimitives.system.successGreen[60]};
    --color-system-success-green-80: ${designTokens.colorPrimitives.system.successGreen[80]};
    --color-system-success-green-100: ${designTokens.colorPrimitives.system.successGreen[100]};
    
    --color-system-success-dark-green-5: ${designTokens.colorPrimitives.system.successDarkGreen[5]};
    --color-system-success-dark-green-10: ${designTokens.colorPrimitives.system.successDarkGreen[10]};
    --color-system-success-dark-green-20: ${designTokens.colorPrimitives.system.successDarkGreen[20]};
    --color-system-success-dark-green-40: ${designTokens.colorPrimitives.system.successDarkGreen[40]};
    --color-system-success-dark-green-60: ${designTokens.colorPrimitives.system.successDarkGreen[60]};
    --color-system-success-dark-green-80: ${designTokens.colorPrimitives.system.successDarkGreen[80]};
    --color-system-success-dark-green-100: ${designTokens.colorPrimitives.system.successDarkGreen[100]};
    
    --color-system-error-red-5: ${designTokens.colorPrimitives.system.errorRed[5]};
    --color-system-error-red-10: ${designTokens.colorPrimitives.system.errorRed[10]};
    --color-system-error-red-20: ${designTokens.colorPrimitives.system.errorRed[20]};
    --color-system-error-red-40: ${designTokens.colorPrimitives.system.errorRed[40]};
    --color-system-error-red-60: ${designTokens.colorPrimitives.system.errorRed[60]};
    --color-system-error-red-80: ${designTokens.colorPrimitives.system.errorRed[80]};
    --color-system-error-red-100: ${designTokens.colorPrimitives.system.errorRed[100]};
    
    --color-system-alert-yellow-5: ${designTokens.colorPrimitives.system.alertYellow[5]};
    --color-system-alert-yellow-10: ${designTokens.colorPrimitives.system.alertYellow[10]};
    --color-system-alert-yellow-20: ${designTokens.colorPrimitives.system.alertYellow[20]};
    --color-system-alert-yellow-40: ${designTokens.colorPrimitives.system.alertYellow[40]};
    --color-system-alert-yellow-60: ${designTokens.colorPrimitives.system.alertYellow[60]};
    --color-system-alert-yellow-80: ${designTokens.colorPrimitives.system.alertYellow[80]};
    --color-system-alert-yellow-100: ${designTokens.colorPrimitives.system.alertYellow[100]};
    
    --color-system-alert-dark-yellow-5: ${designTokens.colorPrimitives.system.alertDarkYellow[5]};
    --color-system-alert-dark-yellow-10: ${designTokens.colorPrimitives.system.alertDarkYellow[10]};
    --color-system-alert-dark-yellow-20: ${designTokens.colorPrimitives.system.alertDarkYellow[20]};
    --color-system-alert-dark-yellow-40: ${designTokens.colorPrimitives.system.alertDarkYellow[40]};
    --color-system-alert-dark-yellow-60: ${designTokens.colorPrimitives.system.alertDarkYellow[60]};
    --color-system-alert-dark-yellow-80: ${designTokens.colorPrimitives.system.alertDarkYellow[80]};
    --color-system-alert-dark-yellow-100: ${designTokens.colorPrimitives.system.alertDarkYellow[100]};

    --color-neutral-white: ${designTokens.colorPrimitives.neutral.white};
    --color-neutral-grey-10: ${designTokens.colorPrimitives.neutral.grey10};
    --color-neutral-grey-20: ${designTokens.colorPrimitives.neutral.grey20};
    --color-neutral-grey-30: ${designTokens.colorPrimitives.neutral.grey30};
    --color-neutral-grey-40: ${designTokens.colorPrimitives.neutral.grey40};
    --color-neutral-grey-40-25: ${designTokens.colorPrimitives.neutral["grey40-25"]};
    --color-neutral-grey-40-45: ${designTokens.colorPrimitives.neutral["grey40-45"]};
    --color-neutral-grey-50: ${designTokens.colorPrimitives.neutral.grey50};
    --color-neutral-grey-60: ${designTokens.colorPrimitives.neutral.grey60};
    --color-neutral-grey-70: ${designTokens.colorPrimitives.neutral.grey70};
    --color-neutral-grey-80: ${designTokens.colorPrimitives.neutral.grey80};
    --color-neutral-grey-90: ${designTokens.colorPrimitives.neutral.grey90};

    --color-table-rows-default: ${designTokens.colorPrimitives.tableRows.default};
    --color-table-rows-hover: ${designTokens.colorPrimitives.tableRows.hover};
    
    --color-links-default: ${designTokens.colorPrimitives.links.default};
    --color-links-hover: ${designTokens.colorPrimitives.links.hover};
    
    --color-overlay-white-80: ${designTokens.colorPrimitives.overlay["white-80"]};
    --color-overlay-black-70: ${designTokens.colorPrimitives.overlay["black-70"]};
    
    --color-buttons-primary-default: ${designTokens.colorPrimitives.buttons.primaryDefault};
    --color-buttons-primary-hover: ${designTokens.colorPrimitives.buttons.primaryHover};
    --color-buttons-primary-pressed: ${designTokens.colorPrimitives.buttons.primaryPressed};
    --color-buttons-secondary-default: ${designTokens.colorPrimitives.buttons.secondaryDefault};
    --color-buttons-secondary-hover: ${designTokens.colorPrimitives.buttons.secondaryHover};
    --color-buttons-secondary-pressed: ${designTokens.colorPrimitives.buttons.secondaryPressed};
    --color-buttons-tertiary-blue-default: ${designTokens.colorPrimitives.buttons.tertiaryBlueDefault};
    --color-buttons-tertiary-blue-hover: ${designTokens.colorPrimitives.buttons.tertiaryBlueHover};
    --color-buttons-tertiary-blue-pressed: ${designTokens.colorPrimitives.buttons.tertiaryBluePressed};
    --color-buttons-tertiary-blue-hover-bg: ${designTokens.colorPrimitives.buttons.tertiaryBlueHoverBg};
    --color-buttons-tertiary-blue-pressed-bg: ${designTokens.colorPrimitives.buttons.tertiaryBluePressedBg};
    --color-buttons-tertiary-grey-default: ${designTokens.colorPrimitives.buttons.tertiaryGreyDefault};
    --color-buttons-tertiary-grey-hover: ${designTokens.colorPrimitives.buttons.tertiaryGreyHover};
    --color-buttons-tertiary-grey-pressed: ${designTokens.colorPrimitives.buttons.tertiaryGreyPressed};
    --color-buttons-tertiary-grey-hover-bg: ${designTokens.colorPrimitives.buttons.tertiaryGreyHoverBg};
    --color-buttons-tertiary-grey-pressed-bg: ${designTokens.colorPrimitives.buttons.tertiaryGreyPressedBg};
    --color-buttons-tertiary-disabled: ${designTokens.colorPrimitives.buttons.tertiaryDisabled};
    --color-buttons-icon-primary-default: ${designTokens.colorPrimitives.buttons.iconPrimaryDefault};
    --color-buttons-icon-primary-hover-bg: ${designTokens.colorPrimitives.buttons.iconPrimaryHoverBg};
    --color-buttons-icon-primary-pressed-bg: ${designTokens.colorPrimitives.buttons.iconPrimaryPressedBg};
    --color-buttons-icon-secondary-default: ${designTokens.colorPrimitives.buttons.iconSecondaryDefault};
    --color-buttons-icon-secondary-hover-bg: ${designTokens.colorPrimitives.buttons.iconSecondaryHoverBg};
    --color-buttons-icon-secondary-pressed-bg: ${designTokens.colorPrimitives.buttons.iconSecondaryPressedBg};
    --color-buttons-icon-disabled: ${designTokens.colorPrimitives.buttons.iconDisabled};
    
    --color-inputs-default: ${designTokens.colorPrimitives.inputs.default};
    --color-inputs-hover: ${designTokens.colorPrimitives.inputs.hover};
    --color-inputs-on-disabled: ${designTokens.colorPrimitives.inputs.onDisabled};
    
    --color-alerts-error: ${designTokens.colorPrimitives.alerts.error};
    --color-alerts-attention: ${designTokens.colorPrimitives.alerts.attention};
    --color-alerts-success: ${designTokens.colorPrimitives.alerts.success};

    /* Spacing Tokens */
    --spacing-0: ${designTokens.primitives.spacer[0]}px;
    --spacing-1: ${designTokens.primitives.spacer[1]}px;
    --spacing-2: ${designTokens.primitives.spacer[2]}px;
    --spacing-3: ${designTokens.primitives.spacer[3]}px;
    --spacing-4: ${designTokens.primitives.spacer[4]}px;
    --spacing-5: ${designTokens.primitives.spacer[5]}px;
    --spacing-6: ${designTokens.primitives.spacer[6]}px;
    --spacing-7: ${designTokens.primitives.spacer[7]}px;
    --spacing-8: ${designTokens.primitives.spacer[8]}px;
    --spacing-9: ${designTokens.primitives.spacer[9]}px;
    --spacing-10: ${designTokens.primitives.spacer[10]}px;
    --spacing-11: ${designTokens.primitives.spacer[11]}px;
    --spacing-12: ${designTokens.primitives.spacer[12]}px;
    --spacing-13: ${designTokens.primitives.spacer[13]}px;
    --spacing-14: ${designTokens.primitives.spacer[14]}px;
    --spacing-15: ${designTokens.primitives.spacer[15]}px;
    --spacing-16: ${designTokens.primitives.spacer[16]}px;

    /* Border Radius Tokens */
    --border-radius-zero: ${designTokens.primitives.radius.zero}px;
    --border-radius-xs: ${designTokens.primitives.radius.xs}px;
    --border-radius-sm: ${designTokens.primitives.radius.sm}px;
    --border-radius-md: ${designTokens.primitives.radius.md}px;
    --border-radius-lg: ${designTokens.primitives.radius.lg}px;
    --border-radius-xl: ${designTokens.primitives.radius.xl}px;
    --border-radius-xxl: ${designTokens.primitives.radius.xxl}px;

    /* Line Height Tokens */
    --line-height-3: ${designTokens.primitives.lineHeight[3]}px;
    --line-height-4: ${designTokens.primitives.lineHeight[4]}px;
    --line-height-4-5: ${designTokens.primitives.lineHeight["4-5"]}px;
    --line-height-5: ${designTokens.primitives.lineHeight[5]}px;
    --line-height-6: ${designTokens.primitives.lineHeight[6]}px;
    --line-height-7: ${designTokens.primitives.lineHeight[7]}px;
    --line-height-10: ${designTokens.primitives.lineHeight[10]}px;

    /* Legacy mappings for backward compatibility */
    --color-primary-50: var(--color-primary-blue-5);
    --color-primary-100: var(--color-primary-blue-10);
    --color-primary-500: var(--color-primary-blue-100);
    --color-primary-600: var(--color-primary-blue-80);
    --color-primary-900: var(--color-primary-dark-blue-100);
    
    --color-neutral-50: var(--color-neutral-grey-10);
    --color-neutral-100: var(--color-neutral-grey-20);
    --color-neutral-500: var(--color-neutral-grey-50);
    --color-neutral-600: var(--color-neutral-grey-60);
    --color-neutral-900: var(--color-neutral-grey-90);
    
    --color-success: var(--color-system-success-dark-green-100);
    --color-warning: var(--color-system-alert-yellow-100);
    --color-error: var(--color-system-error-red-100);
    --color-info: var(--color-primary-blue-100);
    
    --spacing-xs: var(--spacing-1);
    --spacing-sm: var(--spacing-2);
    --spacing-md: var(--spacing-4);
    --spacing-lg: var(--spacing-6);
    --spacing-xl: var(--spacing-8);
    --spacing-2xl: var(--spacing-12);
    --spacing-3xl: var(--spacing-16);
    
    --border-radius-none: var(--border-radius-zero);
    --border-radius-full: 9999px;
    --border-width-thin: 1px;
    --border-width-medium: 2px;
    --border-width-thick: 4px;
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(--0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    
    --font-family-sans: 'Nunito', system-ui, sans-serif;
    --font-family-mono: 'JetBrains Mono', monospace;
    
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
  }
`;

export default designTokens;
