import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../../utils/placeValue.js';
import { celebrate, encourage } from '../../../utils/audio.js';
import './Stn.css';

const rnd = () => Math.floor(Math.random()*900)+100;

export default function StationCrate({ onDone, isDone }) {
  const [target, setTarget] = useState(rnd);
  const [ans, setAns] = useState({h:'',t:'',o:''});
  const [fb, setFb] = useState(null);
  const { hundreds:H, tens:T, ones:O } = decompose(target);

  function inp(k,v){ setFb(null); setAns(a=>({...a,[k]:v.replace(/\D/g,'').slice(0,3)})); }
  function newNum() { setTarget(rnd()); setAns({h:'',t:'',o:''}); setFb(null); }

  function check() {
    if (+ans.h===H*100 && +ans.t===T*10 && +ans.o===O) {
      setFb('correct'); celebrate('You counted perfectly!'); onDone?.();
    } else {
      setFb('wrong'); encourage('Not quite — look at each group!');
    }
  }

  const groups=[
    {items:Array(H).fill('📦'), lbl:`${H} crate${H!==1?'s':''} × 100`, col:'#818cf8'},
    {items:Array(T).fill('🧪'), lbl:`${T} tube${T!==1?'s':''} × 10`,   col:'#6ee7b7'},
    {items:Array(O).fill('🔵'), lbl:`${O} cell${O!==1?'s':''} × 1`,    col:'#fcd34d'},
  ];

  return (
    <div className="stn">
      <p className="stn-prompt">Count the fuel groups, then write the expanded form:</p>

      <div className="stn-visuals">
        {groups.map((g,i)=>(
          <div key={i} className="stn-visual" style={{borderColor:g.col+'40'}}>
            <div className="stn-visual-items">{g.items.length?g.items.map((e,j)=><span key={j}>{e}</span>):<span style={{color:'var(--dim)'}}>none</span>}</div>
            <div className="stn-visual-lbl" style={{color:g.col}}>{g.lbl}</div>
          </div>
        ))}
      </div>

      <div className="stn-inputs">
        <input className="stn-input stn-input-h" type="number" placeholder="H00" value={ans.h} onChange={e=>inp('h',e.target.value)} disabled={fb==='correct'} aria-label="Hundreds"/>
        <span className="stn-op">+</span>
        <input className="stn-input stn-input-t" type="number" placeholder="T0"  value={ans.t} onChange={e=>inp('t',e.target.value)} disabled={fb==='correct'} aria-label="Tens"/>
        <span className="stn-op">+</span>
        <input className="stn-input stn-input-o" type="number" placeholder="O"   value={ans.o} onChange={e=>inp('o',e.target.value)} disabled={fb==='correct'} aria-label="Ones"/>
        <span className="stn-op">=</span>
        <span className="stn-answer-num">{target}</span>
      </div>

      <AnimatePresence>
        {fb&&<motion.div className={`stn-fb stn-fb--${fb}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
          {fb==='correct'?`✅ Correct! ${target} = ${H*100} + ${T*10} + ${O}`:`❌ Hint: ${H} crates = ${H*100}`}
        </motion.div>}
      </AnimatePresence>

      <div className="stn-actions">
        <button className="stn-reset-btn" onClick={newNum}>🔄 New Number</button>
        {fb!=='correct'&&<button className="stn-check-btn" onClick={check}>✓ Check!</button>}
      </div>
    </div>
  );
}
