import { useGame, STEPS, STEP_META } from '../../context/GameContext.jsx';
import './JourneyBar.css';

export default function JourneyBar() {
  const { state, dispatch } = useGame();
  const { activeStep, stepsCompleted } = state;

  const currentIdx = STEPS.indexOf(activeStep);

  function handleStepClick(step, idx) {
    // Allow navigating to completed steps or current step
    const stepIdx = STEPS.indexOf(step);
    if (stepsCompleted[step] || step === activeStep || stepIdx <= currentIdx) {
      dispatch({ type: 'GO_TO_STEP', step });
    }
  }

  return (
    <nav className="journey-bar" role="navigation" aria-label="Learning journey">
      <div className="journey-inner">
        <div className="journey-label">YOUR LEARNING JOURNEY</div>
        <div className="journey-steps">
          {STEPS.map((step, idx) => {
            const meta      = STEP_META[step];
            const isActive  = step === activeStep;
            const isDone    = stepsCompleted[step];
            const isPast    = idx < currentIdx;
            const canClick  = isDone || isActive || isPast;

            return (
              <div key={step} className="journey-step-group">
                <button
                  className={`journey-step
                    ${isActive  ? 'journey-step--active'  : ''}
                    ${isDone    ? 'journey-step--done'    : ''}
                    ${isPast && !isActive ? 'journey-step--past' : ''}
                    ${!canClick ? 'journey-step--locked'  : ''}
                  `}
                  onClick={() => handleStepClick(step, idx)}
                  disabled={!canClick}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${meta.label}${isDone ? ' (completed)' : isActive ? ' (current)' : ''}`}
                >
                  <span className="js-icon">{isDone ? '✅' : meta.icon}</span>
                  <span className="js-label">{meta.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span className={`journey-arrow ${isPast || isActive ? 'active' : ''}`}>→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
