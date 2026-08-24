import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../../utils/placeValue.js';
import { celebrate, encourage } from '../../../utils/audio.js';
import './Stn.css';

const rnd = () => Math.floor(Math.random()*900)+100;
const HOUSES = [
  {key:'hundreds', label:'Hundreds', crew:'Hundy',  emoji:'🟦', col:'#818cf8'},
  {key:'tens',     label:'Tens',     crew:'Tenny',  emoji:'🟩', col:'#6ee7b7'},
  {key:'ones',     label:'Ones',     crew:'Onesy',  emoji:'🟡', col:'#fcd34d'},
];

export default function StationDetective({ onDone, isDone }) {
  const [target, setTarget] = useState(rnd);
  const [sel, setSel]       = useState(null);
  const [matched, setMatched] = useState({});
  const [allDone, setAllDone] = useState(false);
  const { hundreds:H, tens:T, ones:O } = decompose(target);
  const digits = [H,T,O];
  const positions = ['hundreds','tens','ones'];
  const values = [H*100,T*10,O];

  function pick(i) { if(!matched[i]) setSel(sel===i?null:i); }

  function drop(house) {
    if(sel===null) return;
    const ok = positions[sel]===house;
    const nm = {...matched,[sel]:ok?'ok':'bad'};
    setMatched(nm); setSel(null);
    if(ok) celebrate(`${digits[sel]} in ${house} = ${values[sel]}!`);
    else   encourage(`That digit belongs in the ${positions[sel]} house!`);
    const allOk = Object.keys(nm).length===3 && Object.values(nm).every(v=>v==='ok');
    if(allOk){ setAllDone(true); onDone?.(); }
  }

  function reset() { setTarget(rnd()); setSel(null); setMatched({}); setAllDone(false); }

  return (
    <div className="stn">
      <p className="stn-prompt">Tap a digit → then tap its correct house!</p>

      <div className="stn-digits">
        {digits.map((d,i)=>{
          const s = matched[i];
          return (
            <motion.button key={i}
              className={`stn-digit${sel===i?' stn-digit--sel':''}${s==='ok'?' stn-digit--ok':''}${s==='bad'?' stn-digit--bad':''}`}
              onClick={()=>pick(i)}
              whileHover={!s?{scale:1.08}:{}} whileTap={!s?{scale:.92}:{}}
            >{d}</motion.button>
          );
        })}
      </div>

      {sel!==null && <p className="stn-prompt" style={{fontSize:'var(--fs-sm)'}}>Drop digit <strong style={{color:'#fcd34d'}}>{digits[sel]}</strong> into its house</p>}

      <div className="stn-houses">
        {HOUSES.map(h=>{
          const entry = Object.entries(matched).find(([i,s])=>positions[+i]===h.key&&s==='ok');
          const lit = !!entry;
          return (
            <motion.div key={h.key}
              className={`stn-house${lit?' stn-house--lit':''}`}
              style={{borderColor:h.col+'55', background:lit?h.col+'18':''}}
              onClick={()=>drop(h.key)}
              whileHover={sel!==null&&!lit?{scale:1.04}:{}}
              role="button"
            >
              <span className="stn-house-ico">{h.emoji}</span>
              <span className="stn-house-lbl" style={{color:h.col}}>{h.label}</span>
              <span className="stn-house-crew">{h.crew}</span>
              {lit&&<motion.span style={{color:h.col,fontSize:'1.3rem',fontWeight:900}} initial={{scale:0}} animate={{scale:1}}>
                = {values[positions.indexOf(h.key)]}
              </motion.span>}
            </motion.div>
          );
        })}
      </div>

      {allDone&&<motion.div className="stn-fb stn-fb--correct" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}}>✅ Perfect! {target} = {H*100} + {T*10} + {O}</motion.div>}

      <div className="stn-actions">
        <button className="stn-reset-btn" onClick={reset}>🔄 New Number</button>
      </div>
    </div>
  );
}
