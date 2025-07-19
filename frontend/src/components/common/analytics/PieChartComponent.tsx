import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// --------------------------------------------------------------------------
// SECTION 1: DATA TYPES AND FORMATTING
// Your data structure and formatting function are defined here.
// --------------------------------------------------------------------------

export interface TopCommodity {
  commodityName: string;
  totalFeesPaid: number;
}

export type TopCommodityRes = TopCommodity[];

// Your custom function to format currency into Lakhs (L) and Crores (Cr)
export function formatMoney(val: number) {
  const absVal = Math.abs(val);
  const prefix = val < 0 ? '-' : '';
  if (absVal >= 10000000)
    return `${prefix}₹${(absVal / 10000000).toFixed(1)}Cr`;
  if (absVal >= 100000) return `${prefix}₹${(absVal / 100000).toFixed(1)}L`;
  if (absVal >= 1000) return `${prefix}₹${(absVal / 1000).toFixed(1)}K`;
  if (absVal >= 1) return `${prefix}₹${absVal.toFixed(0)}`;
  return `${prefix}₹${absVal}`;
}

// --------------------------------------------------------------------------
// SECTION 2: THE PIE CHART COMPONENT
// This is the new, self-contained React component.
// --------------------------------------------------------------------------

// Colors for the pie slices
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#A569BD',
  '#F5B041',
];

// Define the component's props interface
interface CommodityPieChartProps {
  data: TopCommodityRes;
}

const CommodityPieChart: React.FC<CommodityPieChartProps> = ({data}) => {
  // 1. Transform your data into the format Recharts expects (`name` and `value`)
  const chartData = data.map((item) => ({
    name: item.commodityName,
    value: item.totalFeesPaid,
  }));

  // Custom label inside the pie slices (shows percentage)
  const renderCustomLabel = (props: any) => {
    const {percent} = props;
    if (!percent || percent < 0.05) return null; // Hide labels for small slices
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div style={{width: '100%', height: 400}}>
      <ResponsiveContainer>
        <PieChart>
          {/* 2. The Tooltip that appears on hover */}
          <Tooltip
            formatter={(value: number) => [formatMoney(value), 'Revenue']}
          />

          {/* 3. The Legend on the side */}
          <Legend
            layout='vertical'
            verticalAlign='middle'
            align='right'
            iconSize={10}
            wrapperStyle={{fontSize: '14px'}}
            formatter={(value, entry: any) => {
              const itemValue = entry?.payload?.value || 0;
              return (
                <span style={{color: '#333'}}>
                  {value} ({formatMoney(itemValue)})
                </span>
              );
            }}
          />

          {/* 4. The Pie itself */}
          <Pie
            data={chartData}
            dataKey='value'
            nameKey='name'
            cx='40%' // Positioned to the left to make space for the legend
            cy='50%'
            outerRadius='80%'
            label={renderCustomLabel}
            labelLine={false}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommodityPieChart;
