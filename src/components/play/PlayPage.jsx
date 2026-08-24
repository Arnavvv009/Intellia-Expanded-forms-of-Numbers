import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext.jsx';
import { generateQuestionPool } from '../../engine/questionEngine.js';
import {
  getRandomCorrectFeedback,
  getRandomIncorrectFeedback,
  playArenaIntro,
  checkpointNarration,
  sessionCompleteNarration,
} from '../../utils/narration.js';
import { narrate, stopNarration } from '../../utils/audio.js';
import './PlayPage.css';

const WORLDS = [
  { label:'Number Galaxy',   sub:'Numbers 100–399 · No zeros',  icon:'🌟', col:'#6ee7b7' },
  { label:'Place Value Peak', sub:'Numbers with zero digits',    icon:'⛰️', col:'#a78bfa' },
  { label:'Galaxy Champion',  sub:'All tiers · Full challenge',  icon:'🌌', col:'#fcd34d' },
];

/* ── Option Button ───────────────────────────────────────────── */
function OptBtn({ label, state: st, onClick }) {
  return (
    <motion.button
      className={`opt opt--${st}`}
      onClick={onClick}
      disabled={st !== 'idle'}
      whileHover={st === 'idle' ? { scale:1.025 } : {}}
      whileTap={st === 'idle' ? { scale:.97 } : {}}
    >{label}</motion.button>
  );
}

