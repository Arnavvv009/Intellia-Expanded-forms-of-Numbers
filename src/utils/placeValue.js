/**
 * Core place-value utility — used across Story, Simulate, and Play.
 */

const NUMBER_WORDS = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS_WORDS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];
const HUNDREDS_WORDS = [
  '', 'one hundred', 'two hundred', 'three hundred', 'four hundred',
  'five hundred', 'six hundred', 'seven hundred', 'eight hundred', 'nine hundred',
];

function tensToWords(t, o) {
  if (t === 0 && o === 0) return '';
  if (t === 0) return NUMBER_WORDS[o];
  if (t === 1) return NUMBER_WORDS[10 + o];
  if (o === 0) return TENS_WORDS[t];
  return `${TENS_WORDS[t]}-${NUMBER_WORDS[o]}`;
}

/**
 * Decompose a number into place-value parts.
 * @param {number} value - Integer 1–1000
 * @returns {PlaceValueNumber}
 */
export function decompose(value) {
  if (value === 1000) {
    return {
      value: 1000,
      hundreds: 10,
      tens: 0,
      ones: 0,
      expandedForm: '1000 + 0 + 0',
      wordsForm: 'one thousand',
      hasZeroDigit: true,
    };
  }

  const v = Math.max(1, Math.min(999, Math.floor(value)));
  const hundreds = Math.floor(v / 100);
  const tens = Math.floor((v % 100) / 10);
  const ones = v % 10;

  const H = hundreds * 100;
  const T = tens * 10;
  const O = ones;

  // Build words form
  const hundredsPart = HUNDREDS_WORDS[hundreds];
  const remainder = tensToWords(tens, ones);
  const wordsForm = hundredsPart
    ? remainder ? `${hundredsPart} and ${remainder}` : hundredsPart
    : remainder;

  return {
    value: v,
    hundreds,
    tens,
    ones,
    expandedForm: `${H} + ${T} + ${O}`,
    wordsForm: wordsForm || 'zero',
    hasZeroDigit: hundreds === 0 || tens === 0 || ones === 0,
  };
}

/**
 * Generate a pool of numbers for a given difficulty tier.
 */
export function getNumberPoolForTier(tier) {
  const pool = [];
  switch (tier) {
    case 1: // Easy: 100–399, no zeros
      for (let h = 1; h <= 3; h++) {
        for (let t = 1; t <= 9; t++) {
          for (let o = 1; o <= 9; o++) {
            pool.push(h * 100 + t * 10 + o);
          }
        }
      }
      break;
    case 2: // Medium: 100–999, one zero digit
      for (let n = 100; n <= 999; n++) {
        const { hundreds, tens, ones } = decompose(n);
        const zeros = [hundreds, tens, ones].filter(d => d === 0).length;
        if (zeros === 1) pool.push(n);
      }
      break;
    case 3: // Hard: 400–999, no zeros (recomposition focus)
      for (let h = 4; h <= 9; h++) {
        for (let t = 1; t <= 9; t++) {
          for (let o = 1; o <= 9; o++) {
            pool.push(h * 100 + t * 10 + o);
          }
        }
      }
      break;
    case 4: // Challenge: two zeros, special cases, 1000
      for (let n = 100; n <= 999; n++) {
        const { hundreds, tens, ones } = decompose(n);
        const zeros = [hundreds, tens, ones].filter(d => d === 0).length;
        if (zeros >= 2) pool.push(n);
      }
      pool.push(1000);
      break;
    default:
      for (let n = 100; n <= 999; n++) pool.push(n);
  }
  return pool;
}
