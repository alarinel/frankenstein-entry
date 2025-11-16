interface LogsActionsProps {
  totalLogs: number;
  onDeleteOldLogs: (days: number) => void;
}

/**
 * Logs actions component for bulk log management
 * Provides buttons for deleting old logs with confirmation dialogs
 * 
 * @param {LogsActionsProps} props - Component props
 * @param {number} props.totalLogs - Total number of log entries
 * @param {Function} props.onDeleteOldLogs - Handler for deleting logs older than specified days
 */
export const LogsActions = ({ totalLogs, onDeleteOldLogs }: LogsActionsProps) => {
  const handleDelete = (days: number) => {
    if (confirm(`Delete all logs older than ${days} days?`)) {
      onDeleteOldLogs(days);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-white">
        API Call Logs ({totalLogs})
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => handleDelete(30)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
        >
          🗑️ Delete 30+ days
        </button>
        <button
          onClick={() => handleDelete(7)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
        >
          🗑️ Delete 7+ days
        </button>
      </div>
    </div>
  );
};
