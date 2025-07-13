import type {TopCommodity} from '@/types/districtAnalytics';

interface PieChartProps {
  data: TopCommodity[];
}

export const PieChartComponent: React.FC<PieChartProps> = ({data}) => {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const total = data.reduce((sum, item) => sum + (item.totalFeesPaid || 0), 0);
  let cumulativePercent = 0;

  return (
    <div className='w-full overflow-x-auto'>
      <svg
        width='100%'
        height='300'
        viewBox='0 0 300 300'
        className='min-w-[300px]'>
        {/* Pie Slices */}
        {data.map((item, index) => {
          const percent = (item.totalFeesPaid || 0) / total;
          const startX = Math.cos(2 * Math.PI * cumulativePercent);
          const startY = Math.sin(2 * Math.PI * cumulativePercent);
          cumulativePercent += percent;
          const endX = Math.cos(2 * Math.PI * cumulativePercent);
          const endY = Math.sin(2 * Math.PI * cumulativePercent);

          const largeArcFlag = percent > 0.5 ? 1 : 0;

          const pathData = [
            `M 150 150`,
            `L ${150 + startX * 100} ${150 + startY * 100}`,
            `A 100 100 0 ${largeArcFlag} 1 ${150 + endX * 100} ${
              150 + endY * 100
            }`,
            'Z',
          ].join(' ');

          // Calculate position for percentage label
          const midAngle = 2 * Math.PI * (cumulativePercent - percent / 2);
          const labelX = 150 + Math.cos(midAngle) * 70;
          const labelY = 150 + Math.sin(midAngle) * 70;

          return (
            <g key={`pie-${index}`}>
              <path
                d={pathData}
                fill={COLORS[index % COLORS.length]}
                stroke='white'
                strokeWidth='2'
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor='middle'
                className='text-xs fill-white font-medium'
                dy='.3em'>
                {`${(percent * 100).toFixed(1)}%`}
              </text>
            </g>
          );
        })}

        {/* Center Total */}
        <text
          x='150'
          y='150'
          textAnchor='middle'
          className='text-sm fill-gray-600 font-bold'
          dy='.3em'>
          {total.toLocaleString()}
        </text>
        <text
          x='150'
          y='170'
          textAnchor='middle'
          className='text-xs fill-gray-500'>
          Total
        </text>

        {/* Legend */}
        {data.map((item, index) => (
          <g key={`legend-${index}`} transform='translate(20, 20)'>
            <rect
              x='0'
              y={index * 20}
              width='15'
              height='15'
              fill={COLORS[index % COLORS.length]}
              rx='2'
            />
            <text x='25' y={index * 20 + 12} className='text-xs fill-gray-600'>
              {item.commodityName.length > 15
                ? `${item.commodityName.substring(0, 12)}...`
                : item.commodityName}
            </text>
            <text
              x='180'
              y={index * 20 + 12}
              className='text-xs fill-gray-600 font-medium'
              textAnchor='end'>
              {item.totalFeesPaid?.toLocaleString()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
