export type Theme = 'light' | 'dark' | 'pink';

export type LogType = 'reps' | 'time' | 'sets' | 'none';

export type TabId = 'oversikt' | 'pass' | 'historik' | 'installningar';

export interface ExerciseLevel {
  id: string;
  label: string;
}

export interface ExerciseDefinition {
  id: string;
  swedishName: string;
  category: string;
  shortDescription: string;
  coachingTips: string[];
  videoUrl: string;
  sourceLabel: string;
  levels: ExerciseLevel[];
  defaultLogType: LogType;
  defaultRepsOrTime?: number;
}

export interface ExerciseLog {
  exerciseId: string;
  levelId: string;
  reps?: number;
  timeSeconds?: number;
  sets?: number;
  notes?: string;
  loggedAt: number;
}

export interface Session {
  id: string;
  startedAt: number;
  completedAt?: number;
  logs: ExerciseLog[];
  notes?: string;
}

export interface UserPreferences {
  gymnastName: string;
  theme: Theme;
  onboarded: boolean;
}

export interface StoredAppData {
  schemaVersion: number;
  preferences: UserPreferences;
  lastUsedLevels: Record<string, string>;
  sessions: Session[];
  activeSessionId: string | null;
}

export interface LogInput {
  levelId: string;
  reps?: number;
  timeSeconds?: number;
  sets?: number;
  notes?: string;
}

export const APP_VERSION = '0.1.0';

export const DEFAULT_PREFERENCES: UserPreferences = {
  gymnastName: '',
  theme: 'light',
  onboarded: false,
};

export function createEmptyStoredData(): StoredAppData {
  return {
    schemaVersion: 1,
    preferences: { ...DEFAULT_PREFERENCES },
    lastUsedLevels: {},
    sessions: [],
    activeSessionId: null,
  };
}
