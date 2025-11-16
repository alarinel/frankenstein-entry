/**
 * Type definitions for admin dashboard components
 * Centralizes admin state, statistics, configuration, and log types
 */

/**
 * API call log entry
 * Records details of individual API calls to external services
 */
export interface ApiCallLog {
  id: string;
  storyId: string;
  apiProvider: string;
  operation: string;
  tokensUsed: number;
  costUsd: number;
  status: string;
  timestamp: string;
  durationMs: number;
  errorMessage?: string;
}

/**
 * API usage statistics
 * Aggregated metrics for API usage and costs
 */
export interface Statistics {
  totalCalls: number;
  totalCost: number;
  successRate: number;
  callsByProvider: Record<string, number>;
  costByProvider: Record<string, number>;
  averageCostPerCall: number;
}

/**
 * API configuration
 * Complete configuration for API costs and rate limits
 * Matches backend ApiConfiguration.java model
 */
export interface ApiConfiguration {
  anthropicInputCostPerMillionTokens: number;
  anthropicOutputCostPerMillionTokens: number;
  stabilityImageCostPerImage: number;
  elevenlabsCostPerCharacter: number;
  elevenlabsMaxConcurrentRequests: number;
  maxStoriesPerDay: number;
  enableCostTracking: boolean;
  maleVoiceId: string;
  femaleVoiceId: string;
}

/**
 * Admin dashboard state
 * Tracks all state for the admin dashboard
 */
export interface AdminState {
  logs: ApiCallLog[];
  statistics: Statistics | null;
  configuration: ApiConfiguration | null;
  loading: boolean;
  error: string | null;
}

/**
 * Configuration editor state
 * Tracks editing state for API configuration
 */
export interface ConfigurationEditorState {
  isEditing: boolean;
  hasChanges: boolean;
  validationErrors: Record<string, string>;
}

/**
 * Log filter options
 * Options for filtering API call logs
 */
export interface LogFilterOptions {
  provider?: string;
  operation?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  storyId?: string;
}

/**
 * Log sort options
 * Options for sorting API call logs
 */
export interface LogSortOptions {
  field: 'timestamp' | 'cost' | 'duration' | 'provider';
  direction: 'asc' | 'desc';
}
