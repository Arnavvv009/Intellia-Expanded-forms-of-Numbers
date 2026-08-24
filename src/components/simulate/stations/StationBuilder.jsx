import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../../utils/placeValue.js';
import { celebrate, encourage } from '../../../utils/audio.js';
import './Stn.css';

const rnd = () => Math.floor(Math.random() * 900) + 100;

export default function StationBuilder({ onDone, isDone }) {
  const [target, setTarget] = useState(rnd);
  const [p, setP] = useState({ h:0, t:0, o:0 });
  const [fb, setFb] = useState(null);
  const { hundreds:H, tens:T, ones:O } = decompose(target);
  const total = p.h*100 + p.t*10 + p.o;

  function add(k) { setFb(null); setP(v => ({...v,[k]:Math.min(v[k]+1,9)})); }
  function sub(k) { setFb(null); setP(v => ({...v,[k]:Math.max(v[k]-1,0)})); }
  function reset()  { setP({h:0,t:0,o:0}); setFb(null); }
  function newNum() { setTarget(rnd()); reset(); }

  function check() {
    if (p.h===H && p.t===T && p.o===O) {
      setFb('correct'); celebrate('You built the number perfectly!'); onDone?.();
    } else {
      setFb('wrong'); encourage('Not quite — check each place value!');
    }
  }

  const zones = [
    {k:'h', label:'Hundreds', col:'#818cf8', val:p.h*100},
    {k:'t', label:'Tens',     col:'#6ee7b7', val:p.t*10 },
    {k:'o', label:'Ones',     col:'#fcd34d', val:p.o    },
  ];

  return (
    <div className="stn">
      <div className="stn-target">
        <span className="stn-target-lbl">Build:</span>
        <span className="stn-target-num">{target}</span>
        <button className="stn-new" onClick={newNum}>🎲 New</button>
      </div>

      <div className="stn-zones">
        {zones.map(z => (
          <div key={z.k} className="stn-zone" style={{borderColor:z.col+'55'}}>
            <div className="stn-zone-lbl" style={{color:z.col}}>{z.label}</div>
            <div className="stn-zone-val" style={{color:z.col}}>{z.val}</div>
            <div className="stn-zone-ctrl">
              <button className="stn-btn stn-btn-sub" onClick={()=>sub(z.k)} disabled={p[z.k]===0}>−</button>
              <span className="stn-zone-cnt">{p[z.k]}</span>
              <button className="stn-btn stn-btn-add" onClick={()=>add(z.k)} disabled={p[z.k]===9}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="stn-total">
        <span className="stn-total-lbl">Total:</span>
        <span className={`stn-total-val${total===target?' stn-total-val--ok':''}`}>{total}</span>
        <span className="stn-total-exp">
          = <span style={{color:'#818cf8'}}>{p.h*100}</span> + <span style={{color:'#6ee7b7'}}>{p.t*10}</span> + <span style={{color:'#fcd34d'}}>{p.o}</span>
        </span>
      </div>

      <AnimatePresence>
        {fb && (
          <motion.div className={`stn-fb stn-fb--${fb}`}
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            {fb==='correct' ? `✅ Perfect! ${target} = ${H*100} + ${T*10} + ${O}` : `❌ You have ${total}, need ${target}. ${total<target?'Add more!':'Remove some!'}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stn-actions">
        <button className="stn-reset-btn" onClick={reset}>🔄 Reset</button>
        <button className="stn-check-btn" onClick={check} disabled={isDone}>✓ Check!</button>
      </div>
    </div>
  );
}
