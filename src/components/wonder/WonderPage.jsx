import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import { wonderNarration } from '../../utils/narration.js';
import { stopNarration } from '../../utils/audio.js';
import './WonderPage.css';

export default function WonderPage() {
  const { dispatch } = useGame();

  useEffect(() => {
    console.log('[WonderPage] Mounting, calling wonderNarration()');
    wonderNarration();
    return () => {
      console.log('[WonderPage] Unmounting, stopping narration');
      stopNarration();
    };
  }, []);

  function go() {
    stopNarration();
    dispatch({type:'NEXT_STEP'});
  }

  return (
    <div className="won-page">
      {/* Mascot + speech bubble */}
      <motion.div className="won-mascot-row" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
        <div className="won-avatar float">🚀</div>
        <div className="won-bubble">Hmm… I wonder… 🤔</div>
      </motion.div>

      {/* Question card */}
      <motion.div className="won-card card"
        initial={{opacity:0,y:22}} animate={{opacity:1,y:0}}
        transition={{delay:.2,type:'spring',stiffness:260}}
      >
        <div className="won-icon">❓</div>
        <h2 className="won-q">
          A number has 4 hundreds, 7 tens, and 2 ones.<br/>
          What is its expanded form?
        </h2>
        <p className="won-hint">What if we need to show the value of each digit separately?</p>
        <div className="won-clue">✨ Every digit has its own special place value! ✨</div>
        <button className="btn-yellow won-cta" onClick={go}>🔍 Let's Investigate!</button>
      </motion.div>
    </div>
  );
}
