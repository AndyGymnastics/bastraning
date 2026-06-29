import { useMemo, useState } from 'react';
import type { ExerciseDefinition, LogInput } from '../lib/types';
import { ExerciseCard } from './ExerciseCard';

interface PassFlowProps {
  exercises: ExerciseDefinition[];
  lastUsedLevels: Record<string, string>;
  onLog: (exerciseId: string, input: LogInput) => Promise<void>;
  onComplete: () => Promise<void>;
  onCancel: () => void;
}

export function PassFlow({
  exercises,
  lastUsedLevels,
  onLog,
  onComplete,
  onCancel,
}: PassFlowProps) {
  const [index, setIndex] = useState(0);
  const exercise = exercises[index];
  const progress = useMemo(
    () => `${index + 1} / ${exercises.length}`,
    [index, exercises.length],
  );
  const isLast = index >= exercises.length - 1;

  if (!exercise) {
    return null;
  }

  async function handleAfterLog() {
    if (!isLast) {
      setIndex((current) => current + 1);
      return;
    }
    await onComplete();
  }

  return (
    <section className="pass-flow stack">
      <header className="pass-flow__header">
        <div>
          <p className="label">Passflöde</p>
          <h2>{exercise.swedishName}</h2>
        </div>
        <p className="pass-flow__progress" aria-live="polite">
          {progress}
        </p>
      </header>

      <ExerciseCard
        key={exercise.id}
        exercise={exercise}
        lastUsedLevelId={lastUsedLevels[exercise.id]}
        compact
        submitLabel={isLast ? 'Spara och avsluta pass' : 'Spara och nästa'}
        onLog={(input) => onLog(exercise.id, input)}
        onAfterLog={handleAfterLog}
      />

      <button type="button" className="btn btn--ghost" onClick={onCancel}>
        Avbryt flöde
      </button>
    </section>
  );
}
