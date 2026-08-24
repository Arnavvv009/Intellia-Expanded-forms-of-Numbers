/**
 * narration.js — Place Value Pioneers
 *
 * All narration scripts for every phase of the module.
 * RULE: Paragraph/question text ONLY. No titles, headings, labels.
 * Each string here MUST match exactly what appears in the UI
 * AND exactly what's in the `phrases` array in generate_audio.js.
 */

import { narrate, say, ask, cheer, celebrate, emphasize, think, instruct, encourage } from './audio.js';
export { narrate };

/* ══════════════════════════════════════════════════════
   LANDING / HERO
   ══════════════════════════════════════════════════════ */
export function landingNarration() {
  return narrate([
    { text: "Ready to master place value? Let's go!", style: 'celebration' },
    { text: "Join Hundy, Tenny, and Onesy and discover how every number is secretly made of hundreds, tens, and ones — through stories, simulations, and exciting games!", style: 'statement' },
  ]);
}

/* ══════════════════════════════════════════════════════
   WONDER
   ══════════════════════════════════════════════════════ */
export function wonderNarration() {
  return narrate([
    { text: "A number has 4 hundreds, 7 tens, and 2 ones. What is its expanded form?", style: 'question' },
    { text: "What if we need to show the value of each digit separately?", style: 'thinking' },
    { text: "Every digit has its own special place value!", style: 'emphasis' },
  ]);
}

/* ══════════════════════════════════════════════════════
   STORY — one function per slide
   ══════════════════════════════════════════════════════ */
export function storySlide1Narration() {
  return narrate([
    { text: "Meet Hundy, Tenny, and Onesy — three robot crew members who live inside every 3-digit number. They show how numbers are built from hundreds, tens, and ones!", style: 'statement' },
  ]);
}

export function storySlide2Narration() {
  return narrate([
    { text: "Every 3-digit number has three special homes — Hundreds on the left, Tens in the middle, Ones on the right. Hundy loves Hundreds, Tenny loves Tens, and Onesy loves Ones!", style: 'statement' },
  ]);
}

export function storySlide3Narration() {
  return narrate([
    { text: "The 3 in 358 is in the Hundreds place, so it means 300. The 5 is in the Tens place, so it means 50. The 8 is in the Ones place, so it means 8. So 358 equals 300 plus 50 plus 8!", style: 'emphasis' },
  ]);
}

export function storySlide4Narration() {
  return narrate([
    { text: "We can go the other way too! If you see 400 plus 70 plus 2, just add the parts: 400 plus 70 equals 470, then 470 plus 2 equals 472. Expanded form and standard form show the same number!", style: 'statement' },
  ]);
}

/* ══════════════════════════════════════════════════════
   SIMULATE — station intro narrations
   ══════════════════════════════════════════════════════ */
export function stationBuilderIntro() {
  return narrate([
    { text: "Welcome to the Block Builder! Use the plus and minus buttons to place hundreds, tens, and ones blocks until the total matches the target number.", style: 'instruction' },
  ]);
}

export function stationCrateIntro() {
  return narrate([
    { text: "Count the fuel groups, then write the expanded form. Each crate holds 100 fuel cells, each tube holds 10, and each loose cell is just 1!", style: 'instruction' },
  ]);
}

export function stationDetectiveIntro() {
  return narrate([
    { text: "You're a Digit Detective! Tap a digit from the number, then tap the correct place-value house to drop it in. Match all three digits to complete the mission!", style: 'celebration' },
  ]);
}

export function stationRocketIntro() {
  return narrate([
    { text: "The rocket has landed on a number on the number line. Decode its expanded form by filling in the hundreds, tens, and ones values!", style: 'question' },
  ]);
}

/* ══════════════════════════════════════════════════════
   PLAY — arena intro
   ══════════════════════════════════════════════════════ */
export function playArenaIntro() {
  return narrate([
    { text: "Welcome to the Galaxy Quiz! Answer questions correctly to earn stars and build your streak. Let's go, Place Value Pioneer!", style: 'celebration' },
  ]);
}

/* ══════════════════════════════════════════════════════
   PLAY — correct/incorrect feedback variants
   ══════════════════════════════════════════════════════ */
const CORRECT_VARIANTS = [
  [{ text: "Fantastic! That's exactly right!",                   style: 'celebration'   }],
  [{ text: "Brilliant! You know your place values!",             style: 'celebration'   }],
  [{ text: "Perfect! Keep that streak going!",                   style: 'celebration'   }],
  [{ text: "Amazing work, Place Value Pioneer!",                 style: 'celebration'   }],
  [{ text: "Yes! Hundy, Tenny and Onesy are cheering for you!",  style: 'celebration'   }],
  [{ text: "Superb! You really understand expanded form!",       style: 'celebration'   }],
];

const WRONG_VARIANTS = [
  [{ text: "Not quite, but you're learning! Check each place value.",          style: 'encouragement' }],
  [{ text: "Almost! Remember: hundreds on the left, ones on the right.",       style: 'encouragement' }],
  [{ text: "Good try! Every mistake helps us learn more!",                     style: 'encouragement' }],
  [{ text: "Keep going! Hundy, Tenny and Onesy believe in you!",               style: 'encouragement' }],
  [{ text: "Don't worry — take a look at the explanation and try the next one!", style: 'encouragement' }],
];

export function getRandomCorrectFeedback()   { return CORRECT_VARIANTS[Math.floor(Math.random() * CORRECT_VARIANTS.length)]; }
export function getRandomIncorrectFeedback() { return WRONG_VARIANTS[Math.floor(Math.random()   * WRONG_VARIANTS.length)];   }

/* ══════════════════════════════════════════════════════
   PLAY — checkpoint & session end
   ══════════════════════════════════════════════════════ */
export function checkpointNarration(questionNum) {
  return narrate([
    { text: `Checkpoint! You've answered ${questionNum} questions. You're blasting through the Galaxy Quiz like a true Pioneer!`, style: 'celebration' },
  ]);
}

export function sessionCompleteNarration() {
  return narrate([
    { text: "Mission complete, Galaxy Champion! You finished the quiz and proved you know expanded form inside and out!", style: 'celebration' },
  ]);
}

/* ══════════════════════════════════════════════════════
   REFLECT
   ══════════════════════════════════════════════════════ */
export function reflectSummaryNarration() {
  return narrate([
    { text: "Amazing work completing Place Value Pioneers! You've mastered expanded form — breaking numbers into hundreds, tens, and ones!", style: 'celebration' },
    { text: "You can now write any 3-digit number in expanded form and read it like a true place value expert!", style: 'emphasis' },
  ]);
}

export function reflectQ1Narration() {
  return narrate([{ text: "What does the 6 mean in 634?", style: 'question' }]);
}
export function reflectQ2Narration() {
  return narrate([{ text: "Write 509 in expanded form.", style: 'question' }]);
}
export function reflectQ3Narration() {
  return narrate([{ text: "What number equals 300 plus 40 plus 8?", style: 'question' }]);
}
export function reflectQ4Narration() {
  return narrate([{ text: "Which digit is in the tens place in 726?", style: 'question' }]);
}
