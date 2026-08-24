import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../utils/placeValue.js';
import { celebrate, encourage } from '../../utils/audio.js';
import './Station.css';

function genTarget(prev = 0) {
  let n;
  do {
    n = Math.floor(Math.random() * 900) + 100;
  } while (n === prev);
  return n;
}

export default function DigitDetectiveStation({ onComplete }) {
  const [target, setTarget] = useState(() => genTarget());
  const [selectedPos, setSelectedPos] = useState(null); // 0=hundreds,1=tens,2=ones
  const [litHouse, setLitHouse] = useState(null); // 'hundreds'|'tens'|'ones'
  const [houseFeedback, setHouseFeedback] = useState({}); // position→ correct/incorrect
  const [allDone, setAllDone] = useState(false);
  const [result, setResult] = useState(null);

  const { hundreds, tens, ones } = decompose(target);
  const digits = [hundreds, tens, ones];
  const positions = ['hundreds', 'tens', 'ones'];
  const placeValues = [hundreds * 100, tens * 10, ones];

  function selectDigit(pos) {
    if (houseFeedback[pos]) return;
    setSelectedPos(pos);
  }

  function dropToHouse(house) {
    if (selectedPos === null) return;
    const correct = positions[selectedPos] === house;

    const newFeedback = { ...houseFeedback, [selectedPos]: correct ? 'correct' : 'incorrect' };
    setHouseFeedback(newFeedback);
    setLitHouse(house);

    if (correct) {
      celebrate(`Great job! The ${digits[selectedPos]} is worth ${placeValues[selectedPos]}!`);
    } else {
      encourage(`That digit belongs in the ${positions[selectedPos]} house!`);
    }

    setSelectedPos(null);

    // Check if all 3 done correctly
    const allCorrect = Object.keys(newFeedback).length === 3 && Object.values(newFeedback).every(v => v === 'correct');
    if (allCorrect) {
      setAllDone(true);
      setResult('correct');
      setTimeout(() => onComplete?.(), 1200);
    }
  }

  function tryAnother() {
    setTarget(genTarget(target));
    setSelectedPos(null);
    setLitHouse(null);
    setHouseFeedback({});
    setAllDone(false);
    setResult(null);
  }

  return (
    <div className="station-container">
      <div className="station-prompt">
        Tap a digit, then drop it into the correct house!
      </div>

      {/* 3-digit number display */}
      <div className="digit-display">
        {digits.map((d, i) => {
          const fb = houseFeedback[i];
          let cls = 'digit-card';
          if (selectedPos === i) cls += ' selected';
          if (fb === 'correct')   cls += ' correct';
          if (fb === 'incorrect') cls += ' incorrect';
          return (
            <motion.button
              key={i}
              className={cls}
              onClick={() => selectDigit(i)}
              whileHover={!fb ? { scale: 1.1 } : {}}
              whileTap={!fb ? { scale: 0.9 } : {}}
              aria-label={`Digit ${d} in the ${positions[i]} place`}
              aria-pressed={selectedPos === i}
            >
              {d}
            </motion.button>
          );
        })}
      </div>

      {selectedPos !== null && (
        <div className="station-prompt" style={{ fontSize: 'var(--fs-sm)', opacity: 0.8 }}>
          Tap a house to place digit <strong>{digits[selectedPos]}</strong>
        </div>
      )}

      {/* Houses */}
      <div className="houses">
        {['hundreds', 'tens', 'ones'].map((house, hi) => {
          const placedIdx = Object.entries(houseFeedback).find(
            ([idx, status]) => positions[parseInt(idx)] === house && status === 'correct'
          );
          const isLit = placedIdx !== undefined;
          const houseValue = isLit ? placeValues[parseInt(placedIdx[0])] : null;

          return (
            <motion.div
              key={house}
              className={`house house--${house} ${isLit ? 'lit' : ''}`}
              onClick={() => dropToHouse(house)}
              whileHover={selectedPos !== null && !isLit ? { scale: 1.05 } : {}}
              role="button"
              aria-label={`${house} house`}
            >
              <span className={`house-label text-${house}`}>
                {house.charAt(0).toUpperCase() + house.slice(1)}
              </span>
              <span className="house-name">
                {house === 'hundreds' ? '🟦 Hundy' : house === 'tens' ? '🟩 Tenny' : '🟡 Onesy'}
              </span>
              {isLit && (
                <motion.span
                  className={`house-value text-${house}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  = {houseValue}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            className="station-feedback station-feedback--correct"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ✅ Perfect! {target} = {hundreds * 100} + {tens * 10} + {ones}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="station-actions">
        <button className="btn-secondary" onClick={tryAnother}>🔄 Try Another</button>
      </div>
    </div>
  );
}
