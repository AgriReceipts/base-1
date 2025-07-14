import useDistrictAnalytics from '@/hooks/useDistrictAnalytics';
import React, {useState} from 'react';
import {ChartCard, MetricCard} from './DistrictAnalytics/ChartCard';
import {BarChartComponent} from './DistrictAnalytics/BarChart';
import {CommitteeTable} from './DistrictAnalytics/CommitteeTable';
import {HeatmapComponent} from './DistrictAnalytics/Heatmap';
import {HorizontalBarChart} from './DistrictAnalytics/HorizontalChart';
import {CommodityPieChart} from './DistrictAnalytics/PieChart';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';
import {CommitteeHorizontalBars} from './DistrictAnalytics/HorizontalBar';
import {formatMoney} from '@/lib/helpers';

interface FilterState {
  financialYear: string;
  month: string;
}

const getFinancialYearOptions = (count = 5): string[] => {
  const currentYear = new Date().getFullYear();
  const options: string[] = [];

  for (let i = 0; i < count; i++) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    options.push(`${startYear}-${endYear}`);
  }

  return options.reverse(); // Show recent years first
};

const months = [
  {label: 'All', value: 'All'},
  {label: 'April', value: '4'},
  {label: 'May', value: '5'},
  {label: 'June', value: '6'},
  {label: 'July', value: '7'},
  {label: 'August', value: '8'},
  {label: 'September', value: '9'},
  {label: 'October', value: '10'},
  {label: 'November', value: '11'},
  {label: 'December', value: '12'},
  {label: 'January', value: '1'},
  {label: 'February', value: '2'},
  {label: 'March', value: '3'},
];

