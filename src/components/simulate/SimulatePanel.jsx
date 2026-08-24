import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import BaseTenBuilder from './BaseTenBuilder.jsx';
import CrateCounterStation from './CrateCounterStation.jsx';
import DigitDetectiveStation from './DigitDetectiveStation.jsx';
import NumberLineRocketStation from './NumberLineRocketStation.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import './SimulatePanel.css';

const STATIONS = [
  {
    id: 'builder',
    num: '01',
    label: 'Base-Ten Builder',
    desc: 'Place hundred-flats, ten-rods, and one-cubes to build any number',
    icon: '🧱',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.08)',
    narration: [{ text: "Welcome to the Base-Ten Builder! Drag blocks into the zones to build the target number.", style: 'statement' }],
  },
  {
    id: 'crate',
    num: '02',
    label: 'Crate Counter',
    desc: 'Count crates (100s), tubes (10s) and cells (1s) then write the expanded form',
    icon: '📦',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    narration: [{ text: "Count the crates, tubes, and loose fuel cells, then write the expanded form!", style: 'statement' }],
  },
  {
    id: 'detective',
    num: '03',
    label: 'Digit Detective',
    desc: 'Tap each digit and drag it to its correct place-value house',
    icon: '🔍',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    narration: [{ text: "You're a Digit Detective! Tap a digit and drop it in the correct place-value house!", style: 'celebration' }],
  },
  {
    id: 'rocket',
    num: '04',
    label: 'Number Line Rocket',
    desc: 'Your rocket lands on a number — decode its hundreds, tens and ones',
    icon: '🚀',
    color: '#F9A8D4',
    bg: 'rgba(249,168,212,0.08)',
    narration: [{ text: "Your rocket has landed! Fill in the fuel segments to show the expanded form.", style: 'question' }],
  },
];

export default function SimulatePanel() {
  const { state, dispatch } = useGame();
  const { stationsDone } = state;
  const [activeStation, setActiveStation] = useState(null);
  const [builderTarget, setBuilderTarget] = useState(() => Math.floor(Math.random() * 900) + 100);

  const doneCount = stationsDone.length;

  // Stop audio on unmount
  useEffect(() => {
    return () => stopNarration();
  }, []);

  function openStation(s) {
    setActiveStation(s);
    if (s.narration) narrate(s.narration);
  }

  function closeStation() { stopNarration(); setActiveStation(null); }

  function handleComplete(id) {
    dispatch({ type: 'COMPLETE_STATION', id });
    setTimeout(closeStation, 1400);
  }

  return (
    <div className="simulate-panel">
      {/* Section header */}
      <div className="section-header">
        <span className="section-icon">✏️</span>
        <h2 className="section-title">Simulate</h2>
        <p className="section-sub">
          {doneCount < 4
            ? `Complete the stations to master expanded form · ${doneCount}/4 done`
            : '🌟 All stations mastered! Ready to play?'}
        </p>
      </div>

      {/* Station grid */}
      <div className="sim-grid">
        {STATIONS.map(s => {
          const done = stationsDone.includes(s.id);
          return (
            <motion.button
              key={s.id}
              className={`sim-card glass-card ${done ? 'sim-card--done' : ''}`}
              onClick={() => openStation(s)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              style={{ '--s-color': s.color }}
            >
              <div className="sim-num" style={{ color: s.color }}>{s.num}</div>
              <div className="sim-icon-wrap" style={{ background: s.bg }}>
                <span className="sim-icon">{s.icon}</span>
              </div>
              <div className="sim-body">
                <div className="sim-label" style={{ color: s.color }}>{s.label}</div>
                <div className="sim-desc">{s.desc}</div>
              </div>
              <div className="sim-status">
                {done
                  ? <span className="sim-done-badge">✅ Done</span>
                  : <span className="sim-start-badge" style={{ borderColor: s.color, color: s.color }}>Start →</span>
                }
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      {doneCount >= 3 && (
        <motion.div
          className="sim-cta glass-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="sim-cta-emoji">🌟</span>
          <div className="sim-cta-text">
            <strong>Amazing work!</strong> You've mastered the Place Value Lab!
          </div>
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: 'COMPLETE_STEP', step: 'simulate' })}
          >
            🎮 Play the Galaxy Quiz →
          </button>
        </motion.div>
      )}

      {/* Station modal */}
      <AnimatePresence>
        {activeStation && (
          <motion.div
            className="station-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) closeStation(); }}
          >
            <motion.div
              className="station-modal solid-card"
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="sm-header" style={{ borderColor: activeStation.color + '40' }}>
                <div className="sm-title">
                  <span>{activeStation.icon}</span>
                  <span style={{ color: activeStation.color }}>{activeStation.label}</span>
                </div>
                <button className="sm-close" onClick={closeStation} aria-label="Close">✕</button>
              </div>
              <div className="sm-body">
                {activeStation.id === 'builder' && (
                  <>
                    <BaseTenBuilder targetNumber={builderTarget} onSuccess={() => handleComplete('builder')} />
                    <button className="btn-secondary" style={{ margin: '0 auto', display:'block' }}
                      onClick={() => setBuilderTarget(Math.floor(Math.random()*900)+100)}>
                      🎲 New Number
                    </button>
                  </>
                )}
                {activeStation.id === 'crate'    && <CrateCounterStation    onComplete={() => handleComplete('crate')} />}
                {activeStation.id === 'detective' && <DigitDetectiveStation  onComplete={() => handleComplete('detective')} />}
                {activeStation.id === 'rocket'    && <NumberLineRocketStation onComplete={() => handleComplete('rocket')} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
