import type { ExerciseDefinition } from '../lib/types';

interface LevelPickerProps {
  exercise: ExerciseDefinition;
  selectedLevelId: string;
  onChange: (levelId: string) => void;
}

export function LevelPicker({ exercise, selectedLevelId, onChange }: LevelPickerProps) {
  return (
    <div className="level-picker" role="group" aria-label="Välj nivå">
      {exercise.levels.map((level) => (
        <button
          key={level.id}
          type="button"
          className={`level-picker__btn${selectedLevelId === level.id ? ' is-active' : ''}`}
          aria-pressed={selectedLevelId === level.id}
          onClick={() => onChange(level.id)}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
