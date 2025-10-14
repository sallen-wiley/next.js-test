"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { themes, getTheme } from "@/themes";
import type { Theme } from "@mui/material/styles";

// Define the available theme names
export type ThemeName = keyof typeof themes;
export type ColorMode = "light" | "dark" | "system";

// Theme context interface
interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
  theme: Theme;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use the theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "wiley",
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const setTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem("app-theme", themeName);
  };

  const theme = getTheme(currentTheme);
  const availableThemes = Object.keys(themes) as ThemeName[];

  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
