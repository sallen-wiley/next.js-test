import { describe, expect, it } from "vitest";

import { hexToHsv, hsvToRgb, rgbToHex } from "./colorConversions";
import { extrapolateHue } from "./interpolation";
import { generateShadeColors } from "./shadeGeneration";
import type { HueSet, ShadeDefinition } from "../types";

/**
 * Golden ramps taken from src/themes/researchexchange/brandColors.ts. Locked shades are
 * the brand-authored values verified against the wiley.com Figma variable export; the
 * expectations are the shades the generator is required to produce from them.
 */
const buildRamp = (locked: Record<number, string>, length: number) =>
  Array.from({ length }, (_, i): ShadeDefinition => {
    const hex = locked[i];
    return {
      id: `shade-${i}`,
      label: String(i),
      color: hex ?? "#808080",
      locked: hex !== undefined,
      hsv: hexToHsv(hex ?? "#808080"),
      selectedForH: true,
      selectedForS: true,
      selectedForV: true,
    };
  });

const generate = (
  locked: Record<number, string>,
  length: number,
  mode: HueSet["extrapolationMode"] = "functional-saturated",
) => {
  const result = generateShadeColors(buildRamp(locked, length), mode);
  if (!result) throw new Error("nothing locked");
  return result.shades.map((shade) => shade.color.toLowerCase());
};
describe("generateShadeColors — published ramps", () => {
  it("keeps the Neutral ramp neutral at the dark end", () => {
    const ramp = generate(
      {
        0: "#F8F8F5",
        1: "#F2F2EB",
        2: "#E5E4E0",
        3: "#D4D2CF",
        4: "#C9C7C2",
        5: "#ADACA8",
        6: "#8C8B89",
        7: "#5D5E5C",
        8: "#302F2F",
      },
      10,
    );

    // Regression: this used to be #08040d, a violet-black, because the hue slope was
    // taken from two shades whose hue is a single-level rounding artefact.
    expect(ramp[9]).toBe("#0d0c0c");

    const { h, s } = hexToHsv(ramp[9]);
    expect(s).toBeLessThan(10);
    expect(h < 90 || h > 270).toBe(true);
  });

  it("preserves the intentional hue drift in Primary Heritage", () => {
    const ramp = generate(
      {
        4: "#00BFB1",
        5: "#00A89F",
        6: "#008F8A",
        7: "#007A76",
        8: "#006663",
        9: "#003B44",
      },
      10,
    );

    expect(ramp.slice(0, 4)).toEqual([
      "#e8faf8",
      "#a7ede4",
      "#5fdcce",
      "#23ccbc",
    ]);
  });

  it("reproduces the Primary Data ramp", () => {
    const ramp = generate(
      {
        1: "#BFF5DD",
        2: "#9FF0CB",
        3: "#80ECBA",
        4: "#60E7A9",
        5: "#40E298",
        6: "#00D875",
      },
      10,
    );

    expect(ramp[0]).toBe("#edfcf6");
    expect(ramp.slice(7)).toEqual(["#00a358", "#005830", "#00150b"]);
  });
});

describe("functional-saturated darks", () => {
  it("keeps following a climbing saturation ramp", () => {
    const ramp = generateShadeColors(
      buildRamp({ 0: "#f5fafa", 5: "#68a3a8" }, 10),
      "functional-saturated",
    );
    if (!ramp) throw new Error("nothing locked");

    const saturation = ramp.shades.map((shade) => shade.hsv.s);

    // Control points climb 2.0 -> 38.1, so the generated darks must keep climbing.
    // Regression: anchoring the dark end at the ramp's own maximum flattened these.
    for (let i = 6; i < 10; i++) {
      expect(saturation[i]).toBeGreaterThan(saturation[i - 1]);
    }
    expect(saturation[9]).toBeGreaterThan(60);
  });

  it("does not push an achromatic ramp into colour", () => {
    const ramp = generateShadeColors(
      buildRamp({ 0: "#F8F8F5", 7: "#5D5E5C", 8: "#302F2F" }, 10),
      "functional-saturated",
    );
    if (!ramp) throw new Error("nothing locked");

    expect(ramp.shades[9].hsv.s).toBeLessThan(10);
  });
});

describe("extrapolateHue", () => {
  const saturated = (x: number, y: number) => ({ x, y, chroma: 0.8 });

  it("interpolates across 0/360 the short way round", () => {
    const values = extrapolateHue(
      [saturated(0, 3), saturated(4, 355)],
      [1, 2, 3],
    );

    // Every step stays in the red family rather than sweeping through cyan.
    for (const value of values) {
      expect(value < 20 || value > 340).toBe(true);
    }
  });

  it("extrapolates across 0/360 without wrapping the wrong way", () => {
    const [value] = extrapolateHue([saturated(0, 10), saturated(1, 2)], [2]);

    expect(value).toBeCloseTo(354, 5);
  });

  it("follows the slope when the control points are saturated", () => {
    const [value] = extrapolateHue([saturated(0, 170), saturated(1, 180)], [2]);

    expect(value).toBeCloseTo(190, 5);
  });

  it("damps the slope when the control points are near-neutral", () => {
    const [value] = extrapolateHue(
      [
        { x: 0, y: 90, chroma: 0.008 },
        { x: 1, y: 0, chroma: 0.004 },
      ],
      [2],
    );

    // A -90 deg/step slope read off two near-greys must not survive intact.
    expect(value).toBeGreaterThan(350);
    expect(value).toBeLessThan(360);
  });

  it("trusts points that carry no chroma, preserving legacy behaviour", () => {
    const [value] = extrapolateHue(
      [
        { x: 0, y: 100 },
        { x: 1, y: 110 },
      ],
      [2],
    );

    expect(value).toBeCloseTo(120, 5);
  });
});

describe("hsvToRgb", () => {
  it("normalises out-of-range hue instead of falling through to red", () => {
    expect(hsvToRgb(-90, 70, 50)).toEqual(hsvToRgb(270, 70, 50));
    expect(hsvToRgb(430, 70, 50)).toEqual(hsvToRgb(70, 70, 50));
  });

  it("treats 360 as 0", () => {
    expect(hsvToRgb(360, 100, 100)).toEqual(hsvToRgb(0, 100, 100));
  });

  it("round-trips through hex", () => {
    const rgb = hsvToRgb(210, 55, 80);
    expect(rgbToHex(rgb.r, rgb.g, rgb.b)).toBe("#5c94cc");
  });
});
