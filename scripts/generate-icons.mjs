/**
 * Generates icon-192.png and icon-512.png in /public using Node canvas.
 * Run once: node scripts/generate-icons.mjs
 * Requires: npm install -D canvas  (only needed if you want to regenerate)
 *
 * For CI/Vercel the PNG files are committed directly to the repo so this
 * script is optional.
 */
import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function generate(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#0d1117";
  ctx.fill();

  // Green inner circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = "#13b870";
  ctx.fill();

  // "GH" text
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${size * 0.32}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GH", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

writeFileSync(resolve(__dirname, "../public/icon-192.png"), generate(192));
writeFileSync(resolve(__dirname, "../public/icon-512.png"), generate(512));
console.log("Icons generated: public/icon-192.png, public/icon-512.png");
