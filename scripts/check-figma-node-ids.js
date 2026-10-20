/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const FILE_KEY = "3ZH2uUGxYtIItgBpwjz4NC";
const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.error("FIGMA_ACCESS_TOKEN not set");
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".figma.tsx")) files.push(p);
  }
})("src");

const found = [];
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const matches = [
    ...text.matchAll(/node-id=([0-9]+)(?:%3A|:|-)([0-9]+)/gi),
  ];
  const ids = [
    ...new Set(matches.map((m) => `${m[1]}:${m[2]}`)),
  ];
  if (!ids.length) {
    found.push({ file: path.relative("src", f), id: null });
    continue;
  }
  for (const id of ids) {
    found.push({ file: path.relative("src", f), id });
  }
}

const ids = found.filter((x) => x.id).map((x) => x.id);

const get = async (url) => {
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  if (!res.ok) {
    console.error(`API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  return res.json();
};

(async () => {
  // /nodes is live file content; /component_sets and /components are the last
  // PUBLISHED library snapshot. They drift apart until the library is republished.
  const [live, sets, comps] = await Promise.all([
    get(
      `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${ids.join(",")}`,
    ),
    get(`https://api.figma.com/v1/files/${FILE_KEY}/component_sets`),
    get(`https://api.figma.com/v1/files/${FILE_KEY}/components`),
  ]);

  const published = new Map();
  for (const s of sets.meta?.component_sets ?? [])
    published.set(s.node_id, s.name);
  for (const c of comps.meta?.components ?? [])
    published.set(c.node_id, c.name);

  let problems = 0;
  for (const { file, id } of found) {
    if (!id) {
      console.log(`NO-ID       ${file}`);
      problems++;
      continue;
    }
    const liveName = live.nodes?.[id]?.document?.name ?? null;
    const pubName = published.get(id) ?? null;

    if (!liveName) {
      console.log(`STALE       ${id.padEnd(14)} ${file}  (not in live file)`);
      problems++;
    } else if (!pubName) {
      console.log(
        `UNPUBLISHED ${id.padEnd(
          14,
        )} ${file}  "${liveName}"  (live, but not in published library)`,
      );
      problems++;
    } else if (pubName !== liveName) {
      console.log(
        `NAME-DRIFT  ${id.padEnd(
          14,
        )} ${file}  live "${liveName}" vs published "${pubName}"`,
      );
      problems++;
    } else {
      console.log(`OK          ${id.padEnd(14)} ${file}  "${liveName}"`);
    }
  }

  console.log(`\n${found.length} mappings, ${problems} needing attention`);
  console.log(
    "\nNote: OK means the id resolves in the live file. Figma keeps deleted components\n" +
      "as orphaned nodes until the library is republished, so a resolving id does NOT\n" +
      "prove the component still exists on canvas. Confirm by selecting it in Figma.",
  );
})();
