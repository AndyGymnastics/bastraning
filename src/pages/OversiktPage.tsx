import { useApp } from '../hooks/useAppState';
import { SummaryCard } from '../components/SummaryCard';
import { formatDateTime, formatDuration } from '../lib/format';

export function OversiktPage() {
  const {
    data,
    setActiveTab,
    startNewSession,
    setPassFlowActive,
    getActiveSession,
  } = useApp();

  const loggedSessions = data.sessions.filter((session) => session.logs.length > 0);
  const sessionCount = loggedSessions.length;
  const latestSession = [...loggedSessions].sort(
    (a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt),
  )[0];
  const activeSession = getActiveSession();

  const totalLoggedExercises = loggedSessions.reduce(
    (sum, session) => sum + session.logs.length,
    0,
  );

  const totalTimeSeconds = loggedSessions.reduce((sum, session) => {
    return (
      sum +
      session.logs.reduce((logSum, log) => logSum + (log.timeSeconds ?? 0), 0)
    );
  }, 0);

  async function handleStartPass() {
    await startNewSession();
    setPassFlowActive(true);
    setActiveTab('pass');
  }

  return (
    <section className="page stack">
      <header className="page-header">
        <p className="label">Översikt</p>
        <h1>Hej, {data.preferences.gymnastName || 'gymnast'}!</h1>
        <p className="muted">Din lokala BAS-logg på den här enheten.</p>
      </header>

      <div className="summary-grid">
        <SummaryCard
          title="Antal loggade pass"
          value={String(sessionCount)}
        />
        <SummaryCard
          title="Senaste passet"
          value={
            latestSession
              ? formatDateTime(latestSession.completedAt ?? latestSession.startedAt)
              : 'Inget ännu'
          }
        />
        <SummaryCard
          title="Loggade övningar"
          value={String(totalLoggedExercises)}
          hint={
            totalTimeSeconds > 0
              ? `Total tid: ${formatDuration(totalTimeSeconds)}`
              : undefined
          }
        />
      </div>

      {activeSession ? (
        <p className="info-banner" role="status">
          Du har ett pågående pass med {activeSession.logs.length} loggade övningar.
        </p>
      ) : null}

      <div className="stack">
        <button type="button" className="btn btn--primary btn--large" onClick={handleStartPass}>
          Starta nytt pass
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--large"
          onClick={() => setActiveTab('historik')}
        >
          Gå till historik
        </button>
      </div>
    </section>
  );
}
