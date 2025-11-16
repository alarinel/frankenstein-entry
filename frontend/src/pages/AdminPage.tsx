import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { StatisticsCards, ConfigurationEditor, LogsTable, LogsActions } from '@/components/admin';
import { useAdminData } from '@/hooks/admin';
import { ActionButton } from '@/components/shared';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8083/api';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { logs, statistics, configuration, loading, refresh } = useAdminData();
  const [editingConfig, setEditingConfig] = useState(false);
  const [editedConfig, setEditedConfig] = useState(configuration);

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Delete this log entry?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/logs/${logId}`);
      toast.success('Log deleted');
      refresh();
    } catch (error) {
      toast.error('Failed to delete log');
    }
  };

  const handleDeleteOldLogs = async (days: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/logs/old/${days}`);
      toast.success(`Deleted logs older than ${days} days`);
      refresh();
    } catch (error) {
      toast.error('Failed to delete old logs');
    }
  };

  const handleEditConfig = () => {
    setEditedConfig(configuration);
    setEditingConfig(true);
  };

  const handleCancelEdit = () => {
    setEditedConfig(configuration);
    setEditingConfig(false);
  };

  const handleSaveConfig = async () => {
    if (!editedConfig) return;

    try {
      await axios.put(`${API_BASE_URL}/admin/configuration`, editedConfig);
      toast.success('Configuration saved');
      setEditingConfig(false);
      refresh();
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
          <ActionButton onClick={() => navigate('/')} variant="ghost" size="sm">
            <span>🏠</span>
            <span>Back to Home</span>
          </ActionButton>
        </div>

        {/* Statistics */}
        {statistics && <StatisticsCards statistics={statistics} />}

        {/* Configuration */}
        {editedConfig && (
          <ConfigurationEditor
            configuration={editedConfig}
            isEditing={editingConfig}
            onEdit={handleEditConfig}
            onSave={handleSaveConfig}
            onCancel={handleCancelEdit}
            onChange={setEditedConfig}
          />
        )}

        {/* Logs Management */}
        <div className="bg-dark-800/80 rounded-lg p-6">
          <LogsActions totalLogs={logs.length} onDeleteOldLogs={handleDeleteOldLogs} />
          <LogsTable logs={logs} onDeleteLog={handleDeleteLog} />
        </div>
      </div>
    </div>
  );
};
