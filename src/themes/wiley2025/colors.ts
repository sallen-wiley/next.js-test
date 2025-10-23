// original muiColors https://mui.com/material-ui/customization/color/#color-palette
import * as muiColors from "@mui/material/colors";
import { brandColors } from "./brandColors";

export const green = {
  50: brandColors["System Positive"][50],
  100: brandColors["System Positive"][100],
  200: brandColors["System Positive"][200],
  300: brandColors["System Positive"][300],
  400: brandColors["System Positive"][400],
  500: brandColors["System Positive"][500],
  600: brandColors["System Positive"][600],
  700: brandColors["System Positive"][700],
  800: brandColors["System Positive"][800],
  900: brandColors["System Positive"][900],
};

export const red = {
  50: brandColors["System Negative"][50], // #fff1f0
  100: brandColors["System Negative"][100], // #ffdad6
  200: brandColors["System Negative"][200], // #ffa39e
  300: brandColors["System Negative"][300], // #ff7875
  400: brandColors["System Negative"][400], // #ff6966
  500: brandColors["System Negative"][500], // #ff4d4f
  600: brandColors["System Negative"][600], // #cf1322
  700: brandColors["System Negative"][700], // #a8071a
  800: brandColors["System Negative"][800], // #820014
  900: brandColors["System Negative"][900], // #5c0011
};

export const orange = {
  50: brandColors["System Alert"][50], // #fffbe6
  100: brandColors["System Alert"][100], // #fff5cc
  200: brandColors["System Alert"][200], // #ffe58f
  300: brandColors["System Alert"][300], // #ffd666
  400: brandColors["System Alert"][400], // #ffc53d
  500: brandColors["System Alert"][500], // #faad14
  600: brandColors["System Alert"][600], // #d48806
  700: brandColors["System Alert"][700], // #ad6800
  800: brandColors["System Alert"][800], // #874d00
  900: brandColors["System Alert"][900], // #613400
};

export const grey = {
  50: brandColors.Neutral[50], // #f8f8f5
  100: brandColors.Neutral[100], // #f2f2eb
  200: brandColors.Neutral[200], // #ececec
  300: brandColors.Neutral[300], // #d7d7d2
  400: brandColors.Neutral[400], // #bfbfbf
  500: brandColors.Neutral[500], // #a6a6a1
  600: brandColors.Neutral[600], // #8c8c88
  700: brandColors.Neutral[700], // #5d5e5c
  800: brandColors.Neutral[800], // #302f2f
  900: brandColors.Neutral[900], // #000000
};

export const teal = {
  50: muiColors.teal[50],
  100: brandColors["Primary Data"][100],
  200: brandColors["Primary Data"][200],
  300: brandColors["Primary Data"][300],
  400: brandColors["Primary Data"][400],
  500: brandColors["Primary Data"][500],
  600: brandColors["Primary Data"][600],
  700: muiColors.teal[700],
  800: muiColors.teal[800],
  900: muiColors.teal[900],
};

export const cyan = {
  50: muiColors.cyan[50],
  100: muiColors.cyan[100],
  200: muiColors.cyan[200],
  300: muiColors.cyan[300],
  400: brandColors["Primary Heritage"][400],
  500: brandColors["Primary Heritage"][500],
  600: brandColors["Primary Heritage"][600],
  700: brandColors["Primary Heritage"][700],
  800: brandColors["Primary Heritage"][800],
  900: brandColors["Primary Heritage"][900],
};

export const common = {
  black: brandColors.Neutral[900], // #000000
  white: brandColors.Neutral[0], // #FFFFFF
};

export const blue = muiColors.blue;
