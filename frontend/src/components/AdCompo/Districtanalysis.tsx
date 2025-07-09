import React, {useState, useEffect} from 'react';

// Define all interfaces at the top
interface FilterState {
  financialYear: string;
  month: string;
  committee: string;
  timeRange: string;
}

interface MetricData {
  totalCollection: number;
  achievementRate: number;
  totalReceipt: number;
  avgTransaction: number;
}

interface CommitteeData {
  id: number;
  committee: string;
  target: number;
  achieved: number;
  achievementPercentage: number;
  receipts: number;
  status: string;
}

interface ChartDataItem {
  name: string;
  value?: number;
  currentYear?: number;
  previousYear?: number;
  achievement?: number;
}

interface HeatmapDataItem {
  id: string;
  x: string;
  y: string;
  value: number;
}

// Reusable components with proper TypeScript interfaces
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  color,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-l-4`}
      style={{borderLeftColor: color}}>
      <h3 className='text-gray-500 text-sm font-medium uppercase tracking-wider'>
        {title}
      </h3>
      <p className='text-2xl font-bold my-2' style={{color}}>
        {value}
      </p>
      <p className='text-gray-400 text-xs'>{subtitle}</p>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h2 className='text-gray-700 text-lg font-semibold mb-4'>{title}</h2>
      {children}
    </div>
  );
};

interface LineChartProps {
  data: ChartDataItem[];
  dataKey: keyof ChartDataItem;
}

const LineChartComponent: React.FC<LineChartProps> = ({data, dataKey}) => {
  const maxValue = Math.max(
    ...data.map((item) => (item[dataKey] as number) || 0)
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
        {data.map((item, index) => (
          <text
            key={`xaxis-${index}`}
            x={50 + (700 / (data.length - 1)) * index}
            y='270'
            textAnchor='middle'
            className='text-xs fill-gray-500'>
            {item.name.length > 10
              ? `${item.name.substring(0, 8)}...`
              : item.name}
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

        {/* Gradient Area */}
        <defs>
          <linearGradient id='lineGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#6366f1' stopOpacity='0.2' />
            <stop offset='100%' stopColor='#6366f1' stopOpacity='0' />
          </linearGradient>
        </defs>

        {/* Area */}
        <path
          d={`M50,250 ${data
            .map(
              (item, index) =>
                `L${50 + (700 / (data.length - 1)) * index},${
                  250 - ((item[dataKey] as number) || 0) * (200 / maxValue)
                }`
            )
            .join(' ')} L750,250 Z`}
          fill='url(#lineGradient)'
        />

        {/* Line */}
        <polyline
          fill='none'
          stroke='#6366f1'
          strokeWidth='2.5'
          points={data
            .map((item, index) => {
              const x = 50 + (700 / (data.length - 1)) * index;
              const y =
                250 - ((item[dataKey] as number) || 0) * (200 / maxValue);
              return `${x},${y}`;
            })
            .join(' ')}
        />

        {/* Dots */}
        {data.map((item, index) => (
          <circle
            key={`dot-${index}`}
            cx={50 + (700 / (data.length - 1)) * index}
            cy={250 - ((item[dataKey] as number) || 0) * (200 / maxValue)}
            r='5'
            fill='#6366f1'
            stroke='white'
            strokeWidth='2'
          />
        ))}

        {/* Legend */}
        <text
          x='700'
          y='30'
          textAnchor='end'
          className='text-xs fill-gray-600 font-medium'>
          Achievement (₹ Lakhs)
        </text>
      </svg>
    </div>
  );
};

interface BarChartProps {
  data: ChartDataItem[];
}

const BarChartComponent: React.FC<BarChartProps> = ({data}) => {
  const maxValue = Math.max(
    ...data.map((item) => item.currentYear || 0),
    ...data.map((item) => item.previousYear || 0)
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
        {data.map((item, index) => (
          <text
            key={`xaxis-${index}`}
            x={75 + (650 / data.length) * index + 650 / data.length / 2}
            y='270'
            textAnchor='middle'
            className='text-xs fill-gray-500'>
            {item.name}
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
        {data.map((item, index) => {
          const barWidth = 650 / data.length / 2 - 5;
          const currentYearHeight = (item.currentYear || 0) * (200 / maxValue);
          const previousYearHeight =
            (item.previousYear || 0) * (200 / maxValue);

          return (
            <g key={`bars-${index}`}>
              {/* Current Year Bar */}
              <rect
                x={75 + (650 / data.length) * index - barWidth - 2}
                y={250 - currentYearHeight}
                width={barWidth}
                height={currentYearHeight}
                fill='#6366f1'
                rx='2'
              />

              {/* Previous Year Bar */}
              <rect
                x={75 + (650 / data.length) * index + 2}
                y={250 - previousYearHeight}
                width={barWidth}
                height={previousYearHeight}
                fill='#10b981'
                rx='2'
              />

              {/* Current Year Value */}
              <text
                x={75 + (650 / data.length) * index - barWidth / 2 - 2}
                y={250 - currentYearHeight - 5}
                textAnchor='middle'
                className='text-xs fill-gray-600 font-medium'>
                {item.currentYear?.toLocaleString()}
              </text>

              {/* Previous Year Value */}
              <text
                x={75 + (650 / data.length) * index + barWidth / 2 + 2}
                y={250 - previousYearHeight - 5}
                textAnchor='middle'
                className='text-xs fill-gray-600 font-medium'>
                {item.previousYear?.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x='600' y='20' width='15' height='15' fill='#6366f1' rx='2' />
        <text x='620' y='30' className='text-xs fill-gray-600'>
          Current Year
        </text>
        <rect x='600' y='40' width='15' height='15' fill='#10b981' rx='2' />
        <text x='620' y='50' className='text-xs fill-gray-600'>
          Previous Year
        </text>
      </svg>
    </div>
  );
};

interface PieChartProps {
  data: ChartDataItem[];
}

const PieChartComponent: React.FC<PieChartProps> = ({data}) => {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
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
          const percent = (item.value || 0) / total;
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
              {item.name.length > 15
                ? `${item.name.substring(0, 12)}...`
                : item.name}
            </text>
            <text
              x='180'
              y={index * 20 + 12}
              className='text-xs fill-gray-600 font-medium'
              textAnchor='end'>
              {item.value?.toLocaleString()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

interface HorizontalBarChartProps {
  data: ChartDataItem[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({data}) => {
  const maxValue = Math.max(...data.map((item) => item.value || 0));

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
              width={((item.value || 0) / maxValue) * 600}
              height='20'
              fill='#6366f1'
              rx='3'
            />

            {/* Bar Value */}
            <text
              x={155 + ((item.value || 0) / maxValue) * 600}
              y='15'
              className='text-xs fill-white font-medium'>
              {item.value?.toLocaleString()}
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

interface HeatmapComponentProps {
  data: HeatmapDataItem[];
  getColor: (value: number) => string;
}

const HeatmapComponent: React.FC<HeatmapComponentProps> = ({
  data,
  getColor,
}) => {
  const committees = Array.from(new Set(data.map((item) => item.x)));
  const months = Array.from(new Set(data.map((item) => item.y)));

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
            {month}
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
        {committees.map((committee, committeeIndex) =>
          months.map((month, monthIndex) => {
            const item = data.find((d) => d.x === committee && d.y === month);
            const value = item ? item.value : 0;

            return (
              <g key={`cell-${committeeIndex}-${monthIndex}`}>
                <rect
                  x={150 + monthIndex * 50}
                  y={80 + committeeIndex * 30}
                  width='40'
                  height='20'
                  fill={getColor(value)}
                  stroke='#fff'
                  rx='2'>
                  <title>{`${committee} - ${month}: ${value}%`}</title>
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

interface CommitteeTableProps {
  data: CommitteeData[];
}

const CommitteeTable: React.FC<CommitteeTableProps> = ({data}) => {
  return (
    <div className='w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Committee
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Target (₹ Lakhs)
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Achieved (₹ Lakhs)
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Achievement %
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Receipts
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item) => (
            <tr key={item.id} className='hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {item.committee}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {item.target.toLocaleString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {item.achieved.toLocaleString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {item.achievementPercentage}%
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {item.receipts.toLocaleString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    item.status === 'On Track'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Needs Attention'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Dashboard Component
const DistrictAnalysis: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    financialYear: '2023-2024',
    month: 'All',
    committee: 'All',
    timeRange: 'Current Year',
  });

  const [metrics, setMetrics] = useState<MetricData>({
    totalCollection: 0,
    achievementRate: 0,
    totalReceipt: 0,
    avgTransaction: 0,
  });

  const [lineData, setLineData] = useState<ChartDataItem[]>([]);
  const [barData, setBarData] = useState<ChartDataItem[]>([]);
  const [commodityData, setCommodityData] = useState<ChartDataItem[]>([]);
  const [achievementData, setAchievementData] = useState<ChartDataItem[]>([]);
  const [checkpostData, setCheckpostData] = useState<ChartDataItem[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapDataItem[]>([]);
  const [committeeData, setCommitteeData] = useState<CommitteeData[]>([]);

  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    setMetrics({
      totalCollection: 12500000,
      achievementRate: 78.5,
      totalReceipt: 3421,
      avgTransaction: 3653.42,
    });

    const committees = [
      'Market Committee',
      'Transport Committee',
      'Trade Committee',
      'Agriculture Committee',
      'Industrial Committee',
    ];
    const lineChartData = committees.map((committee) => ({
      name: committee,
      achievement: Math.floor(Math.random() * 500) + 100,
    }));
    setLineData(lineChartData);

    const months = [
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
    ];
    const barChartData = months.map((month) => ({
      name: month,
      currentYear: Math.floor(Math.random() * 300) + 50,
      previousYear: Math.floor(Math.random() * 250) + 40,
    }));
    setBarData(barChartData);

    const commodities = [
      {name: 'Agricultural Products', value: 35},
      {name: 'Industrial Goods', value: 25},
      {name: 'Construction Materials', value: 20},
      {name: 'Consumer Goods', value: 15},
      {name: 'Others', value: 5},
    ];
    setCommodityData(commodities);

    const achievementPieData = [
      {name: 'Achieved', value: 78.5},
      {name: 'Pending', value: 21.5},
    ];
    setAchievementData(achievementPieData);

    const checkposts = [
      {name: 'North Checkpost', value: 420},
      {name: 'South Checkpost', value: 380},
      {name: 'East Checkpost', value: 290},
      {name: 'West Checkpost', value: 160},
      {name: 'Central Checkpost', value: 120},
    ];
    setCheckpostData(checkposts);

    const heatmap: HeatmapDataItem[] = [];
    committees.forEach((committee) => {
      months.forEach((month) => {
        heatmap.push({
          id: `${committee}-${month}`,
          x: committee,
          y: month,
          value: Math.floor(Math.random() * 100) + 1,
        });
      });
    });
    setHeatmapData(heatmap);

    const committeeTableData = committees.map((committee, index) => ({
      id: index + 1,
      committee,
      target: Math.floor(Math.random() * 500) + 200,
      achieved: Math.floor(Math.random() * 500) + 100,
      achievementPercentage: Math.floor(Math.random() * 30) + 70,
      receipts: Math.floor(Math.random() * 1000) + 200,
      status: ['On Track', 'Needs Attention', 'Critical'][
        Math.floor(Math.random() * 3)
      ],
    }));
    setCommitteeData(committeeTableData);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getHeatmapColor = (value: number) => {
    if (value < 20) return '#ebedf0';
    if (value < 40) return '#9be9a8';
    if (value < 60) return '#40c463';
    if (value < 80) return '#30a14e';
    return '#216e39';
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 '>
      <div className='max-w-full mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
          District Revenue Analysis Dashboard
        </h1>

        {/* Filters & Controls */}
        <div className='bg-white rounded-lg shadow-md p-4 mb-6'>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>
            Filters & Controls
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <label
                htmlFor='financialYear'
                className='block text-sm font-medium text-gray-700'>
                Financial Year
              </label>
              <select
                id='financialYear'
                name='financialYear'
                value={filters.financialYear}
                onChange={handleFilterChange}
                className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border'>
                <option value='2022-2023'>2022-2023</option>
                <option value='2023-2024'>2023-2024</option>
                <option value='2024-2025'>2024-2025</option>
              </select>
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='month'
                className='block text-sm font-medium text-gray-700'>
                Month
              </label>
              <select
                id='month'
                name='month'
                value={filters.month}
                onChange={handleFilterChange}
                className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border'>
                <option value='All'>All Months</option>
                {[
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
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='committee'
                className='block text-sm font-medium text-gray-700'>
                Committee
              </label>
              <select
                id='committee'
                name='committee'
                value={filters.committee}
                onChange={handleFilterChange}
                className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border'>
                <option value='All'>All Committees</option>
                <option value='Market Committee'>Market Committee</option>
                <option value='Transport Committee'>Transport Committee</option>
                <option value='Trade Committee'>Trade Committee</option>
                <option value='Agriculture Committee'>
                  Agriculture Committee
                </option>
                <option value='Industrial Committee'>
                  Industrial Committee
                </option>
              </select>
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='timeRange'
                className='block text-sm font-medium text-gray-700'>
                Time Range
              </label>
              <select
                id='timeRange'
                name='timeRange'
                value={filters.timeRange}
                onChange={handleFilterChange}
                className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border'>
                <option value='Current Year'>Current Year</option>
                <option value='Last 3 Years'>Last 3 Years</option>
                <option value='Last 5 Years'>Last 5 Years</option>
                <option value='Custom Range'>Custom Range</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <MetricCard
            title='Total Collection'
            value={`₹${(metrics.totalCollection / 100000).toFixed(2)} L`}
            subtitle='Current FY'
            color='#3b82f6'
          />
          <MetricCard
            title='Achievement Rate'
            value={`${metrics.achievementRate}%`}
            subtitle='Against Target'
            color='#10b981'
          />
          <MetricCard
            title='Total Receipt'
            value={metrics.totalReceipt.toLocaleString()}
            subtitle='Transactions'
            color='#ef4444'
          />
          <MetricCard
            title='Avg Transaction'
            value={`₹${metrics.avgTransaction.toLocaleString()}`}
            subtitle='Per Receipt'
            color='#f59e0b'
          />
        </div>

        {/* Charts Row 1 - Line and Bar Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <ChartCard title='Committee Wise Achievement (in Lakhs)'>
            <LineChartComponent data={lineData} dataKey='achievement' />
          </ChartCard>
          <ChartCard title='Monthly Collection Trends (in Lakhs)'>
            <BarChartComponent data={barData} />
          </ChartCard>
        </div>

        {/* Charts Row 2 - Pie Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <ChartCard title='Top Commodities by Revenue'>
            <PieChartComponent data={commodityData} />
          </ChartCard>
          <ChartCard title='Target Achievement'>
            <PieChartComponent data={achievementData} />
          </ChartCard>
        </div>

        {/* Checkpost Performance */}
        <div className='mb-6'>
          <ChartCard
            title='Top Checkpost Performance (in Lakhs)'
            className='w-full'>
            <HorizontalBarChart data={checkpostData} />
          </ChartCard>
        </div>

        {/* Heatmap */}
        <div className='mb-6'>
          <ChartCard
            title='Committee-Month Performance Heatmap'
            className='w-full'>
            <HeatmapComponent data={heatmapData} getColor={getHeatmapColor} />
          </ChartCard>
        </div>

        {/* Committee Analysis Table */}
        <div className='mb-6'>
          <ChartCard title='Detailed Committee Analysis' className='w-full'>
            <CommitteeTable data={committeeData} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default DistrictAnalysis;
