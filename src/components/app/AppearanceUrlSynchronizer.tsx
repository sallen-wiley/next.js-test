"use client";

import { useEffect, useMemo } from "react";
import { useColorScheme } from "@mui/material/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLogoContext } from "@/contexts/LogoContext";
import { useAppearanceUrlSync } from "@/contexts/AppearanceUrlSyncContext";
import {
  appearanceQueryParamKeys,
  parseAppearanceUrlParams,
} from "@/lib/appearanceUrlParams";

export default function AppearanceUrlSynchronizer() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";

  const parsedParams = useMemo(
    () => parseAppearanceUrlParams(new URLSearchParams(searchParamsString)),
    [searchParamsString],
  );

  const { currentTheme, setTheme } = useThemeContext();
  const { currentTenant, setTenant } = useLogoContext();
  const { mode, setMode } = useColorScheme();
  const { pinned, pinParams } = useAppearanceUrlSync();

  useEffect(() => {
    if (parsedParams.theme) {
      pinParams({ theme: true });
      if (currentTheme !== parsedParams.theme) {
        setTheme(parsedParams.theme);
      }
    }

    if (parsedParams.mode) {
      pinParams({ mode: true });
      if (mode !== parsedParams.mode) {
        setMode(parsedParams.mode);
      }
    }

    if (parsedParams.logo) {
      pinParams({ logo: true });
      if (currentTenant !== parsedParams.logo) {
        setTenant(parsedParams.logo);
      }
    }
  }, [
    currentTenant,
    currentTheme,
    mode,
    parsedParams.logo,
    parsedParams.mode,
    parsedParams.theme,
    pinParams,
    setMode,
    setTenant,
    setTheme,
  ]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const nextParams = new URLSearchParams(searchParamsString);
    const targetTheme = parsedParams.theme ?? (pinned.theme ? currentTheme : undefined);
    const targetMode = parsedParams.mode ?? (pinned.mode ? mode : undefined);
    const targetLogo = parsedParams.logo ?? (pinned.logo ? currentTenant : undefined);
    let changed = false;

    if (targetTheme) {
      if (nextParams.get(appearanceQueryParamKeys.theme) !== targetTheme) {
        nextParams.set(appearanceQueryParamKeys.theme, targetTheme);
        changed = true;
      }
    } else if (parsedParams.hasThemeParam && !parsedParams.theme) {
      nextParams.delete(appearanceQueryParamKeys.theme);
      changed = true;
    }

    if (targetMode) {
      if (nextParams.get(appearanceQueryParamKeys.mode) !== targetMode) {
        nextParams.set(appearanceQueryParamKeys.mode, targetMode);
        changed = true;
      }
    } else if (parsedParams.hasModeParam && !parsedParams.mode) {
      nextParams.delete(appearanceQueryParamKeys.mode);
      changed = true;
    }

    if (targetLogo) {
      if (nextParams.get(appearanceQueryParamKeys.logo) !== targetLogo) {
        nextParams.set(appearanceQueryParamKeys.logo, targetLogo);
        changed = true;
      }
    } else if (parsedParams.hasLogoParam && !parsedParams.logo) {
      nextParams.delete(appearanceQueryParamKeys.logo);
      changed = true;
    }

    if (!changed) {
      return;
    }

    const nextSearchString = nextParams.toString();
    const currentUrl = searchParamsString
      ? `${pathname}?${searchParamsString}`
      : pathname;
    const nextUrl = nextSearchString ? `${pathname}?${nextSearchString}` : pathname;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    currentTenant,
    currentTheme,
    mode,
    parsedParams.hasLogoParam,
    parsedParams.hasModeParam,
    parsedParams.hasThemeParam,
    parsedParams.logo,
    parsedParams.mode,
    parsedParams.theme,
    pathname,
    pinned.logo,
    pinned.mode,
    pinned.theme,
    router,
    searchParamsString,
  ]);

  return null;
}
