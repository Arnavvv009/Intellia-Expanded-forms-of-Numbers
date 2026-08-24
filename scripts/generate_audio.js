/**
 * generate_audio.js — Place Value Pioneers
 *
 * Offline TTS generation using ElevenLabs API (Alice voice).
 * Saves MP3 files to public/assets/audio/ and writes src/utils/audioMap.js.
 *
 * Usage:  node scripts/generate_audio.js
 * Requires: VITE_ELEVENLABS_API_KEY in .env.local
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

/* ── Paths ─────────────────────────────────────────────────── */
const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');
const AUDIO_DIR  = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_PATH   = path.join(ROOT, 'src', 'utils', 'audioMap.js');
const ENV_PATH   = path.join(ROOT, '.env.local');

/* ── Load API key from .env.local ──────────────────────────── */
function loadEnv() {
  try {
    const raw = fs.readFileSync(ENV_PATH, 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^VITE_ELEVENLABS_API_KEY\s*=\s*(.+)$/);
      if (m) return m[1].trim();
    }
  } catch {}
  return process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY || '';
}

const API_KEY = loadEnv();
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';

/* ── Per-style voice settings (from pipeline doc) ─────────── */
const STYLE_SETTINGS = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:  { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

/* ══════════════════════════════════════════════════════════════
   PHRASES — paragraph/question text ONLY (no titles/labels)
   Each entry must exactly match what's in narration.js
   ══════════════════════════════════════════════════════════════ */
const phrases = [
  /* ── Landing ─────────────────────────────────────────────── */
  { text: "Ready to master place value? Let's go!", style: 'celebration' },
  { text: "Join Hundy, Tenny, and Onesy and discover how every number is secretly made of hundreds, tens, and ones — through stories, simulations, and exciting games!", style: 'statement' },

  /* ── Wonder ──────────────────────────────────────────────── */
  { text: "A number has 4 hundreds, 7 tens, and 2 ones. What is its expanded form?", style: 'question' },
  { text: "What if we need to show the value of each digit separately?", style: 'thinking' },
  { text: "Every digit has its own special place value!", style: 'emphasis' },

  /* ── Story slides ────────────────────────────────────────── */
  { text: "Meet Hundy, Tenny, and Onesy — three robot crew members who live inside every 3-digit number. They show how numbers are built from hundreds, tens, and ones!", style: 'statement' },
  { text: "Every 3-digit number has three special homes — Hundreds on the left, Tens in the middle, Ones on the right. Hundy loves Hundreds, Tenny loves Tens, and Onesy loves Ones!", style: 'statement' },
  { text: "The 3 in 358 is in the Hundreds place, so it means 300. The 5 is in the Tens place, so it means 50. The 8 is in the Ones place, so it means 8. So 358 equals 300 plus 50 plus 8!", style: 'emphasis' },
  { text: "We can go the other way too! If you see 400 plus 70 plus 2, just add the parts: 400 plus 70 equals 470, then 470 plus 2 equals 472. Expanded form and standard form show the same number!", style: 'statement' },

  /* ── Simulate — station intros ───────────────────────────── */
  { text: "Welcome to the Block Builder! Use the plus and minus buttons to place hundreds, tens, and ones blocks until the total matches the target number.", style: 'instruction' },
  { text: "Count the fuel groups, then write the expanded form. Each crate holds 100 fuel cells, each tube holds 10, and each loose cell is just 1!", style: 'instruction' },
  { text: "You're a Digit Detective! Tap a digit from the number, then tap the correct place-value house to drop it in. Match all three digits to complete the mission!", style: 'celebration' },
  { text: "The rocket has landed on a number on the number line. Decode its expanded form by filling in the hundreds, tens, and ones values!", style: 'question' },

  /* ── Play — arena intro ───────────────────────────────────── */
  { text: "Welcome to the Galaxy Quiz! Answer questions correctly to earn stars and build your streak. Let's go, Place Value Pioneer!", style: 'celebration' },

  /* ── Play — correct feedback ─────────────────────────────── */
  { text: "Fantastic! That's exactly right!",                    style: 'celebration' },
  { text: "Brilliant! You know your place values!",              style: 'celebration' },
  { text: "Perfect! Keep that streak going!",                    style: 'celebration' },
  { text: "Amazing work, Place Value Pioneer!",                  style: 'celebration' },
  { text: "Yes! Hundy, Tenny and Onesy are cheering for you!",   style: 'celebration' },
  { text: "Superb! You really understand expanded form!",        style: 'celebration' },

  /* ── Play — incorrect feedback ───────────────────────────── */
  { text: "Not quite, but you're learning! Check each place value.",          style: 'encouragement' },
  { text: "Almost! Remember: hundreds on the left, ones on the right.",       style: 'encouragement' },
  { text: "Good try! Every mistake helps us learn more!",                     style: 'encouragement' },
  { text: "Keep going! Hundy, Tenny and Onesy believe in you!",               style: 'encouragement' },
  { text: "Don't worry — take a look at the explanation and try the next one!", style: 'encouragement' },

  /* ── Play — session end ───────────────────────────────────── */
  { text: "Mission complete, Galaxy Champion! You finished the quiz and proved you know expanded form inside and out!", style: 'celebration' },

  /* ── Reflect ─────────────────────────────────────────────── */
  { text: "Amazing work completing Place Value Pioneers! You've mastered expanded form — breaking numbers into hundreds, tens, and ones!", style: 'celebration' },
  { text: "You can now write any 3-digit number in expanded form and read it like a true place value expert!", style: 'emphasis' },
  { text: "What does the 6 mean in 634?",                        style: 'question' },
  { text: "Write 509 in expanded form.",                         style: 'question' },
  { text: "What number equals 300 plus 40 plus 8?",             style: 'question' },
  { text: "Which digit is in the tens place in 726?",            style: 'question' },
];

/* ── Helpers ────────────────────────────────────────────────── */
function slugify(text, style) {
  const slug = `${style}_${text}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 80);
  return `${slug}.mp3`;
}

async function generateMp3(text, style) {
  const settings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key':   API_KEY,
      'Content-Type': 'application/json',
      'Accept':       'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: settings,
    }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.status);
    throw new Error(`ElevenLabs ${res.status}: ${msg}`);
  }
  return res.arrayBuffer();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Main ───────────────────────────────────────────────────── */
async function main() {
  if (!API_KEY) {
    console.error('\n❌  No API key found. Set VITE_ELEVENLABS_API_KEY in .env.local\n');
    process.exit(1);
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const audioMap = {};
  let generated = 0;
  let skipped   = 0;
  let failed    = 0;

  console.log(`\n🎙  Place Value Pioneers — Audio Generation`);
  console.log(`📁  Output: ${AUDIO_DIR}`);
  console.log(`🔑  Voice: Alice (${VOICE_ID})`);
  console.log(`📝  Phrases: ${phrases.length}\n`);

  for (const { text, style } of phrases) {
    const filename = slugify(text, style);
    const filepath = path.join(AUDIO_DIR, filename);
    const mapKey   = `${style}:${text}`;

    if (fs.existsSync(filepath)) {
      console.log(`  ⏭   skip  (exists): ${filename}`);
      audioMap[mapKey] = `/assets/audio/${filename}`;
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`  🎤  gen   [${style}] "${text.slice(0, 55)}${text.length > 55 ? '…' : ''}" … `);
      const buf = await generateMp3(text, style);
      fs.writeFileSync(filepath, Buffer.from(buf));
      audioMap[mapKey] = `/assets/audio/${filename}`;
      generated++;
      console.log('✅');
      await sleep(550); // rate-limit: 500ms+ between calls
    } catch (err) {
      failed++;
      console.log(`❌  ${err.message}`);
    }
  }

  /* Write audioMap.js */
  const mapContent = `/**
 * audioMap.js — AUTO-GENERATED by scripts/generate_audio.js
 * Maps "style:text" → "/assets/audio/filename.mp3"
 * DO NOT EDIT MANUALLY — run: node scripts/generate_audio.js
 */
const audioMap = ${JSON.stringify(audioMap, null, 2)};
export default audioMap;
`;
  fs.writeFileSync(MAP_PATH, mapContent, 'utf8');

  console.log('\n──────────────────────────────────────────────────');
  console.log(`✅  Generated : ${generated}`);
  console.log(`⏭   Skipped   : ${skipped}`);
  console.log(`❌  Failed    : ${failed}`);
  console.log(`📄  audioMap  : ${Object.keys(audioMap).length} entries → ${MAP_PATH}`);
  console.log('──────────────────────────────────────────────────\n');
}

main().catch(err => { console.error(err); process.exit(1); });
