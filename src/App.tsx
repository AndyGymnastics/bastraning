import { AppProvider, useApp } from './hooks/useAppState';
import { OnboardingScreen } from './components/OnboardingScreen';
import { BottomNav } from './components/BottomNav';
import { OversiktPage } from './pages/OversiktPage';
import { PassPage } from './pages/PassPage';
import { HistorikPage } from './pages/HistorikPage';
import { InstallningarPage } from './pages/InstallningarPage';
import { SessionDetailPage } from './pages/SessionDetailPage';

function AppShell() {
  const {
    data,
    loading,
    saveError,
    activeTab,
    selectedSessionId,
    setActiveTab,
  } = useApp();

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Laddar BAS Logg…</p>
      </div>
    );
  }

  if (!data.preferences.onboarded) {
    return <OnboardingScreen />;
  }

  let page = null;
  if (selectedSessionId) {
    page = <SessionDetailPage />;
  } else if (activeTab === 'oversikt') {
    page = <OversiktPage />;
  } else if (activeTab === 'pass') {
    page = <PassPage />;
  } else if (activeTab === 'historik') {
    page = <HistorikPage />;
  } else {
    page = <InstallningarPage />;
  }

  return (
    <div className="app-shell">
      <main className="app-main">{page}</main>
      {saveError ? (
        <p className="save-error" role="alert">
          {saveError}
        </p>
      ) : null}
      {!selectedSessionId ? (
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
