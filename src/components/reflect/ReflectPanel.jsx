import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import './ReflectPanel.css';

const KEY_LEARNINGS = [
  {
    icon: '🟦',
    title: 'Hundreds Place',
    text: 'The leftmost digit in a 3-digit number is in the hundreds place. A 4 there means 400.',
    color: '#6366F1',
  },
  {
    icon: '🟩',
    title: 'Tens Place',
    text: 'The middle digit is in the tens place. A 7 there means 70.',
    color: '#10B981',
  },
  {
    icon: '🟡',
    title: 'Ones Place',
    text: 'The rightmost digit is in the ones place. An 8 there means just 8.',
    color: '#F59E0B',
  },
  {
    icon: '🔀',
    title: 'Expanded Form',
    text: 'Breaking 472 into 400 + 70 + 2 is called writing it in expanded form.',
    color: '#F9A8D4',
  },
  {
    icon: '🔁',
    title: 'Standard Form',
    text: 'Adding the parts back: 400 + 70 + 2 = 472. That\'s standard form.',
    color: '#A78BFA',
  },
  {
    icon: '0️⃣',
    title: 'Zero Digits',
    text: 'Zero still holds a place! 405 = 400 + 0 + 5. Never skip the zero!',
    color: '#6EE7B7',
  },
];

const REFLECTION_QS = [
  {
    q: "What does the digit 5 mean in the number 537?",
    a: "500 — it's in the hundreds place, so it represents 500!",
    hint: "Look at which place the 5 is in.",
  },
  {
    q: "Write 608 in expanded form.",
    a: "600 + 0 + 8 — don't forget the zero in the tens place!",
    hint: "Break each digit into its place value.",
  },
  {
    q: "What number does 200 + 40 + 9 make?",
    a: "249 — just add the parts together!",
    hint: "Add hundreds, tens, and ones.",
  },
];

export default function ReflectPanel() {
  const { state, dispatch } = useGame();
  const { stars, badges, correctCount, questionIndex } = state;
  const [revealed, setRevealed] = useState([]);
  const accuracy = questionIndex > 0 ? Math.round((correctCount / questionIndex) * 100) : 0;

  // Stop audio on unmount
  useEffect(() => {
    return () => stopNarration();
  }, []);

  function toggleReveal(i) {
    setRevealed(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i]);
  }

  function handleNarrate() {
    narrate([
      { text: "Great job completing the Place Value Pioneers module!", style: 'celebration' },
      { text: "You've learned that every number is made of hundreds, tens, and ones.", style: 'statement' },
      { text: "You can write any number in expanded form and read it like a pro!", style: 'emphasis' },
    ]);
  }

  return (
    <div className="reflect-panel">
      {/* Section header */}
      <div className="section-header">
        <span className="section-icon">📋</span>
        <h2 className="section-title">Reflect</h2>
        <p className="section-sub">Look back at what you've learned today</p>
      </div>

      {/* Stats summary */}
      <motion.div
        className="reflect-summary glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rs-header">
          <span className="rs-emoji">🎓</span>
          <div>
            <div className="rs-title">Your Learning Summary</div>
            <div className="rs-sub">Place Value Pioneers · Expanded Form to 1,000</div>
          </div>
          <button className="btn-secondary rs-narrate" onClick={handleNarrate}>🔊 Listen</button>
        </div>
        <div className="rs-stats">
          <div className="rs-stat">
            <span className="rs-stat-val" style={{ color:'#FCD34D' }}>{stars}</span>
            <span className="rs-stat-label">Stars Earned</span>
          </div>
          <div className="rs-stat">
            <span className="rs-stat-val" style={{ color:'#6EE7B7' }}>{accuracy}%</span>
            <span className="rs-stat-label">Accuracy</span>
          </div>
          <div className="rs-stat">
            <span className="rs-stat-val" style={{ color:'#A78BFA' }}>{badges.length}</span>
            <span className="rs-stat-label">Badges</span>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="rs-badges">
            {badges.map((b, i) => (
              <motion.span
                key={b.id}
                className="badge-pill"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                {b.emoji} {b.label}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Key learnings */}
      <div className="reflect-section">
        <h3 className="reflect-h3">📚 Key Learnings</h3>
        <div className="key-grid">
          {KEY_LEARNINGS.map((k, i) => (
            <motion.div
              key={i}
              className="key-card glass-card"
              style={{ borderTop: `3px solid ${k.color}` }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="kc-icon">{k.icon}</div>
              <div className="kc-body">
                <div className="kc-title" style={{ color: k.color }}>{k.title}</div>
                <div className="kc-text">{k.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reflection questions */}
      <div className="reflect-section">
        <h3 className="reflect-h3">🤔 Reflect & Check</h3>
        <div className="rq-list">
          {REFLECTION_QS.map((item, i) => (
            <div key={i} className="rq-item glass-card">
              <div className="rq-q">
                <span className="rq-num">{i + 1}</span>
                <span className="rq-text">{item.q}</span>
              </div>
              {item.hint && !revealed.includes(i) && (
                <div className="rq-hint">💡 Hint: {item.hint}</div>
              )}
              <button
                className={`rq-reveal-btn ${revealed.includes(i) ? 'revealed' : ''}`}
                onClick={() => toggleReveal(i)}
              >
                {revealed.includes(i) ? '▲ Hide Answer' : '▼ Show Answer'}
              </button>
              {revealed.includes(i) && (
                <motion.div
                  className="rq-answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  ✅ {item.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action row */}
      <div className="reflect-actions">
        <button className="btn-secondary" onClick={() => dispatch({ type: 'GO_TO_STEP', step: 'wonder' })}>
          🏠 Back to Start
        </button>
        <button className="btn-secondary" onClick={() => dispatch({ type: 'GO_TO_STEP', step: 'story' })}>
          📖 Replay Story
        </button>
        <button className="btn-secondary" onClick={() => dispatch({ type: 'GO_TO_STEP', step: 'simulate' })}>
          ✏️ Practice More
        </button>
        <button
          className="btn-primary"
          onClick={() => { dispatch({ type: 'RESET_SESSION' }); dispatch({ type: 'GO_TO_STEP', step: 'play' }); }}
        >
          🎮 Play Again!
        </button>
      </div>
    </div>
  );
}
