import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../utils/placeValue.js';
import { celebrate, encourage } from '../../utils/audio.js';
import './Station.css';

function genTarget(prev = 0) {
  let n;
  do { n = Math.floor(Math.random() * 900) + 100; } while (n === prev);
  return n;
}

export default function NumberLineRocketStation({ onComplete }) {
  const [target, setTarget] = useState(() => genTarget());
  const [answers, setAnswers] = useState({ h: '', t: '', o: '' });
  const [result, setResult] = useState(null);

  const { hundreds, tens, ones } = decompose(target);
  const rocketPct = ((target - 100) / 900) * 90 + 5; // 5–95%

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
    if (correct) {
      setResult('correct');
      celebrate('Perfect landing! You decoded the expanded form!');
      setTimeout(() => onComplete?.(), 1400);
    } else {
      setResult('incorrect');
      encourage('Check the H, T, O segments again!');
    }
  }

  function tryAnother() {
    setTarget(genTarget(target));
    setAnswers({ h: '', t: '', o: '' });
    setResult(null);
  }

  // Segment bar widths proportional
  const maxBar = 120;
  const hWidth = Math.max(20, (hundreds / 9) * maxBar);
  const tWidth = Math.max(12, (tens / 9) * maxBar);
  const oWidth = Math.max(10, (ones / 9) * maxBar);

  return (
    <div className="station-container">
      <div className="station-prompt">
        The rocket landed on <strong>{target}</strong>. Fill in the fuel segments!
      </div>

      {/* Number line */}
      <div className="number-line-wrap">
        <div className="number-line">
          <div className="nl-track" />
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(v => (
            <div
              key={v}
              className="nl-tick"
              style={{ left: `${((v - 100) / 900) * 90 + 5}%` }}
            >
              <div className="nl-tick-mark" />
              <div className="nl-tick-label">{v}</div>
            </div>
          ))}
          <motion.div
            className="nl-rocket"
            style={{ left: `${rocketPct}%` }}
            animate={{ left: `${rocketPct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            🚀
          </motion.div>
        </div>
      </div>

      {/* Fuel segments visualization */}
      <div className="nl-segments">
        <div className="nl-segment">
          <div className="nl-seg-bar nl-seg-bar--hundreds" style={{ width: hWidth }} />
          <div className="nl-seg-label text-hundreds">Hundreds</div>
        </div>
        <div className="nl-segment">
          <div className="nl-seg-bar nl-seg-bar--tens" style={{ width: tWidth }} />
          <div className="nl-seg-label text-tens">Tens</div>
        </div>
        <div className="nl-segment">
          <div className="nl-seg-bar nl-seg-bar--ones" style={{ width: oWidth }} />
          <div className="nl-seg-label text-ones">Ones</div>
        </div>
      </div>

      <div className="station-prompt" style={{ fontSize: 'var(--fs-base)' }}>
        {target} = ___ + ___ + ___
      </div>

      <div className="station-inputs">
        <input
          type="number"
          className="expand-input expand-input--hundreds"
          placeholder="H00"
          value={answers.h}
          onChange={e => handleInput('h', e.target.value)}
          aria-label="Hundreds component"
          disabled={result === 'correct'}
        />
        <span className="expand-op">+</span>
        <input
          type="number"
          className="expand-input expand-input--tens"
          placeholder="T0"
          value={answers.t}
          onChange={e => handleInput('t', e.target.value)}
          aria-label="Tens component"
          disabled={result === 'correct'}
        />
        <span className="expand-op">+</span>
        <input
          type="number"
          className="expand-input expand-input--ones"
          placeholder="O"
          value={answers.o}
          onChange={e => handleInput('o', e.target.value)}
          aria-label="Ones component"
          disabled={result === 'correct'}
        />
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
              : `❌ Not quite! Remember ${hundreds} hundreds = ${hundreds * 100}, ${tens} tens = ${tens * 10}`
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
