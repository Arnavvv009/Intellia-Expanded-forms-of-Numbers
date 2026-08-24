import { useState } from 'react';
import { motion } from 'framer-motion';
import './ChoiceGrid.css';

export default function ChoiceGrid({ options, correctIndex, onAnswer, disabled = false }) {
  const [selected, setSelected] = useState(null);

  function handleSelect(idx) {
    if (disabled || selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === correctIndex;
    onAnswer(isCorrect, idx);
  }

  return (
    <div className="choice-grid" role="list">
      {options.map((opt, i) => {
        let cls = 'choice-btn';
        if (selected !== null) {
          if (i === correctIndex) cls += ' choice-btn--correct';
          else if (i === selected && i !== correctIndex) cls += ' choice-btn--incorrect';
          else cls += ' choice-btn--dim';
        }

        return (
          <motion.button
            key={i}
            className={cls}
            onClick={() => handleSelect(i)}
            disabled={disabled || selected !== null}
            role="listitem"
            aria-label={`Option ${i + 1}: ${opt}`}
            aria-pressed={selected === i}
            whileHover={selected === null && !disabled ? { scale: 1.03, y: -2 } : {}}
            whileTap={selected === null && !disabled ? { scale: 0.97 } : {}}
          >
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
            <span className="choice-text">{opt}</span>
            {selected !== null && i === correctIndex && <span className="choice-icon">✅</span>}
            {selected !== null && i === selected && i !== correctIndex && <span className="choice-icon">❌</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
