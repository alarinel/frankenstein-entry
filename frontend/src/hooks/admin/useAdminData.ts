/**
 * Custom hook for managing admin dashboard data
 * Fetches and manages API logs, statistics, and configuration
 * 
 * @author alarinel@gmail.com
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ApiCallLog, ApiConfiguration, Statistics } from '@/types/admin';

interface UseAdminDataReturn {
  logs: ApiCallLog[];
  statistics: Statistics | null;
  configuration: ApiConfiguration | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8083/api';

/**
 * Hook for fetching and managing admin dashboard data
 * Loads API logs, statistics, and configuration on mount
 * Provides refresh function for manual data reload
 * 
 * @returns {UseAdminDataReturn} Admin data and loading state
 * 
 * @example
 * ```tsx
 * const { logs, statistics, configuration, loading, refresh } = useAdminData();
 * ```
 */
export const useAdminData = (): UseAdminDataReturn => {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [configuration, setConfiguration] = useState<ApiConfiguration | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [logsRes, statsRes, configRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/logs`),
        axios.get(`${API_BASE_URL}/admin/statistics`),
        axios.get(`${API_BASE_URL}/admin/configuration`),
      ]);

      setLogs(logsRes.data);
      setStatistics(statsRes.data);
      setConfiguration(configRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    logs,
    statistics,
    configuration,
    loading,
    refresh: loadData,
  };
};
