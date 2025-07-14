import React, {useMemo} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 1. Import the plugin

// 2. Register all necessary components, including the new datalabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// --------------------------------------------------------------------------
// SECTION 1: DATA TYPES AND FORMATTING (Unchanged)
// --------------------------------------------------------------------------

export interface TopCommodity {
  commodityName: string;
  totalFeesPaid: number;
}

export type TopCommodityRes = TopCommodity[];

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
// SECTION 2: THE PIE CHART COMPONENT (Updated with Datalabels)
// --------------------------------------------------------------------------

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#A569BD',
  '#F5B041',
  '#CCCCCC',
];

interface CommodityPieChartProps {
  data: TopCommodityRes;
  topN?: number;
}

export const CommodityPieChart: React.FC<CommodityPieChartProps> = ({
  data,
  topN = 7,
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {labels: [], datasets: []};
    }
    const sortedData = [...data].sort(
      (a, b) => b.totalFeesPaid - a.totalFeesPaid
    );
    const labels: string[] = [];
    const values: number[] = [];
    const topItems = sortedData.slice(0, topN);
    topItems.forEach((item) => {
      labels.push(item.commodityName);
      values.push(item.totalFeesPaid);
    });
    if (sortedData.length > topN) {
      const otherItems = sortedData.slice(topN);
      const otherValue = otherItems.reduce(
        (sum, item) => sum + item.totalFeesPaid,
        0
      );
      labels.push('Other');
      values.push(otherValue);
    }
    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: values,
          backgroundColor: COLORS,
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
      ],
    };
  }, [data, topN]);

  // 3. Configure chart options, including the new datalabels plugin
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {padding: 20, font: {size: 14}},
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatMoney(value)}`;
          },
        },
      },
      // -- NEW CONFIGURATION FOR ON-CHART LABELS --
      datalabels: {
        // Use the formatter to return the formatted value
        formatter: (value: number, context: any) => {
          // To avoid clutter, you can hide labels for very small slices
          const total = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = value / total;
          if (percentage < 0.04) {
            // Hides labels for slices smaller than 4%
            return null;
          }
          return formatMoney(value);
        },
        color: '#fff', // The color of the label text
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        // Add a small stroke to make text more readable on busy backgrounds
        textStrokeColor: 'black',
        textStrokeWidth: 1,
      },
    },
  };

  return (
    <div style={{position: 'relative', width: '100%', height: '400px'}}>
      {data && data.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <div style={{textAlign: 'center', paddingTop: '150px'}}>
          No data available
        </div>
      )}
    </div>
  );
};

export default CommodityPieChart;
