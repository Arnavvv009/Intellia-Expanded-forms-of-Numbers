import { useState } from 'react';
import { motion } from 'framer-motion';
import './TrueFalse.css';

export default function TrueFalse({ correctAnswer, onAnswer, disabled = false }) {
  const [selected, setSelected] = useState(null);

  function handleSelect(answer) {
    if (disabled || selected !== null) return;
    setSelected(answer);
    onAnswer(answer === correctAnswer, answer);
  }

  return (
    <div className="true-false">
      {[true, false].map(val => {
        let cls = 'tf-btn';
        if (selected !== null) {
          if (val === correctAnswer) cls += ' tf-btn--correct';
          else if (val === selected && val !== correctAnswer) cls += ' tf-btn--incorrect';
          else cls += ' tf-btn--dim';
        }

        return (
          <motion.button
            key={String(val)}
            className={cls}
            onClick={() => handleSelect(val)}
            disabled={disabled || selected !== null}
            aria-label={val ? 'True' : 'False'}
            aria-pressed={selected === val}
            whileHover={selected === null && !disabled ? { scale: 1.06, y: -3 } : {}}
            whileTap={selected === null && !disabled ? { scale: 0.94 } : {}}
          >
            <span className="tf-icon">{val ? '✅' : '❌'}</span>
            <span className="tf-label">{val ? 'TRUE' : 'FALSE'}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
