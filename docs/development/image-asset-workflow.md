# Image Asset Workflow

This project uses a source-first image pipeline optimized for Next.js.

## Directory Layout

- Source assets (commit to git): `assets/images/source/`
- Generated runtime assets (do not commit): `public/images/generated/`

## Build Behavior

The image build script is `scripts/images/build-images.mjs`.

It does the following:

- Scans `assets/images/source/` recursively
- Converts supported raster files (`.jpg`, `.jpeg`, `.png`, `.tif`, `.tiff`, `.webp`) to optimized `.webp`
- Auto-rotates based on EXIF metadata
- Resizes very large files down to max width `2560px` (never upscales)
- Writes generated files to `public/images/generated/`
- Writes a metadata manifest to `public/images/generated/manifest.json`
- Caches source fingerprints to avoid unnecessary rebuilds

## Commands

```bash
npm run images:build
npm run images:clean
```

`images:build` runs automatically in `predev` and `prebuild`.

## Using Images in Components

Use `next/image` and reference generated assets.

Example:

```tsx
import Image from "next/image";
import imageManifest from "@/../public/images/generated/manifest.json";

const hero = imageManifest["marketing/hero.jpg"];

export function HeroImage() {
  return (
    <Image
      src={hero.src}
      width={hero.width}
      height={hero.height}
      alt="Marketing hero"
      priority
    />
  );
}
```

## Notes

- Keep originals in `assets/images/source/` so design-quality source files are preserved.
- Serve only generated derivatives from `public/images/generated/`.
- For external image hosts, whitelist domains in `next.config.ts` under `images.remotePatterns`.
