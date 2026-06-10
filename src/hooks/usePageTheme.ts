"use client";

import { useEffect, useRef } from "react";
import {
  useThemeContext,
  type ThemeName,
  type ColorMode,
} from "@/contexts/ThemeContext";
import { useAppearanceUrlSync } from "@/contexts/AppearanceUrlSyncContext";
import { useColorScheme } from "@mui/material/styles";
import { useSearchParams } from "next/navigation";
import { useAppearanceController } from "@/hooks/useAppearanceController";
import { parseAppearanceUrlParams } from "@/lib/appearanceUrlParams";

/**
 * Force a specific theme and/or color mode when a page loads.
 * Allows manual theme/mode switching during the session, but resets to the specified values on next visit.
 *
 * @param requiredTheme - The theme to apply when the page mounts
 * @param options.mode - Optional color mode to force ("light", "dark", or "system")
 * @param options.restoreOnUnmount - Whether to restore the previous theme/mode when unmounting (default: false)
 *
 * @example
 * // Basic usage - force theme only
 * usePageTheme("phenom");
 *
 * @example
 * // Force theme and dark mode
 * usePageTheme("phenom", { mode: "dark" });
 *
 * @example
 * // Force light mode only (keep current theme)
 * usePageTheme(undefined, { mode: "light" });
 *
 * @example
 * // Restore previous theme/mode when leaving page
 * usePageTheme("phenom", { mode: "dark", restoreOnUnmount: true });
 */
export function usePageTheme(
  requiredTheme?: ThemeName,
  options?: {
    mode?: ColorMode;
    restoreOnUnmount?: boolean;
  },
) {
  const { currentTheme } = useThemeContext();
  const { mode } = useColorScheme();
  const { pinned } = useAppearanceUrlSync();
  const { applyAppearance } = useAppearanceController();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";
  const previousTheme = useRef<ThemeName>(currentTheme);
  const previousMode = useRef<ColorMode | undefined>(mode);

  useEffect(() => {
    const routerUrlParams = parseAppearanceUrlParams(
      new URLSearchParams(searchParamsString),
    );

    const windowUrlParams =
      typeof window !== "undefined"
        ? parseAppearanceUrlParams(new URLSearchParams(window.location.search))
        : null;

    const themePinnedByUrl =
      pinned.theme ||
      Boolean(routerUrlParams.theme) ||
      Boolean(windowUrlParams?.theme);
    const modePinnedByUrl =
      pinned.mode ||
      Boolean(routerUrlParams.mode) ||
      Boolean(windowUrlParams?.mode);

    // Store the theme and mode that were active when component mounted
    previousTheme.current = currentTheme;
    previousMode.current = mode;

    // Force the required theme if specified and not already active
    if (requiredTheme && !themePinnedByUrl && currentTheme !== requiredTheme) {
      applyAppearance({ theme: requiredTheme });
    }

    // Force the required mode if specified and not already active
    if (options?.mode && !modePinnedByUrl && mode !== options.mode) {
      applyAppearance({ mode: options.mode });
    }

    // Optional cleanup: restore previous theme/mode on unmount
    return () => {
      if (options?.restoreOnUnmount) {
        if (
          requiredTheme &&
          !themePinnedByUrl &&
          previousTheme.current !== requiredTheme
        ) {
          applyAppearance({ theme: previousTheme.current });
        }
        if (
          options.mode &&
          !modePinnedByUrl &&
          previousMode.current &&
          previousMode.current !== options.mode
        ) {
          applyAppearance({ mode: previousMode.current });
        }
      }
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
