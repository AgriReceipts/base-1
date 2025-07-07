import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  date: string;
  mf: number;
}

interface AreaChartComponentProps {
  title?: string;
  subtitle?: string;
  data?: ChartData[];
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  title = 'Market Fee Collected (Month-wise)',
  subtitle = '',
  data,
}) => {
  return (
    <div className='w-full'>
      <div className='mb-2'>
        <h3 className='text-xl font-bold text-gray-900 leading-tight'>
          {title}
        </h3>
        <p className='text-base text-gray-500 mt-1'>{subtitle}</p>
        <div className='mt-1'>
          <button className='text-base font-medium text-purple-600 px-0 py-0 bg-transparent border-none outline-none focus:outline-none'>
            Last {data?.length} months
          </button>
        </div>
      </div>
      <div className='w-full h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={data}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <defs>
              <linearGradient id='colorVisitors' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='date'
              axisLine={false}
              tickLine={false}
              tick={{fill: '#666'}}
            />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666'}} />
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              opacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type='monotone'
              dataKey='mf'
              stroke='#8884d8'
              fillOpacity={1}
              fill='url(#colorVisitors)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartComponent;
