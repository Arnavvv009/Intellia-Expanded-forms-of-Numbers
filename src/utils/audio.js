/**
 * Audio Engine — Place Value Pioneers
 * Priority: 1. Pre-generated MP3 (audioMap)  2. ElevenLabs API fallback
 * Voice: Alice  Xb7hH8MSUJpSbSDYk0k2  eleven_multilingual_v2
 */

import audioMap from './audioMap.js';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  celebration:  { stability:0.12, similarity_boost:0.45, style:0.75, use_speaker_boost:true },
  encouragement:{ stability:0.16, similarity_boost:0.50, style:0.65, use_speaker_boost:true },
  question:     { stability:0.20, similarity_boost:0.55, style:0.55, use_speaker_boost:true },
  emphasis:     { stability:0.16, similarity_boost:0.50, style:0.60, use_speaker_boost:true },
  thinking:     { stability:0.24, similarity_boost:0.60, style:0.35, use_speaker_boost:true },
  statement:    { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
  instruction:  { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
};

/* ── State ──────────────────────────────────────────────────── */
let _enabled      = true;
let _currentAudio = null;
let _activeId     = 0;
const _blobCache  = new Map(); // key → blob URL (pre-fetched)

/* ── Public controls ────────────────────────────────────────── */
export function setAudioEnabled(on) {
  _enabled = on;
  if (!on) stopNarration();
}
export function isAudioEnabled() { return _enabled; }

export function stopNarration() {
  _activeId++;
  if (_currentAudio) {
    try { _currentAudio.pause(); _currentAudio.src = ''; } catch (_) {}
    _currentAudio = null;
  }
}

/* ── URL resolution ─────────────────────────────────────────── */
// For pre-generated MP3s: returns the static path directly (no fetch needed — browser caches it)
// For API fallback: fetches and stores blob URL
function getStaticPath(text, style) {
  const key = `${style}:${text}`;
  return audioMap[key] || audioMap[text] || null;
}

async function resolveUrl(text, style) {
  const key = `${style}:${text}`;

  // 1. Already blob-cached (pre-fetched)
  if (_blobCache.has(key)) return _blobCache.get(key);

  // 2. Static MP3 path — browser will cache it automatically
  const staticPath = getStaticPath(text, style);
  if (staticPath) return staticPath;

  // 3. ElevenLabs API fallback
  try {
    const settings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
    const res = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: VOICE_ID, model_id: MODEL, voice_settings: settings }),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const url = URL.createObjectURL(await res.blob());
    _blobCache.set(key, url);
    return url;
  } catch (err) {
    console.warn('[Audio] API failed:', text.slice(0,50), err.message);
    return null;
  }
}

/* ── Preload (call on component mount to eliminate first-play delay) ── */
export function preloadAudio(segments) {
  if (!Array.isArray(segments)) return;
  segments.forEach(({ text, style = 'statement' }) => {
    const staticPath = getStaticPath(text, style);
    if (staticPath) {
      // Warm the browser's HTTP cache by fetching the file in background
      const key = `${style}:${text}`;
      if (!_blobCache.has(key)) {
        fetch(staticPath)
          .then(r => r.blob())
          .then(blob => { _blobCache.set(key, URL.createObjectURL(blob)); })
          .catch(() => {});
      }
    }
  });
}

/* ── Playback ───────────────────────────────────────────────── */
async function playSingle(text, style, id) {
  if (!_enabled || _activeId !== id) return;
  const url = await resolveUrl(text, style);
  if (!url || _activeId !== id) return;

  await new Promise(resolve => {
    const audio = new Audio(url);
    _currentAudio = audio;
    audio.onended  = () => { if (_currentAudio === audio) _currentAudio = null; resolve(); };
    audio.onerror  = () => { if (_currentAudio === audio) _currentAudio = null; resolve(); };
    audio.play().catch(() => { if (_currentAudio === audio) _currentAudio = null; resolve(); });
  });
}

async function playQueue(segments, id) {
  for (let i = 0; i < segments.length; i++) {
    if (_activeId !== id) return;
    // Eagerly preload next segment
    if (i + 1 < segments.length) {
      resolveUrl(segments[i+1].text, segments[i+1].style);
    }
    await playSingle(segments[i].text, segments[i].style, id);
  }
}

/* ── Public narrate API ─────────────────────────────────────── */
export function narrate(segments) {
  if (!segments?.length) return;
  stopNarration();               // stop current + increment _activeId
  if (!_enabled) return;
  const id = _activeId;
  playQueue(segments, id);       // async, no await
}

/* ── Convenience helpers ────────────────────────────────────── */
export const say      = (t) => narrate([{ text:t, style:'statement'     }]);
export const ask      = (t) => narrate([{ text:t, style:'question'      }]);
export const cheer    = (t) => narrate([{ text:t, style:'celebration'   }]);
export const celebrate= (t) => narrate([{ text:t, style:'celebration'   }]);
export const emphasize= (t) => narrate([{ text:t, style:'emphasis'      }]);
export const think    = (t) => narrate([{ text:t, style:'thinking'      }]);
export const instruct = (t) => narrate([{ text:t, style:'instruction'   }]);
export const encourage= (t) => narrate([{ text:t, style:'encouragement' }]);
