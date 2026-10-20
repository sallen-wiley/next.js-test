// Usage: node scripts/figma-node-props.js <nodeId> [nodeId...]
// Prints live name, type and component property definitions for Figma nodes.
const FILE_KEY = "3ZH2uUGxYtIItgBpwjz4NC";

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.error("FIGMA_ACCESS_TOKEN not set");
  process.exit(1);
}

const ids = process.argv.slice(2).map((id) => id.replace("-", ":"));
if (!ids.length) {
  console.error("Pass at least one node id, e.g. 1479:32615");
  process.exit(1);
}

(async () => {
  const res = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${ids.join(",")}`,
    { headers: { "X-Figma-Token": token } },
  );
  if (!res.ok) {
    console.error(`API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const data = await res.json();

  for (const id of ids) {
    const doc = data?.nodes?.[id]?.document ?? null;
    if (!doc) {
      console.log(`\n=== ${id} :: NOT FOUND ===`);
      continue;
    }
    console.log(`\n=== ${id}  "${doc.name}"  [${doc.type}] ===`);

    const defs = doc.componentPropertyDefinitions ?? {};
    const keys = Object.keys(defs);
    if (!keys.length) {
      console.log("   (no component properties)");
    }
    for (const k of keys) {
      const v = defs[k];
      const variants = v.variantOptions
        ? ` [${v.variantOptions.join(", ")}]`
        : "";
      console.log(`   ${k}  ->  ${v.type}${variants}`);
    }

    const kids = doc.children ?? [];
    if (kids.length) {
      console.log(
        `   children: ${kids.map((c) => `${c.name} (${c.type})`).join(", ")}`,
      );
    }
  }
})();
