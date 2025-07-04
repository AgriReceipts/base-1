import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

// Add onClickData prop
type PieChartComponentProps = {
  data: any[];
  onClickData?: (entry: any) => void;
};

const PieChartComponent = ({ data, onClickData }: PieChartComponentProps) => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          labelLine={false}
          outerRadius={80}
          fill='#8884d8'
          dataKey='value'
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          onClick={onClickData ? (_, index) => onClickData(data[index]) : undefined}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            value,
            `${name}: ${(props.payload.percent * 100).toFixed(2)}%`,
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
