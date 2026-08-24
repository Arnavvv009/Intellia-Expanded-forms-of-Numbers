import { useGame, STEPS, STEP_META } from '../../context/GameContext.jsx';
import { setAudioEnabled } from '../../utils/audio.js';
import './TopNav.css';

export default function TopNav() {
  const { state, dispatch } = useGame();
  const { step, stepsCompleted, audioEnabled } = state;

  function toggleAudio() {
    dispatch({ type: 'TOGGLE_AUDIO' });
    setAudioEnabled(!audioEnabled);
  }

  return (
    <nav className="tnav">
      <button className="tnav-home" onClick={() => dispatch({type:'GO',step:'landing'})}>
        🏠 Home
      </button>
      <div className="tnav-pill">
        {STEPS.map((s, i) => {
          const m = STEP_META[s];
          const active = s === step;
          const done   = stepsCompleted[s];
          return (
            <span key={s} className="tnav-grp">
              <button
                className={`tnav-step${active?' tnav-step--on':''}${done?' tnav-step--done':''}`}
                onClick={() => dispatch({type:'GO',step:s})}
                aria-current={active?'step':undefined}
              >
                <span className="tnav-n">{m.n}</span>
                <span className="tnav-ico">{done?'✓':m.icon}</span>
                <span className="tnav-lbl">{m.label}</span>
              </button>
              {i < STEPS.length-1 && <span className="tnav-sep">→</span>}
            </span>
          );
        })}
      </div>
      <button
        className={`tnav-mute ${audioEnabled ? 'on' : 'off'}`}
        onClick={toggleAudio}
        aria-label={audioEnabled ? 'Mute' : 'Unmute'}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>
    </nav>
  );
}
