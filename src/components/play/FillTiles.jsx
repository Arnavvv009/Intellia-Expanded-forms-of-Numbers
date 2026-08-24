import { useState } from 'react';
import { motion } from 'framer-motion';
import './FillTiles.css';

export default function FillTiles({ number, correctValues, onAnswer, disabled = false }) {
  // correctValues = [H*100, T*10, O]
  const [inputs, setInputs] = useState(['', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([null, null, null]);

  const labels = ['Hundreds', 'Tens', 'Ones'];
  const colors = ['hundreds', 'tens', 'ones'];

  function handleInput(i, val) {
    if (submitted) return;
    const clean = val.replace(/\D/g, '').slice(0, 4);
    const updated = [...inputs];
    updated[i] = clean;
    setInputs(updated);
  }

  function handleSubmit() {
    if (submitted) return;
    const newResults = inputs.map((v, i) => parseInt(v || '0') === correctValues[i]);
    setResults(newResults);
    setSubmitted(true);
    const allCorrect = newResults.every(Boolean);
    onAnswer(allCorrect, inputs);
  }

  return (
    <div className="fill-tiles">
      <div className="fill-equation">
        <span className="fill-number">{number}</span>
        <span className="fill-eq"> = </span>
        {inputs.map((val, i) => (
          <span key={i} className="fill-group">
            <input
              type="number"
              className={`fill-input fill-input--${colors[i]}
                ${submitted ? (results[i] ? 'fill-input--correct' : 'fill-input--incorrect') : ''}
              `}
              value={val}
              onChange={e => handleInput(i, e.target.value)}
              disabled={disabled || submitted}
              placeholder="___"
              aria-label={`${labels[i]} value`}
              min={0}
              max={900}
            />
            {i < 2 && <span className="fill-op">+</span>}
            {submitted && (
              <motion.span
                className="fill-hint"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {results[i] ? '✅' : `→${correctValues[i]}`}
              </motion.span>
            )}
          </span>
        ))}
      </div>

      {!submitted && (
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={disabled || inputs.some(v => v === '')}
          style={{ alignSelf: 'center' }}
        >
          ✓ Check!
        </button>
      )}
    </div>
  );
}
