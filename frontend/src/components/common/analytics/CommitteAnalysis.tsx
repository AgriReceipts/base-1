import {useState, useMemo} from 'react';
import AreaChartComponent from './AreaChartComponent';
import {useAuthStore} from '@/stores/authStore';
import {useCommitteeAnalytics} from '@/hooks/analytics/useCommitteeAnalytics';
import {
  useCommodityAnalytics,
  useCommodityDetailedAnalytics,
} from '@/hooks/analytics/useCommodityAnalytics';
import {formatMoney} from '@/lib/helpers';
import {CommitteePieChartComponent} from './CommittePieChart';

export default function CommitteeAnalysis() {
  const [locationTimeFrame, setLocationTimeFrame] = useState<'month' | 'all'>(
    'month'
  );
  const [commodityTimeFrame, setCommodityTimeFrame] = useState<'month' | 'all'>(
    'month'
  );
  const [selectedCommodityId, setSelectedCommodityId] = useState<string | null>(
    null
  );

  const {committee} = useAuthStore();
  const committeeId = committee?.id;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (!committeeId || !currentMonth || !currentYear) {
    return (
      <div className='w-full p-4 md:p-6 flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='text-lg font-semibold text-gray-600'>Loading...</div>
          <div className='text-sm text-gray-500 mt-2'>
            Please login again if this persists
          </div>
        </div>
      </div>
    );
  }

  const {
    data: committeeData,
    loading: committeeLoading,
    error: committeeError,
  } = useCommitteeAnalytics({
    committeeId,
    year: currentYear,
    month: currentMonth,
  });

  const {
    data: commodityData,
    loading: commodityLoading,
    error: commodityError,
  } = useCommodityAnalytics({
    committeeId,
    year: commodityTimeFrame === 'month' ? currentYear : undefined,
    month: commodityTimeFrame === 'month' ? currentMonth : undefined,
    limit: 5,
  });

  const {
    data: detailedCommodityData,
    loading: detailedLoading,
    error: detailedError,
  } = useCommodityDetailedAnalytics({
    committeeId,
    commodityId: selectedCommodityId || '',
    year: commodityTimeFrame === 'month' ? currentYear : undefined,
    month: commodityTimeFrame === 'month' ? currentMonth : undefined,
  });

  const processedCommodityData = useMemo(() => {
    if (!commodityData) return [];
    const dataSource =
      commodityTimeFrame === 'month'
        ? commodityData.topCommoditiesMonthly
        : commodityData.topCommoditiesOverall;
    return dataSource.map((item) => ({
      id: item.commodityId,
      name: item.commodity.name,
      category: item.commodity.category,
      receipts: item.totalReceipts,
      value: formatMoney(item.totalValue),
      feesPaid: formatMoney(item.totalFeesPaid),
      quantity: item.totalQuantity,
      avgPerReceipt: formatMoney(item.averageValuePerReceipt),
    }));
  }, [commodityData, commodityTimeFrame]);

  // Get current data for location pie chart based on timeframe
  const currentLocationData = useMemo(() => {
    if (!committeeData) return [];

    const dataSource =
      locationTimeFrame === 'month'
        ? committeeData.locationData
        : committeeData.allTimeLocationData;

    return dataSource || [];
  }, [committeeData, locationTimeFrame]);

  // Get total fees based on timeframe
  const totalFees = useMemo(() => {
    if (!committeeData) return 0;

    if (locationTimeFrame === 'month') {
      return committeeData.currentMonth?.marketFees || 0;
    } else {
      return committeeData.currentFinancialYear?.totalFees || 0;
    }
  }, [committeeData, locationTimeFrame]);

  if (committeeLoading && commodityLoading) {
    return (
      <div className='w-full p-4 md:p-6 flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <div className='text-lg font-semibold text-gray-600 mt-2'>
            Loading Analytics...
          </div>
        </div>
      </div>
    );
  }

  if (committeeError || commodityError) {
    return (
      <div className='w-full p-4 md:p-6 flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='text-red-500 text-lg font-semibold'>
            Error Loading Data
          </div>
          <div className='text-sm text-gray-500 mt-2'>
            {committeeError || commodityError}
          </div>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full p-4 md:p-6'>
      <div className='mb-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full'>
          <div className='h-64 md:h-80 w-full flex items-center justify-center'>
            {committeeData?.chartData ? (
              <AreaChartComponent
                data={committeeData.chartData}
                year={committeeData.currentFinancialYear.fyPeriod}
              />
            ) : (
              <div className='text-gray-500'>No chart data available</div>
            )}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>Market Fees by Location</h3>
            <div className='flex bg-gray-100 rounded-lg p-1'>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  locationTimeFrame === 'month'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setLocationTimeFrame('month')}>
                This Month
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  locationTimeFrame === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setLocationTimeFrame('all')}>
                Current Financial Year
              </button>
            </div>
          </div>

          <div className='mb-4'>
            <div className='text-sm text-gray-500'>Total Fees Collected</div>
            <div className='text-2xl font-bold text-gray-900'>
              {formatMoney(totalFees)}
            </div>
          </div>

          <div className='h-64 md:h-80'>
            {committeeLoading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              </div>
            ) : currentLocationData.length > 0 ? (
              <CommitteePieChartComponent data={currentLocationData} />
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                No location data available
              </div>
            )}
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-xl font-bold mb-1'>Commodity Directory</h3>
              <div className='text-gray-500 text-sm'>
                Click on a commodity to view detailed analytics
              </div>
            </div>
            <div className='flex bg-gray-100 rounded-lg p-1'>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  commodityTimeFrame === 'month'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCommodityTimeFrame('month')}>
                This Month
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  commodityTimeFrame === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCommodityTimeFrame('all')}>
                All Time
              </button>
            </div>
          </div>
          <div className='flex-1 flex flex-col gap-3'>
            {commodityLoading ? (
              <div className='flex items-center justify-center h-32'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
              </div>
            ) : processedCommodityData.length > 0 ? (
              processedCommodityData.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition bg-white hover:bg-blue-50 ${
                    selectedCommodityId === c.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedCommodityId(c.id)}>
                  <div>
                    <div className='font-semibold text-lg text-left'>
                      {c.name}
                    </div>
                    <div className='text-gray-500 text-sm'>
                      {c.receipts} receipts
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold text-xl'>{c.value}</div>
                    <div className='text-xs text-gray-500'>Total Value</div>
                  </div>
                </button>
              ))
            ) : (
              <div className='flex items-center justify-center h-32 text-gray-500'>
                No commodity data available
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCommodityId && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6'>
          {detailedLoading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : detailedError ? (
            <div className='text-center py-8'>
              <div className='text-red-500 font-semibold'>
                Error loading detailed analytics
              </div>
              <div className='text-sm text-gray-500 mt-2'>{detailedError}</div>
            </div>
          ) : detailedCommodityData ? (
            (() => {
              // **FIX**: Determine the correct data source based on the time frame toggle.
              const displayAnalytics =
                commodityTimeFrame === 'all'
                  ? detailedCommodityData.overallAnalytics
                  : detailedCommodityData.monthlyAnalytics?.[0];

              return (
                <>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-4'>
                    <div className='flex-grow'>
                      <div className='text-2xl font-bold flex items-center gap-2'>
                        <span>📈</span> {detailedCommodityData.commodity.name} -
                        Detailed Analytics
                      </div>
                      <div className='text-gray-500 text-sm mt-1'>
                        Comprehensive performance analysis
                      </div>
                    </div>
                    <div className='flex items-center gap-4 mt-4 md:mt-0'>
                      {/* **FIX**: This toggle now correctly controls the data for this section */}
                      <div className='flex bg-gray-100 rounded-lg p-1'>
                        <button
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            commodityTimeFrame === 'month'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                          onClick={() => setCommodityTimeFrame('month')}>
                          This Month
                        </button>
                        <button
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            commodityTimeFrame === 'all'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                          onClick={() => setCommodityTimeFrame('all')}>
                          All Time
                        </button>
                      </div>
                      <button
                        className='text-xs text-blue-600 underline'
                        onClick={() => setSelectedCommodityId(null)}>
                        Close
                      </button>
                    </div>
                  </div>

                  {/* **FIX**: Stat cards now use the 'displayAnalytics' variable for dynamic data */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {displayAnalytics?.totalReceipts || 0}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Receipts
                      </div>
                    </div>
                    <div className='bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {formatMoney(displayAnalytics?.totalValue || 0)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Value
                      </div>
                    </div>
                    <div className='bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {formatMoney(displayAnalytics?.totalFeesPaid || 0)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Fees
                      </div>
                    </div>
                    <div className='bg-purple-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {(displayAnalytics?.totalQuantity || 0).toFixed(1)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Quantity (kg)
                      </div>
                    </div>
                  </div>

                  {/* **FIX**: Conditionally render graph for 'All Time' and insights for both views */}
                  {commodityTimeFrame === 'all' ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <div className='font-semibold mb-2'>
                          Monthly Trading Pattern
                        </div>
                        <div className='bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center'>
                          {detailedCommodityData.monthlyAnalytics.length > 0 ? (
                            <svg
                              width='100%'
                              height='100%'
                              viewBox='0 0 300 200'>
                              <line
                                x1='30'
                                y1='10'
                                x2='30'
                                y2='180'
                                stroke='#ccc'
                                strokeWidth='1'
                              />
                              {[0, 0.25, 0.5, 0.75, 1].map((fraction, idx) => {
                                const max = Math.max(
                                  ...detailedCommodityData.monthlyAnalytics.map(
                                    (item) => item.totalValue
                                  )
                                );
                                const value = Math.round(max * fraction);
                                const y = 180 - fraction * 160;
                                return (
                                  <g key={idx}>
                                    <text
                                      x='5'
                                      y={y + 4}
                                      fontSize='10'
                                      fill='#666'>
                                      {formatMoney(value)}
                                    </text>
                                    <line
                                      x1='28'
                                      y1={y}
                                      x2='300'
                                      y2={y}
                                      stroke='#eee'
                                      strokeWidth='1'
                                    />
                                  </g>
                                );
                              })}
                              <line
                                x1='30'
                                y1='180'
                                x2='300'
                                y2='180'
                                stroke='#ccc'
                                strokeWidth='1'
                              />
                              {detailedCommodityData.monthlyAnalytics
                                .slice(0, 6)
                                .reverse()
                                .map((d, i) => (
                                  <text
                                    key={`${d.year}-${d.month}-label`}
                                    x={30 + i * 50}
                                    y={195}
                                    fontSize='10'
                                    textAnchor='middle'
                                    fill='#666'>
                                    {d.month.toString().padStart(2, '0')}/
                                    {d.year.toString().slice(-2)}
                                  </text>
                                ))}
                              <polyline
                                fill='none'
                                stroke='#8884d8'
                                strokeWidth='2'
                                points={detailedCommodityData.monthlyAnalytics
                                  .slice(0, 6)
                                  .reverse()
                                  .map((d, i) => {
                                    const max = Math.max(
                                      ...detailedCommodityData.monthlyAnalytics.map(
                                        (item) => item.totalValue
                                      )
                                    );
                                    const x = 30 + i * 50;
                                    const y = 180 - (d.totalValue / max) * 160;
                                    return `${x},${y}`;
                                  })
                                  .join(' ')}
                              />
                              {detailedCommodityData.monthlyAnalytics
                                .slice(0, 6)
                                .reverse()
                                .map((d, i) => {
                                  const max = Math.max(
                                    ...detailedCommodityData.monthlyAnalytics.map(
                                      (item) => item.totalValue
                                    )
                                  );
                                  const x = 30 + i * 50;
                                  const y = 180 - (d.totalValue / max) * 160;
                                  return (
                                    <circle
                                      key={`${d.year}-${d.month}`}
                                      cx={x}
                                      cy={y}
                                      r='4'
                                      fill='#8884d8'
                                    />
                                  );
                                })}
                            </svg>
                          ) : (
                            <div className='text-gray-500'>
                              No monthly data to plot
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className='font-semibold mb-2'>
                          Performance Insights
                        </div>
                        <div className='space-y-2 mb-4'>
                          {detailedCommodityData.insights.map(
                            (insight, index) => (
                              <div
                                key={index}
                                className='text-sm text-gray-700 bg-gray-50 p-2 rounded'>
                                {insight}
                              </div>
                            )
                          )}
                        </div>
                        <div className='text-sm text-gray-700 mb-1'>
                          <b>Growth Trend:</b>{' '}
                          {detailedCommodityData.trends.trend
                            .charAt(0)
                            .toUpperCase() +
                            detailedCommodityData.trends.trend.slice(1)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className='font-semibold mb-2'>
                        Performance Insights
                      </div>
                      <div className='space-y-2'>
                        {detailedCommodityData.insights.length > 0 ? (
                          detailedCommodityData.insights.map(
                            (insight, index) => (
                              <div
                                key={index}
                                className='text-sm text-gray-700 bg-gray-50 p-3 rounded-lg'>
                                {insight}
                              </div>
                            )
                          )
                        ) : (
                          <div className='text-sm text-gray-500 bg-gray-50 p-3 rounded-lg'>
                            No specific insights for this month.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            <div className='text-center py-8 text-gray-500'>
              No detailed analytics available for this commodity.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
