import { Component } from 'react';
import { Button } from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-8 text-center shadow-card dark:border-border dark:bg-surface">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 dark:bg-error/20">
                <svg className="h-6 w-6 text-error dark:text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m-6-4a2 2 0 11-4 0 2 2 0 014 0zM9 0a9 9 0 018.94 10.12A9 9 0 010 9a9 9 0 018.94 8.88A9 9 0 019 0zm0 2a7 7 0 110 14A7 7 0 019 2z" />
                </svg>
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary dark:text-white">Oops! Something went wrong</h1>
            <p className="mt-2 text-sm text-text-muted dark:text-text-secondary">
              We encountered an unexpected error. Please try again or return to the dashboard.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-left dark:bg-red-950">
                <p className="font-mono text-xs text-red-600 dark:text-red-300">{this.state.error.toString()}</p>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="secondary" onClick={this.handleReset}>
                Go to home
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
