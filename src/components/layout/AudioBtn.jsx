import { useGame } from '../../context/GameContext.jsx';
import { setAudioEnabled } from '../../utils/audio.js';
import './AudioBtn.css';

export default function AudioBtn() {
  const { state, dispatch } = useGame();
  function toggle() {
    dispatch({ type: 'TOGGLE_AUDIO' });
    setAudioEnabled(!state.audioEnabled);
  }
  return (
    <button
      className={`audio-fab ${state.audioEnabled ? 'on' : 'off'}`}
      onClick={toggle}
      aria-label={state.audioEnabled ? 'Mute' : 'Unmute'}
    >
      {state.audioEnabled ? '🔊' : '🔇'}
    </button>
  );
}
