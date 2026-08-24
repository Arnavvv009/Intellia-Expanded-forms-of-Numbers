import { useGame } from '../../context/GameContext.jsx';
import { setAudioEnabled } from '../../utils/audio.js';
import './TopBar.css';

export default function TopBar() {
  const { state, dispatch } = useGame();
  const { audioEnabled, stars, level, streak } = state;

  function toggleAudio() {
    dispatch({ type: 'TOGGLE_AUDIO' });
    setAudioEnabled(!audioEnabled);
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar-inner">
        {/* Brand */}
        <div className="topbar-brand">
          <span className="topbar-logo">🚀</span>
          <div className="topbar-title-group">
            <span className="topbar-subject">✨ Singapore MOE Curriculum · Grade 2</span>
            <span className="topbar-title">Place Value Pioneers</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="topbar-stats">
          {streak >= 3 && (
            <div className="stat-badge stat-badge--fire">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
          )}
          <div className="stat-badge stat-badge--stars">
            <span>⭐</span>
            <span>{stars}</span>
          </div>
          <div className="stat-badge stat-badge--level">
            <span>🎖️</span>
            <span>Lv {level}</span>
          </div>
          <button
            className={`audio-toggle ${audioEnabled ? 'on' : 'off'}`}
            onClick={toggleAudio}
            aria-label={audioEnabled ? 'Mute narration' : 'Unmute narration'}
            title={audioEnabled ? 'Mute' : 'Unmute'}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </header>
  );
}
