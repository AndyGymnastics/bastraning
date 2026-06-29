import { useApp } from '../hooks/useAppState';
import { getExercises } from '../lib/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { PassFlow } from '../components/PassFlow';

export function PassPage() {
  const {
    data,
    passFlowActive,
    setPassFlowActive,
    logExercise,
    startNewSession,
    completeActiveSession,
    getActiveSession,
  } = useApp();

  const exercises = getExercises();
  const activeSession = getActiveSession();

  async function handleStartFlow() {
    if (!activeSession) {
      await startNewSession();
    }
    setPassFlowActive(true);
  }

  async function handleCompleteFlow() {
    await completeActiveSession();
    setPassFlowActive(false);
  }

  if (passFlowActive) {
    return (
      <section className="page">
        <PassFlow
          exercises={exercises}
          lastUsedLevels={data.lastUsedLevels}
          onLog={logExercise}
          onComplete={handleCompleteFlow}
          onCancel={() => setPassFlowActive(false)}
        />
      </section>
    );
  }

  return (
    <section className="page stack">
      <header className="page-header">
        <p className="label">Pass</p>
        <h1>BAS-övningar</h1>
        <p className="muted">Välj nivå, logga och spara direkt lokalt.</p>
      </header>

      {activeSession ? (
        <p className="info-banner" role="status">
          Pågående pass · {activeSession.logs.length} övningar loggade
        </p>
      ) : null}

      <button type="button" className="btn btn--primary btn--large" onClick={handleStartFlow}>
        Starta passflöde (Nästa)
      </button>

      <div className="exercise-list stack">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            lastUsedLevelId={data.lastUsedLevels[exercise.id]}
            onLog={(input) => logExercise(exercise.id, input)}
          />
        ))}
      </div>

      {activeSession ? (
        <button
          type="button"
          className="btn btn--ghost btn--large"
          onClick={() => completeActiveSession()}
        >
          Avsluta pågående pass
        </button>
      ) : null}
    </section>
  );
}
