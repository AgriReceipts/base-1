import type { HeatMapRes } from "@/types/districtAnalytics";

export interface HeatmapComponentProps {
  data: HeatMapRes[];
  getColor: (value: number) => string;
}

export const HeatmapComponent: React.FC<HeatmapComponentProps> = ({
  data,
  getColor,
}) => {
  // Define months in chronological order (April to March)
  const months = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

  // Get committee names from data
  const committees = data.map((item) => item.committeeName);

  // Helper function to get value for a specific committee and month
  const getValue = (committee: HeatMapRes, month: string): number => {
    return (committee[month as keyof HeatMapRes] as number) || 0;
  };

  // Calculate dynamic dimensions
  const leftMargin = 180;
  const cellWidth = 60;
  const cellHeight = 35;
  const cellSpacing = 8;
  const headerHeight = 80;
  const legendHeight = 120; // Increased to ensure legend is visible
  const totalWidth =
    leftMargin + months.length * (cellWidth + cellSpacing) - cellSpacing + 40;
  const heatmapHeight =
    committees.length * (cellHeight + cellSpacing) - cellSpacing;
  const totalHeight = headerHeight + heatmapHeight + legendHeight;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="100%"
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={`min-w-[${totalWidth}px]`}
      >
        {/* Title */}
        <text
          x={totalWidth / 2}
          y="25"
          textAnchor="middle"
          className="text-lg fill-gray-700 font-semibold"
        >
          Achievement Percentage by Committee and Month
        </text>

        {/* Months on X axis */}
        {months.map((month, index) => (
          <text
            key={`month-${index}`}
            x={leftMargin + index * (cellWidth + cellSpacing) + cellWidth / 2}
            y="60"
            textAnchor="middle"
            className="text-sm fill-gray-600 font-medium"
          >
            {month.substring(0, 3)} {/* Show abbreviated month names */}
          </text>
        ))}

        {/* Committees on Y axis */}
        {committees.map((committee, index) => (
          <text
            key={`committee-${index}`}
            x={leftMargin - 10}
            y={
              headerHeight +
              index * (cellHeight + cellSpacing) +
              cellHeight / 2 +
              4
            }
            textAnchor="end"
            className="text-sm fill-gray-600 font-medium"
          >
            {committee.length > 25
              ? `${committee.substring(0, 22)}...`
              : committee}
          </text>
        ))}

        {/* Heatmap cells */}
        {data.map((committee, committeeIndex) =>
          months.map((month, monthIndex) => {
            const value = getValue(committee, month);

            return (
              <g key={`cell-${committeeIndex}-${monthIndex}`}>
                <rect
                  x={leftMargin + monthIndex * (cellWidth + cellSpacing)}
                  y={headerHeight + committeeIndex * (cellHeight + cellSpacing)}
                  width={cellWidth}
                  height={cellHeight}
                  fill={getColor(value)}
                  stroke="#fff"
                  strokeWidth="1"
                  rx="4"
                >
                  <title>{`${committee.committeeName} - ${month}: ${value}%`}</title>
                </rect>

                {/* Value text for cells with enough contrast */}
                {value > 0 && (
                  <text
                    x={
                      leftMargin +
                      monthIndex * (cellWidth + cellSpacing) +
                      cellWidth / 2
                    }
                    y={
                      headerHeight +
                      committeeIndex * (cellHeight + cellSpacing) +
                      cellHeight / 2 +
                      4
                    }
                    textAnchor="middle"
                    className="text-xs fill-gray-600 "
                  >
                    {value}%
                  </text>
                )}
              </g>
            );
          }),
        )}

        {/* Color legend - positioned below heatmap with proper spacing */}
        <text
          x={leftMargin}
          y={headerHeight + heatmapHeight + 40}
          className="text-sm fill-gray-700 font-medium"
        >
          Performance Scale:
        </text>

        {[0, 20, 40, 60, 80, 100].map((value, index) => {
          const color = getColor(value);
          const rectX = leftMargin + index * (cellWidth + cellSpacing);
          const rectY = headerHeight + heatmapHeight + 50;
          const textX = rectX + cellWidth / 2;
          const textY = rectY + 35; // Moved text closer to rectangle

          return (
            <g key={`legend-${index}`}>
              <rect
                x={rectX}
                y={rectY}
                width={cellWidth}
                height="25"
                fill={color || "#d1d5db"}
                stroke="#9ca3af"
                strokeWidth="1"
                rx="4"
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                fill="#374151"
                fontSize="12"
                fontWeight="500"
              >
                {value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
