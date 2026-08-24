import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import './MatchPairs.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairs({ pairs, onAnswer, disabled = false }) {
  const standards = useMemo(() => shuffle(pairs.map(p => p.standard)), [pairs]);
  const expandeds = useMemo(() => shuffle(pairs.map(p => p.expanded)), [pairs]);

  const [selectedStd, setSelectedStd] = useState(null);
  const [matched, setMatched] = useState({}); // standard → expanded
  const [incorrectFlash, setIncorrectFlash] = useState(null);
  const [done, setDone] = useState(false);

  function selectStd(std) {
    if (done || matched[std]) return;
    setSelectedStd(std);
  }

  function selectExp(exp) {
    if (done || !selectedStd) return;

    // Find correct expanded for selectedStd
    const pair = pairs.find(p => p.standard === selectedStd);
    const correct = pair?.expanded === exp;

    if (correct) {
      const newMatched = { ...matched, [selectedStd]: exp };
      setMatched(newMatched);
      setSelectedStd(null);
      if (Object.keys(newMatched).length === pairs.length) {
        setDone(true);
        onAnswer(true, newMatched);
      }
    } else {
      setIncorrectFlash(exp);
      setTimeout(() => setIncorrectFlash(null), 600);
    }
  }

  const matchedValues = new Set(Object.values(matched));

  return (
    <div className="match-pairs">
      <div className="match-columns">
        <div className="match-col match-col--left">
          {standards.map(std => {
            const isMatched = Boolean(matched[std]);
            const isSelected = selectedStd === std;
            let cls = 'match-card';
            if (isMatched) cls += ' match-card--matched';
            if (isSelected) cls += ' match-card--selected';
            return (
              <motion.button
                key={std}
                className={cls}
                onClick={() => selectStd(std)}
                disabled={disabled || isMatched}
                aria-label={`Standard form: ${std}`}
                aria-selected={isSelected}
                whileHover={!isMatched && !disabled ? { x: 4 } : {}}
                whileTap={!isMatched && !disabled ? { scale: 0.97 } : {}}
              >
                <span className="match-value">{std}</span>
                {isMatched && <span className="match-tick">✅</span>}
              </motion.button>
            );
          })}
        </div>

        <div className="match-connector">
          {pairs.map((p, i) => {
            const isMatched = matched[p.standard] === p.expanded;
            return (
              <div key={i} className={`connector-line ${isMatched ? 'active' : ''}`} />
            );
          })}
        </div>

        <div className="match-col match-col--right">
          {expandeds.map(exp => {
            const isMatched = matchedValues.has(exp);
            const isFlash = incorrectFlash === exp;
            let cls = 'match-card match-card--expanded';
            if (isMatched) cls += ' match-card--matched';
            if (isFlash) cls += ' match-card--wrong';
            return (
              <motion.button
                key={exp}
                className={cls}
                onClick={() => selectExp(exp)}
                disabled={disabled || isMatched}
                aria-label={`Expanded form: ${exp}`}
                whileHover={!isMatched && !disabled && selectedStd ? { x: -4 } : {}}
                whileTap={!isMatched && !disabled && selectedStd ? { scale: 0.97 } : {}}
                animate={isFlash ? { x: [-6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <span className="match-value">{exp}</span>
                {isMatched && <span className="match-tick">✅</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {done && (
        <motion.div
          className="match-done"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          🌟 All matched correctly! Amazing!
        </motion.div>
      )}
    </div>
  );
}
