import sageTheme from "./sage";
import wileyTheme from "./wiley";
import techTheme from "./tech";

// Available themes with different typography approaches
export const themes = {
  sage: sageTheme, // Source Serif 4 - Elegant serif for nature/organic brands
  wiley: wileyTheme, // Inter - Modern sans-serif for professional/academic
  tech: techTheme, // IBM Plex Mono - Monospace for tech/development brands
};

// Helper to get theme by name with fallback
export const getTheme = (themeName: keyof typeof themes = "wiley") => {
  return themes[themeName] || themes.wiley;
};

// Available theme names
export const themeNames = Object.keys(themes) as Array<keyof typeof themes>;

export { sageTheme, wileyTheme, techTheme };
export default themes;
