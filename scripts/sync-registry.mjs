import { mkdir, writeFile } from "node:fs/promises";

const source = "https://api.mcp.github.com/v0.1/servers";
const destination = new URL("../docs/v0.1/servers", import.meta.url);
const servers = [];
const seenCursors = new Set();
let cursor;

for (;;) {
  const url = new URL(source);
  url.searchParams.set("version", "latest");
  url.searchParams.set("limit", "100");
  if (cursor) url.searchParams.set("cursor", cursor);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "github-mcp-registry-pages-mirror",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub MCP Registry returned ${response.status} ${response.statusText}`);
  }

  const page = await response.json();
  if (!Array.isArray(page.servers) || !page.metadata) {
    throw new Error("GitHub MCP Registry returned an unexpected response");
  }

  servers.push(...page.servers);
  const nextCursor = page.metadata.nextCursor;
  if (!nextCursor) break;
  if (seenCursors.has(nextCursor)) throw new Error("GitHub MCP Registry repeated a pagination cursor");

  seenCursors.add(nextCursor);
  cursor = nextCursor;
}

const registry = {
  servers,
  metadata: {
    count: servers.length,
  },
};

await mkdir(new URL("../docs/v0.1/", import.meta.url), { recursive: true });
await writeFile(destination, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Mirrored ${servers.length} servers from ${source}`);
