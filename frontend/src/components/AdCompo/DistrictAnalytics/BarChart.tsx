import type {MonthlyTrend} from '@/types/districtAnalytics';

interface BarChartProps {
  data: MonthlyTrend;
}

export const BarChartComponent: React.FC<BarChartProps> = ({data}) => {
  const maxValue = Math.max(
    ...data.data.map((item) => item.currentYear || 0),
    ...data.data.map((item) => item.comparisonYear || 0)
  );

  return (
    <div className='w-full overflow-x-auto'>
      <svg
        width='100%'
        height='300'
        viewBox='0 0 800 300'
        className='min-w-[800px]'>
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((value) => (
          <line
            key={`grid-${value}`}
            x1='50'
            y1={50 + 200 * value}
            x2='750'
            y2={50 + 200 * value}
            stroke='#e5e7eb'
            strokeWidth='1'
            strokeDasharray='3 3'
          />
        ))}

        {/* X Axis */}
        <line
          x1='50'
          y1='250'
          x2='750'
          y2='250'
          stroke='#d1d5db'
          strokeWidth='1.5'
        />
        {data.data.map((item, index) => (
          <text
            key={`xaxis-${index}`}
            x={
              75 + (650 / data.data.length) * index + 650 / data.data.length / 2
            }
            y='270'
            textAnchor='middle'
            className='text-xs fill-gray-500'>
            {item.month}
          </text>
        ))}

        {/* Y Axis */}
        <line
          x1='50'
          y1='50'
          x2='50'
          y2='250'
          stroke='#d1d5db'
          strokeWidth='1.5'
        />
        {[0, 0.25, 0.5, 0.75, 1].map((value, index) => (
          <g key={`yaxis-${index}`}>
            <text
              x='40'
              y={250 - value * 200}
              textAnchor='end'
              className='text-xs fill-gray-500'
              dy='4'>
              {Math.round(value * maxValue).toLocaleString()}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.data.map((item, index) => {
          const barWidth = 650 / data.data.length / 2 - 5;
          const currentYearHeight = (item.currentYear || 0) * (200 / maxValue);
          const comparisonYearHeight =
            (item.comparisonYear || 0) * (200 / maxValue);

          return (
            <g key={`bars-${index}`}>
              {/* Current Year Bar */}
              <rect
                x={75 + (650 / data.data.length) * index - barWidth - 2}
                y={250 - currentYearHeight}
                width={barWidth}
                height={currentYearHeight}
                fill='#6366f1'
                rx='2'
              />

              {/* Comparison Year Bar */}
              <rect
                x={75 + (650 / data.data.length) * index + 2}
                y={250 - comparisonYearHeight}
                width={barWidth}
                height={comparisonYearHeight}
                fill='#10b981'
                rx='2'
              />

              {/* Current Year Value */}
              <text
                x={75 + (650 / data.data.length) * index - barWidth / 2 - 2}
                y={250 - currentYearHeight - 5}
                textAnchor='middle'
                className='text-xs fill-gray-600 font-medium'>
                {item.currentYear?.toLocaleString()}
              </text>

              {/* Comparison Year Value */}
              <text
                x={75 + (650 / data.data.length) * index + barWidth / 2 + 2}
                y={250 - comparisonYearHeight - 5}
                textAnchor='middle'
                className='text-xs fill-gray-600 font-medium'>
                {item.comparisonYear?.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x='600' y='20' width='15' height='15' fill='#6366f1' rx='2' />
        <text x='620' y='30' className='text-xs fill-gray-600'>
          {data.labels.currentYear}
        </text>
        <rect x='600' y='40' width='15' height='15' fill='#10b981' rx='2' />
        <text x='620' y='50' className='text-xs fill-gray-600'>
          {data.labels.comparisonYear}
        </text>
      </svg>
    </div>
  );
};
