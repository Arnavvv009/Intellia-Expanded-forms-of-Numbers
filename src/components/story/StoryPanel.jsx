import img1 from '../../assets/story-img-1.png';
import img2 from '../../assets/story-img-2.png';
import img3 from '../../assets/story-img-3.png';
import img4 from '../../assets/story-img-4.png';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import { narrate, stopNarration, preCache } from '../../utils/audio.js';
import './StoryPanel.css';
import img1 from '../../assets/story-img-1.png';
import img2 from '../../assets/story-img-2.png';
import img3 from '../../assets/story-img-3.png';
import img4 from '../../assets/story-img-4.png';
console.log("IMG1 =", img1);
console.log("IMG2 =", img2);
console.log("IMG3 =", img3);
console.log("IMG4 =", img4);

const SCENES = [
  {
    id: 'intro',
    chapter: 'Chapter 1',
    title: "Meet the Place Value Crew",
    icon: '🚀',
    image: img1,
    color: '#A78BFA',
    narration: [
      { text: "Welcome to Captain Hundred's Place Value Galaxy!", style: 'celebration' },
      { text: "Every number is made of three amazing parts. Meet the crew!", style: 'statement' },
    ],
    content:  Scene_Intro />,
  },
  {
    id: 'chart',
    chapter: 'Chapter 2',
    title: "The Place Value Chart",
    icon: '📊',
    image: img2,
    color: '#6EE7B7',
    narration: [
      { text: "Every 3-digit number has three special places: Hundreds, Tens, and Ones.", style: 'emphasis' },
    ],
    content: <Scene_Chart />,
  },
  {
    id: 'break',
    chapter: 'Chapter 3',
    title: "Breaking Apart 358",
    icon: '🔨',
    image: img3,
    color: '#FCD34D',
    narration: [
      { text: "Let's break apart 358! The 3 means 300, the 5 means 50, and the 8 means 8!", style: 'emphasis' },
    ],
    content: <Scene_Break />,
  },
  {
    id: 'read',
    chapter: 'Chapter 4',
    title: "Reading Expanded Form",
    icon: '📖',
    image: img4,
    color: '#F9A8D4',
    narration: [
      { text: "300 plus 50 plus 8 is the same as saying three hundred and fifty-eight!", style: 'statement' },
    ],
    content: <Scene_Read />,
  },
  {
    id: 'recompose',
    chapter: 'Chapter 5',
    title: "Putting It Back Together",
    icon: '🔧',
    color: '#86EFAC',
    narration: [
      { text: "400 plus 70 plus 2 equals 472. We can always put the parts back together!", style: 'celebration' },
    ],
    content: <Scene_Recompose />,
  },
  {
    id: 'fuel',
    chapter: 'Chapter 6',
    title: "Fuel Cells in the Galaxy",
    icon: '⚡',
    color: '#FCA5A5',
    narration: [
      { text: "4 crates of 100 plus 6 tubes of 10 plus 3 loose cells equals 463 fuel cells!", style: 'statement' },
    ],
    content: <Scene_Fuel />,
  },
];

