"use client";

import { useEffect, useMemo } from "react";
import { useColorScheme } from "@mui/material/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLogoContext } from "@/contexts/LogoContext";
import { useAppearanceUrlSync } from "@/contexts/AppearanceUrlSyncContext";
import { useAppearanceController } from "@/hooks/useAppearanceController";
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

  const { currentTheme } = useThemeContext();
  const { currentTenant } = useLogoContext();
  const { mode } = useColorScheme();
  const { pinned, pending, clearPendingSync } = useAppearanceUrlSync();
  const { applyAppearance } = useAppearanceController();

  useEffect(() => {
    if (pending.active) {
      return;
    }

    if (parsedParams.theme || parsedParams.mode || parsedParams.logo) {
      applyAppearance(
        {
          theme: parsedParams.theme,
          mode: parsedParams.mode,
          logo: parsedParams.logo,
        },
        { pinParams: true },
      );
    }
  }, [
    applyAppearance,
    pending.active,
    parsedParams.logo,
    parsedParams.mode,
    parsedParams.theme,
  ]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const nextParams = new URLSearchParams(searchParamsString);

    if (pending.active) {
      const pendingThemeSettled =
        pending.theme === undefined || currentTheme === pending.theme;
      const pendingModeSettled =
        pending.mode === undefined || mode === pending.mode;
      const pendingLogoSettled =
        pending.logo === undefined || currentTenant === pending.logo;
      const pendingThemeInUrl =
        pending.theme === undefined || parsedParams.theme === pending.theme;
      const pendingModeInUrl =
        pending.mode === undefined || parsedParams.mode === pending.mode;
      const pendingLogoInUrl =
        pending.logo === undefined || parsedParams.logo === pending.logo;

      if (
        pendingThemeSettled &&
        pendingModeSettled &&
        pendingLogoSettled &&
        pendingThemeInUrl &&
        pendingModeInUrl &&
        pendingLogoInUrl
      ) {
        clearPendingSync();
      }
    }

    const usePendingTheme = pending.active && pending.theme !== undefined;
    const usePendingMode = pending.active && pending.mode !== undefined;
    const usePendingLogo = pending.active && pending.logo !== undefined;

    const targetTheme =
      parsedParams.theme ??
      (usePendingTheme
        ? pending.theme
        : pinned.theme
        ? currentTheme
        : undefined);
    const targetMode =
      parsedParams.mode ??
      (usePendingMode ? pending.mode : pinned.mode ? mode : undefined);
    const targetLogo =
      parsedParams.logo ??
      (usePendingLogo ? pending.logo : pinned.logo ? currentTenant : undefined);
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
    const nextUrl = nextSearchString
      ? `${pathname}?${nextSearchString}`
      : pathname;

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
    clearPendingSync,
    pending.active,
    pending.logo,
    pending.mode,
    pending.theme,
    pinned.logo,
    pinned.mode,
    pinned.theme,
    router,
    searchParamsString,
  ]);

  return null;
}
