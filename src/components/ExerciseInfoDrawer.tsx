import { useEffect, useRef } from 'react';
import type { ExerciseDefinition } from '../lib/types';
import { toYoutubeEmbedUrl } from '../lib/youtube';

interface ExerciseInfoDrawerProps {
  exercise: ExerciseDefinition;
  showVideo: boolean;
  onClose: () => void;
  onToggleVideo: () => void;
}

export function ExerciseInfoDrawer({
  exercise,
  showVideo,
  onClose,
  onToggleVideo,
}: ExerciseInfoDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`drawer-title-${exercise.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer__header">
          <h2 id={`drawer-title-${exercise.id}`}>{exercise.swedishName}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-btn"
            aria-label="Stäng"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="drawer__body stack">
          <p className="badge">{exercise.category}</p>
          <p>{exercise.shortDescription}</p>

          <section>
            <h3>Tips</h3>
            <ul className="tips-list">
              {exercise.coachingTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <p className="muted source-label">{exercise.sourceLabel}</p>

          <button type="button" className="btn" onClick={onToggleVideo}>
            {showVideo ? 'Dölj video' : 'Visa video'}
          </button>

          {showVideo ? (
            <div className="video-frame">
              <iframe
                title={`Video: ${exercise.swedishName}`}
                src={toYoutubeEmbedUrl(exercise.videoUrl)}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
