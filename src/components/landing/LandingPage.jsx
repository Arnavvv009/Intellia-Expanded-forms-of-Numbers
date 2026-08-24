import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import { landingNarration } from '../../utils/narration.js';
import { stopNarration } from '../../utils/audio.js';
import './LandingPage.css';

export default function LandingPage() {
  const { dispatch } = useGame();

  useEffect(() => {
    landingNarration();
    return () => stopNarration();
  }, []);

  return (
    <div className="land">
      <motion.span className="land-badge" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
        ✨ MOE Curriculum · Grade 2
      </motion.span>

      <motion.div className="land-title-wrap" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.16}}>
        <h1 className="land-title">Expanded Form of</h1>
        <h1 className="land-title land-title-amber">Numbers to 1,000</h1>
      </motion.div>

      <motion.div className="land-mascot-row" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.24}}>
        <div className="land-avatar float">🚀</div>
        <div className="land-bubble">Ready to master place value? Let's go! 🌟</div>
      </motion.div>

      <motion.p className="land-desc" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>
        Join <strong>Hundy</strong>, <strong>Tenny</strong>, and <strong>Onesy</strong> and discover
        how every number is secretly made of hundreds, tens, and ones —
        through stories, simulations, and exciting games!
      </motion.p>

      <motion.div className="land-journey" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.38}}>
        <p className="land-journey-lbl">YOUR LEARNING JOURNEY</p>
        <div className="land-journey-steps">
          {[['🔮','Wonder'],['📖','Story'],['✏️','Simulate'],['🎮','Practice'],['📋','Reflect']].map(([ic,lb],i,a)=>(
            <span key={lb} className="land-step-grp">
              <span className="land-step"><span>{ic}</span><span>{lb}</span></span>
              {i < a.length-1 && <span className="land-arr">→</span>}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.button
        className="btn-yellow land-cta"
        onClick={() => dispatch({type:'BEGIN'})}
        initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}}
        transition={{delay:.48,type:'spring',stiffness:260}}
        whileHover={{scale:1.04}} whileTap={{scale:.96}}
      >
        🚀 Begin Your Journey!
      </motion.button>

      <motion.div className="land-features" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.56}}>
        {[['🏦','Place Value Houses'],['🧱','4 Simulations'],['⛰️','3 Game Worlds']].map(([ic,lb])=>(
          <div key={lb} className="land-feat">
            <span>{ic}</span><span className="land-feat-lbl">{lb}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
