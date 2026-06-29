#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "assets", "images", "source");
const OUTPUT_DIR = path.join(ROOT, "public", "images", "generated");
const CACHE_PATH = path.join(OUTPUT_DIR, ".build-cache.json");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

const CACHE_VERSION = 1;
const MAX_WIDTH = 2560;
const WEBP_QUALITY = 82;
const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
]);

const args = new Set(process.argv.slice(2));
const shouldClean = args.has("--clean");

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const resolvedPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(resolvedPath)));
      continue;
    }

    files.push(resolvedPath);
  }

  return files;
}

function toPosixPath(inputPath) {
  return inputPath.split(path.sep).join("/");
}

async function readJson(filePath, fallback) {
  if (!(await pathExists(filePath))) {
    return fallback;
  }

  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function cleanOutput() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, ".gitkeep"), "", "utf8");
}

async function main() {
  if (shouldClean) {
    await cleanOutput();
    console.log("images: cleaned generated image output");
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const cache = await readJson(CACHE_PATH, {
    version: CACHE_VERSION,
    files: {},
  });
  const previousFiles =
    cache.version === CACHE_VERSION ? cache.files || {} : {};

  const nextCache = {
    version: CACHE_VERSION,
    files: {},
  };

  if (!(await pathExists(SOURCE_DIR))) {
    await writeJson(CACHE_PATH, nextCache);
    await writeJson(MANIFEST_PATH, {});
    console.log("images: no source images found in assets/images/source");
    return;
  }

  const allFiles = await walk(SOURCE_DIR);
  const imageFiles = allFiles.filter((filePath) =>
    SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );

  const seenInputs = new Set();
  let builtCount = 0;
  let skippedCount = 0;

  for (const sourcePath of imageFiles) {
    const relativeInputPath = path.relative(SOURCE_DIR, sourcePath);
    const parsedInputPath = path.parse(relativeInputPath);
    const relativeOutputPath = path.join(
      parsedInputPath.dir,
      `${parsedInputPath.name}.webp`,
    );
    const outputPath = path.join(OUTPUT_DIR, relativeOutputPath);

    const sourceStat = await fs.stat(sourcePath);
    const fingerprint = `${sourceStat.size}:${Math.floor(sourceStat.mtimeMs)}`;
    const previousEntry = previousFiles[relativeInputPath];
    const outputExists = await pathExists(outputPath);

    seenInputs.add(relativeInputPath);

    if (previousEntry?.fingerprint === fingerprint && outputExists) {
      nextCache.files[relativeInputPath] = previousEntry;
      skippedCount += 1;
      continue;
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const pipeline = sharp(sourcePath, { failOn: "none" }).rotate().resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

    const info = await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    nextCache.files[relativeInputPath] = {
      fingerprint,
      outputPath: toPosixPath(relativeOutputPath),
      width: info.width,
      height: info.height,
    };

    builtCount += 1;
  }

  for (const [relativeInputPath, previousEntry] of Object.entries(
    previousFiles,
  )) {
    if (seenInputs.has(relativeInputPath)) {
      continue;
    }

    if (typeof previousEntry?.outputPath !== "string") {
      continue;
    }

    const staleOutput = path.join(OUTPUT_DIR, previousEntry.outputPath);
    await fs.rm(staleOutput, { force: true });
  }

  const manifest = {};

  for (const [relativeInputPath, cacheEntry] of Object.entries(
    nextCache.files,
  )) {
    manifest[toPosixPath(relativeInputPath)] = {
      src: `/images/generated/${toPosixPath(cacheEntry.outputPath)}`,
      width: cacheEntry.width,
      height: cacheEntry.height,
    };
  }

  await writeJson(CACHE_PATH, nextCache);
  await writeJson(MANIFEST_PATH, manifest);

  console.log(
    `images: processed ${imageFiles.length} source file(s) (${builtCount} built, ${skippedCount} cached)`,
  );
}

main().catch((error) => {
  console.error("images: build failed", error);
  process.exit(1);
});
