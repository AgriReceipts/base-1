import type { MonthlyTrend } from "@/types/districtAnalytics";
import { formatMoney } from "@/lib/helpers";

interface BarChartProps {
  data: MonthlyTrend;
}

export const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(
    ...data.data.map((item) => item.currentYear || 0),
    ...data.data.map((item) => item.comparisonYear || 0),
  );

  // Calculate responsive dimensions
  const minBarWidth = 24; // Minimum bar width for readability
  const barSpacing = 8; // Space between bars in a group
  const groupSpacing = 32; // Space between month groups
  const sideMargin = 60; // Left margin for Y-axis labels
  const topMargin = 40; // Top margin for value labels
  const bottomMargin = 50; // Bottom margin for X-axis labels
  const chartHeight = 240; // Height of the chart area

  // Calculate total width needed
  const totalGroups = data.data.length;
  const barsPerGroup = 2;
  const totalBarsWidth = totalGroups * barsPerGroup * minBarWidth;
  const totalBarSpacing = totalGroups * barSpacing;
  const totalGroupSpacing = (totalGroups - 1) * groupSpacing;
  const minChartWidth = totalBarsWidth + totalBarSpacing + totalGroupSpacing;
  const totalWidth = Math.max(800, minChartWidth + sideMargin + 100); // Minimum 800px width

  const chartWidth = totalWidth - sideMargin - 100;
  const groupWidth = chartWidth / totalGroups;
  const barWidth = Math.min(minBarWidth, (groupWidth - groupSpacing) / 2);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={totalWidth}
        height={chartHeight + topMargin + bottomMargin}
        viewBox={`0 0 ${totalWidth} ${chartHeight + topMargin + bottomMargin}`}
        className="min-w-full"
      >
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((value) => (
          <line
            key={`grid-${value}`}
            x1={sideMargin}
            y1={topMargin + chartHeight * value}
            x2={sideMargin + chartWidth}
            y2={topMargin + chartHeight * value}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {/* X Axis */}
        <line
          x1={sideMargin}
          y1={topMargin + chartHeight}
          x2={sideMargin + chartWidth}
          y2={topMargin + chartHeight}
          stroke="#d1d5db"
          strokeWidth="1.5"
        />

        {/* X Axis Labels */}
        {data.data.map((item, index) => (
          <text
            key={`xaxis-${index}`}
            x={sideMargin + groupWidth * index + groupWidth / 2}
            y={topMargin + chartHeight + 20}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {item.month}
          </text>
        ))}

        {/* Y Axis */}
        <line
          x1={sideMargin}
          y1={topMargin}
          x2={sideMargin}
          y2={topMargin + chartHeight}
          stroke="#d1d5db"
          strokeWidth="1.5"
        />

        {/* Y Axis Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((value, index) => (
          <text
            key={`yaxis-${index}`}
            x={sideMargin - 10}
            y={topMargin + chartHeight - value * chartHeight}
            textAnchor="end"
            className="text-xs fill-gray-500"
            dy="4"
          >
            {formatMoney(Math.round(value * maxValue))}
          </text>
        ))}

        {/* Bars */}
        {data.data.map((item, index) => {
          const groupX = sideMargin + groupWidth * index;
          const currentYearHeight =
            (item.currentYear || 0) * (chartHeight / maxValue);
          const comparisonYearHeight =
            (item.comparisonYear || 0) * (chartHeight / maxValue);

          // Calculate bar positions with proper spacing
          const bar1X = groupX + (groupWidth - (barWidth * 2 + barSpacing)) / 2;
          const bar2X = bar1X + barWidth + barSpacing;

          return (
            <g key={`bars-${index}`}>
              {/* Current Year Bar */}
              <rect
                x={bar1X}
                y={topMargin + chartHeight - currentYearHeight}
                width={barWidth}
                height={currentYearHeight}
                fill="#6366f1"
                rx="2"
              />

              {/* Comparison Year Bar */}
              <rect
                x={bar2X}
                y={topMargin + chartHeight - comparisonYearHeight}
                width={barWidth}
                height={comparisonYearHeight}
                fill="#10b981"
                rx="2"
              />

              {/* Current Year Value - Smaller text */}
              {item.currentYear != null && currentYearHeight > 15 && (
                <text
                  x={bar1X + barWidth / 2}
                  y={topMargin + chartHeight - currentYearHeight - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-gray-600 font-medium"
                >
                  {formatMoney(item.currentYear)}
                </text>
              )}

              {/* Comparison Year Value - Smaller text */}
              {item.comparisonYear != null && comparisonYearHeight > 15 && (
                <text
                  x={bar2X + barWidth / 2}
                  y={topMargin + chartHeight - comparisonYearHeight - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-gray-600 font-medium"
                >
                  {formatMoney(item.comparisonYear)}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${totalWidth - 180}, 20)`}>
          <rect x="0" y="0" width="12" height="12" fill="#6366f1" rx="2" />
          <text x="18" y="9" className="text-xs fill-gray-600">
            {data.labels.currentYear}
          </text>
          <rect x="0" y="20" width="12" height="12" fill="#10b981" rx="2" />
          <text x="18" y="29" className="text-xs fill-gray-600">
            {data.labels.comparisonYear}
          </text>
        </g>
      </svg>
    </div>
  );
};
