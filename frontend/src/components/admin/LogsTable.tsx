import { ApiCallLog } from '@/types/admin';

interface LogsTableProps {
  logs: ApiCallLog[];
  onDeleteLog: (logId: string) => void;
}

/**
 * Logs table component for admin dashboard
 * Displays API call logs in a sortable table format
 * Provides delete action for individual log entries
 * Shows empty state when no logs exist
 * 
 * @param {LogsTableProps} props - Component props
 * @param {ApiCallLog[]} props.logs - Array of API call log entries
 * @param {Function} props.onDeleteLog - Handler for deleting a log entry
 */
export const LogsTable = ({ logs, onDeleteLog }: LogsTableProps) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-6xl mb-4">📋</div>
        <div className="text-xl">No API call logs yet</div>
        <div className="text-sm mt-2">Logs will appear here after story generation</div>
      </div>
    );
  }

  return (
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
              <td className="py-3 text-gray-300 text-sm">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="py-3 text-gray-300">{log.apiProvider}</td>
              <td className="py-3 text-gray-300">{log.operation}</td>
              <td className="py-3 text-gray-300">{log.tokensUsed.toLocaleString()}</td>
              <td className="py-3 text-green-400">${log.costUsd.toFixed(4)}</td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    log.status === 'SUCCESS'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="py-3 text-gray-300">{log.durationMs}ms</td>
              <td className="py-3">
                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete log"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
