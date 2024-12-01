import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mimic `__dirname` in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 48, 128];
const baseIcon = `
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#0052CC"/>
  <text x="64" y="80" text-anchor="middle" font-size="72" font-family="Arial" fill="white">U</text>
</svg>
`;

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(baseIcon))
      .resize(size, size)
      .toFile(path.join(__dirname, `icon${size}.png`));
  }
}

generateIcons().catch(console.error);
