import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext.jsx';
import { sessionSummaryNarration } from '../../utils/narration.js';
import './SessionSummary.css';

export default function SessionSummary() {
  const { state, dispatch } = useGame();
  const { stars, correctCount, questionIndex, badges, level } = state;
  const accuracy = questionIndex > 0 ? Math.round((correctCount / questionIndex) * 100) : 0;

  useEffect(() => {
    // Big celebration
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#6366F1','#F59E0B','#22C55E'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#14B8A6','#F87171','#818CF8'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    sessionSummaryNarration(stars, accuracy);
  }, []);

  function handleReplay() {
    dispatch({ type: 'RESET_SESSION' });
  }

  return (
    <div className="session-summary">
      <motion.div
        className="summary-card card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="summary-trophy">🏆</div>
        <h2 className="summary-title">Mission Complete!</h2>
        <p className="summary-sub">You're a Galaxy Champion, Pioneer! 🌌</p>

        <div className="summary-stats">
          <StatBox icon="⭐" value={stars} label="Stars Earned" color="ones" />
          <StatBox icon="🎯" value={`${accuracy}%`} label="Accuracy" color="success" />
          <StatBox icon="❓" value={questionIndex} label="Questions" color="tens" />
          <StatBox icon="🎖️" value={`Lv ${level}`} label="Level" color="hundreds" />
        </div>

        {/* Badges earned */}
        {badges.length > 0 && (
          <div className="summary-badges">
            <h3 className="badges-title">Badges Earned</h3>
            <div className="badges-grid">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  className="badge-chip"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  title={badge.desc}
                >
                  <span className="badge-chip-emoji">{badge.emoji}</span>
                  <span className="badge-chip-label">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Accuracy bar */}
        <div className="summary-accuracy">
          <div className="acc-label">Accuracy</div>
          <div className="acc-track">
            <motion.div
              className="acc-fill"
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="acc-pct">{accuracy}%</div>
        </div>

        {/* Actions */}
        <div className="summary-actions">
          <button className="btn-secondary" onClick={handleReplay}>
            🔄 Play Again
          </button>
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: 'SET_TAB', tab: 'simulate' })}
          >
            🔬 Back to Simulate
          </button>
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: 'SET_TAB', tab: 'story' })}
          >
            📖 Replay Story
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ icon, value, label, color }) {
  return (
    <div className={`stat-box stat-box--${color}`}>
      <span className="stat-box-icon">{icon}</span>
      <span className="stat-box-value">{value}</span>
      <span className="stat-box-label">{label}</span>
    </div>
  );
}