const DistrictAnalysis: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    financialYear: '2025-2026',
    month: 'All',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const financialYearStart = parseInt(filters.financialYear.split('-')[0]);

  // Create hook parameters object conditionally
  const hookParams: {
    financialYearStart: string;
    month?: string;
  } = {
    financialYearStart: financialYearStart.toString(),
  };

  // Only add month if it's not "All"
  if (filters.month !== 'All') {
    hookParams.month = filters.month;
  }

  const {
    committeeWiseAchievement,
    districtMetadata,
    monthlyTrend,
    topCommodities,
    checkPosts,
    heatMapData,
    loading,
    error,
  } = useDistrictAnalytics(hookParams);

  const getHeatmapColor = (value: number): string => {
    // Ensure value is between 0 and 100
    const normalizedValue = Math.max(0, Math.min(100, value));

    if (normalizedValue === 0) {
      return '#f8f9fa'; // Light gray for 0%
    } else if (normalizedValue <= 20) {
      return '#e3f2fd'; // Light blue for 20%
    } else if (normalizedValue <= 40) {
      return '#fff3cd'; // Light yellow for 40%
    } else if (normalizedValue <= 60) {
      return '#ffd54f'; // Medium yellow for 60%
    } else if (normalizedValue <= 80) {
      return '#aed581'; // Light green for 80%
    } else {
      return '#4caf50'; // Green for 100%
    }
  };

  // Helper function to get month name
  const getMonthName = (monthValue: string): string => {
    const month = months.find((m) => m.value === monthValue);
    return month ? month.label : 'All';
  };

  // Error component for individual chart failures
  const ChartError: React.FC<{title: string; error?: string}> = ({
    title,
    error,
  }) => (
    <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
      <div className='text-red-400 mb-2'>
        <svg
          className='mx-auto h-12 w-12'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </div>
      <h3 className='text-lg font-medium text-red-800 mb-1'>
        {title} - Data Unavailable
      </h3>
      <p className='text-sm text-red-600'>
        {error || 'Unable to load chart data'}
      </p>
    </div>
  );

  // Loading component for individual charts
  const ChartLoading: React.FC<{title: string}> = ({title}) => (
    <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3'></div>
      <p className='text-gray-600'>Loading {title}...</p>
    </div>
  );

  const financialYearOptions = getFinancialYearOptions(5);

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 w-full'>
      <div className='max-w-full mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
          District Revenue Analysis Dashboard
        </h1>

        {/* Enhanced Filters */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 sticky top-0 z-10'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            {/* Current Selection Display */}
            <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-indigo-500 rounded-full'></div>
                <span className='text-sm font-medium text-gray-600'>
                  Currently Viewing:
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800'>
                  FY {filters.financialYear}
                </span>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  {getMonthName(filters.month)}
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-col'>
                <label
                  htmlFor='financialYear'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Financial Year
                </label>
                <select
                  id='financialYear'
                  name='financialYear'
                  value={filters.financialYear}
                  onChange={handleFilterChange}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white'>
                  {financialYearOptions.map((fy) => (
                    <option key={fy} value={fy}>
                      {fy}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col'>
                <label
                  htmlFor='month'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Month
                </label>
                <select
                  id='month'
                  name='month'
                  value={filters.month}
                  onChange={handleFilterChange}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white'>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Global Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>
                  Data Loading Error
                </h3>
                <p className='mt-1 text-sm text-red-700'>{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Metrics - Show loading state or error gracefully */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {loading ? (
            // Loading state for metrics
            Array.from({length: 4}).map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-8 bg-gray-200 rounded w-1/2 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              </div>
            ))
          ) : districtMetadata ? (
            <>
              <MetricCard
                title='Total Collection'
                value={formatMoney(districtMetadata.totalMarketFees)}
                subtitle='Current FY'
                color='#3b82f6'
              />
              <MetricCard
                title='Achievement Rate'
                value={`${districtMetadata.achievementPercent ?? 0}%`}
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
                value={formatMoney(districtMetadata.avgTransaction)}
                subtitle='Per Receipt'
                color='#f59e0b'
              />
            </>
          ) : (
            // Error state for metrics
            <div className='col-span-full'>
              <ChartError
                title='Metrics'
                error='Unable to load district metadata'
              />
            </div>
          )}
        </div>

        {/* Charts with individual error handling */}
        <div className='flex flex-col w-full gap-6 mb-6'>
          <ChartCard title='Monthly Collection Trends'>
            {loading ? (
              <ChartLoading title='Monthly Trends' />
            ) : monthlyTrend ? (
              <BarChartComponent data={monthlyTrend} />
            ) : (
              <ChartError title='Monthly Trends' />
            )}
          </ChartCard>

          <ChartCard>
            {loading ? (
              <ChartLoading title='Committee Analysis' />
            ) : committeeWiseAchievement ? (
              <CommitteeHorizontalBars data={committeeWiseAchievement} />
            ) : (
              <ChartError title='Committee Analysis' />
            )}
          </ChartCard>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <ChartCard title='Top Commodities by Revenue'>
            {loading ? (
              <ChartLoading title='Commodities' />
            ) : topCommodities ? (
              <CommodityPieChart data={topCommodities} />
            ) : (
              <ChartError title='Commodities' />
            )}
          </ChartCard>

          <ChartCard title='Target Achievement'>
            {loading ? (
              <ChartLoading title='Target Achievement' />
            ) : districtMetadata ? (
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
                  <Cell fill='#10b981' />
                  <Cell fill='#f97316' />
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
            ) : (
              <ChartError title='Target Achievement' />
            )}
          </ChartCard>
        </div>

        <div className='mb-6'>
          <ChartCard
            title='Top Checkpost Performance (in Lakhs)'
            className='w-full'>
            {loading ? (
              <ChartLoading title='Checkpost Performance' />
            ) : checkPosts ? (
              <HorizontalBarChart data={checkPosts} />
            ) : (
              <ChartError title='Checkpost Performance' />
            )}
          </ChartCard>
        </div>

        <div className='mb-6'>
          <ChartCard
            title='Committee-Month Performance Heatmap'
            className='w-full overflow-x-auto'>
            {loading ? (
              <ChartLoading title='Heatmap' />
            ) : heatMapData ? (
              <HeatmapComponent data={heatMapData} getColor={getHeatmapColor} />
            ) : (
              <ChartError title='Heatmap' />
            )}
          </ChartCard>
        </div>

        <div className='mb-6'>
          <ChartCard title='Detailed Committee Analysis' className='w-full'>
            {loading ? (
              <ChartLoading title='Committee Table' />
            ) : committeeWiseAchievement ? (
              <CommitteeTable data={committeeWiseAchievement} />
            ) : (
              <ChartError title='Committee Table' />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default DistrictAnalysis;