export default function StoryPanel() {
  const { dispatch } = useGame();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [dir, setDir]     = useState(1);

  // Auto-play narration on mount
  useEffect(() => {
    const scene = SCENES[0];
    if (scene?.narration) narrate(scene.narration);
    // Pre-cache next 2 scenes
    if (SCENES[1]?.narration) preCache(SCENES[1].narration);
    if (SCENES[2]?.narration) preCache(SCENES[2].narration);
    return () => stopNarration();
  }, []);

  // Pre-cache nearby scenes when scene changes
  useEffect(() => {
    if (sceneIdx + 1 < SCENES.length && SCENES[sceneIdx + 1]?.narration) {
      preCache(SCENES[sceneIdx + 1].narration);
    }
    if (sceneIdx + 2 < SCENES.length && SCENES[sceneIdx + 2]?.narration) {
      preCache(SCENES[sceneIdx + 2].narration);
    }
  }, [sceneIdx]);

  // Stop audio when scene changes
  useEffect(() => {
    return () => stopNarration();
  }, [sceneIdx]);

  // Stop audio on unmount
  useEffect(() => {
    return () => stopNarration();
  }, []);

  const scene = SCENES[sceneIdx];
  const isLast = sceneIdx === SCENES.length - 1;

  function goNext() {
    if (!isLast) {
      const nextIdx = sceneIdx + 1;
      const next = SCENES[nextIdx];
      setDir(1);
      setSceneIdx(nextIdx);
      if (next?.narration) narrate(next.narration);
    } else {
      dispatch({ type: 'COMPLETE_STEP', step: 'story' });
    }
  }

  function goPrev() {
    if (sceneIdx > 0) {
      const prevIdx = sceneIdx - 1;
      const prev = SCENES[prevIdx];
      stopNarration();
      setDir(-1);
      setSceneIdx(prevIdx);
      if (prev?.narration) narrate(prev.narration);
    }
  }

  function playNarration() {
    if (scene?.narration) narrate(scene.narration);
  }

  return (
    <div className="story-panel">
      {/* Section header */}
      <div className="section-header">
        <span className="section-icon">📖</span>
        <h2 className="section-title">Story</h2>
        <p className="section-sub">Follow the journey of Hundy, Tenny and Onesy</p>
      </div>

      {/* Scene dots */}
      <div className="scene-dots" role="list">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            className={`scene-dot ${i === sceneIdx ? 'active' : ''} ${i < sceneIdx ? 'done' : ''}`}
            onClick={() => {
              stopNarration();
              setDir(i > sceneIdx ? 1 : -1);
              setSceneIdx(i);
              if (s?.narration) narrate(s.narration);
            }}
            aria-label={`Scene ${i + 1}: ${s.title}`}
            aria-current={i === sceneIdx ? 'step' : undefined}
          />
        ))}
      </div>

      {/* Scene card */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={scene.id}
          custom={dir}
          variants={{
            initial: d => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
            animate: { x: 0, opacity: 1 },
            exit:    d => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="scene-card glass-card"
          onClick={playNarration}
          role="article"
          aria-label={`${scene.chapter}: ${scene.title}`}
        >
          {/* Chapter label */}
          <div className="scene-chapter" style={{ color: scene.color }}>
            {scene.chapter}
          </div>

          {/* Scene header */}
          <div className="scene-head">
            <span className="scene-icon" style={{ filter: `drop-shadow(0 0 12px ${scene.color}80)` }}>
              {scene.icon}
            </span>
            <h3 className="scene-title-text">{scene.title}</h3>
            <button
              className="scene-play-btn"
              onClick={e => { e.stopPropagation(); playNarration(); }}
              aria-label="Play narration"
              title="Hear narration"
            >
              🔊
            </button>
          </div>

          {/* Content */}
          <div className="scene-body">
            {scene.content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="story-nav">
        <button
          className="btn-secondary"
          onClick={goPrev}
          disabled={sceneIdx === 0}
        >
          ← Back
        </button>
        <span className="scene-counter">
          {sceneIdx + 1} <span className="sc-sep">/</span> {SCENES.length}
        </span>
        <button className="btn-primary" onClick={goNext}>
          {isLast ? '✏️ Go to Simulate →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

/* ── Scene content components ──────────────────────────────────────────────── */
function Scene_Intro() {
  return (
    <div className="scene-content">
      <img 
        src={img1}
        alt="Place Value Crew - Hundy, Tenny, and Onesy" 
        className="scene-image" 
      />
      <div className="crew-row">
        {[
          { emoji: '🟦', name: 'Hundy', role: 'Hundreds', color: '#6366F1' },
          { emoji: '🟩', name: 'Tenny', role: 'Tens',     color: '#10B981' },
          { emoji: '🟡', name: 'Onesy', role: 'Ones',     color: '#F59E0B' },
        ].map(c => (
          <motion.div
            key={c.name}
            className="crew-card"
            style={{ '--crew-color': c.color }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <span className="crew-emoji anim-float">{c.emoji}</span>
            <span className="crew-name" style={{ color: c.color }}>{c.name}</span>
            <span className="crew-role">{c.role}</span>
          </motion.div>
        ))}
      </div>
      <p className="scene-text">
        Every number is secretly made of three parts —{' '}
        <strong style={{ color:'#6366F1' }}>Hundreds</strong>,{' '}
        <strong style={{ color:'#10B981' }}>Tens</strong>, and{' '}
        <strong style={{ color:'#F59E0B' }}>Ones</strong>!
        Meet the crew that keeps our rocket flying through the Place Value Galaxy!
      </p>
    </div>
  );
}

function Scene_Chart() {
  return (
    <div className="scene-content">
      <img 
        src={img2}
        alt="Place Value Chart with three homes" 
        className="scene-image" 
      />
      <div className="pv-chart">
        {[
          { label:'Hundreds', sub:'Hundy', val:'H', color:'#6366F1', bg:'rgba(99,102,241,0.12)' },
          { label:'Tens',     sub:'Tenny', val:'T', color:'#10B981', bg:'rgba(16,185,129,0.12)' },
          { label:'Ones',     sub:'Onesy', val:'O', color:'#F59E0B', bg:'rgba(245,158,11,0.12)' },
        ].map(col => (
          <div key={col.label} className="pv-col" style={{ background: col.bg, borderColor: col.color + '55' }}>
            <div className="pvc-label" style={{ color: col.color }}>{col.label}</div>
            <div className="pvc-val" style={{ color: col.color }}>{col.val}</div>
            <div className="pvc-sub">{col.sub}</div>
          </div>
        ))}
      </div>
      <p className="scene-text">
        When we write a 3-digit number, each digit lives in its own place.
        The <strong style={{color:'#6366F1'}}>hundreds</strong> digit is on the left,
        <strong style={{color:'#10B981'}}> tens</strong> in the middle, and
        <strong style={{color:'#F59E0B'}}> ones</strong> on the right!
      </p>
    </div>
  );
}

function Scene_Break() {
  return (
    <div className="scene-content">
      <img 
        src={img3}
        alt="Breaking apart 358 into place values" 
        className="scene-image" 
      />
      <div className="break-demo">
        <motion.div
          className="bd-number"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          358
        </motion.div>
        <div className="bd-arrow">↓</div>
        <div className="bd-parts">
          {[
            { digit:'3', val:'300', color:'#6366F1', delay: 0.2 },
            { digit:'5', val:'50',  color:'#10B981', delay: 0.4 },
            { digit:'8', val:'8',   color:'#F59E0B', delay: 0.6 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="bd-part"
              style={{ borderColor: p.color + '60', background: p.color + '15' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: p.delay }}
            >
              <span className="bdp-digit" style={{ color: p.color }}>{p.digit}</span>
              <span className="bdp-eq">→</span>
              <span className="bdp-val" style={{ color: p.color }}>{p.val}</span>
            </motion.div>
          ))}
        </div>
        <div className="bd-result">
          <span style={{color:'#6366F1'}}>300</span>
          {' + '}
          <span style={{color:'#10B981'}}>50</span>
          {' + '}
          <span style={{color:'#F59E0B'}}>8</span>
          {' = 358'}
        </div>
      </div>
      <p className="scene-text">
        The digit <strong style={{color:'#6366F1'}}>3</strong> is in the hundreds place → <strong style={{color:'#6366F1'}}>300</strong>.
        The digit <strong style={{color:'#10B981'}}>5</strong> is in the tens place → <strong style={{color:'#10B981'}}>50</strong>.
        The digit <strong style={{color:'#F59E0B'}}>8</strong> is in the ones place → <strong style={{color:'#F59E0B'}}>8</strong>.
      </p>
    </div>
  );
}

function Scene_Read() {
  return (
    <div className="scene-content">
      <img 
        src={img4}
        alt="Adding expanded form parts together" 
        className="scene-image" 
      />
      <div className="read-demo">
        <div className="rd-expanded">
          <span style={{color:'#6366F1',fontSize:'var(--fs-3xl)',fontWeight:900}}>300</span>
          <span className="rd-op">+</span>
          <span style={{color:'#10B981',fontSize:'var(--fs-3xl)',fontWeight:900}}>50</span>
          <span className="rd-op">+</span>
          <span style={{color:'#F59E0B',fontSize:'var(--fs-3xl)',fontWeight:900}}>8</span>
        </div>
        <div className="rd-equals">⬇</div>
        <div className="rd-words">"Three hundred and fifty-eight"</div>
      </div>
      <p className="scene-text">
        We read <strong>300 + 50 + 8</strong> as "three hundred and fifty-eight."
        The expanded form <em>reveals</em> the value hiding inside every digit!
      </p>
    </div>
  );
}

function Scene_Recompose() {
  return (
    <div className="scene-content">
      <div className="recompose-demo">
        <div className="rc-parts">
          <span style={{color:'#6366F1',fontWeight:900,fontSize:'var(--fs-2xl)'}}>400</span>
          <span className="rd-op">+</span>
          <span style={{color:'#10B981',fontWeight:900,fontSize:'var(--fs-2xl)'}}>70</span>
          <span className="rd-op">+</span>
          <span style={{color:'#F59E0B',fontWeight:900,fontSize:'var(--fs-2xl)'}}>2</span>
        </div>
        <div className="rc-steps">
          <motion.div
            className="rc-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >400 + 70 = 470</motion.div>
          <motion.div
            className="rc-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >470 + 2 = <strong style={{color:'#86EFAC',fontSize:'var(--fs-xl)'}}>472</strong></motion.div>
        </div>
      </div>
      <p className="scene-text">
        We can always add the parts back together!
        <strong> 400 + 70 + 2 = 472</strong>.
        Expanded form and standard form are two ways of writing the same number!
      </p>
    </div>
  );
}

function Scene_Fuel() {
  return (
    <div className="scene-content">
      <div className="fuel-demo">
        {[
          { items: ['📦','📦','📦','📦'], label:'4 crates × 100', value:'= 400', color:'#6366F1' },
          { items: ['🧪','🧪','🧪','🧪','🧪','🧪'], label:'6 tubes × 10', value:'= 60', color:'#10B981' },
          { items: ['🔵','🔵','🔵'], label:'3 cells × 1', value:'= 3', color:'#F59E0B' },
        ].map((g, i) => (
          <div key={i} className="fuel-group" style={{ borderColor: g.color + '40' }}>
            <div className="fg-items">{g.items.map((e,j) => <span key={j}>{e}</span>)}</div>
            <div className="fg-label" style={{color: g.color}}>{g.label}</div>
            <div className="fg-val"  style={{color: g.color}}>{g.value}</div>
          </div>
        ))}
      </div>
      <div className="fuel-total">
        <span style={{color:'#6366F1',fontWeight:800}}>400</span>{' + '}
        <span style={{color:'#10B981',fontWeight:800}}>60</span>{' + '}
        <span style={{color:'#F59E0B',fontWeight:800}}>3</span>{' = '}
        <span style={{color:'#86EFAC',fontWeight:900,fontSize:'var(--fs-2xl)'}}>463</span>
        {' fuel cells! 🚀'}
      </div>
      <p className="scene-text">
        We group things in hundreds, tens, and ones in real life too!
        Our rocket sorts fuel cells in crates (100s), tubes (10s), and loose cells (1s).
      </p>
    </div>
  );
}
