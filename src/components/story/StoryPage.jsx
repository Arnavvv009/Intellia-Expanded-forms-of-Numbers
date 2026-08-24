import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext.jsx';
import {
  storySlide1Narration, storySlide2Narration,
  storySlide3Narration, storySlide4Narration,
} from '../../utils/narration.js';
import { stopNarration } from '../../utils/audio.js';
import './StoryPage.css';
import img1 from '../../assets/story-img-1.png';
import img2 from '../../assets/story-img-2.png';
import img3 from '../../assets/story-img-3.png';
import img4 from '../../assets/story-img-4.png';

const SLIDES = [
  {
    id: 'intro',
     image: img1,
    bg: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    emoji: '🚀',
    title: "Captain Hundred's Crew",
    body: "Meet Hundy 🟦, Tenny 🟩, and Onesy 🟡 — three robot crew members who live inside every 3-digit number. They show how numbers are built from hundreds, tens, and ones!",
    highlight: '💡  Every number is made of parts!',
    speech: "Let's write it out using Hundreds, Tens, and Ones! 📊",
    narrate: storySlide1Narration,
  },
  {

    id: 'chart',
    image: img2,
    bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    emoji: '📊',
    title: "The Place Value Chart",
    body: "Every 3-digit number has three homes — Hundreds on the left, Tens in the middle, Ones on the right. Hundy loves Hundreds, Tenny loves Tens, and Onesy loves Ones!",
    highlight: 'H  |  T  |  O  →  Hundreds, Tens, Ones',
    speech: "Each digit lives in its own special house! 🏠",
    narr: [{ text: "Every 3-digit number has three places: Hundreds, Tens, and Ones!", style: 'emphasis' }],
    narrate: storySlide2Narration,
  },
  {
    id: 'break',
      image: img3,
    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    emoji: '🔨',
    title: "Breaking Apart 358",
    body: "The 3 is in the Hundreds place → means 300. The 5 is in the Tens place → means 50. The 8 is in the Ones place → means 8. So 358 = 300 + 50 + 8!",
    highlight: '✨  358 = 300 + 50 + 8  ✨',
    speech: "This is called expanded form! 🎉",
    narr: [{ text: "The 3 in 358 is in the Hundreds place, so it means 300. The 5 is in the Tens place, so it means 50. The 8 is in the Ones place, so it means 8. So 358 equals 300 plus 50 plus 8!", style: 'emphasis' }],
    narrate: storySlide3Narration,
  },
  {
    id: 'recompose',
     image: img4,
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    emoji: '🔧',
    title: "Putting It Back Together",
    body: "We can go the other way too! If you see 400 + 70 + 2, just add the parts: 400 + 70 = 470, then 470 + 2 = 472. Expanded form and standard form show the same number!",
    highlight: '✨  400 + 70 + 2 = 472  ✨',
    speech: "You've got it! Now let's try it yourself! 🌟",
    narr: [{ text: "We can go the other way too! If you see 400 plus 70 plus 2, just add the parts: 400 plus 70 equals 470, then 470 plus 2 equals 472. Expanded form and standard form show the same number!", style: 'statement' }],
    narrate: storySlide4Narration,
  }
];

export default function StoryPage() {
  const { dispatch } = useGame();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const slide = SLIDES[idx];

  // Play narration on mount and when slide changes
  useEffect(() => {
    if (slide?.narrate) {
      console.log('[Story] Playing narration for slide:', slide.id);
      slide.narrate();
    }
    return () => stopNarration();
  }, [idx]);

  function goNext() {
    if (idx < SLIDES.length - 1) {
      setDir(1); 
      setIdx(i => i + 1);
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  }
  function goPrev() {
    if (idx > 0) { setDir(-1); setIdx(i => i - 1); }
  }
console.log("Current slide image =", slide.image);
  return (
    <div className="story-page">

      {/* Progress row */}
      <div className="story-prog-row">
        <span className="story-prog-lbl">Slide {idx + 1} of {SLIDES.length}</span>
        <div className="story-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`story-dot${i === idx ? ' active' : ''}${i < idx ? ' done' : ''}`}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="story-prog-pct">{Math.round(((idx + 1) / SLIDES.length) * 100)}%</span>
      </div>

      {/* Slide card — compact, centred */}
      <div className="story-card-wrap">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            variants={{
              initial: d => ({ x: d > 0 ? 55 : -55, opacity: 0 }),
              animate: { x: 0, opacity: 1 },
              exit:    d => ({ x: d > 0 ? -55 : 55, opacity: 0 }),
            }}
            initial="initial" animate="animate" exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="story-card"
            onClick={() => slide.narrate?.()}
          >
            {/* Illustration band */}
            <div className="story-illus" style={{ background: slide.bg }}>
  <img
    src={slide.image}
    alt={slide.title}
    className="story-slide-image"
  />

  <span className="story-illus-hint">
    🔊 Tap to hear
  </span>
</div>

            {/* Text content */}
            <div className="story-body">
              <h3 className="story-title">{slide.title}</h3>
              <p className="story-text">{slide.body}</p>
              <div className="story-highlight">{slide.highlight}</div>
              <div className="story-speech-row">
                <div className="story-speech-avatar">🚀</div>
                <div className="story-speech-bubble">{slide.speech}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — Back left, Next right, below the card */}
      <div className="story-nav">
        <button className="btn-ghost story-back" onClick={goPrev} disabled={idx === 0}>
          ← Back
        </button>
        <button className="btn-yellow story-next" onClick={goNext}>
          {idx < SLIDES.length - 1 ? 'Next →' : 'Simulate! ✏️'}
        </button>
      </div>

    </div>
  );
}
