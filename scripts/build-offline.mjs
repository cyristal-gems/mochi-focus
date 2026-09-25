import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const root = new URL("../dist/", import.meta.url);
async function walk(directory, prefix = "") {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory())
      paths.push(
        ...(await walk(new URL(entry.name + "/", directory), name + "/")),
      );
    else if (entry.name !== "sw.js") paths.push(name);
  }
  return paths.sort();
}
const files = await walk(root);
const template = await readFile(
  new URL("./sw-template.js", import.meta.url),
  "utf8",
);
const hash = createHash("sha256").update(template);
for (const file of files)
  hash.update(file).update(await readFile(new URL(file, root)));
await writeFile(
  new URL("sw.js", root),
  template
    .replace("'__VERSION__'", JSON.stringify(hash.digest("hex").slice(0, 16)))
    .replace("__FILES__", JSON.stringify(files)),
);
console.log(
  `Offline build: ${files.length} local assets precached; external music excluded.`,
);
