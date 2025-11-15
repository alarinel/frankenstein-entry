import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ApiCallLog {
  id: string;
  storyId: string;
  apiProvider: string;
  operation: string;
  tokensUsed: number;
  costUsd: number;
  status: string;
  timestamp: string;
  durationMs: number;
}

interface ApiConfiguration {
  anthropicInputCostPerMillionTokens: number;
  anthropicOutputCostPerMillionTokens: number;
  stabilityImageCostPerImage: number;
  elevenlabsCostPerCharacter: number;
  elevenlabsRateLimitPerMinute: number;
  elevenlabsDelayBetweenCallsMs: number;
  maxStoriesPerDay: number;
  enableCostTracking: boolean;
}

interface Statistics {
  totalCalls: number;
  totalCost: number;
  successRate: number;
  callsByProvider: Record<string, number>;
  costByProvider: Record<string, number>;
  averageCostPerCall: number;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8083/api';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [config, setConfig] = useState<ApiConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [logsRes, statsRes, configRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/logs`),
        axios.get(`${API_BASE_URL}/admin/statistics`),
        axios.get(`${API_BASE_URL}/admin/configuration`),
      ]);
      
      setLogs(logsRes.data);
      setStats(statsRes.data);
      setConfig(configRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (logId: string) => {
    if (!confirm('Delete this log entry?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/logs/${logId}`);
      toast.success('Log deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete log');
    }
  };

  const deleteOldLogs = async (days: number) => {
    if (!confirm(`Delete all logs older than ${days} days?`)) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/logs/old/${days}`);
      toast.success(`Deleted logs older than ${days} days`);
      loadData();
    } catch (error) {
      toast.error('Failed to delete old logs');
    }
  };

  const saveConfiguration = async () => {
    if (!config) return;
    
    try {
      await axios.put(`${API_BASE_URL}/admin/configuration`, config);
      toast.success('Configuration saved');
      setEditingConfig(false);
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-spooky bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-white transition-colors"
          >
            🏠 Back to Home
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800/80 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Calls</div>
              <div className="text-3xl font-bold text-white">{stats.totalCalls}</div>
            </div>
            <div className="bg-dark-800/80 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Cost</div>
              <div className="text-3xl font-bold text-green-400">${stats.totalCost.toFixed(2)}</div>
            </div>
            <div className="bg-dark-800/80 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Success Rate</div>
              <div className="text-3xl font-bold text-blue-400">{stats.successRate.toFixed(1)}%</div>
            </div>
            <div className="bg-dark-800/80 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Avg Cost/Call</div>
              <div className="text-3xl font-bold text-purple-400">${stats.averageCostPerCall.toFixed(3)}</div>
            </div>
          </div>
        )}

        {/* Configuration */}
        {config && (
          <div className="bg-dark-800/80 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Configuration</h2>
              <button
                onClick={() => editingConfig ? saveConfiguration() : setEditingConfig(true)}
                className="px-4 py-2 bg-spooky-purple-600 hover:bg-spooky-purple-700 rounded-lg text-white transition-colors"
              >
                {editingConfig ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Anthropic Input Cost (per 1M tokens)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.anthropicInputCostPerMillionTokens}
                  onChange={(e) => setConfig({...config, anthropicInputCostPerMillionTokens: parseFloat(e.target.value)})}
                  disabled={!editingConfig}
                  className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Anthropic Output Cost (per 1M tokens)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.anthropicOutputCostPerMillionTokens}
                  onChange={(e) => setConfig({...config, anthropicOutputCostPerMillionTokens: parseFloat(e.target.value)})}
                  disabled={!editingConfig}
                  className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Stability AI Cost (per image)</label>
                <input
                  type="number"
                  step="0.001"
                  value={config.stabilityImageCostPerImage}
                  onChange={(e) => setConfig({...config, stabilityImageCostPerImage: parseFloat(e.target.value)})}
                  disabled={!editingConfig}
                  className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">ElevenLabs Cost (per character)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={config.elevenlabsCostPerCharacter}
                  onChange={(e) => setConfig({...config, elevenlabsCostPerCharacter: parseFloat(e.target.value)})}
                  disabled={!editingConfig}
                  className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">ElevenLabs Rate Limit (per minute)</label>
                <input
                  type="number"
                  value={config.elevenlabsRateLimitPerMinute}
                  onChange={(e) => setConfig({...config, elevenlabsRateLimitPerMinute: parseInt(e.target.value)})}
                  disabled={!editingConfig}
                  className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">ElevenLabs Delay Between Calls (ms)</label>
                <input
                  type="number"
                  value={config.elevenlabsDelayBetweenCallsMs}
                  onChange={(e) => setConfig({...config, elevenlabsDelayBetweenCallsMs: parseInt(e.target.value)})}
                  disabled={!editingConfig}
                  className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Logs Management */}
        <div className="bg-dark-800/80 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">API Call Logs ({logs.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() => deleteOldLogs(30)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
              >
                🗑️ Delete 30+ days
              </button>
              <button
                onClick={() => deleteOldLogs(7)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                🗑️ Delete 7+ days
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-gray-400 font-semibold">Timestamp</th>
                  <th className="pb-3 text-gray-400 font-semibold">Provider</th>
                  <th className="pb-3 text-gray-400 font-semibold">Operation</th>
                  <th className="pb-3 text-gray-400 font-semibold">Tokens</th>
                  <th className="pb-3 text-gray-400 font-semibold">Cost</th>
                  <th className="pb-3 text-gray-400 font-semibold">Status</th>
                  <th className="pb-3 text-gray-400 font-semibold">Duration</th>
                  <th className="pb-3 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800 hover:bg-dark-700/50">
                    <td className="py-3 text-gray-300 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 text-gray-300">{log.apiProvider}</td>
                    <td className="py-3 text-gray-300">{log.operation}</td>
                    <td className="py-3 text-gray-300">{log.tokensUsed.toLocaleString()}</td>
                    <td className="py-3 text-green-400">${log.costUsd.toFixed(4)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'SUCCESS' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{log.durationMs}ms</td>
                    <td className="py-3">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
