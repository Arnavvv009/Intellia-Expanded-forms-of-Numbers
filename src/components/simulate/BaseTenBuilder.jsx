import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaceValueBlock from '../shared/PlaceValueBlock.jsx';
import ExpandedFormStrip from '../shared/ExpandedFormStrip.jsx';
import { decompose } from '../../utils/placeValue.js';
import { celebrate, encourage } from '../../utils/audio.js';
import './BaseTenBuilder.css';

const MAX = { hundred: 9, ten: 9, one: 9 };

export default function BaseTenBuilder({ targetNumber, onSuccess }) {
  const target = decompose(targetNumber);
  const [placed, setPlaced] = useState({ hundred: 0, ten: 0, one: 0 });
  const [showResult, setShowResult] = useState(null); // null | 'correct' | 'incorrect'
  const [showExpanded, setShowExpanded] = useState(false);

  const total = placed.hundred * 100 + placed.ten * 10 + placed.one;

  function addBlock(type) {
    setShowResult(null);
    setPlaced(p => ({
      ...p,
      [type]: Math.min(p[type] + 1, MAX[type]),
    }));
  }

  function removeBlock(type) {
    setShowResult(null);
    setPlaced(p => ({
      ...p,
      [type]: Math.max(p[type] - 1, 0),
    }));
  }

  function reset() {
    setPlaced({ hundred: 0, ten: 0, one: 0 });
    setShowResult(null);
  }

  function checkAnswer() {
    if (total === targetNumber) {
      setShowResult('correct');
      celebrate('Amazing! You built the number perfectly!');
      setTimeout(() => onSuccess?.(), 1500);
    } else {
      setShowResult('incorrect');
      encourage('Not quite — try adding or removing some blocks!');
    }
  }

  return (
    <div className="btb-container">
      <div className="btb-target">
        <span className="btb-target-label">Build this number:</span>
        <span className="btb-target-number">{targetNumber}</span>
      </div>

      {/* Drop zones */}
      <div className="btb-zones">
        {[
          { key: 'hundred', label: 'Hundreds', color: 'hundreds', emoji: '🟦', value: placed.hundred * 100 },
          { key: 'ten',     label: 'Tens',     color: 'tens',     emoji: '🟩', value: placed.ten * 10 },
          { key: 'one',     label: 'Ones',     color: 'ones',     emoji: '🟡', value: placed.one },
        ].map(zone => (
          <div key={zone.key} className={`btb-zone btb-zone--${zone.color}`}>
            <div className="zone-header">
              <span className="zone-emoji">{zone.emoji}</span>
              <span className={`zone-label text-${zone.color}`}>{zone.label}</span>
              <span className="zone-value">{zone.value}</span>
            </div>

            <div className="zone-blocks">
              <AnimatePresence>
                {Array.from({ length: placed[zone.key] }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <PlaceValueBlock
                      type={zone.key === 'hundred' ? 'hundred' : zone.key === 'ten' ? 'ten' : 'one'}
                      onClick={() => removeBlock(zone.key)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {placed[zone.key] === 0 && (
                <div className="zone-empty">tap + to add</div>
              )}
            </div>

            <div className="zone-controls">
              <button
                className="zone-btn zone-btn--remove"
                onClick={() => removeBlock(zone.key)}
                disabled={placed[zone.key] === 0}
                aria-label={`Remove one ${zone.label} block`}
              >−</button>
              <span className="zone-count">{placed[zone.key]}</span>
              <button
                className="zone-btn zone-btn--add"
                onClick={() => addBlock(zone.key)}
                disabled={placed[zone.key] >= MAX[zone.key]}
                aria-label={`Add one ${zone.label} block`}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Running total */}
      <div className="btb-total">
        <span className="btb-total-label">Current total:</span>
        <span className={`btb-total-value ${total === targetNumber ? 'text-success' : ''}`}>{total}</span>
      </div>

      {/* Expanded form strip */}
      <div className="btb-strip">
        <button
          className="btn-secondary toggle-btn"
          onClick={() => setShowExpanded(v => !v)}
          aria-expanded={showExpanded}
        >
          {showExpanded ? 'Hide' : 'Show'} Expanded Form
        </button>
        <AnimatePresence>
          {showExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ExpandedFormStrip
                hundreds={placed.hundred}
                tens={placed.ten}
                ones={placed.one}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className={`btb-feedback btb-feedback--${showResult}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {showResult === 'correct'
              ? `✅ Perfect! ${targetNumber} = ${target.hundreds * 100} + ${target.tens * 10} + ${target.ones}`
              : `Try again! You have ${total}, but need ${targetNumber}. ${total < targetNumber ? 'Add more blocks!' : 'Remove some blocks!'}`
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="btb-actions">
        <button className="btn-secondary" onClick={reset} aria-label="Reset blocks">
          🔄 Reset
        </button>
        <button className="btn-primary" onClick={checkAnswer} aria-label="Check your answer">
          ✓ Check!
        </button>
      </div>
    </div>
  );
}
