import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, STEPS, STEP_META } from '../../context/GameContext.jsx';
import { narrate, stopNarration, preCache } from '../../utils/audio.js';
import './WonderPanel.css';

const WONDER_Q = {
  text: "A number has 3 hundreds, 5 tens, and 7 ones. What is its expanded form?",
  options: [
    { label: "300 + 50 + 7", correct: true  },
    { label: "357",           correct: false },
    { label: "3 + 5 + 7",    correct: false },
    { label: "300 + 57",      correct: false },
  ],
  explanation: "300 + 50 + 7 shows the value of each digit. That's expanded form!",
};

export default function WonderPanel({ embedded = false }) {
  const { dispatch } = useGame();
  const [opts]          = useState(() => [...WONDER_Q.options].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  // Auto-play narration when panel appears
  useEffect(() => {
    narrate([{ text: WONDER_Q.text, style: 'question' }]);
    // Pre-cache response narrations
    preCache([
      { text: "Amazing! That's exactly right! 300 plus 50 plus 7 is the expanded form!", style: 'celebration' },
      { text: "Good try! The answer is 300 plus 50 plus 7. Each digit shows its place value!", style: 'encouragement' },
    ]);
    return () => stopNarration();
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => stopNarration();
  }, []);

  function handleAnswer(opt, i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (opt.correct) {
      narrate([{ text: "Amazing! That's exactly right! 300 plus 50 plus 7 is the expanded form!", style: 'celebration' }]);
    } else {
      narrate([{ text: "Good try! The answer is 300 plus 50 plus 7. Each digit shows its place value!", style: 'encouragement' }]);
    }
  }

  /* ── Embedded (inside journey after Begin) ─────────────────────────────── */
  if (embedded) {
    return (
      <div className="wonder-embedded">
        <div className="section-header">
          <span className="section-icon">🔮</span>
          <h2 className="section-title">Wonder</h2>
          <p className="section-sub">Think about this before we start…</p>
        </div>

        <div className="wonder-card glass-card">
          <p className="wc-question">{WONDER_Q.text}</p>

          <div className="wc-opts">
            {opts.map((opt, i) => {
              let cls = 'wc-opt';
              if (answered && i === selected) cls += opt.correct ? ' wc-opt--correct' : ' wc-opt--wrong';
              if (answered && opt.correct && i !== selected) cls += ' wc-opt--reveal';
              return (
                <motion.button
                  key={i}
                  className={cls}
                  onClick={() => handleAnswer(opt, i)}
                  disabled={answered}
                  whileHover={!answered ? { scale: 1.03, y: -2 } : {}}
                  whileTap={!answered ? { scale: 0.97 } : {}}
                  aria-label={`Answer: ${opt.label}`}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                className={`wc-feedback ${opts[selected]?.correct ? 'correct' : 'encourage'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {opts[selected]?.correct ? '🌟 ' : '💡 '}{WONDER_Q.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="btn-primary wc-next"
            onClick={() => dispatch({ type: 'COMPLETE_STEP', step: 'wonder' })}
          >
            {answered ? '📖 Go to Story →' : 'Skip Wonder →'}
          </button>
        </div>
      </div>
    );
  }

  /* ── Full-screen hero landing ──────────────────────────────────────────── */
  return (
    <div className="wonder-hero">
      {/* Background particles */}
      <HeroParticles />

      {/* Floating orbs */}
      <div className="hero-orb hero-orb--1" aria-hidden="true" />
      <div className="hero-orb hero-orb--2" aria-hidden="true" />
      <div className="hero-orb hero-orb--3" aria-hidden="true" />

      <motion.div
        className="hero-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          ✨ Singapore MOE Curriculum · Grade 2
        </motion.div>

        {/* Mascot */}
        <motion.div
          className="hero-mascot"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
        >
          <motion.span
            className="mascot-emoji"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🚀
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="hero-titles"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="hero-title">
            Expanded Form of<br />
            <span className="hero-title-gradient">Numbers to 1,000</span>
          </h1>
        </motion.div>

        {/* Hook text */}
        <motion.div
          className="hero-hook-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <p className="hero-hook">🌟 Ready to blast off into Place Value? Let's go!</p>
          <p className="hero-desc">
            Join <strong>Hundy</strong>, <strong>Tenny</strong>, and <strong>Onesy</strong> and discover
            how every number is secretly made of hundreds, tens, and ones —
            through stories, simulations, and exciting games!
          </p>
        </motion.div>

        {/* Journey flow */}
        <motion.div
          className="hero-journey-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="hjc-label">YOUR LEARNING JOURNEY</div>
          <div className="hjc-steps">
            {Object.entries(STEP_META).map(([key, meta], i, arr) => (
              <span key={key} className="hjc-group">
                <span className="hjc-step">
                  <span>{meta.icon}</span>
                  <span className="hjc-step-label">{meta.label}</span>
                </span>
                {i < arr.length - 1 && <span className="hjc-arrow">→</span>}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          className="hero-chips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          {['🏦 Place Value Houses', '🧱 4 Simulations', '⛰️ 100 Questions', '✨ Badges & XP'].map(c => (
            <span key={c} className="hero-chip">{c}</span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          className="hero-cta"
          onClick={() => dispatch({ type: 'BEGIN_JOURNEY' })}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, type: 'spring', stiffness: 280 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          🚀 Begin Your Journey!
        </motion.button>
      </motion.div>
    </div>
  );
}

function HeroParticles() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2.5 + 0.5,
    d: Math.random() * 4 + 2,
    del: Math.random() * 6,
  }));
  return (
    <div className="hero-particles" aria-hidden="true">
      {stars.map(p => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.s}px`, height: `${p.s}px`,
            '--pd': `${p.d}s`, '--pdel': `${p.del}s`,
          }}
        />
      ))}
    </div>
  );
}
