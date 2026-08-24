/**
 * clean_audio.js — Place Value Pioneers
 *
 * Removes orphaned MP3 files from public/assets/audio/
 * that are no longer referenced in src/utils/audioMap.js.
 *
 * Usage:  node scripts/clean_audio.js
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_PATH  = path.join(ROOT, 'src', 'utils', 'audioMap.js');

function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('No audio directory found — nothing to clean.');
    return;
  }
  if (!fs.existsSync(MAP_PATH)) {
    console.log('No audioMap.js found — cannot determine referenced files.');
    return;
  }

  const mapContent  = fs.readFileSync(MAP_PATH, 'utf8');
  const referenced  = new Set(
    [...mapContent.matchAll(/\/assets\/audio\/([^"]+\.mp3)/g)].map(m => m[1])
  );

  const all    = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
  let removed  = 0;
  let retained = 0;

  for (const file of all) {
    if (!referenced.has(file)) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
      console.log(`  🗑   removed orphan: ${file}`);
      removed++;
    } else {
      retained++;
    }
  }

  console.log(`\n✅  Clean complete.`);
  console.log(`    Removed:  ${removed}`);
  console.log(`    Retained: ${retained}\n`);
}

main();
