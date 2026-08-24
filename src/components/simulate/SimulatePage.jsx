import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import {
  stationBuilderIntro,
  stationCrateIntro,
  stationDetectiveIntro,
  stationRocketIntro,
} from '../../utils/narration.js';
import { stopNarration } from '../../utils/audio.js';
import StationBuilder   from './stations/StationBuilder.jsx';
import StationCrate     from './stations/StationCrate.jsx';
import StationDetective from './stations/StationDetective.jsx';
import StationRocket    from './stations/StationRocket.jsx';
import './SimulatePage.css';

const STATIONS = [
  { id:'A', key:'builder',   label:'Block Builder',   icon:'🧱', color:'#f5a623', Comp:StationBuilder,  playIntro: stationBuilderIntro   },
  { id:'B', key:'crate',     label:'Crate Counter',   icon:'📦', color:'#6ee7b7', Comp:StationCrate,    playIntro: stationCrateIntro     },
  { id:'C', key:'detective', label:'Digit Detective', icon:'🔍', color:'#a78bfa', Comp:StationDetective,playIntro: stationDetectiveIntro },
  { id:'D', key:'rocket',    label:'Number Rocket',   icon:'🚀', color:'#f9a8d4', Comp:StationRocket,   playIntro: stationRocketIntro    },
];

export default function SimulatePage() {
  const { state, dispatch } = useGame();
  const { stationsDone } = state;
  const [activeIdx, setActiveIdx] = useState(0);

  // Stop audio on unmount
  useEffect(() => () => stopNarration(), []);

  const station = STATIONS[activeIdx];

  function switchStation(i) {
    setActiveIdx(i);
    STATIONS[i].playIntro?.();
  }

  function handleDone() {
    dispatch({ type: 'DONE_STATION', id: station.key });
  }

  function goNext() {
    if (activeIdx < STATIONS.length - 1) switchStation(activeIdx + 1);
    else dispatch({ type: 'NEXT_STEP' });
  }
  function goPrev() {
    if (activeIdx > 0) switchStation(activeIdx - 1);
  }

  const done = stationsDone.includes(station.key);

  return (
    <div className="sim-page">
      {/* Header */}
      <div className="sim-hdr">
        <span className="sim-badge">✏️ Simulate</span>
        <p className="sim-sub">Explore and discover — no wrong answers!</p>
      </div>

      {/* A/B/C/D tab pills */}
      <div className="sim-tabs">
        {STATIONS.map((s, i) => {
          const isDone   = stationsDone.includes(s.key);
          const isActive = i === activeIdx;
          return (
            <button key={s.id}
              className={`sim-tab${isActive ? ' sim-tab--on' : ''}${isDone ? ' sim-tab--done' : ''}`}
              style={isActive ? { background: s.color, color: '#1a0a3e', borderColor: s.color } : {}}
              onClick={() => switchStation(i)}
            >
              <span className="sim-tab-id">{s.id}</span>
              <span>{isDone ? '✓' : s.icon}</span>
              <span className="sim-tab-lbl">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Station card */}
      <div className="sim-card-wrap">
        <AnimatePresence mode="wait">
          <motion.div key={station.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="sim-card"
          >
            <div className="sim-card-hdr">
              <span style={{ fontSize: '1.4rem', color: station.color }}>{station.icon}</span>
              <div>
                <div className="sim-card-title" style={{ color: station.color }}>{station.label}</div>
                <div className="sim-card-sub">Station {station.id} · Place Value Lab</div>
              </div>
              {done && <span className="sim-done-chip">✅ Done!</span>}
            </div>
            <div className="sim-card-body">
              <station.Comp onDone={handleDone} isDone={done} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next nav */}
      <div className="sim-nav">
        <button className="btn-dark sim-prev" onClick={goPrev} disabled={activeIdx === 0}>
          ← Previous Station
        </button>
        <button className="btn-yellow sim-next" onClick={goNext}>
          {activeIdx < STATIONS.length - 1 ? 'Next Station →' : '🎮 Go to Practice!'}
        </button>
      </div>
    </div>
  );
}
