import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decompose } from '../../../utils/placeValue.js';
import { celebrate, encourage } from '../../../utils/audio.js';
import './Stn.css';

const rnd = () => Math.floor(Math.random()*900)+100;

export default function StationRocket({ onDone, isDone }) {
  const [target, setTarget] = useState(rnd);
  const [ans, setAns] = useState({h:'',t:'',o:''});
  const [fb, setFb] = useState(null);
  const { hundreds:H, tens:T, ones:O } = decompose(target);
  const rPct = ((target-100)/900)*84 + 8;

  function inp(k,v){ setFb(null); setAns(a=>({...a,[k]:v.replace(/\D/g,'').slice(0,3)})); }
  function newNum(){ setTarget(rnd()); setAns({h:'',t:'',o:''}); setFb(null); }

  function check(){
    if(+ans.h===H*100&&+ans.t===T*10&&+ans.o===O){ setFb('correct'); celebrate('Perfect landing! Expanded form decoded!'); onDone?.(); }
    else { setFb('wrong'); encourage('Check the H, T, O segments again!'); }
  }

  const maxW=120;
  const bars=[
    {lbl:'Hundreds',w:Math.max(22,(H/9)*maxW),col:'#818cf8'},
    {lbl:'Tens',    w:Math.max(16,(T/9)*maxW),col:'#6ee7b7'},
    {lbl:'Ones',    w:Math.max(12,(O/9)*maxW),col:'#fcd34d'},
  ];

  return (
    <div className="stn">
      <p className="stn-prompt">🚀 Rocket landed on <strong style={{color:'var(--amber)', fontSize:'var(--fs-lg)'}}>{target}</strong>. Decode the expanded form!</p>

      {/* Number line */}
      <div style={{width:'100%', padding:'6px 0', overflowX:'hidden'}}>
        <div style={{position:'relative', height:56, width:'100%'}}>
          {/* Track line */}
          <div style={{position:'absolute', top:'35%', left:'5%', right:'5%', height:4, background:'rgba(255,255,255,.28)', borderRadius:3, transform:'translateY(-50%)'}}/>
          {/* Tick marks + labels */}
          {[100,200,300,400,500,600,700,800,900].map(v=>(
            <div key={v} style={{position:'absolute', top:'35%', left:`${((v-100)/900)*84+8}%`, transform:'translateX(-50%) translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
              <div style={{width:2, height:12, background:'rgba(255,255,255,.55)', borderRadius:2}}/>
              <div style={{
                fontSize:11,
                fontWeight:800,
                color:'#d4c8f0',
                marginTop:2,
                whiteSpace:'nowrap',
              }}>{v}</div>
            </div>
          ))}
          {/* Rocket */}
          <motion.div
            style={{position:'absolute', top:'35%', left:`${rPct}%`, transform:'translateY(-50%) translateX(-50%)', fontSize:'1.6rem', filter:'drop-shadow(0 0 8px rgba(245,166,35,.8))'}}
            animate={{left:`${rPct}%`}}
            transition={{type:'spring', stiffness:100, damping:18}}
          >🚀</motion.div>
        </div>
      </div>

      {/* Segment bars */}
      <div style={{display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', margin:'2px 0'}}>
        {bars.map(b=>(
          <div key={b.lbl} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
            <div style={{height:18, width:b.w, background:b.col, borderRadius:9999, boxShadow:`0 0 8px ${b.col}66`}}/>
            <span style={{fontSize:'var(--fs-sm)', fontWeight:800, color:b.col}}>{b.lbl}</span>
          </div>
        ))}
      </div>

      <div className="stn-inputs">
        <input className="stn-input stn-input-h" type="number" placeholder="H00" value={ans.h} onChange={e=>inp('h',e.target.value)} disabled={fb==='correct'} aria-label="Hundreds"/>
        <span className="stn-op">+</span>
        <input className="stn-input stn-input-t" type="number" placeholder="T0"  value={ans.t} onChange={e=>inp('t',e.target.value)} disabled={fb==='correct'} aria-label="Tens"/>
        <span className="stn-op">+</span>
        <input className="stn-input stn-input-o" type="number" placeholder="O"   value={ans.o} onChange={e=>inp('o',e.target.value)} disabled={fb==='correct'} aria-label="Ones"/>
      </div>

      <AnimatePresence>
        {fb&&<motion.div className={`stn-fb stn-fb--${fb}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
          {fb==='correct'?`✅ Correct! ${target} = ${H*100} + ${T*10} + ${O}`:`❌ Hint: ${H} hundreds = ${H*100}, ${T} tens = ${T*10}`}
        </motion.div>}
      </AnimatePresence>

      <div className="stn-actions">
        <button className="stn-reset-btn" onClick={newNum}>🔄 New Number</button>
        {fb!=='correct'&&<button className="stn-check-btn" onClick={check}>✓ Check!</button>}
      </div>
    </div>
  );
}
