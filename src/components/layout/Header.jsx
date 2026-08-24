import { useGame } from '../../context/GameContext.jsx';
import { setAudioEnabled } from '../../utils/audio.js';
import './Header.css';

export default function Header() {
  const { state, dispatch } = useGame();
  const { audioEnabled, progress, stars, level, activeTab } = state;

  // Overall progress: story=33%, simulate=66%, play=100%
  const overallPct = Math.round(
    (progress.story * 0.33 + progress.simulate * 0.34 + progress.play * 0.33) / 100 * 100
  );

  function handleAudioToggle() {
    dispatch({ type: 'TOGGLE_AUDIO' });
    setAudioEnabled(!audioEnabled);
  }

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          <span className="logo-icon">🚀</span>
          <div className="logo-text">
            <span className="logo-title">Place Value</span>
            <span className="logo-subtitle">Pioneers</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="header-progress">
          <div className="progress-labels">
            <span>Progress</span>
            <span className="progress-pct">{overallPct}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${overallPct}%` }}
              role="progressbar"
              aria-valuenow={overallPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall module progress"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="header-stats">
          <div className="stat-chip">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{stars}</span>
          </div>
          <div className="stat-chip">
            <span className="stat-icon">🎖️</span>
            <span className="stat-value">Lv {level}</span>
          </div>
          <button
            className={`audio-btn ${audioEnabled ? 'on' : 'off'}`}
            onClick={handleAudioToggle}
            aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
            title={audioEnabled ? 'Mute' : 'Unmute'}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </header>
  );
}
