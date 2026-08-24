/**
 * Distractor Engine — generates pedagogically meaningful wrong answers
 * based on common Grade 2 misconceptions about place value.
 */

import { decompose } from '../utils/placeValue.js';

/**
 * Generate 3 unique distractors for a given number's expanded form.
 * Misconception patterns:
 *  1. Digit-position swap (e.g. 472 → 400+20+7 or 200+70+4)
 *  2. Wrong magnitude (treat tens digit as ones: 70→7, 7→70)
 *  3. Zero-digit omission (408 → 40+8, missing hundreds)
 *  4. Off-by-one-hundred/ten errors
 *  5. Sum confusion (4+7+2=13 trap)
 */
export function generateExpandedFormDistractors(number) {
  const { hundreds, tens, ones } = decompose(number);
  const H = hundreds * 100;
  const T = tens * 10;
  const O = ones;
  const correct = `${H} + ${T} + ${O}`;
  const distractors = new Set();

  // 1. Digit swap: swap hundreds and tens digits
  if (hundreds !== tens) {
    const swapped = `${tens * 100} + ${hundreds * 10} + ${O}`;
    if (swapped !== correct) distractors.add(swapped);
  }

  // 2. Swap hundreds and ones
  if (hundreds !== ones) {
    const swapped2 = `${ones * 100} + ${T} + ${hundreds}`;
    if (swapped2 !== correct) distractors.add(swapped2);
  }

  // 3. Wrong magnitude on tens digit (use tens digit as ones value, e.g. 70→7)
  const wrongTens = `${H} + ${tens} + ${O}`;
  if (wrongTens !== correct) distractors.add(wrongTens);

  // 4. Wrong magnitude on hundreds digit
  const wrongHundreds = `${hundreds} + ${T} + ${O}`;
  if (wrongHundreds !== correct) distractors.add(wrongHundreds);

  // 5. Zero omission — if there's a zero, omit it
  if (tens === 0) {
    const noZeroTens = `${H} + ${O}`;
    distractors.add(noZeroTens);
  }
  if (ones === 0) {
    const noZeroOnes = `${H} + ${T}`;
    distractors.add(noZeroOnes);
  }

  // 6. Off by one hundred
  if (H > 0) {
    const offH = `${H - 100} + ${T} + ${O}`;
    if (offH !== correct && H - 100 >= 0) distractors.add(offH);
    const offH2 = `${H + 100} + ${T} + ${O}`;
    if (offH2 !== correct) distractors.add(offH2);
  }

  // 7. Sum trap (digit sum instead of expanded form)
  const digitSum = hundreds + tens + ones;
  distractors.add(`${digitSum}`);

  // Filter out the correct answer and return 3
  const pool = [...distractors].filter(d => d !== correct);
  return pool.slice(0, 3);
}

/**
 * Generate distractors for standard-form questions
 * (given expanded form, pick the number)
 */
export function generateStandardFormDistractors(number) {
  const { hundreds, tens, ones } = decompose(number);
  const distractors = new Set();

  // Swap digits
  const swapped1 = tens * 100 + hundreds * 10 + ones;
  const swapped2 = ones * 100 + tens * 10 + hundreds;
  const swapped3 = hundreds * 100 + ones * 10 + tens;

  if (swapped1 !== number) distractors.add(swapped1);
  if (swapped2 !== number) distractors.add(swapped2);
  if (swapped3 !== number) distractors.add(swapped3);

  // Off by a place value unit
  if (number + 10 <= 999) distractors.add(number + 10);
  if (number - 10 >= 100) distractors.add(number - 10);
  if (number + 100 <= 999) distractors.add(number + 100);
  if (number - 100 >= 100) distractors.add(number - 100);

  const pool = [...distractors].filter(d => d !== number && d >= 0 && d <= 1000);
  return pool.slice(0, 3);
}

/**
 * Generate True/False statement — sometimes correct, sometimes not
 */
export function generateTrueFalseStatement(number) {
  const { hundreds, tens, ones } = decompose(number);
  const H = hundreds * 100;
  const T = tens * 10;
  const O = ones;

  // Decide randomly whether to make it true or false
  const makeTrue = Math.random() > 0.5;
  if (makeTrue) {
    return {
      statement: `${H} + ${T} + ${O} is the expanded form of ${number}`,
      answer: true,
      explanation: `Yes! ${number} = ${H} + ${T} + ${O} because it has ${hundreds} hundreds, ${tens} tens, and ${ones} ones.`,
    };
  } else {
    // Swap tens and ones for a false statement
    const wrongT = ones * 10;
    const wrongO = tens;
    return {
      statement: `${H} + ${wrongT} + ${wrongO} is the expanded form of ${number}`,
      answer: false,
      explanation: `Not quite! ${number} = ${H} + ${T} + ${O}. The tens digit is ${tens} (= ${T}), not ${ones}.`,
    };
  }
}
