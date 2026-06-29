import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  ExerciseLog,
  LogInput,
  Session,
  StoredAppData,
  TabId,
  Theme,
  UserPreferences,
} from '../lib/types';
import { createEmptyStoredData } from '../lib/types';
import { loadStoredData, saveStoredData, clearStoredData } from '../lib/storage';
import { createSessionId } from '../lib/format';

interface AppContextValue {
  data: StoredAppData;
  loading: boolean;
  saveError: string | null;
  activeTab: TabId;
  passFlowActive: boolean;
  selectedSessionId: string | null;
  setActiveTab: (tab: TabId) => void;
  setPassFlowActive: (active: boolean) => void;
  openSessionDetail: (sessionId: string) => void;
  closeSessionDetail: () => void;
  completeOnboarding: (name: string, theme: Theme) => Promise<void>;
  updatePreferences: (patch: Partial<UserPreferences>) => Promise<void>;
  startNewSession: () => Promise<Session>;
  completeActiveSession: (notes?: string) => Promise<void>;
  logExercise: (exerciseId: string, input: LogInput) => Promise<void>;
  resetAllData: () => Promise<void>;
  getActiveSession: () => Session | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

async function persistData(next: StoredAppData): Promise<void> {
  await saveStoredData(next);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredAppData>(createEmptyStoredData());
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('oversikt');
  const [passFlowActive, setPassFlowActive] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const stored = await loadStoredData();
        if (!cancelled) {
          setData(stored);
        }
      } catch {
        if (!cancelled) {
          setSaveError('Kunde inte läsa lokala data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = data.preferences.theme;
  }, [data.preferences.theme]);

  const commit = useCallback(async (updater: (current: StoredAppData) => StoredAppData) => {
    setSaveError(null);
    let nextState: StoredAppData | null = null;

    setData((current) => {
      nextState = updater(current);
      return nextState;
    });

    if (!nextState) {
      return;
    }

    try {
      await persistData(nextState);
    } catch {
      setSaveError('Kunde inte spara. Försök igen.');
    }
  }, []);

  const completeOnboarding = useCallback(
    async (name: string, theme: Theme) => {
      await commit((current) => ({
        ...current,
        preferences: {
          gymnastName: name.trim(),
          theme,
          onboarded: true,
        },
      }));
    },
    [commit],
  );

  const updatePreferences = useCallback(
    async (patch: Partial<UserPreferences>) => {
      await commit((current) => ({
        ...current,
        preferences: { ...current.preferences, ...patch },
      }));
    },
    [commit],
  );

  const startNewSession = useCallback(async () => {
    const session: Session = {
      id: createSessionId(),
      startedAt: Date.now(),
      logs: [],
    };

    await commit((current) => {
      const sessions = current.activeSessionId
        ? current.sessions.map((item) =>
            item.id === current.activeSessionId && !item.completedAt
              ? { ...item, completedAt: Date.now() }
              : item,
          )
        : current.sessions;

      return {
        ...current,
        sessions: [session, ...sessions],
        activeSessionId: session.id,
      };
    });

    return session;
  }, [commit]);

  const completeActiveSession = useCallback(
    async (notes?: string) => {
      await commit((current) => {
        if (!current.activeSessionId) {
          return current;
        }

        return {
          ...current,
          activeSessionId: null,
          sessions: current.sessions.map((session) =>
            session.id === current.activeSessionId
              ? {
                  ...session,
                  completedAt: Date.now(),
                  notes: notes?.trim() || session.notes,
                }
              : session,
          ),
        };
      });
    },
    [commit],
  );

  const logExercise = useCallback(
    async (exerciseId: string, input: LogInput) => {
      const logEntry: ExerciseLog = {
        exerciseId,
        levelId: input.levelId,
        reps: input.reps,
        timeSeconds: input.timeSeconds,
        sets: input.sets,
        notes: input.notes?.trim() || undefined,
        loggedAt: Date.now(),
      };

      await commit((current) => {
        let sessions = current.sessions;
        let activeSessionId = current.activeSessionId;

        if (!activeSessionId) {
          const session: Session = {
            id: createSessionId(),
            startedAt: Date.now(),
            logs: [logEntry],
          };
          return {
            ...current,
            sessions: [session, ...sessions],
            activeSessionId: session.id,
            lastUsedLevels: {
              ...current.lastUsedLevels,
              [exerciseId]: input.levelId,
            },
          };
        }

        sessions = sessions.map((session) => {
          if (session.id !== activeSessionId) {
            return session;
          }

          const existingIndex = session.logs.findIndex(
            (log) => log.exerciseId === exerciseId,
          );
          const logs =
            existingIndex >= 0
              ? session.logs.map((log, index) =>
                  index === existingIndex ? logEntry : log,
                )
              : [...session.logs, logEntry];

          return { ...session, logs };
        });

        return {
          ...current,
          sessions,
          lastUsedLevels: {
            ...current.lastUsedLevels,
            [exerciseId]: input.levelId,
          },
        };
      });
    },
    [commit],
  );

  const resetAllData = useCallback(async () => {
    setSaveError(null);
    try {
      await clearStoredData();
      const empty = createEmptyStoredData();
      setData(empty);
      setActiveTab('oversikt');
      setPassFlowActive(false);
      setSelectedSessionId(null);
    } catch {
      setSaveError('Kunde inte rensa data.');
    }
  }, []);

  const getActiveSession = useCallback(() => {
    if (!data.activeSessionId) {
      return undefined;
    }
    return data.sessions.find((session) => session.id === data.activeSessionId);
  }, [data.activeSessionId, data.sessions]);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      loading,
      saveError,
      activeTab,
      passFlowActive,
      selectedSessionId,
      setActiveTab,
      setPassFlowActive,
      openSessionDetail: setSelectedSessionId,
      closeSessionDetail: () => setSelectedSessionId(null),
      completeOnboarding,
      updatePreferences,
      startNewSession,
      completeActiveSession,
      logExercise,
      resetAllData,
      getActiveSession,
    }),
    [
      data,
      loading,
      saveError,
      activeTab,
      passFlowActive,
      selectedSessionId,
      completeOnboarding,
      updatePreferences,
      startNewSession,
      completeActiveSession,
      logExercise,
      resetAllData,
      getActiveSession,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp måste användas inom AppProvider');
  }
  return context;
}
