import type { ReactNode } from "react";

export interface LogoVariant {
  viewBox: string;
  width: number;
  height: number;
  path: ReactNode;
}

export interface LogoConfig {
  viewBox: string;
  width: number;
  height: number;
  path: ReactNode;
  dark?: ReactNode; // Optional dark mode variant
  mobile?: {
    viewBox: string;
    width: number;
    height: number;
    path: ReactNode;
    dark?: ReactNode; // Optional dark mode for mobile
  };
}

export type TenantType =
  | "wiley"
  | "wiley2025"
  | "sage"
  | "ieee"
  | "re-light-stacked"
  | "re-bold-stacked"
  | "re-light-allcaps"
  | "re-bold-allcaps"
  | "re-bold"
  | "default";
