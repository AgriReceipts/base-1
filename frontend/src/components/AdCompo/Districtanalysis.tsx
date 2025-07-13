import useDistrictAnalytics from '@/hooks/useDistrictAnalytics';
import React, {useState} from 'react';
import {ChartCard, MetricCard} from './DistrictAnalytics/ChartCard';
import {BarChartComponent} from './DistrictAnalytics/BarChart';
import {CommitteeTable} from './DistrictAnalytics/CommitteeTable';
import {HeatmapComponent} from './DistrictAnalytics/Heatmap';
import {HorizontalBarChart} from './DistrictAnalytics/HorizontalChart';
import {PieChartComponent} from './DistrictAnalytics/PieChart';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';

import {CommitteeHorizontalBars} from './DistrictAnalytics/HorizontalBar';

// Define all interfaces at the top
interface FilterState {
  financialYear: string;
  month: string;
}

// Main Dashboard Component
const DistrictAnalysis: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    financialYear: '2023-2024',
    month: 'All',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    committeeWiseAchievement,
    districtMetadata,
    monthlyTrend,
    topCommodities,
    checkPosts,
    heatMapData,
    loading,
    error,
  } = useDistrictAnalytics({
    financialYearStart: '2025',
  });

  const getHeatmapColor = (value: number): string => {
    if (value >= 90) return '#22c55e'; // Green
    if (value >= 80) return '#84cc16'; // Light green
    if (value >= 70) return '#eab308'; // Yellow
    if (value >= 60) return '#f97316'; // Orange
    if (value >= 50) return '#ef4444'; // Red
    return '#94a3b8'; // Gray for low values
  };
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Error loading analytics data</p>
          <p className='text-gray-500'>{error.message}</p>
        </div>
      </div>
    );
  }

  // Add null check for districtMetadata - this is the key fix
  if (!districtMetadata) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>No data available</p>
        </div>
      </div>
    );
  }

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
          </div>
        </div>

        {/* Metric Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <MetricCard
            title='Total Collection'
            value={`₹${(districtMetadata.totalMarketFees / 100000).toFixed(
              2
            )} L`}
            subtitle='Current FY'
            color='#3b82f6'
          />
          <MetricCard
            title='Achievement Rate'
            value={`${districtMetadata.achievementPercent}%`}
            subtitle='Against Target'
            color='#10b981'
          />
          <MetricCard
            title='Total Receipt'
            value={districtMetadata.totalReceipts.toLocaleString()}
            subtitle='Transactions'
            color='#ef4444'
          />
          <MetricCard
            title='Avg Transaction'
            value={`₹${districtMetadata.avgTransaction.toLocaleString()}`}
            subtitle='Per Receipt'
            color='#f59e0b'
          />
        </div>

        {/* Charts Row 1 - Line and Bar Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <ChartCard title='Committee Wise Achievement (in Lakhs)'>
            <CommitteeHorizontalBars data={committeeWiseAchievement} />
          </ChartCard>
          <ChartCard title='Monthly Collection Trends (in Lakhs)'>
            {monthlyTrend && <BarChartComponent data={monthlyTrend} />}
          </ChartCard>
        </div>

        {/* Charts Row 2 - Pie Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <ChartCard title='Top Commodities by Revenue'>
            <PieChartComponent data={topCommodities} />
          </ChartCard>
          <ChartCard title='Target Achievement'>
            <PieChart width={400} height={300}>
              <Pie
                data={[
                  {
                    name: 'Achieved',
                    value: districtMetadata.totalMarketFees,
                  },
                  {
                    name: 'Pending',
                    value: Math.max(
                      (districtMetadata.totalTarget ?? 0) -
                        districtMetadata.totalMarketFees,
                      0
                    ),
                  },
                ]}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label={({name, percent}) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }>
                <Cell fill='#10b981' /> {/* Green for Achieved */}
                <Cell fill='#f97316' /> {/* Orange for Pending */}
              </Pie>
              <Tooltip
                content={({active, payload}) => {
                  if (active && payload && payload.length) {
                    const {name, value} = payload[0];
                    const formatted = `₹${(value / 100000).toFixed(2)} L`;
                    return (
                      <div className='bg-white border border-gray-200 rounded p-2 shadow text-sm text-gray-700'>
                        <p>
                          {name === 'Achieved'
                            ? `Market Fees Collected: ${formatted}`
                            : `Remaining Target: ${formatted}`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartCard>
        </div>

        {/* Checkpost Performance */}
        <div className='mb-6'>
          <ChartCard
            title='Top Checkpost Performance (in Lakhs)'
            className='w-full'>
            <HorizontalBarChart data={checkPosts} />
          </ChartCard>
        </div>

        {/* Heatmap */}
        <div className='mb-6'>
          <ChartCard
            title='Committee-Month Performance Heatmap'
            className='w-full'>
            <HeatmapComponent data={heatMapData} getColor={getHeatmapColor} />
          </ChartCard>
        </div>

        {/* Committee Analysis Table */}
        <div className='mb-6'>
          <ChartCard title='Detailed Committee Analysis' className='w-full'>
            <CommitteeTable data={committeeWiseAchievement} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default DistrictAnalysis;
