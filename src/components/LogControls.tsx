import { useEffect, useRef, useState } from 'react';
import type { LogType } from '../lib/types';
import { formatTimeClock } from '../lib/format';

interface LogControlsProps {
  logType: LogType;
  defaultValue?: number;
  reps?: number;
  sets?: number;
  timeSeconds?: number;
  notes?: string;
  onRepsChange: (value: number | undefined) => void;
  onSetsChange: (value: number | undefined) => void;
  onTimeChange: (value: number | undefined) => void;
  onNotesChange: (value: string) => void;
}

export function LogControls({
  logType,
  defaultValue,
  reps,
  sets,
  timeSeconds,
  notes,
  onRepsChange,
  onSetsChange,
  onTimeChange,
  onNotesChange,
}: LogControlsProps) {
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      onTimeChange((timeSeconds ?? 0) + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [running, timeSeconds, onTimeChange]);

  function toggleTimer() {
    setRunning((current) => !current);
  }

  function resetTimer() {
    setRunning(false);
    onTimeChange(defaultValue ?? 0);
  }

  return (
    <div className="log-controls stack">
      {logType === 'reps' ? (
        <label className="field">
          <span>Repetitioner</span>
          <input
            type="number"
            min={0}
            max={999}
            inputMode="numeric"
            value={reps ?? defaultValue ?? ''}
            onChange={(event) =>
              onRepsChange(event.target.value ? Number(event.target.value) : undefined)
            }
          />
        </label>
      ) : null}

      {logType === 'sets' ? (
        <>
          <label className="field">
            <span>Set</span>
            <input
              type="number"
              min={0}
              max={99}
              inputMode="numeric"
              value={sets ?? defaultValue ?? ''}
              onChange={(event) =>
                onSetsChange(event.target.value ? Number(event.target.value) : undefined)
              }
            />
          </label>
          <label className="field">
            <span>Repetitioner</span>
            <input
              type="number"
              min={0}
              max={999}
              inputMode="numeric"
              value={reps ?? ''}
              onChange={(event) =>
                onRepsChange(event.target.value ? Number(event.target.value) : undefined)
              }
            />
          </label>
        </>
      ) : null}

      {logType === 'time' ? (
        <div className="timer">
          <p className="timer__display" aria-live="polite">
            {formatTimeClock(timeSeconds ?? defaultValue ?? 0)}
          </p>
          <div className="timer__actions">
            <button type="button" className="btn" onClick={toggleTimer}>
              {running ? 'Pausa' : 'Starta timer'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={resetTimer}>
              Återställ
            </button>
          </div>
        </div>
      ) : null}

      <label className="field">
        <span>Anteckning (valfritt)</span>
        <textarea
          rows={2}
          value={notes ?? ''}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="T.ex. bra balans idag"
        />
      </label>
    </div>
  );
}
