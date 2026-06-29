import { useEffect, useState, type FormEvent } from 'react';
import { useApp } from '../hooks/useAppState';
import type { Theme } from '../lib/types';
import { APP_VERSION } from '../lib/types';

const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Ljus' },
  { id: 'dark', label: 'Mörk' },
  { id: 'pink', label: 'Rosa' },
];

export function InstallningarPage() {
  const { data, updatePreferences, resetAllData } = useApp();
  const [name, setName] = useState(data.preferences.gymnastName);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(data.preferences.gymnastName);
  }, [data.preferences.gymnastName]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setMessage('Namn kan inte vara tomt.');
      return;
    }
    await updatePreferences({ gymnastName: name.trim() });
    setMessage('Inställningar sparade.');
  }

  async function handleThemeChange(theme: Theme) {
    await updatePreferences({ theme });
  }

  async function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await resetAllData();
    setConfirmReset(false);
    setName('');
  }

  return (
    <section className="page stack">
      <header className="page-header">
        <p className="label">Inställningar</p>
        <h1>Lokal profil</h1>
        <p className="muted">Allt sparas endast på den här enheten.</p>
      </header>

      <form onSubmit={handleSave} className="stack">
        <label className="field">
          <span>Gymnastens namn</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
          />
        </label>
        <button type="submit" className="btn btn--primary">
          Spara namn
        </button>
      </form>

      <fieldset className="theme-picker">
        <legend>Tema</legend>
        <div className="theme-picker__options">
          {THEMES.map((option) => (
            <label key={option.id} className="theme-picker__option">
              <input
                type="radio"
                name="settings-theme"
                checked={data.preferences.theme === option.id}
                onChange={() => handleThemeChange(option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section className="danger-zone stack">
        <h2>Rensa data</h2>
        <p className="muted">
          Tar bort all historik, nivåminnen och profil på den här enheten.
        </p>
        {confirmReset ? (
          <p className="error-text">Är du säker? Detta går inte att ångra.</p>
        ) : null}
        <button type="button" className="btn btn--danger" onClick={handleReset}>
          {confirmReset ? 'Ja, rensa allt' : 'Rensa lokal data'}
        </button>
        {confirmReset ? (
          <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
            Avbryt
          </button>
        ) : null}
      </section>

      {message ? <p className="success-text">{message}</p> : null}

      <footer className="app-meta muted">
        <p>BAS Logg v{APP_VERSION}</p>
        <p>Lokal lagring · IndexedDB</p>
      </footer>
    </section>
  );
}
