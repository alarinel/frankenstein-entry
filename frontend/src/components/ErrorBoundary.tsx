import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SpookyButton } from './spooky/SpookyButton';
import { SpookyCard } from './spooky/SpookyCard';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full"
          >
            <SpookyCard glowColor="orange" className="text-center">
              {/* Error Icon */}
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                👻
              </motion.div>

              {/* Error Title */}
              <h1 className="text-4xl font-spooky bg-gradient-to-r from-spooky-orange-400 to-spooky-pink-400 bg-clip-text text-transparent mb-4">
                Oops! Something Went Wrong
              </h1>

              {/* Error Message */}
              <p className="text-gray-300 text-lg mb-6 font-fun">
                The spirits have encountered an unexpected problem. Don't worry, your magical journey can
                continue!
              </p>

              {/* Error Details (in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-dark-800/50 rounded-lg text-left overflow-auto max-h-48">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-400 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <SpookyButton onClick={this.handleReload} variant="secondary">
                  <span className="text-xl mr-2">🔄</span>
                  Try Again
                </SpookyButton>

                <SpookyButton onClick={this.handleReset} variant="primary">
                  <span className="text-xl mr-2">🏠</span>
                  Go Home
                </SpookyButton>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-gray-400 text-sm font-fun italic">
                If the problem persists, try refreshing the page or starting a new story.
              </p>
            </SpookyCard>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
