import { useApp } from '../hooks/useAppState';
import { getExerciseMap } from '../lib/exercises';
import { formatDateTime, formatDuration } from '../lib/format';

export function SessionDetailPage() {
  const { data, selectedSessionId, closeSessionDetail } = useApp();
  const exerciseMap = getExerciseMap();

  const session = data.sessions.find((item) => item.id === selectedSessionId);

  if (!session) {
    return null;
  }

  const timestamp = session.completedAt ?? session.startedAt;

  return (
    <section className="page stack">
      <header className="page-header">
        <button type="button" className="btn btn--ghost back-link" onClick={closeSessionDetail}>
          ← Tillbaka
        </button>
        <p className="label">Passdetalj</p>
        <h1>{formatDateTime(timestamp)}</h1>
        {session.notes ? <p>{session.notes}</p> : null}
      </header>

      <ul className="log-list stack">
        {session.logs.map((log) => {
          const exercise = exerciseMap.get(log.exerciseId);
          const levelLabel =
            exercise?.levels.find((level) => level.id === log.levelId)?.label ?? log.levelId;

          return (
            <li key={`${log.exerciseId}-${log.loggedAt}`} className="log-item">
              <h2>{exercise?.swedishName ?? log.exerciseId}</h2>
              <p className="muted">{levelLabel}</p>
              <dl className="log-item__meta">
                {log.reps != null ? (
                  <>
                    <dt>Reps</dt>
                    <dd>{log.reps}</dd>
                  </>
                ) : null}
                {log.sets != null ? (
                  <>
                    <dt>Set</dt>
                    <dd>{log.sets}</dd>
                  </>
                ) : null}
                {log.timeSeconds != null ? (
                  <>
                    <dt>Tid</dt>
                    <dd>{formatDuration(log.timeSeconds)}</dd>
                  </>
                ) : null}
              </dl>
              {log.notes ? <p>{log.notes}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
