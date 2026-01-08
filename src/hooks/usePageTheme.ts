"use client";

import { useEffect, useRef } from "react";
import { useThemeContext, type ThemeName } from "@/contexts/ThemeContext";

/**
 * Force a specific theme when a page loads.
 * Allows manual theme switching during the session, but resets to the specified theme on next visit.
 *
 * @param requiredTheme - The theme to apply when the page mounts
 * @param options.restoreOnUnmount - Whether to restore the previous theme when unmounting (default: false)
 *
 * @example
 * // Basic usage - force theme on mount only
 * usePageTheme("phenom");
 *
 * @example
 * // Restore previous theme when leaving page
 * usePageTheme("phenom", { restoreOnUnmount: true });
 */
export function usePageTheme(
  requiredTheme: ThemeName,
  options?: {
    restoreOnUnmount?: boolean;
  }
) {
  const { setTheme, currentTheme } = useThemeContext();
  const previousTheme = useRef<ThemeName>(currentTheme);

  useEffect(() => {
    // Store the theme that was active when component mounted
    previousTheme.current = currentTheme;

    // Force the required theme if not already active
    if (currentTheme !== requiredTheme) {
      setTheme(requiredTheme);
    }

    // Optional cleanup: restore previous theme on unmount
    return () => {
      if (
        options?.restoreOnUnmount &&
        previousTheme.current !== requiredTheme
      ) {
        setTheme(previousTheme.current);
      }
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
