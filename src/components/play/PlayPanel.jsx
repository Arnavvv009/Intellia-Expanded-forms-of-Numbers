import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext.jsx';
import QuestionCard from './QuestionCard.jsx';
import CheckpointModal from './CheckpointModal.jsx';
import StarBurst from '../shared/StarBurst.jsx';
import { generateQuestionPool } from '../../engine/questionEngine.js';
import { narrate, stopNarration } from '../../utils/audio.js';
import './PlayPanel.css';

const WORLDS = [
  { id: 'easy',      label: 'Hundreds House',   desc: 'Tiers 1–2 · Easy & Medium', icon: '🏦', color: '#6366F1', tiers: [1,2] },
  { id: 'medium',    label: 'Tens Tower',        desc: 'Tiers 2–3 · Medium & Hard',  icon: '🗼', color: '#10B981', tiers: [2,3] },
  { id: 'challenge', label: 'Galaxy Champion',   desc: 'All Tiers · Full Challenge',  icon: '🌌', color: '#F59E0B', tiers: [1,2,3,4] },
];

export default function PlayPanel() {
  const { state, dispatch } = useGame();
  const { questionIndex, totalQuestions, stars, streak, hearts, mode, sessionStarted, sessionDone } = state;

  // Stop audio on unmount
  useEffect(() => {
    return () => stopNarration();
  }, []);

  const [questions, setQuestions]         = useState(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [starBurst, setStarBurst]         = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);

  // Auto-generate questions when session starts
  useEffect(() => {
    if (sessionStarted && !questions) {
      setQuestions(generateQuestionPool(Date.now()));
    }
  }, [sessionStarted]);

  function handleSelectWorld(world) {
    setSelectedWorld(world);
    dispatch({ type: 'SET_MODE', mode: world.id === 'challenge' ? 'challenge' : 'practice' });
  }

  function handleStart() {
    if (!selectedWorld) return;
    dispatch({ type: 'START_SESSION' });
    setQuestions(generateQuestionPool(Date.now()));
    narrate([{ text: "Welcome to the Galaxy Quiz Arena! Answer questions to become a Galaxy Champion!", style: 'celebration' }]);
  }

  function handleCorrect() {
    dispatch({ type: 'ANSWER_CORRECT' });
    setStarBurst(true);
    const nextIdx = questionIndex + 1;
    if (nextIdx % 10 === 0 && nextIdx < totalQuestions) {
      setTimeout(() => setShowCheckpoint(true), 500);
    }
  }

  function handleIncorrect() {
    dispatch({ type: 'ANSWER_INCORRECT' });
  }

  // Session complete → go to Reflect
  if (sessionDone) {
    return <SessionEnd dispatch={dispatch} state={state} />;
  }

  // Lobby
  if (!sessionStarted) {
    return (
      <div className="play-panel">
        <div className="section-header">
          <span className="section-icon">🎮</span>
          <h2 className="section-title">Play</h2>
          <p className="section-sub">Choose your world and start the Galaxy Quiz!</p>
        </div>

        <div className="worlds-grid">
          {WORLDS.map(w => (
            <motion.button
              key={w.id}
              className={`world-card glass-card ${selectedWorld?.id === w.id ? 'world-card--selected' : ''}`}
              onClick={() => handleSelectWorld(w)}
              style={{ '--w-color': w.color }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="wc-icon">{w.icon}</span>
              <div className="wc-body">
                <div className="wc-label" style={{ color: w.color }}>{w.label}</div>
                <div className="wc-desc">{w.desc}</div>
              </div>
              {selectedWorld?.id === w.id && <span className="wc-check">✅</span>}
            </motion.button>
          ))}
        </div>

        <div className="play-info-row">
          <div className="info-item glass-card">
            <span className="info-icon">🎯</span>
            <span className="info-val">100</span>
            <span className="info-label">Challenges</span>
          </div>
          <div className="info-item glass-card">
            <span className="info-icon">🔢</span>
            <span className="info-val">5</span>
            <span className="info-label">Question Types</span>
          </div>
          <div className="info-item glass-card">
            <span className="info-icon">✨</span>
            <span className="info-val">7</span>
            <span className="info-label">Badges & XP</span>
          </div>
        </div>

        <motion.button
          className="btn-primary play-start-btn"
          onClick={handleStart}
          disabled={!selectedWorld}
          whileHover={selectedWorld ? { scale: 1.04 } : {}}
          whileTap={selectedWorld ? { scale: 0.97 } : {}}
        >
          🚀 Begin Your Journey!
        </motion.button>
      </div>
    );
  }

  if (!questions) return (
    <div className="play-loading">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>🚀</motion.div>
      <span>Loading questions…</span>
    </div>
  );

  const currentQ = questions[questionIndex];
  if (!currentQ) return <SessionEnd dispatch={dispatch} state={state} />;

  const progressPct = Math.round((questionIndex / totalQuestions) * 100);

  return (
    <div className="play-panel play-panel--active">
      <StarBurst active={starBurst} onComplete={() => setStarBurst(false)} />

      {/* HUD */}
      <div className="play-hud glass-card">
        <div className="hud-stats">
          <div className="hud-chip hud-chip--stars">
            <span>⭐</span>
            <motion.span key={stars} initial={{ scale: 1.6, color: '#FCD34D' }} animate={{ scale: 1, color: '#F1F0FF' }} transition={{ duration: 0.3 }}>
              {stars}
            </motion.span>
          </div>
          <div className={`hud-chip hud-chip--streak ${streak >= 5 ? 'on-fire' : ''}`}>
            <span>🔥</span>
            <span>{streak}</span>
          </div>
          {mode === 'challenge' && (
            <div className="hud-chip hud-chip--hearts">
              {[0,1,2].map(i => <span key={i}>{i < hearts ? '❤️' : '🤍'}</span>)}
            </div>
          )}
        </div>

        <div className="hud-progress">
          <div className="hud-track">
            <motion.div className="hud-fill" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <span className="hud-counter">{questionIndex}/{totalQuestions}</span>
        </div>
      </div>

      {/* Question */}
      <div className="play-question-area">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQ.id}
            question={currentQ}
            questionNum={questionIndex + 1}
            totalQuestions={totalQuestions}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
          />
        </AnimatePresence>
      </div>

      {/* Checkpoint */}
      <AnimatePresence>
        {showCheckpoint && (
          <CheckpointModal
            questionNum={questionIndex}
            onContinue={() => setShowCheckpoint(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionEnd({ dispatch, state }) {
  const { stars, correctCount, questionIndex, badges, level } = state;
  const accuracy = questionIndex > 0 ? Math.round((correctCount / questionIndex) * 100) : 0;

  useEffect(() => {
    const end = Date.now() + 2500;
    const loop = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#A78BFA','#F9A8D4','#FCD34D','#6EE7B7'] });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#6366F1','#10B981','#F59E0B'] });
      if (Date.now() < end) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  return (
    <motion.div
      className="session-end"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="se-trophy">🏆</div>
      <h2 className="se-title gradient-text">Mission Complete!</h2>
      <p className="se-sub">You're a Galaxy Champion, Place Value Pioneer!</p>

      <div className="se-stats">
        {[
          { icon:'⭐', val: stars,          label:'Stars' },
          { icon:'🎯', val: `${accuracy}%`, label:'Accuracy' },
          { icon:'❓', val: questionIndex,   label:'Questions' },
          { icon:'🎖️', val: `Lv ${level}`,  label:'Level' },
        ].map(s => (
          <div key={s.label} className="se-stat glass-card">
            <span className="se-stat-icon">{s.icon}</span>
            <span className="se-stat-val">{s.val}</span>
            <span className="se-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {badges.length > 0 && (
        <div className="se-badges">
          {badges.map((b, i) => (
            <motion.span
              key={b.id}
              className="badge-pill"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            >
              {b.emoji} {b.label}
            </motion.span>
          ))}
        </div>
      )}

      <div className="se-actions">
        <button className="btn-secondary" onClick={() => dispatch({ type: 'RESET_SESSION' })}>
          🔄 Play Again
        </button>
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'COMPLETE_STEP', step: 'play' })}
        >
          📋 Go to Reflect →
        </button>
      </div>
    </motion.div>
  );
}
