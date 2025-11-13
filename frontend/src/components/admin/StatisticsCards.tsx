import { StatCard } from '@/components/shared';
import { Statistics } from '@/types/admin';

interface StatisticsCardsProps {
  statistics: Statistics;
}

/**
 * Statistics cards component for admin dashboard
 * Displays API usage statistics in a grid layout
 * Shows total calls, costs, success rate, and average cost per call
 * 
 * @param {StatisticsCardsProps} props - Component props
 * @param {Statistics} props.statistics - Aggregated API statistics data
 */
export const StatisticsCards = ({ statistics }: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total Calls"
        value={statistics.totalCalls}
        valueColor="text-white"
      />
      <StatCard
        label="Total Cost"
        value={`$${statistics.totalCost.toFixed(2)}`}
        valueColor="text-green-400"
      />
      <StatCard
        label="Success Rate"
        value={`${statistics.successRate.toFixed(1)}%`}
        valueColor="text-blue-400"
      />
      <StatCard
        label="Avg Cost/Call"
        value={`$${statistics.averageCostPerCall.toFixed(3)}`}
        valueColor="text-purple-400"
      />
    </div>
  );
};
