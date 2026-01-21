import type { LogoConfig } from "./types";

export const defaultLogo: LogoConfig = {
  viewBox: "0 0 40 40",
  width: 40,
  height: 40,
  path: (
    <circle
      cx="20"
      cy="20"
      r="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  ),
};
