import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import {
  reflectSummaryNarration,
  reflectQ1Narration, reflectQ2Narration,
  reflectQ3Narration, reflectQ4Narration,
} from '../../utils/narration.js';
import { stopNarration } from '../../utils/audio.js';
import './ReflectPage.css';

const LEARNINGS = [
  { ico:'🟦', title:'Hundreds Place',    text:'Leftmost digit. 4 in 472 → 400.',              col:'#818cf8' },
  { ico:'🟩', title:'Tens Place',         text:'Middle digit. 7 in 472 → 70.',                 col:'#6ee7b7' },
  { ico:'🟡', title:'Ones Place',         text:'Rightmost digit. 2 in 472 → 2.',               col:'#fcd34d' },
  { ico:'🔀', title:'Expanded Form',      text:'472 = 400 + 70 + 2. Show each digit\'s value.', col:'#f9a8d4' },
  { ico:'🔁', title:'Standard Form',      text:'400 + 70 + 2 = 472. Add parts together.',      col:'#a78bfa' },
  { ico:'0️⃣', title:'Zero Still Counts!', text:'405 = 400 + 0 + 5. Never skip the zero!',     col:'#6ee7b7' },
];

const QS = [
  { q:'What does the 6 mean in 634?',              a:'600 — the 6 is in the hundreds place, so it represents 6 × 100 = 600.' },
  { q:'Write 509 in expanded form.',                a:'500 + 0 + 9 — include the 0 in the tens place!' },
  { q:'What number equals 300 + 40 + 8?',          a:'348 — add the place values: 300 + 40 + 8 = 348.' },
  { q:'Which digit is in the tens place in 726?',  a:'2 — the middle digit represents 2 tens = 20.' },
];

export default function ReflectPage() {
  const { state, dispatch } = useGame();
  const { stars, badges, correct, qIndex } = state;
  const acc = qIndex > 0 ? Math.round((correct / qIndex) * 100) : 0;
  const [open, setOpen] = useState([]);

  // Stop audio on unmount
  useEffect(() => () => stopNarration(), []);

  function toggle(i) { setOpen(o => o.includes(i) ? o.filter(x=>x!==i) : [...o,i]); }

  return (
    <div className="rfl-page">
      {/* Summary */}
      <motion.div className="rfl-card card" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}>
        <div className="rfl-card-hdr">
          <div className="rfl-ava float">🚀</div>
          <div className="rfl-card-info">
            <div className="rfl-card-title">Your Learning Summary</div>
            <div className="rfl-card-sub">Expanded Form of Numbers to 1,000</div>
          </div>
          <button className="rfl-narrate" onClick={reflectSummaryNarration} aria-label="Play summary narration">🔊</button>
        </div>
        <div className="rfl-stats">
          {[['#fcd34d',stars,'Stars'],['#6ee7b7',`${acc}%`,'Accuracy'],['#a78bfa',badges.length,'Badges']].map(([col,val,lbl])=>(
            <div key={lbl} className="rfl-stat">
              <span style={{color:col,fontSize:'var(--fs-2xl)',fontWeight:900,lineHeight:1}}>{val}</span>
              <span style={{fontSize:'var(--fs-xs)',color:'var(--dim)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>{lbl}</span>
            </div>
          ))}
        </div>
        {badges.length > 0 && (
          <div className="rfl-badges">
            {badges.map((b,i) => (
              <motion.span key={b.id} className="rfl-badge" initial={{scale:0}} animate={{scale:1}} transition={{delay:i*.07}}>
                {b.emoji} {b.label}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Key learnings */}
      <div className="rfl-section">
        <h3 className="rfl-sec-title">📚 Key Learnings</h3>
        <div className="rfl-grid">
          {LEARNINGS.map((l,i)=>(
            <motion.div key={i} className="rfl-learn" style={{borderTop:`2px solid ${l.col}`}}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}>
              <span style={{fontSize:'1.25rem'}}>{l.ico}</span>
              <div>
                <div style={{fontSize:'var(--fs-sm)',fontWeight:800,color:l.col,marginBottom:2}}>{l.title}</div>
                <div style={{fontSize:'var(--fs-xs)',color:'var(--muted)',lineHeight:1.5}}>{l.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Check questions */}
      <div className="rfl-section">
        <h3 className="rfl-sec-title">🤔 Check Your Understanding</h3>
        <div className="rfl-qs">
          {QS.map((item,i)=>(
            <div key={i} className="rfl-q card">
              <div className="rfl-q-row">
                <span className="rfl-q-num">{i+1}</span>
                <span className="rfl-q-text">{item.q}</span>
                <button className="rfl-narrate" style={{marginLeft:'auto',flexShrink:0}}
                  onClick={[reflectQ1Narration,reflectQ2Narration,reflectQ3Narration,reflectQ4Narration][i]}
                  aria-label="Hear question">🔊</button>
              </div>
              <button className={`rfl-toggle${open.includes(i)?' rfl-toggle--open':''}`} onClick={()=>toggle(i)}>
                {open.includes(i) ? '▲ Hide Answer' : '▼ Show Answer'}
              </button>
              {open.includes(i) && (
                <motion.div className="rfl-answer" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}>
                  ✅ {item.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="rfl-actions">
        <button className="stn-reset-btn" onClick={()=>dispatch({type:'GO',step:'landing'})}>🏠 Home</button>
        <button className="stn-reset-btn" onClick={()=>dispatch({type:'GO',step:'story'})}>📖 Story</button>
        <button className="stn-reset-btn" onClick={()=>dispatch({type:'GO',step:'simulate'})}>✏️ Simulate</button>
        <button className="btn-yellow" style={{padding:'11px 26px',fontSize:'var(--fs-base)'}}
          onClick={()=>{dispatch({type:'RESET_SESSION'});dispatch({type:'GO',step:'play'});}}>
          🎮 Practice Again!
        </button>
      </div>
    </div>
  );
}
