#!/usr/bin/env node
// Télécharge les images de plages Wikimedia Commons dans public/beaches/
// Usage : node scripts/download-beach-images.mjs

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "beaches");

const images = [
  ["trestraou", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Plage_de_Trestraou%2C_Perros-Guirec_%282015%29.JPG/1200px-Plage_de_Trestraou%2C_Perros-Guirec_%282015%29.JPG"],
  ["tresmeur", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Plage_de_Tresmeur_-_Tr%C3%A9beurden.JPG/1200px-Plage_de_Tresmeur_-_Tr%C3%A9beurden.JPG"],
  ["tregastel", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Plage_du_Coz_Pors%2C_Tregastel-.jpg/1200px-Plage_du_Coz_Pors%2C_Tregastel-.jpg"],
  ["bonaparte", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Plage_Bonaparte_de_Plouha.jpg/1200px-Plage_Bonaparte_de_Plouha.jpg"],
  ["binic", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Plage_de_la_Banche%2C_Binic-3263.jpg/1200px-Plage_de_la_Banche%2C_Binic-3263.jpg"],
  ["rosaires", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Pl%C3%A9rin_-_Plage_des_Rosaires_01.jpg/1200px-Pl%C3%A9rin_-_Plage_des_Rosaires_01.jpg"],
  ["pleneuf", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Pl%C3%A9neuf-Val-Andr%C3%A9_-_Plage_du_Val_Andr%C3%A9_-_Vue_g%C3%A9n%C3%A9rale_01.jpg/1200px-Pl%C3%A9neuf-Val-Andr%C3%A9_-_Plage_du_Val_Andr%C3%A9_-_Vue_g%C3%A9n%C3%A9rale_01.jpg"],
  ["sablesdor", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fr%C3%A9hel_-_Sables-d%27Or-les-Pins_-_Plage_%28vu_vers_l%27Est%29.jpg/1200px-Fr%C3%A9hel_-_Sables-d%27Or-les-Pins_-_Plage_%28vu_vers_l%27Est%29.jpg"],
  ["caroual", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Coucher_de_soleil_sur_la_plage_de_Caroual_%C3%A0_Erquy_-_Avril_2017.jpg/1200px-Coucher_de_soleil_sur_la_plage_de_Caroual_%C3%A0_Erquy_-_Avril_2017.jpg"],
  ["saintpabu", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Plage_du_Lourtuais_Erquy_mars_2022.jpg/1200px-Plage_du_Lourtuais_Erquy_mars_2022.jpg"],
  ["penguen", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Saint-Cast-le-Guildo_-_Plage_de_Pen_Guen_01.jpg/1200px-Saint-Cast-le-Guildo_-_Plage_de_Pen_Guen_01.jpg"],
];

const UA =
  "SurfConditionsApp/1.0 (+https://github.com/lucasissayama/surf-conditions) Node/Fetch";

if (!existsSync(outDir)) {
  await mkdir(outDir, { recursive: true });
}

let ok = 0;
let fail = 0;
for (const [id, url] of images) {
  const target = join(outDir, `${id}.jpg`);
  if (existsSync(target)) {
    console.log(`skip   ${id}.jpg (déjà présent)`);
    continue;
  }
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`fail   ${id}.jpg HTTP ${res.status}`);
      fail++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(target, buf);
    console.log(`ok     ${id}.jpg ${(buf.length / 1024).toFixed(0)} KB`);
    ok++;
    await new Promise((r) => setTimeout(r, 1500)); // gentille pause entre requêtes
  } catch (e) {
    console.log(`fail   ${id}.jpg ${e.message}`);
    fail++;
  }
}

console.log(`\n${ok} téléchargées, ${fail} échecs.`);
if (fail > 0) process.exit(1);
