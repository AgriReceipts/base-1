import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  visitors: number;
}

const AreaChartComponent: React.FC = () => {
  // Sample data - replace with your actual data
  const data: ChartData[] = [
    { date: 'Apr 13', visitors: 4000 },
    { date: 'Apr 28', visitors: 3000 },
    { date: 'May 13', visitors: 5000 },
    { date: 'May 28', visitors: 2780 },
    { date: 'Jun 12', visitors: 1890 },
    { date: 'Jun 30', visitors: 2390 },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Area Chart - Interactive</h3>
        <p className="text-sm text-gray-500">Showing total visitors for the last 3 months</p>
        <div className="mt-2">
          <button className="text-sm font-medium text-purple-600 px-2 py-1 mr-2">Last 3 months</button>
          {/* Add other time filters if needed */}
        </div>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666' }}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        2 cm of rain Today
      </div>
    </div>
  );
};

export default AreaChartComponent;