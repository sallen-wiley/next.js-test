import type { LogoConfig } from "./types";

// Research Exchange Light All Caps - uses currentColor (black in light, white in dark)
// PLACEHOLDER - awaiting actual SVG from design
export const reLightAllcapsLogo: LogoConfig = {
  viewBox: "0 0 258 18",
  width: 258,
  height: 18,
  path: (
    <text
      x="129"
      y="14"
      fontSize="14"
      textAnchor="middle"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      RESEARCH EXCHANGE
    </text>
  ),
};
