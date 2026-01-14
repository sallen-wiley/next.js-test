import defaultTheme from "./default";
import sageTheme from "./sage";
import wileyTheme from "./wiley";
import wiley2025Theme from "./wiley2025";
import phenomTheme from "./phenom";
import researchexchangeTheme from "./researchexchange";

// Available themes with different typography approaches
export const themes = {
  default: defaultTheme,
  sage: sageTheme,
  wiley: wileyTheme,
  wiley2025: wiley2025Theme,
  phenom: phenomTheme,
  researchexchange: researchexchangeTheme,
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
  researchexchangeTheme,
};
export default themes;
