import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Appfel', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="loading-screen stack" style={{ padding: '1rem', textAlign: 'center' }}>
          <h1>Något gick fel</h1>
          <p className="muted">Ladda om sidan. Om problemet kvarstår, rensa webbplatsdata för BAS Logg.</p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            Ladda om
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
