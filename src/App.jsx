import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext.jsx';
import TopNav      from './components/layout/TopNav.jsx';
import AudioFab    from './components/layout/AudioFab.jsx';
import StarsField  from './components/shared/StarsField.jsx';
import LandingPage from './components/landing/LandingPage.jsx';
import WonderPage  from './components/wonder/WonderPage.jsx';
import StoryPage   from './components/story/StoryPage.jsx';
import SimulatePage from './components/simulate/SimulatePage.jsx';
import PlayPage    from './components/play/PlayPage.jsx';
import ReflectPage from './components/reflect/ReflectPage.jsx';
import { stopNarration } from './utils/audio.js';
import './App.css';

const PAGES = {
  landing:  LandingPage,
  wonder:   WonderPage,
  story:    StoryPage,
  simulate: SimulatePage,
  play:     PlayPage,
  reflect:  ReflectPage,
};

function AppInner() {
  const { state } = useGame();
  const Page = PAGES[state.step] || LandingPage;
  const showNav = state.step !== 'landing';

  // Stop audio when navigating AWAY from a step (cleanup = runs before next render)
  // Using a ref so we only stop on actual step changes, not initial mount
  useEffect(() => {
    return () => stopNarration(); // fires when step changes — stops OLD page audio
  }, [state.step]);

  return (
    <div className="shell">
      <StarsField />
      <div className="shell-layout">
        {showNav && <TopNav />}
        <main className="shell-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="page-mount"
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
