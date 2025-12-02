import React from 'react';

// This is a placeholder. Integrate chart.js, recharts, victory, or ECharts for production
export const StatsBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  return (
    <div style={{ height: 220 }} className="flex items-end gap-2 overflow-x-auto">
      {data && data.length > 0 ? (
        data.map((item) => (
          <div key={item.label} className="flex flex-col items-center flex-1 min-w-[32px]">
            <div
              className="w-full bg-primary-500 rounded-t-md"
              style={{ height: `${4 * item.value || 1}px`, minHeight: 8 }}
              title={`${item.value} new`}
            />
            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
        ))
      ) : (
        <span className="text-gray-400">No chart data</span>
      )}
    </div>
  );
};