/* ── Question View (all 5 types) ────────────────────────────── */
function QView({ q, onCorrect, onWrong }) {
  const [picked, setPicked]           = useState(null);
  const [done, setDone]               = useState(false);
  const [fillAns, setFillAns]         = useState(['','','']);
  const [fillResult, setFillResult]   = useState(null);
  const [matchSel, setMatchSel]       = useState(null);
  const [matchDone, setMatchDone]     = useState({});
  const [matchAllDone, setMatchAllDone] = useState(false);
  const [buildPlaced, setBuildPlaced] = useState({ h:0, t:0, o:0 });
  const [buildResult, setBuildResult] = useState(null);

  function markCorrect() {
    confetti({ particleCount:55, spread:60, origin:{y:.55}, colors:['#f5a623','#a78bfa','#6ee7b7'] });
    narrate(getRandomCorrectFeedback());
    setDone(true);
    setTimeout(onCorrect, 1600);
  }
  function markWrong() {
    narrate(getRandomIncorrectFeedback());
    setDone(true);
  }

  // MCQ
  function pick(idx) {
    if (done) return;
    setPicked(idx);
    idx === q.correctIndex ? markCorrect() : markWrong();
  }
  function optState(idx) {
    if (!done) return 'idle';
    if (idx === q.correctIndex) return 'correct';
    if (idx === picked) return 'wrong';
    return 'dim';
  }

  // T/F
  function tfPick(val) {
    if (done) return;
    setPicked(val);
    val === q.correctAnswer ? markCorrect() : markWrong();
  }
  function tfState(val) {
    if (!done) return 'idle';
    if (val === q.correctAnswer) return 'correct';
    if (val === picked) return 'wrong';
    return 'dim';
  }

  // Fill tiles
  function checkFill() {
    const ok = +fillAns[0]===q.correctValues[0] && +fillAns[1]===q.correctValues[1] && +fillAns[2]===q.correctValues[2];
    setFillResult(ok ? 'correct' : 'wrong');
    ok ? markCorrect() : markWrong();
  }

  // Match pairs
  function matchLeft(i)  { if (matchDone[i]) return; setMatchSel(s => s===i ? null : i); }
  function matchRight(j) {
    if (matchSel===null) return;
    const ok = q.pairs[matchSel].expanded === q.pairs[j].expanded;
    const nd = { ...matchDone, [matchSel]: ok?'ok':'bad' };
    setMatchDone(nd); setMatchSel(null);
    if (q.pairs.every((_,i) => nd[i]==='ok')) { setMatchAllDone(true); markCorrect(); }
  }

  // Build it
  const buildTotal = buildPlaced.h*100 + buildPlaced.t*10 + buildPlaced.o;
  function buildAdd(k) { setBuildResult(null); setBuildPlaced(p=>({...p,[k]:Math.min(p[k]+1,9)})); }
  function buildSub(k) { setBuildResult(null); setBuildPlaced(p=>({...p,[k]:Math.max(p[k]-1,0)})); }
  function checkBuild() {
    const ok = buildPlaced.h===q.target.hundreds && buildPlaced.t===q.target.tens && buildPlaced.o===q.target.ones;
    setBuildResult(ok?'correct':'wrong');
    ok ? markCorrect() : markWrong();
  }

  const isCorrect = done && (
    picked===q.correctIndex || picked===q.correctAnswer ||
    fillResult==='correct'  || matchAllDone || buildResult==='correct'
  );

  return (
    <div className="qview">
      <div className="qview-prompt"><p>{q.prompt}</p></div>

      {q.type==='mcq' && (
        <div className="qview-opts">
          {q.options.map((o,i) => <OptBtn key={i} label={o} state={optState(i)} onClick={()=>pick(i)} />)}
        </div>
      )}

      {q.type==='trueFalse' && (
        <div className="qview-tf">
          <OptBtn label="✅  TRUE"  state={tfState(true)}  onClick={()=>tfPick(true)} />
          <OptBtn label="❌  FALSE" state={tfState(false)} onClick={()=>tfPick(false)} />
        </div>
      )}

      {q.type==='fillTiles' && (
        <div className="qview-fill">
          <div className="qview-fill-row">
            {['#818cf8','#6ee7b7','#fcd34d'].map((col,i)=>(
              <span key={i} className="qview-fill-grp">
                <input className="qview-fill-input" style={{borderColor:col,color:col}}
                  type="number" placeholder={['H00','T0','O'][i]}
                  value={fillAns[i]} disabled={fillResult==='correct'}
                  onChange={e=>{const v=e.target.value.replace(/\D/g,'').slice(0,3);setFillAns(a=>{const n=[...a];n[i]=v;return n;});}}
                  aria-label={['Hundreds','Tens','Ones'][i]}/>
                {i<2 && <span className="qview-fill-op">+</span>}
              </span>
            ))}
          </div>
          {fillResult && <div className={`qview-fill-fb ${fillResult==='correct'?'fill-ok':'fill-bad'}`}>
            {fillResult==='correct' ? `✅ Correct! ${q.number} = ${q.correctValues.join(' + ')}` : `❌ Answer: ${q.correctValues.join(' + ')}`}
          </div>}
          {!done && <button className="stn-check-btn qview-check" onClick={checkFill} disabled={fillAns.some(v=>v==='')}>✓ Check!</button>}
        </div>
      )}

      {q.type==='matchPairs' && (
        <div className="qview-match">
          {q.pairs.map((pair,i)=>(
            <div key={i} className="qview-match-row">
              <button className={`qview-match-btn qview-match-left${matchSel===i?' sel':''}${matchDone[i]==='ok'?' ok':''}${matchDone[i]==='bad'?' bad':''}`}
                onClick={()=>matchLeft(i)} disabled={matchDone[i]==='ok'}>{pair.standard}</button>
              <span className={`qview-match-line${matchDone[i]==='ok'?' ok':''}`}>—</span>
              <button className={`qview-match-btn qview-match-right${matchDone[i]==='ok'?' ok':''}`}
                onClick={()=>matchRight(i)} disabled={matchDone[i]==='ok'||matchSel===null}>{pair.expanded}</button>
            </div>
          ))}
          {matchAllDone && <div className="qview-fill-fb fill-ok">✅ All matched!</div>}
        </div>
      )}

      {q.type==='buildIt' && (
        <div className="qview-build">
          <div className="qview-build-zones">
            {[{k:'h',label:'Hundreds',col:'#818cf8',val:buildPlaced.h*100},{k:'t',label:'Tens',col:'#6ee7b7',val:buildPlaced.t*10},{k:'o',label:'Ones',col:'#fcd34d',val:buildPlaced.o}].map(z=>(
              <div key={z.k} className="qview-build-zone" style={{borderColor:z.col+'55'}}>
                <span className="qvb-label" style={{color:z.col}}>{z.label}</span>
                <span className="qvb-val"   style={{color:z.col}}>{z.val}</span>
                <div className="qvb-ctrl">
                  <button className="stn-btn stn-btn-sub" onClick={()=>buildSub(z.k)} disabled={buildPlaced[z.k]===0||buildResult==='correct'}>−</button>
                  <span className="qvb-cnt">{buildPlaced[z.k]}</span>
                  <button className="stn-btn stn-btn-add" onClick={()=>buildAdd(z.k)} disabled={buildPlaced[z.k]===9||buildResult==='correct'}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="qvb-total">Total: <strong style={{color:buildTotal===q.number?'#86efac':'#fff'}}>{buildTotal}</strong> <span style={{color:'var(--muted)'}}>/ need {q.number}</span></div>
          {buildResult && <div className={`qview-fill-fb ${buildResult==='correct'?'fill-ok':'fill-bad'}`}>
            {buildResult==='correct' ? `✅ Perfect! ${q.number} = ${q.expandedForm}` : '❌ Not quite — adjust the blocks!'}
          </div>}
          {!done && <button className="stn-check-btn qview-check" onClick={checkBuild}>✓ Check!</button>}
        </div>
      )}

      <AnimatePresence>
        {done && (
          <motion.div className={`qview-exp${isCorrect?' qview-exp--ok':' qview-exp--wrong'}`}
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <span>{isCorrect?'🌟':'💡'}</span>
            <p>{q.explanation}</p>
            {!isCorrect && <button className="stn-check-btn" style={{marginTop:8}} onClick={onWrong}>Next Question →</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Session Done Screen ─────────────────────────────────────── */
function SessionDoneScreen({ state, dispatch }) {
  const { stars, correct, qIndex, badges } = state;
  const acc = qIndex > 0 ? Math.round((correct / qIndex) * 100) : 0;

  // Play completion narration once on mount
  useEffect(() => {
    sessionCompleteNarration();
    return () => stopNarration();
  }, []);

  return (
    <div className="play-page" style={{justifyContent:'center',alignItems:'center'}}>
      <motion.div className="play-done" initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:260}}>
        <div className="pd-trophy">🏆</div>
        <h2 className="pd-title">Mission Complete!</h2>
        <p className="pd-sub">You're a Galaxy Champion!</p>
        <div className="pd-stats">
          {[['⭐',stars,'Stars'],['🎯',`${acc}%`,'Accuracy'],['❓',qIndex,'Questions'],['🏅',badges.length,'Badges']].map(([ic,v,lb])=>(
            <div key={lb} className="pd-stat"><span>{ic}</span><span className="pd-stat-val">{v}</span><span className="pd-stat-lbl">{lb}</span></div>
          ))}
        </div>
        {badges.length > 0 && (
          <div className="pd-badges">
            {badges.map(b=><span key={b.id} className="pd-badge">{b.emoji} {b.label}</span>)}
          </div>
        )}
        <div className="pd-actions">
          <button className="stn-reset-btn" onClick={()=>dispatch({type:'RESET_SESSION'})}>🔄 Practice Again</button>
          <button className="btn-yellow" style={{padding:'11px 26px',fontSize:'var(--fs-base)'}} onClick={()=>dispatch({type:'NEXT_STEP'})}>📋 Reflect →</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main PlayPage ────────────────────────────────────────────── */
export default function PlayPage() {
  const { state, dispatch } = useGame();
  const { qIndex, qTotal, stars, streak, hearts, mode, sessionOn, sessionDone } = state;

  const [worldIdx, setWorldIdx]     = useState(0);
  const [questions, setQuestions]   = useState(null);
  const [checkpoint, setCheckpoint] = useState(false);

  // Stop all audio on unmount (navigating away)
  useEffect(() => () => stopNarration(), []);

  useEffect(() => {
    if (sessionOn && !questions) setQuestions(generateQuestionPool(Date.now()));
  }, [sessionOn]);

  function startGame() {
    dispatch({ type:'SET_MODE', mode: worldIdx===2 ? 'challenge' : 'practice' });
    dispatch({ type:'START_SESSION' });
    setQuestions(generateQuestionPool(Date.now()));
    playArenaIntro();
  }

  function onCorrect() {
    dispatch({ type:'CORRECT' });
    const next = qIndex + 1;
    if (next > 0 && next % 10 === 0 && next < qTotal) {
      setTimeout(() => { setCheckpoint(true); checkpointNarration(next); }, 600);
    }
  }

  function onWrong() { dispatch({ type:'WRONG' }); }

  /* Session done */
  if (sessionDone) return <SessionDoneScreen state={state} dispatch={dispatch} />;

  /* World selector */
  if (!sessionOn) {
    return (
      <div className="play-page">
        <motion.div className="play-world-hdr" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
          <h2>🌍 Choose Your World!</h2>
          <p>Beat each world to unlock the next. Earn stars and XP!</p>
        </motion.div>
        <div className="play-world-list">
          {WORLDS.map((w,i) => {
            const locked = i > 0;
            return (
              <motion.div key={w.label}
                className={`world-row${i===worldIdx?' world-row--on':''}${locked?' world-row--locked':''}`}
                onClick={() => !locked && setWorldIdx(i)}
                initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{delay:i*.08}}
                whileHover={!locked?{x:3}:{}}
              >
                <div className="world-row-left">
                  <div className="world-row-ico" style={i===worldIdx?{background:w.col+'28',borderColor:w.col+'60'}:{}}>
                    {locked?'🔒':w.icon}
                  </div>
                  <div>
                    <div className="world-row-lbl" style={i===worldIdx?{color:w.col}:{}}>{w.label}</div>
                    <div className="world-row-sub">{w.sub}</div>
                  </div>
                </div>
                {i===worldIdx && <button className="btn-green world-play-btn" onClick={e=>{e.stopPropagation();startGame();}}>▶ PLAY</button>}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!questions) return (
    <div className="play-page play-loading">
      <motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}>🚀</motion.span> Loading…
    </div>
  );

  const q = questions[qIndex];
  if (!q) return null;
  const pct = Math.round((qIndex / qTotal) * 100);

  /* Active game */
  return (
    <div className="play-page play-page--active">
      <div className="play-world-pill">
        <span className="play-dot" />{WORLDS[worldIdx]?.label || 'Galaxy Quiz'}
      </div>

      <div className="play-hud">
        <div className="hud-l">
          <span className="hud-stars">⭐ {stars}</span>
          <span className="hud-hearts">
            {[0,1,2].map(i => <span key={i} style={{opacity:mode==='challenge'&&i>=hearts?.3:1}}>{mode==='challenge'&&i>=hearts?'🖤':'❤️'}</span>)}
          </span>
        </div>
        <div className="hud-r"><span className="hud-streak">🔥 {streak}x</span></div>
      </div>

      <div className="play-prog">
        <span className="play-prog-lbl">Question {qIndex+1}/{qTotal}</span>
        <div className="play-prog-track"><motion.div className="play-prog-fill" animate={{width:`${pct}%`}} transition={{duration:.4}}/></div>
        <span className="play-prog-pct">{pct}%</span>
      </div>

      <div className="play-qcard">
        <AnimatePresence mode="wait">
          <motion.div key={q.id}
            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}}
            transition={{duration:.18}}>
            <QView q={q} onCorrect={onCorrect} onWrong={onWrong} />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {checkpoint && (
          <motion.div className="play-checkpoint" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div className="play-cp-card" initial={{scale:.82,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.82,opacity:0}} transition={{type:'spring',stiffness:260}}>
              <div className="cp-stars">⭐⭐⭐</div>
              <h3 className="cp-title">Checkpoint!</h3>
              <p className="cp-sub">Question {qIndex} done — keep going!</p>
              <button className="btn-yellow" style={{padding:'12px 42px'}} onClick={()=>{stopNarration();setCheckpoint(false);}}>Continue 🚀</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
