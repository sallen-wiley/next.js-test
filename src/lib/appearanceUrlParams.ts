import type { TenantType } from "@/components/product/logos/types";
import { availableTenants } from "@/components/product/logos/constants";
import type { ColorMode, ThemeName } from "@/contexts/ThemeContext";
import { themeNames } from "@/themes";

type SearchParamReader = Pick<URLSearchParams, "get" | "has">;

export const appearanceQueryParamKeys = {
  theme: "theme",
  mode: "mode",
  logo: "logo",
} as const;

const modeValues: ColorMode[] = ["light", "dark", "system"];
const themeNameSet = new Set<string>(themeNames as string[]);
const modeSet = new Set<string>(modeValues);
const tenantSet = new Set<string>(availableTenants);

const isThemeName = (value: string): value is ThemeName =>
  themeNameSet.has(value);

const isColorMode = (value: string): value is ColorMode => modeSet.has(value);

const isLogoTenant = (value: string): value is TenantType =>
  tenantSet.has(value);

export interface ParsedAppearanceUrlParams {
  theme?: ThemeName;
  mode?: ColorMode;
  logo?: TenantType;
  rawTheme: string | null;
  rawMode: string | null;
  rawLogo: string | null;
  hasThemeParam: boolean;
  hasModeParam: boolean;
  hasLogoParam: boolean;
  hasAnyAppearanceParam: boolean;
}

export function parseAppearanceUrlParams(
  searchParams: SearchParamReader,
): ParsedAppearanceUrlParams {
  const rawTheme = searchParams.get(appearanceQueryParamKeys.theme);
  const rawMode = searchParams.get(appearanceQueryParamKeys.mode);
  const rawLogo = searchParams.get(appearanceQueryParamKeys.logo);

  const theme = rawTheme && isThemeName(rawTheme) ? rawTheme : undefined;
  const mode = rawMode && isColorMode(rawMode) ? rawMode : undefined;
  const logo = rawLogo && isLogoTenant(rawLogo) ? rawLogo : undefined;

  const hasThemeParam = searchParams.has(appearanceQueryParamKeys.theme);
  const hasModeParam = searchParams.has(appearanceQueryParamKeys.mode);
  const hasLogoParam = searchParams.has(appearanceQueryParamKeys.logo);

  return {
    theme,
    mode,
    logo,
    rawTheme,
    rawMode,
    rawLogo,
    hasThemeParam,
    hasModeParam,
    hasLogoParam,
    hasAnyAppearanceParam: hasThemeParam || hasModeParam || hasLogoParam,
  };
}
