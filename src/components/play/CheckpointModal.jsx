import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext.jsx';
import './CheckpointModal.css';

export default function CheckpointModal({ questionNum, onContinue }) {
  const { state } = useGame();
  const latestBadge = state.badges[state.badges.length - 1];

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#A78BFA', '#F9A8D4', '#FCD34D', '#6EE7B7', '#6366F1'],
    });
  }, []);

  return (
    <motion.div
      className="cp-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="cp-modal solid-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <div className="cp-stars">⭐⭐⭐</div>
        <h2 className="cp-title gradient-text">Checkpoint!</h2>
        <p className="cp-sub">You've answered <strong>{questionNum}</strong> questions!</p>

        {latestBadge && (
          <motion.div
            className="cp-badge"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="cpb-emoji">{latestBadge.emoji}</span>
            <div className="cpb-info">
              <div className="cpb-label">{latestBadge.label}</div>
              <div className="cpb-desc">{latestBadge.desc}</div>
            </div>
          </motion.div>
        )}

        <div className="cp-stats">
          <div className="cp-stat">
            <span>⭐</span><span>{state.stars}</span>
            <span className="cp-stat-l">Stars</span>
          </div>
          <div className="cp-stat">
            <span>🔥</span><span>{state.streak}</span>
            <span className="cp-stat-l">Streak</span>
          </div>
          <div className="cp-stat">
            <span>🎖️</span><span>Lv {state.level}</span>
            <span className="cp-stat-l">Level</span>
          </div>
        </div>

        <button className="btn-primary" onClick={onContinue}>
          Keep Going! 🚀
        </button>
      </motion.div>
    </motion.div>
  );
}
