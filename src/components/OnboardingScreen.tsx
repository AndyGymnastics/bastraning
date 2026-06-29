import { useState, type FormEvent } from 'react';
import { useApp } from '../hooks/useAppState';
import type { Theme } from '../lib/types';

const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Ljus' },
  { id: 'dark', label: 'Mörk' },
  { id: 'pink', label: 'Rosa' },
];

export function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const [name, setName] = useState('');
  const [theme, setTheme] = useState<Theme>('light');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Ange ditt namn för att fortsätta.');
      return;
    }
    setError('');
    await completeOnboarding(name, theme);
  }

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <h1>Välkommen till BAS Logg</h1>
        <p className="muted">
          Logga din BAS-träning lokalt på den här enheten. Ingen inloggning, ingen
          molnsynk.
        </p>
        <form onSubmit={handleSubmit} className="stack">
          <label className="field">
            <span>Ditt namn</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Gymnastens namn"
              autoComplete="name"
              maxLength={60}
            />
          </label>

          <fieldset className="theme-picker">
            <legend>Tema</legend>
            <div className="theme-picker__options">
              {THEMES.map((option) => (
                <label key={option.id} className="theme-picker__option">
                  <input
                    type="radio"
                    name="theme"
                    value={option.id}
                    checked={theme === option.id}
                    onChange={() => setTheme(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="btn btn--primary btn--large">
            Kom igång
          </button>
        </form>
      </div>
    </div>
  );
}
