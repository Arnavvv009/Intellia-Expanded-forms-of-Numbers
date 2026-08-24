import { useState, useEffect } from 'react';
import './MascotFooter.css';

const MASCOT_TIPS = [
  "Remember: H = Hundreds, T = Tens, O = Ones! 🚀",
  "Every 3-digit number is made of hundreds, tens, and ones!",
  "Breaking a number apart is called expanded form! 🌟",
  "358 = 300 + 50 + 8 — Hundy, Tenny, and Onesy!",
  "The digit in the hundreds place tells us how many hundreds! 💡",
  "Zero in a place still counts! 405 = 400 + 0 + 5",
  "You can always add the parts back together to get the original number!",
];

export default function MascotFooter({ caption }) {
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTipIdx(i => (i + 1) % MASCOT_TIPS.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const displayText = caption || MASCOT_TIPS[tipIdx];

  return (
    <footer className="mascot-footer" role="complementary" aria-label="Mascot tips">
      <div className="mascot-footer-inner">
        <div className="mascot-avatar" aria-hidden="true">
          <div className="mascot-body">🤖</div>
          <div className="mascot-label">Hundy</div>
        </div>
        <div className="mascot-speech">
          <div className="speech-bubble">
            <p className="speech-text" aria-live="polite">{displayText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
