import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_SRC_ROOTS = [
  "auth-js",
  "functions-js",
  "postgrest-js",
  "realtime-js",
  "ssr",
  "storage-js",
  "supabase-js",
].map((pkg) =>
  path.join(process.cwd(), "node_modules", "@supabase", pkg, "src"),
);

const SYNTHETIC_SOURCE_CONTENT: Record<string, string> = {
  "/_next/internal/helpers.ts":
    "// Virtual Turbopack helper source placeholder for DevTools.\n",
  "/_next/static/runtime.ts":
    "// Virtual Turbopack runtime source placeholder for DevTools.\n",
};

function toSafeProjectPath(requestPath: string): string | null {
  if (requestPath.startsWith("/src/")) {
    return requestPath.slice("/src/".length);
  }

  if (requestPath.startsWith("/_next/src/")) {
    return requestPath.slice("/_next/src/".length);
  }

  return null;
}

function isAllowedExtension(filePath: string): boolean {
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx");
}

function resolveSourcePath(relativePath: string): string | null {
  for (const root of SUPABASE_SRC_ROOTS) {
    const resolvedPath = path.resolve(root, relativePath);
    const normalizedRoot = path.resolve(root) + path.sep;

    if (!resolvedPath.startsWith(normalizedRoot)) {
      continue;
    }

    if (!isAllowedExtension(resolvedPath)) {
      continue;
    }

    if (!existsSync(resolvedPath)) {
      continue;
    }

    return resolvedPath;
  }

  return null;
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestedPath =
    request.nextUrl.searchParams.get("p") ||
    request.headers.get("x-dev-source-path") ||
    "";

  if (requestedPath in SYNTHETIC_SOURCE_CONTENT) {
    return new NextResponse(SYNTHETIC_SOURCE_CONTENT[requestedPath], {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  const relativePath = toSafeProjectPath(requestedPath);

  if (!relativePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resolvedPath = resolveSourcePath(relativePath);

  if (!resolvedPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const contents = await readFile(resolvedPath, "utf8");
    return new NextResponse(contents, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
