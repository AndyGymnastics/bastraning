import { useApp } from '../hooks/useAppState';
import { formatDateTime } from '../lib/format';
import { getExerciseMap } from '../lib/exercises';

export function HistorikPage() {
  const { data, openSessionDetail } = useApp();
  const exerciseMap = getExerciseMap();

  const sessions = [...data.sessions]
    .filter((session) => session.logs.length > 0)
    .sort(
      (a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt),
    );

  if (sessions.length === 0) {
    return (
      <section className="page stack">
        <header className="page-header">
          <p className="label">Historik</p>
          <h1>Inga pass ännu</h1>
          <p className="muted">Logga ditt första pass under fliken Pass.</p>
        </header>
      </section>
    );
  }

  return (
    <section className="page stack">
      <header className="page-header">
        <p className="label">Historik</p>
        <h1>Loggade pass</h1>
      </header>

      <ul className="session-list">
        {sessions.map((session) => {
          const timestamp = session.completedAt ?? session.startedAt;
          const exerciseNames = session.logs
            .map((log) => exerciseMap.get(log.exerciseId)?.swedishName)
            .filter(Boolean)
            .slice(0, 3)
            .join(', ');

          return (
            <li key={session.id}>
              <button
                type="button"
                className="session-card"
                onClick={() => openSessionDetail(session.id)}
              >
                <div>
                  <h2>{formatDateTime(timestamp)}</h2>
                  <p className="muted">
                    {session.logs.length} övningar
                    {exerciseNames ? ` · ${exerciseNames}` : ''}
                  </p>
                  {session.notes ? <p>{session.notes}</p> : null}
                </div>
                <span aria-hidden="true">›</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
