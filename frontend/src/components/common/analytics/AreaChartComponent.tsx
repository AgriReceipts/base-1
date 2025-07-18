import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartData {
  date: string;
  mf: number;
}

interface BarChartComponentProps {
  title?: string;
  subtitle?: string;
  data?: ChartData[];
  year?: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  title = "Market Fee Collected (Month-wise)",
  subtitle = "",
  data,
  year,
}) => {
  // Array of vibrant colors for bars
  const colors = [
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#ec4899", // Pink
    "#84cc16", // Lime
    "#6366f1", // Indigo
    "#f97316", // Orange
    "#14b8a6", // Teal
    "#a855f7", // Purple variant
    "#0ea5e9", // Sky blue
  ];

  // Custom label component to show values on top of bars
  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    const valueInLakhs = (value / 100000).toFixed(1);
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
      >
        ₹{valueInLakhs}L
      </text>
    );
  };

  // Custom Y-axis tick formatter to show values in lakhs
  const formatYAxisTick = (value: number) => {
    return `₹${(value / 100000).toFixed(0)}L`;
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h3>
        <p className="text-base text-gray-500 mt-1">{subtitle}</p>
        <div className="mt-1">
          <button className="text-base font-medium text-purple-600 px-0 py-0 bg-transparent border-none outline-none focus:outline-none">
            {year}
          </button>
        </div>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={formatYAxisTick}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.3}
              stroke="#e5e7eb"
            />
            <Bar
              dataKey="mf"
              radius={[6, 6, 0, 0]}
              animationBegin={0}
              animationDuration={1000}
              label={<CustomLabel />}
            >
              {data?.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
