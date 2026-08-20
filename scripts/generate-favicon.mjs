import { writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const sizes = [16, 32, 48];
const source = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="112" fill="#087f73"/>
    <path
      fill="#ffffff"
      d="M256 94c-22 0-40-13-67-13-61 0-101 48-101 112 0 45 19 77 36 105 14 24 21 46 25 82 4 34 15 57 34 57 21 0 26-25 31-65 5-41 18-59 42-59s37 18 42 59c5 40 10 65 31 65 19 0 30-23 34-57 4-36 11-58 25-82 17-28 36-60 36-105 0-64-40-112-101-112-27 0-45 13-67 13Zm-46 45c15 7 29 11 46 11s31-4 46-11c11-5 25 0 30 11 5 12 0 25-12 31-20 9-41 15-64 15s-44-6-64-15c-12-6-17-19-12-31 5-11 19-16 30-11Z"
    />
  </svg>
`);

const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(source)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

const headerSize = 6;
const entrySize = 16;
let imageOffset = headerSize + entrySize * pngs.length;
const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);

const entries = pngs.map((png, index) => {
  const entry = Buffer.alloc(entrySize);
  const size = sizes[index];

  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(imageOffset, 12);
  imageOffset += png.length;

  return entry;
});

const output = Buffer.concat([header, ...entries, ...pngs]);
await writeFile(path.join(process.cwd(), "src/app/favicon.ico"), output);

console.log("Generated src/app/favicon.ico with 16, 32, and 48 pixel icons.");
