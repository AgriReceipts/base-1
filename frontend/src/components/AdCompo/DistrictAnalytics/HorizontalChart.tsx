import type {TopCheckPost} from '@/types/districtAnalytics';

interface HorizontalBarChartProps {
  data: TopCheckPost[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
}) => {
  const maxValue = Math.max(...data.map((item) => item.totalFees || 0));

  return (
    <div className='w-full overflow-x-auto'>
      <svg
        width='100%'
        height={data.length * 40 + 50}
        viewBox={`0 0 800 ${data.length * 40 + 50}`}
        className='min-w-[800px]'>
        {/* Bars */}
        {data.map((item, index) => (
          <g
            key={`bar-${index}`}
            transform={`translate(0, ${index * 40 + 20})`}>
            {/* Bar Label */}
            <text
              x='0'
              y='15'
              textAnchor='start'
              className='text-xs fill-gray-600'>
              {item.name}
            </text>

            {/* Bar Background */}
            <rect x='150' y='0' width='600' height='20' fill='#e5e7eb' rx='3' />

            {/* Bar Fill */}
            <rect
              x='150'
              y='0'
              width={((item.totalFees || 0) / maxValue) * 600}
              height='20'
              fill='#6366f1'
              rx='3'
            />

            {/* Bar Value */}
            <text
              x={155 + ((item.totalFees || 0) / maxValue) * 600}
              y='15'
              className='text-xs fill-white font-medium'>
              {item.totalFees?.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X Axis */}
        <line
          x1='150'
          y1={data.length * 40 + 20}
          x2='750'
          y2={data.length * 40 + 20}
          stroke='#d1d5db'
          strokeWidth='1.5'
        />

        {/* X Axis Ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((value, index) => (
          <g key={`xaxis-${index}`}>
            <text
              x={150 + 600 * value}
              y={data.length * 40 + 35}
              textAnchor='middle'
              className='text-xs fill-gray-500'>
              {Math.round(value * maxValue).toLocaleString()}
            </text>
            <line
              x1={150 + 600 * value}
              y1={data.length * 40 + 20}
              x2={150 + 600 * value}
              y2={data.length * 40 + 15}
              stroke='#d1d5db'
              strokeWidth='1.5'
            />
          </g>
        ))}

        {/* Chart Title */}
        <text
          x='400'
          y='15'
          textAnchor='middle'
          className='text-sm fill-gray-600 font-medium'>
          Collection in Lakhs
        </text>
      </svg>
    </div>
  );
};
