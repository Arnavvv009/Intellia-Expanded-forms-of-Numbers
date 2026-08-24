import { useGame } from '../../context/GameContext.jsx';
import './TabNav.css';

const TABS = [
  { id: 'story',    label: 'Story',    icon: '📖', desc: 'Learn the concept' },
  { id: 'simulate', label: 'Simulate', icon: '🔬', desc: 'Build numbers' },
  { id: 'play',     label: 'Practice', icon: '🎮', desc: 'Quiz arena' },
];

export default function TabNav() {
  const { state, dispatch } = useGame();
  const { activeTab, progress } = state;

  function handleTab(tabId) {
    dispatch({ type: 'SET_TAB', tab: tabId });
  }

  return (
    <nav className="tab-nav" role="tablist" aria-label="Module sections">
      {TABS.map((tab, i) => {
        const isActive = activeTab === tab.id;
        const pct = progress[tab.id] || 0;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tab.label}: ${tab.desc}`}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleTab(tab.id)}
          >
            <span className="tab-number">{i + 1}</span>
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {pct > 0 && (
              <span className="tab-progress-dot" aria-label={`${pct}% complete`}>
                {pct === 100 ? '✅' : `${pct}%`}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
