/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Development console debugging information
    console.error('Deskora ErrorBoundary caught an unexpected error:', error, errorInfo);
  }

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      this.setState({ hasError: false });
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          id="deskora-error-boundary"
          className="min-h-screen w-full flex items-center justify-center p-6 bg-[#FFFCFA] text-[#252126]"
        >
          <div className="w-full max-w-md p-8 rounded-[28px] bg-white border border-[#F0E8EA] deskora-shadow-elevated text-center flex flex-col items-center">
            {/* Soft decorative warning icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1F3] border border-[#F6D8DF] flex items-center justify-center mb-5 text-[#F39A8C]">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#252126] mb-2">
              Something went wrong.
            </h1>

            <p className="text-sm text-[#6F6870] leading-relaxed mb-6 max-w-xs">
              An unexpected issue occurred while rendering Deskora. Please reload the application to restore your session.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#252126] hover:bg-[#3D373F] text-white text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#F39A8C]" />
              <span>Reload Deskora</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
