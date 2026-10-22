import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="min-h-screen w-full flex items-center justify-center"
          style={{ backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif" }}
        >
          <div className="text-center max-w-md px-6">
            <h1 className="text-white text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-sm mb-6" style={{ color: '#6b7fa3' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              id="error-boundary-reload"
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #e0407b 0%, #c02060 100%)',
                boxShadow: '0 4px 20px rgba(224,64,123,0.4)',
              }}
            >
              Reload Page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
