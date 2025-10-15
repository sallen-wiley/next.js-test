import defaultTheme from "./default";
import sageTheme from "./sage";
import wileyTheme from "./wiley";
import wiley2025Theme from "./wiley2025";
import phenomTheme from "./phenom";
import techTheme from "./tech";

// Available themes with different typography approaches
export const themes = {
  default: defaultTheme, // Standard Material-UI theme with Roboto
  sage: sageTheme, // Source Serif 4 - Elegant serif for nature/organic brands
  wiley: wileyTheme, // Open Sans - Modern sans-serif for professional/academic
  wiley2025: wiley2025Theme, // Inter - 2025 brand refresh
  phenom: phenomTheme, // Roboto - Clean, modern theme
  tech: techTheme, // IBM Plex Mono - Monospace for tech/development brands
};

// Helper to get theme by name with fallback
export const getTheme = (themeName: keyof typeof themes = "wiley") => {
  return themes[themeName] || themes.wiley;
};

// Available theme names
export const themeNames = Object.keys(themes) as Array<keyof typeof themes>;

export {
  defaultTheme,
  sageTheme,
  wileyTheme,
  wiley2025Theme,
  phenomTheme,
  techTheme,
};
export default themes;
