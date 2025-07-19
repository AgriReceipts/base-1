import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {formatMoney} from '@/lib/helpers';
import type {TooltipItem} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface LocationData {
  name: string;
  value: number;
}

interface CommitteePieChartProps {
  data: LocationData[];
}

export const CommitteePieChartComponent = ({data}: CommitteePieChartProps) => {
  // This function maps a data point name to a specific color.
  const getColor = (name: string): string => {
    switch (name) {
      case 'Office':
        return '#2563eb'; // Blue
      case 'Checkpost':
        return '#22c55e'; // Green
      case 'Other':
        return '#f59e42'; // Orange
      default:
        return '#8884d8'; // Default Purple
    }
  };

  // Transform the input data into the format required by Chart.js
  const chartData = {
    labels: data.map((item: LocationData) => item.name),
    datasets: [
      {
        label: 'Amount',
        // The actual values for the chart segments
        data: data.map((item) => item.value),
        // The background color for each chart segment
        backgroundColor: data.map((item) => getColor(item.name)),
        // The border color for each chart segment
        borderColor: data.map((item) => getColor(item.name)),
        borderWidth: 1,
      },
    ],
  };

  // Configure the chart options for responsiveness and tooltips
  const options = {
    // Makes the chart responsive to container size changes
    responsive: true,
    // Prevents the chart from maintaining a fixed aspect ratio, allowing it to fill the container height/width properly.
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const, // Position the legend at the top
      },
      tooltip: {
        // Callbacks allow you to customize the tooltip content
        callbacks: {
          /**
           * Customizes the label displayed in the tooltip.
           * @param {TooltipItem<'pie'>} tooltipItem - The tooltip item context.
           * @returns {string} - The custom tooltip label.
           */
          label: function (tooltipItem: TooltipItem<'pie'>): string {
            // The default label is in the format "DatasetLabel: value"
            // We retrieve the raw value from the dataset
            const value = tooltipItem.raw as number;
            // We format the value using the provided formatMoney function
            return `${tooltipItem.label}: ${formatMoney(value)}`;
          },
        },
      },
    },
  };

  // The wrapper div is crucial for responsiveness.
  // Chart.js will make the canvas fill this container.
  // Give it a specific height to ensure it's visible.
  return (
    <div className='relative w-full h-96'>
      <Pie data={chartData} options={options} />
    </div>
  );
};
