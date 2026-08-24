import { useGame } from '../../context/GameContext.jsx';
import { setAudioEnabled } from '../../utils/audio.js';
export default function AudioFab() {
  const { state, dispatch } = useGame();
  const on = state.audioEnabled;
  function toggle() { dispatch({type:'TOGGLE_AUDIO'}); setAudioEnabled(!on); }
  return (
    <button onClick={toggle} aria-label={on?'Mute':'Unmute'}
      style={{position:'fixed',bottom:20,right:20,zIndex:'var(--z-fab)',
        width:48,height:48,borderRadius:'50%',
        background:'rgba(61,32,128,.9)',border:'2px solid rgba(255,255,255,.2)',
        fontSize:'1.3rem',display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:'0 4px 16px rgba(0,0,0,.4)',cursor:'pointer',
        opacity: on ? 1 : 0.5, transition:'opacity .2s'}}>
      {on ? '🔊' : '🔇'}
    </button>
  );
}
