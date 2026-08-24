import { useState } from 'react';
import { motion } from 'framer-motion';
import StarBurst from '../shared/StarBurst.jsx';
import './WonderQuestion.css';

const OPTIONS = [
  { value: 426, label: '426', correct: true },
  { value: 246, label: '246', correct: false },
  { value: 462, label: '462', correct: false },
  { value: 642, label: '642', correct: false },
];

// Shuffle options deterministically
const SHUFFLED = [OPTIONS[0], OPTIONS[2], OPTIONS[1], OPTIONS[3]];

export default function WonderQuestion({ onNext }) {
  const [selected, setSelected] = useState(null);
  const [showBurst, setShowBurst] = useState(false);
  const [answered, setAnswered] = useState(false);

  function handleChoice(opt) {
    if (answered) return;
    setSelected(opt.value);
    setAnswered(true);
    if (opt.correct) {
      setShowBurst(true);
    }
  }

  return (
    <div className="wonder-question">
      <StarBurst active={showBurst} onComplete={() => setShowBurst(false)} />

      <div className="wonder-prompt">
        <p className="wonder-text">
          🤔 If <strong className="text-hundreds">Hundy</strong> gave you <strong>4</strong> hundred-blocks,
          <strong className="text-tens"> Tenny</strong> gave you <strong>2</strong> ten-rods,
          and <strong className="text-ones"> Onesy</strong> gave you <strong>6</strong> ones-cubes...
        </p>
        <p className="wonder-question-line">What number would you build?</p>
      </div>

      <div className="wonder-hint">
        <span className="text-hundreds">400</span>
        <span className="wonder-op">+</span>
        <span className="text-tens">20</span>
        <span className="wonder-op">+</span>
        <span className="text-ones">6</span>
        <span className="wonder-op">=</span>
        <span className="wonder-blank">{answered ? <strong className="text-success">426</strong> : '?'}</span>
      </div>

      <div className="wonder-options">
        {SHUFFLED.map(opt => {
          const isSelected = selected === opt.value;
          const isCorrect = opt.correct;
          let cls = 'wonder-opt';
          if (answered && isSelected && isCorrect) cls += ' correct';
          else if (answered && isSelected && !isCorrect) cls += ' incorrect';
          else if (answered && isCorrect) cls += ' reveal';

          return (
            <motion.button
              key={opt.value}
              className={cls}
              onClick={() => handleChoice(opt)}
              disabled={answered}
              whileHover={!answered ? { scale: 1.05 } : {}}
              whileTap={!answered ? { scale: 0.95 } : {}}
              aria-label={`Answer: ${opt.label}`}
              aria-pressed={isSelected}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          className={`wonder-result ${selected === 426 ? 'success' : 'encourage'}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selected === 426
            ? '🌟 Amazing! 4 hundreds + 2 tens + 6 ones = 426!'
            : '💡 The answer is 426! 400 + 20 + 6 = 426. Great try!'}
        </motion.div>
      )}

      <div className="wonder-nav">
        <button
          className="btn-primary"
          onClick={onNext}
          aria-label="Go to Simulate panel"
        >
          {answered ? "Let's Simulate! 🔬" : "Skip to Simulate →"}
        </button>
      </div>
    </div>
  );
}
