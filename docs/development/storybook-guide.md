# Storybook Guide

This project uses Storybook as the primary environment for isolated component development.

## Current Stack

- Framework: @storybook/nextjs-vite
- Storybook version: 9.x
- Addons:
  - @storybook/addon-docs
  - @storybook/addon-a11y
  - @chromatic-com/storybook

Configuration sources:

- .storybook/main.ts
- .storybook/preview.tsx

## Run Storybook

```bash
npm run storybook
```

Default local URL: http://localhost:6006

## Theme and Mode Toolbar

Theme options configured in preview globals:

- default
- sage
- wiley
- wiley2025
- phenom
- researchexchange

Color mode options:

- light
- dark
- system

## Story Authoring Baseline

Use CSF with typed meta and stories:

```ts
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof ComponentName> = {
  title: "MUI Components/Category/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;
```

Recommended story set:

1. Default interactive story with meaningful controls.
2. At least one state story (disabled/error/loading where relevant).
3. One static reference story for variant coverage.

## Quality Checklist

Before considering a story complete:

1. Verify rendering across all project themes.
2. Verify rendering in light and dark modes.
3. Check accessibility panel for major violations.
4. Keep controls focused on visual and interaction behavior.

## Related Docs

- docs/development/MUI_BEST_PRACTICES.md
- docs/development/theme-guide.md
- README.md (scripts and tooling overview)

**Last reviewed:** 2026-07-08
