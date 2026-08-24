import { createContext, useContext, useReducer, useEffect } from 'react';

export const STEPS = ['wonder','story','simulate','play','reflect'];
export const STEP_META = {
  wonder:   { n:'01', icon:'🔮', label:'Wonder'   },
  story:    { n:'02', icon:'📖', label:'Story'    },
  simulate: { n:'03', icon:'✏️', label:'Simulate' },
  play:     { n:'04', icon:'🎮', label:'Practice' },
  reflect:  { n:'05', icon:'📋', label:'Reflect'  },
};

export const BADGES = {
  BLAST_OFF:    { id:'blast_off',    emoji:'🚀', label:'First Blast-Off!',     desc:'Completed the Story' },
  BLOCK_BUILDER:{ id:'block_builder',emoji:'🧱', label:'Block Builder',         desc:'Completed 3 stations' },
  PRO:          { id:'pro',          emoji:'🏆', label:'Place Value Pro',        desc:'Answered 50 questions' },
  CHAMPION:     { id:'champion',     emoji:'🌌', label:'Galaxy Champion',        desc:'Completed 100 questions' },
  ON_FIRE:      { id:'on_fire',      emoji:'🔥', label:'On Fire!',               desc:'10-question streak' },
};

const KEY = 'pvp3';

const init = {
  step: 'landing',           // landing | wonder | story | simulate | play | reflect
  stepsCompleted: {},
  audioEnabled: true,
  // game
  stars: 0, xp: 0, level: 1,
  streak: 0, hearts: 3, mode: 'practice',
  badges: [],
  stationsDone: [],
  // quiz session
  qIndex: 0, qTotal: 100, correct: 0,
  sessionOn: false, sessionDone: false,
};

function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY)||'{}');
    return { ...init, stars:s.stars||0, xp:s.xp||0, level:s.level||1,
             badges:s.badges||[], audioEnabled:s.audioEnabled??true,
             stepsCompleted:s.stepsCompleted||{} };
  } catch { return init; }
}

function reducer(state, a) {
  switch(a.type) {

    case 'GO': return { ...state, step: a.step };

    case 'BEGIN': return { ...state, step: 'wonder' };

    case 'NEXT_STEP': {
      const i = STEPS.indexOf(state.step);
      const next = STEPS[i+1] || state.step;
      const done = { ...state.stepsCompleted, [state.step]: true };
      const badges = [...state.badges];
      if (state.step === 'story' && !badges.find(b=>b.id==='blast_off')) badges.push(BADGES.BLAST_OFF);
      return { ...state, step: next, stepsCompleted: done, badges };
    }

    case 'TOGGLE_AUDIO': return { ...state, audioEnabled: !state.audioEnabled };

    case 'SET_MODE': return { ...state, mode: a.mode, hearts: a.mode==='challenge' ? 3 : 999 };

    case 'START_SESSION': {
      return { ...state, sessionOn:true, sessionDone:false, qIndex:0, correct:0, streak:0,
               hearts: state.mode==='challenge'?3:999 };
    }

    case 'CORRECT': {
      const streak = state.streak+1;
      const bonus  = streak>0 && streak%5===0 ? 5 : 0;
      const stars  = state.stars + 10 + bonus;
      const xp     = state.xp + 10 + bonus;
      const level  = Math.max(state.level, Math.floor(xp/100)+1);
      const qi     = state.qIndex+1;
      const done   = qi >= state.qTotal;
      const badges = [...state.badges];
      if (streak>=10 && !badges.find(b=>b.id==='on_fire'))    badges.push(BADGES.ON_FIRE);
      if (qi>=50     && !badges.find(b=>b.id==='pro'))         badges.push(BADGES.PRO);
      if (done       && !badges.find(b=>b.id==='champion'))    badges.push(BADGES.CHAMPION);
      return { ...state, stars, xp, level, streak, qIndex:qi, correct:state.correct+1, badges, sessionDone:done };
    }

    case 'WRONG': {
      const hearts = state.mode==='challenge' ? Math.max(0,state.hearts-1) : state.hearts;
      const qi     = state.qIndex+1;
      const done   = qi>=state.qTotal || (state.mode==='challenge' && hearts<=0);
      return { ...state, streak:0, hearts, qIndex:qi, sessionDone:done };
    }

    case 'DONE_STATION': {
      const sd = state.stationsDone.includes(a.id) ? state.stationsDone : [...state.stationsDone,a.id];
      const stars = state.stars+5;
      const badges = [...state.badges];
      if (sd.length>=3 && !badges.find(b=>b.id==='block_builder')) badges.push(BADGES.BLOCK_BUILDER);
      return { ...state, stationsDone:sd, stars, badges };
    }

    case 'RESET_SESSION':
      return { ...state, qIndex:0, correct:0, streak:0, sessionOn:false, sessionDone:false,
               hearts: state.mode==='challenge'?3:999 };

    default: return state;
  }
}

const Ctx = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, loadSaved());
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({
      stars:state.stars, xp:state.xp, level:state.level,
      badges:state.badges, audioEnabled:state.audioEnabled,
      stepsCompleted:state.stepsCompleted
    })); } catch {}
  }, [state.stars, state.xp, state.badges, state.audioEnabled, state.stepsCompleted]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useGame() { return useContext(Ctx); }
