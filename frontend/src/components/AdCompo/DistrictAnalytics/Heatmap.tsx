import type {HeatMapRes} from '@/types/districtAnalytics';

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
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
  ];

  // Get committee names from data
  const committees = data.map((item) => item.committeeName);

  // Helper function to get value for a specific committee and month
  const getValue = (committee: HeatMapRes, month: string): number => {
    return (committee[month as keyof HeatMapRes] as number) || 0;
  };

  return (
    <div className='w-full overflow-x-auto'>
      <svg
        width='100%'
        height={committees.length * 30 + 100}
        viewBox={`0 0 800 ${committees.length * 30 + 100}`}
        className='min-w-[800px]'>
        {/* Title */}
        <text
          x='400'
          y='20'
          textAnchor='middle'
          className='text-sm fill-gray-600 font-medium'>
          Achievement Percentage by Committee and Month
        </text>

        {/* Months on X axis */}
        {months.map((month, index) => (
          <text
            key={`month-${index}`}
            x={150 + index * 50 + 25}
            y='45'
            textAnchor='middle'
            className='text-xs fill-gray-600'>
            {month.substring(0, 3)} {/* Show abbreviated month names */}
          </text>
        ))}

        {/* Committees on Y axis */}
        {committees.map((committee, index) => (
          <text
            key={`committee-${index}`}
            x='140'
            y={80 + index * 30 + 15}
            textAnchor='end'
            className='text-xs fill-gray-600'>
            {committee.length > 20
              ? `${committee.substring(0, 17)}...`
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
                  x={150 + monthIndex * 50}
                  y={80 + committeeIndex * 30}
                  width='40'
                  height='20'
                  fill={getColor(value)}
                  stroke='#fff'
                  strokeWidth='0.5'
                  rx='2'>
                  <title>{`${committee.committeeName} - ${month}: ${value}%`}</title>
                </rect>

                {/* Value text for cells with enough contrast */}
                {value > 30 && (
                  <text
                    x={150 + monthIndex * 50 + 20}
                    y={80 + committeeIndex * 30 + 13}
                    textAnchor='middle'
                    className='text-[10px] fill-white font-medium'>
                    {value}%
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Color legend */}
        <text
          x='150'
          y={committees.length * 30 + 70}
          className='text-xs fill-gray-600'>
          Performance:
        </text>

        {[0, 20, 40, 60, 80, 100].map((value, index) => (
          <g
            key={`legend-${index}`}
            transform={`translate(${250 + index * 50}, ${
              committees.length * 30 + 60
            })`}>
            <rect
              x='0'
              y='0'
              width='40'
              height='20'
              fill={getColor(value)}
              stroke='#fff'
              strokeWidth='0.5'
              rx='2'
            />
            <text
              x='20'
              y='35'
              textAnchor='middle'
              className='text-xs fill-gray-500'>
              {value}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
