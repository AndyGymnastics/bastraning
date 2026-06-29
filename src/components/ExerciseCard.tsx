import { useMemo, useState } from 'react';
import type { ExerciseDefinition, LogInput } from '../lib/types';
import { LevelPicker } from './LevelPicker';
import { LogControls } from './LogControls';
import { ExerciseInfoDrawer } from './ExerciseInfoDrawer';
import { toYoutubeThumbnailUrl } from '../lib/youtube';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  lastUsedLevelId?: string;
  compact?: boolean;
  submitLabel?: string;
  onLog: (input: LogInput) => Promise<void>;
  onAfterLog?: () => void;
}

export function ExerciseCard({
  exercise,
  lastUsedLevelId,
  compact = false,
  submitLabel = 'Spara övning',
  onLog,
  onAfterLog,
}: ExerciseCardProps) {
  const defaultLevelId = useMemo(() => {
    if (lastUsedLevelId && exercise.levels.some((level) => level.id === lastUsedLevelId)) {
      return lastUsedLevelId;
    }
    return exercise.levels[0]?.id ?? '1';
  }, [exercise.levels, lastUsedLevelId]);

  const [levelId, setLevelId] = useState(defaultLevelId);
  const [reps, setReps] = useState<number | undefined>(
    exercise.defaultLogType === 'reps' ? exercise.defaultRepsOrTime : undefined,
  );
  const [sets, setSets] = useState<number | undefined>(
    exercise.defaultLogType === 'sets' ? exercise.defaultRepsOrTime : undefined,
  );
  const [timeSeconds, setTimeSeconds] = useState<number | undefined>(
    exercise.defaultLogType === 'time' ? exercise.defaultRepsOrTime : undefined,
  );
  const [notes, setNotes] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const thumbnail = toYoutubeThumbnailUrl(exercise.videoUrl);

  async function handleSave() {
    await onLog({
      levelId,
      reps,
      sets,
      timeSeconds,
      notes,
    });
    setSavedMessage('Sparat');
    window.setTimeout(() => setSavedMessage(''), 1800);
    onAfterLog?.();
  }

  return (
    <article className={`exercise-card${compact ? ' exercise-card--compact' : ''}`}>
      <header className="exercise-card__header">
        <div>
          <p className="badge">{exercise.category}</p>
          <h3>{exercise.swedishName}</h3>
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label={`Info om ${exercise.swedishName}`}
          onClick={() => setDrawerOpen(true)}
        >
          i
        </button>
      </header>

      {!compact && thumbnail ? (
        <button
          type="button"
          className="video-preview"
          onClick={() => {
            setDrawerOpen(true);
            setShowVideo(true);
          }}
          aria-label={`Visa video för ${exercise.swedishName}`}
        >
          <img src={thumbnail} alt="" loading="lazy" />
          <span className="video-preview__play">▶</span>
        </button>
      ) : null}

      <div className="exercise-card__level">
        <p className="label">Senaste nivå</p>
        <LevelPicker exercise={exercise} selectedLevelId={levelId} onChange={setLevelId} />
      </div>

      <LogControls
        logType={exercise.defaultLogType}
        defaultValue={exercise.defaultRepsOrTime}
        reps={reps}
        sets={sets}
        timeSeconds={timeSeconds}
        notes={notes}
        onRepsChange={setReps}
        onSetsChange={setSets}
        onTimeChange={setTimeSeconds}
        onNotesChange={setNotes}
      />

      <div className="exercise-card__actions">
        <button type="button" className="btn btn--primary btn--large" onClick={handleSave}>
          {submitLabel}
        </button>
        {savedMessage ? (
          <p className="success-text" aria-live="polite">
            {savedMessage}
          </p>
        ) : null}
      </div>

      {drawerOpen ? (
        <ExerciseInfoDrawer
          exercise={exercise}
          showVideo={showVideo}
          onClose={() => {
            setDrawerOpen(false);
            setShowVideo(false);
          }}
          onToggleVideo={() => setShowVideo((current) => !current)}
        />
      ) : null}
    </article>
  );
}
