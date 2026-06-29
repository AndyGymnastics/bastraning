import type { StoredAppData } from '../types';
import { createEmptyStoredData } from '../types';

export function migrateStoredData(raw: unknown): StoredAppData {
  if (!raw || typeof raw !== 'object') {
    return createEmptyStoredData();
  }

  const candidate = raw as Partial<StoredAppData>;

  if (typeof candidate.schemaVersion !== 'number') {
    return createEmptyStoredData();
  }

  if (candidate.schemaVersion === 1) {
    return normalizeV1(candidate);
  }

  return createEmptyStoredData();
}

function normalizeV1(candidate: Partial<StoredAppData>): StoredAppData {
  const fallback = createEmptyStoredData();

  return {
    schemaVersion: 1,
    preferences: {
      gymnastName:
        typeof candidate.preferences?.gymnastName === 'string'
          ? candidate.preferences.gymnastName
          : fallback.preferences.gymnastName,
      theme:
        candidate.preferences?.theme === 'dark' ||
        candidate.preferences?.theme === 'pink' ||
        candidate.preferences?.theme === 'light'
          ? candidate.preferences.theme
          : fallback.preferences.theme,
      onboarded: Boolean(candidate.preferences?.onboarded),
    },
    lastUsedLevels:
      candidate.lastUsedLevels && typeof candidate.lastUsedLevels === 'object'
        ? candidate.lastUsedLevels
        : {},
    sessions: Array.isArray(candidate.sessions)
      ? candidate.sessions.filter(
          (session) =>
            session &&
            typeof session.id === 'string' &&
            typeof session.startedAt === 'number' &&
            Array.isArray(session.logs),
        )
      : [],
    activeSessionId:
      typeof candidate.activeSessionId === 'string' ||
      candidate.activeSessionId === null
        ? candidate.activeSessionId
        : null,
  };
}
