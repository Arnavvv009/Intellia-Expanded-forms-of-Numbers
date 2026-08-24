import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import './StarBurst.css';

export default function StarBurst({ active = false, onComplete }) {
  useEffect(() => {
    if (!active) return;
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#A78BFA', '#F9A8D4', '#FCD34D', '#6EE7B7', '#6366F1', '#F59E0B'],
    });
    const t = setTimeout(() => onComplete?.(), 1200);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div className="star-burst" aria-hidden="true">
      {['⭐','🌟','✨','💫','⭐','🌟'].map((s, i) => (
        <span
          key={i}
          className="burst-star"
          style={{ '--angle': `${i * 60}deg`, '--delay': `${i * 0.08}s` }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
