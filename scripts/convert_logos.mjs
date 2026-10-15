// Converts uploaded submission logos (src/data/submissions/<Name>_logo.<ext>)
// to AVIF at src/logos/<Name>.avif (256px, suitable for the 80px table icons)
// and removes the uploaded original. No-op when there are no uploads.
// ponytail: name must match the form's sanitizer (ProjectForm.jsx logoBase) —
// single submission flow, per-project locks if that ever changes.
import { readdir, unlink } from "node:fs/promises";
import sharp from "sharp";

const dir = "src/data/submissions";

const uploads = (await readdir(dir).catch(() => []))
  .filter((f) => /_logo\.(png|jpe?g|webp|avif)$/i.test(f));

for (const file of uploads) {
  const out = `src/logos/${file.replace(/_logo\.[^.]+$/i, "")}.avif`;
  await sharp(`${dir}/${file}`)
    .resize(256, 256, { fit: "inside", withoutEnlargement: true })
    .avif({ quality: 50, effort: 4 })
    .toFile(out);
  await unlink(`${dir}/${file}`);
  console.log(`converted ${file} -> ${out}`);
}

if (uploads.length === 0) console.log("no submission logos to convert");
