import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../utils/placeValue.js';
import { celebrate, encourage } from '../../utils/audio.js';
import './Station.css';

function generateTarget(prev) {
  let n;
  do {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    n = h * 100 + t * 10 + o;
  } while (n === prev);
  return n;
}

export default function CrateCounterStation({ onComplete }) {
  const [target, setTarget] = useState(() => generateTarget(0));
  const [answers, setAnswers] = useState({ h: '', t: '', o: '' });
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const { hundreds, tens, ones } = decompose(target);

  function handleInput(field, val) {
    setResult(null);
    const clean = val.replace(/\D/g, '').slice(0, 3);
    setAnswers(a => ({ ...a, [field]: clean }));
  }

  function checkAnswer() {
    const userH = parseInt(answers.h || '0');
    const userT = parseInt(answers.t || '0');
    const userO = parseInt(answers.o || '0');
    const correct = userH === hundreds * 100 && userT === tens * 10 && userO === ones;
    setAttempts(a => a + 1);
    if (correct) {
      setResult('correct');
      celebrate('You counted the crates perfectly!');
      setTimeout(() => onComplete?.(), 1200);
    } else {
      setResult('incorrect');
      encourage('Not quite — look at each group carefully!');
    }
  }

  function tryAnother() {
    setTarget(generateTarget(target));
    setAnswers({ h: '', t: '', o: '' });
    setResult(null);
  }

  return (
    <div className="station-container">
      <div className="station-visual">
        {/* Crates (hundreds) */}
        <div className="visual-group">
          <div className="visual-items">
            {Array.from({ length: hundreds }).map((_, i) => (
              <motion.span
                key={i}
                className="visual-item"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >📦</motion.span>
            ))}
          </div>
          <div className="visual-label text-hundreds">{hundreds} crate{hundreds !== 1 ? 's' : ''} × 100</div>
        </div>

        {/* Tubes (tens) */}
        <div className="visual-group">
          <div className="visual-items">
            {Array.from({ length: tens }).map((_, i) => (
              <motion.span
                key={i}
                className="visual-item"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >🧪</motion.span>
            ))}
            {tens === 0 && <span className="visual-none">0 tubes</span>}
          </div>
          <div className="visual-label text-tens">{tens} tube{tens !== 1 ? 's' : ''} × 10</div>
        </div>

        {/* Cells (ones) */}
        <div className="visual-group">
          <div className="visual-items">
            {Array.from({ length: ones }).map((_, i) => (
              <motion.span
                key={i}
                className="visual-item"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >🔵</motion.span>
            ))}
            {ones === 0 && <span className="visual-none">0 cells</span>}
          </div>
          <div className="visual-label text-ones">{ones} cell{ones !== 1 ? 's' : ''} × 1</div>
        </div>
      </div>

      <div className="station-prompt">
        Write the expanded form of the total fuel cells:
      </div>

      <div className="station-inputs">
        <input
          type="number"
          className="expand-input expand-input--hundreds"
          placeholder="H00"
          value={answers.h}
          onChange={e => handleInput('h', e.target.value)}
          min={0}
          max={900}
          aria-label="Hundreds value (e.g. 300)"
          disabled={result === 'correct'}
        />
        <span className="expand-op">+</span>
        <input
          type="number"
          className="expand-input expand-input--tens"
          placeholder="T0"
          value={answers.t}
          onChange={e => handleInput('t', e.target.value)}
          min={0}
          max={90}
          aria-label="Tens value (e.g. 50)"
          disabled={result === 'correct'}
        />
        <span className="expand-op">+</span>
        <input
          type="number"
          className="expand-input expand-input--ones"
          placeholder="O"
          value={answers.o}
          onChange={e => handleInput('o', e.target.value)}
          min={0}
          max={9}
          aria-label="Ones value (e.g. 8)"
          disabled={result === 'correct'}
        />
        <span className="expand-op">=</span>
        <div className="expand-total">{target}</div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className={`station-feedback station-feedback--${result}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {result === 'correct'
              ? `✅ Correct! ${target} = ${hundreds * 100} + ${tens * 10} + ${ones}`
              : `❌ Not quite! Check each place value. Hint: ${hundreds} crates = ${hundreds * 100}`
            }
          </motion.div>
        )}
      </AnimatePresence>

      <div className="station-actions">
        <button className="btn-secondary" onClick={tryAnother}>🔄 Try Another</button>
        {result !== 'correct' && (
          <button className="btn-primary" onClick={checkAnswer}>✓ Check!</button>
        )}
      </div>
    </div>
  );
}
