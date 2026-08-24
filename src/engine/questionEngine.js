/**
 * Question Engine — generates up to 100 unique randomized questions
 * across 5 types and 4 difficulty tiers.
 */

import { decompose, getNumberPoolForTier } from '../utils/placeValue.js';
import {
  generateExpandedFormDistractors,
  generateStandardFormDistractors,
  generateTrueFalseStatement,
} from './distractorEngine.js';
import { createRNG, shuffle } from './rng.js';

const QUESTION_TYPES = ['mcq', 'fillTiles', 'trueFalse', 'matchPairs', 'buildIt'];
const TIER_DISTRIBUTION = [
  // [tier, count] — 100 total
  [1, 30],
  [2, 30],
  [3, 25],
  [4, 15],
];

let questionCounter = 0;

function makeId() {
  return `q_${String(++questionCounter).padStart(3, '0')}`;
}

/**
 * Build a single MCQ question: "What is the expanded form of N?"
 */
function buildMCQExpanded(number, difficulty) {
  const { expandedForm } = decompose(number);
  const distractors = generateExpandedFormDistractors(number);
  // Fill to 3 distractors if needed
  while (distractors.length < 3) {
    const fake = number + (distractors.length + 1) * 11;
    const { expandedForm: fe } = decompose(fake > 999 ? fake - 200 : fake);
    if (!distractors.includes(fe) && fe !== expandedForm) distractors.push(fe);
  }
  const options = shuffle([expandedForm, ...distractors.slice(0, 3)], createRNG(number + difficulty));
  const correctIndex = options.indexOf(expandedForm);
  return {
    id: makeId(),
    type: 'mcq',
    difficulty,
    number,
    prompt: `What is the expanded form of ${number}?`,
    options,
    correctIndex,
    explanation: `${number} has ${decompose(number).hundreds} hundreds, ${decompose(number).tens} tens, and ${decompose(number).ones} ones. So ${number} = ${expandedForm}.`,
  };
}

/**
 * Build an MCQ question: "Which number equals H + T + O?"
 */
function buildMCQStandard(number, difficulty) {
  const { expandedForm } = decompose(number);
  const distractors = generateStandardFormDistractors(number);
  while (distractors.length < 3) {
    const fake = number + (distractors.length + 1) * 7;
    if (!distractors.includes(fake) && fake !== number && fake >= 100 && fake <= 999) {
      distractors.push(fake);
    } else {
      distractors.push(number + (distractors.length + 1) * 13 > 999 ? number - 13 : number + 13);
    }
  }
  const options = shuffle([String(number), ...distractors.slice(0, 3).map(String)], createRNG(number * 2 + difficulty));
  const correctIndex = options.indexOf(String(number));
  return {
    id: makeId(),
    type: 'mcq',
    difficulty,
    number,
    prompt: `${expandedForm} = ?`,
    options,
    correctIndex,
    explanation: `${expandedForm} = ${number}. Add up the place values: ${decompose(number).hundreds * 100} + ${decompose(number).tens * 10} + ${decompose(number).ones} = ${number}.`,
  };
}

/**
 * Build a Fill-Tiles question: "N = ___ + ___ + ___"
 */
function buildFillTiles(number, difficulty) {
  const { hundreds, tens, ones } = decompose(number);
  return {
    id: makeId(),
    type: 'fillTiles',
    difficulty,
    number,
    prompt: `Complete the expanded form: ${number} = ___ + ___ + ___`,
    correctValues: [hundreds * 100, tens * 10, ones],
    explanation: `${number} = ${hundreds * 100} + ${tens * 10} + ${ones} (${hundreds} hundreds, ${tens} tens, ${ones} ones).`,
  };
}

/**
 * Build a True/False question
 */
function buildTrueFalse(number, difficulty) {
  const tf = generateTrueFalseStatement(number);
  return {
    id: makeId(),
    type: 'trueFalse',
    difficulty,
    number,
    prompt: tf.statement,
    correctAnswer: tf.answer,
    explanation: tf.explanation,
  };
}

/**
 * Build a Match-Pairs set (returns a question with pairs data)
 */
function buildMatchPairs(numbers, difficulty) {
  const pairs = numbers.map(n => ({
    standard: String(n),
    expanded: decompose(n).expandedForm,
  }));
  return {
    id: makeId(),
    type: 'matchPairs',
    difficulty,
    number: numbers[0],
    prompt: 'Match each number with its expanded form!',
    pairs,
    explanation: pairs.map(p => `${p.standard} = ${p.expanded}`).join('; '),
  };
}

/**
 * Build a Build-It question (mini base-ten block builder)
 */
function buildBuildIt(number, difficulty) {
  const { hundreds, tens, ones, expandedForm } = decompose(number);
  return {
    id: makeId(),
    type: 'buildIt',
    difficulty,
    number,
    prompt: `Use the blocks to build ${number}. Place the right number of hundreds, tens, and ones!`,
    target: { hundreds, tens, ones },
    expandedForm,
    explanation: `${number} = ${hundreds} hundred-blocks + ${tens} ten-rods + ${ones} one-cubes = ${expandedForm}.`,
  };
}

/**
 * Generate a session's full question pool (up to 100 questions).
 * @param {number} seed - RNG seed (optional, defaults to Date.now())
 * @returns {Question[]}
 */
export function generateQuestionPool(seed = Date.now()) {
  questionCounter = 0;
  const rng = createRNG(seed);
  const questions = [];

  for (const [tier, count] of TIER_DISTRIBUTION) {
    const pool = shuffle(getNumberPoolForTier(tier), rng);
    let usedNumbers = new Set();
    let qCount = 0;

    for (let i = 0; i < pool.length && qCount < count; i++) {
      const number = pool[i];
      if (usedNumbers.has(number)) continue;
      usedNumbers.add(number);

      // Rotate through question types, but matchPairs needs 4 numbers
      const typeIdx = Math.floor(rng() * QUESTION_TYPES.length);
      const qType = QUESTION_TYPES[typeIdx];

      switch (qType) {
        case 'mcq': {
          // Alternate between expanded→standard and standard→expanded
          const variant = Math.floor(rng() * 2);
          questions.push(
            variant === 0
              ? buildMCQExpanded(number, tier)
              : buildMCQStandard(number, tier)
          );
          qCount++;
          break;
        }
        case 'fillTiles':
          questions.push(buildFillTiles(number, tier));
          qCount++;
          break;
        case 'trueFalse':
          questions.push(buildTrueFalse(number, tier));
          qCount++;
          break;
        case 'matchPairs': {
          // Gather 3 more numbers for the pairs set
          const pairNumbers = [number];
          for (let j = i + 1; j < pool.length && pairNumbers.length < 4; j++) {
            if (!usedNumbers.has(pool[j])) {
              pairNumbers.push(pool[j]);
              usedNumbers.add(pool[j]);
            }
          }
          if (pairNumbers.length >= 3) {
            questions.push(buildMatchPairs(pairNumbers, tier));
            qCount++;
          } else {
            // Fallback to MCQ
            questions.push(buildMCQExpanded(number, tier));
            qCount++;
          }
          break;
        }
        case 'buildIt':
          questions.push(buildBuildIt(number, tier));
          qCount++;
          break;
        default:
          questions.push(buildMCQExpanded(number, tier));
          qCount++;
      }
    }
  }

  return shuffle(questions, rng).slice(0, 100);
}
