import type { TabId } from '../lib/types';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'oversikt', label: 'Översikt', icon: '⌂' },
  { id: 'pass', label: 'Pass', icon: '▶' },
  { id: 'historik', label: 'Historik', icon: '☰' },
  { id: 'installningar', label: 'Inställningar', icon: '⚙' },
];

interface BottomNavProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Huvudnavigering">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav__item${activeTab === tab.id ? ' is-active' : ''}`}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="bottom-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
