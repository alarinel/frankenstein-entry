import toast from 'react-hot-toast';

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
}

export class ErrorHandler {
  static categorizeError(error: any): AppError {
    // Network errors
    if (!navigator.onLine) {
      return {
        type: ErrorType.NETWORK,
        message: 'No internet connection. Please check your network and try again.',
      };
    }

    // Fetch/Axios errors
    if (error.response) {
      const statusCode = error.response.status;

      switch (statusCode) {
        case 400:
          return {
            type: ErrorType.VALIDATION,
            message: error.response.data?.message || 'Invalid request. Please check your input.',
            statusCode,
          };
        case 401:
          return {
            type: ErrorType.UNAUTHORIZED,
            message: 'Unauthorized access. Please log in again.',
            statusCode,
          };
        case 404:
          return {
            type: ErrorType.NOT_FOUND,
            message: 'The requested resource was not found.',
            statusCode,
          };
        case 500:
        case 502:
        case 503:
          return {
            type: ErrorType.SERVER,
            message: 'Server error. Our magical spirits are working on it. Please try again later.',
            statusCode,
          };
        default:
          return {
            type: ErrorType.UNKNOWN,
            message: error.response.data?.message || 'An unexpected error occurred.',
            statusCode,
          };
      }
    }

    // Network timeout or connection refused
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        type: ErrorType.NETWORK,
        message: 'Request timed out. Please check your connection and try again.',
      };
    }

    // Generic errors
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message,
        originalError: error,
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message: 'An unexpected error occurred.',
    };
  }

  static handle(error: any, options: {
    showToast?: boolean;
    customMessage?: string;
    onError?: (appError: AppError) => void;
  } = {}) {
    const { showToast = true, customMessage, onError } = options;

    const appError = this.categorizeError(error);
    const message = customMessage || appError.message;

    console.error('Application error:', appError);

    if (showToast) {
      const toastOptions = {
        duration: 4000,
        icon: this.getErrorIcon(appError.type),
      };

      toast.error(message, toastOptions);
    }

    if (onError) {
      onError(appError);
    }

    return appError;
  }

  private static getErrorIcon(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return '📡';
      case ErrorType.VALIDATION:
        return '⚠️';
      case ErrorType.SERVER:
        return '🔧';
      case ErrorType.NOT_FOUND:
        return '🔍';
      case ErrorType.UNAUTHORIZED:
        return '🔒';
      default:
        return '❌';
    }
  }

  static logError(error: any, context?: string) {
    if (import.meta.env.DEV) {
      console.group(`Error ${context ? `in ${context}` : ''}`);
      console.error(error);
      console.groupEnd();
    }

    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, etc.
  }
}
