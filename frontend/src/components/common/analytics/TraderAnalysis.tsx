import {useState, useMemo, useRef, useEffect} from 'react';
import {useAuthStore} from '@/stores/authStore';
import {
  useTraderAnalytics,
  useTraderDetailedAnalytics,
} from '@/hooks/analytics/useTraderAnalytics';
import {formatMoney} from '@/lib/helpers';

export default function TraderAnalysis() {
  const [traderTimeFrame, setTraderTimeFrame] = useState<'month' | 'all'>(
    'month'
  );
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const detailedSectionRef = useRef<HTMLDivElement>(null);

  const {committee} = useAuthStore();
  const committeeId = committee?.id;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const {
    data: traderData,
    loading: traderLoading,
    error: traderError,
  } = useTraderAnalytics({
    committeeId: committeeId || '',
    year: traderTimeFrame === 'month' ? currentYear : undefined,
    month: traderTimeFrame === 'month' ? currentMonth : undefined,
    limit: 5,
  });

  const {
    data: detailedTraderData,
    loading: detailedLoading,
    error: detailedError,
  } = useTraderDetailedAnalytics({
    committeeId: committeeId || '',
    traderId: selectedTraderId || '',
    year: traderTimeFrame === 'month' ? currentYear : undefined,
    month: traderTimeFrame === 'month' ? currentMonth : undefined,
  });

  useEffect(() => {
    if (selectedTraderId && detailedSectionRef.current) {
      setTimeout(() => {
        detailedSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [selectedTraderId, detailedTraderData]);

  const processedTraders = useMemo(() => {
    const source =
      traderTimeFrame === 'month'
        ? traderData?.topTradersMonthly
        : traderData?.topTradersOverall;

    if (!source) return [];

    return source.map((item) => ({
      id: item.trader.id,
      name: item.trader.name,
      receipts: item.totalReceipts,
      value: item.totalValue,
      fees: item.totalFeesPaid,
      quantity: item.totalQuantity,
    }));
  }, [traderData, traderTimeFrame]);

  const metrics = [
    {
      label: 'Unique Traders',
      value: traderData?.totalMonthlyTraders || 0,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      ),
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Total Receipts',
      value: traderData?.totalMonthlyReceipts || 0,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z'
          />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Market Fees',
      value: traderData?.totalMonthyFees || 0,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      color: 'bg-green-50 text-green-600',
      isMoney: true,
    },
    {
      label: 'Avg Fees/Trader',
      value: traderData?.avgMonthlyFees || 0,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z'
          />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
      isMoney: true,
    },
  ];

  if (!committeeId) {
    return (
      <div className='flex justify-center items-center h-64 text-center'>
        <div>
          <p className='text-gray-600 text-lg font-semibold'>Loading...</p>
          <p className='text-sm text-gray-500 mt-2'>
            Please login again if this persists.
          </p>
        </div>
      </div>
    );
  }

  if (traderError) {
    return (
      <div className='flex flex-col justify-center items-center h-64 text-center'>
        <p className='text-red-500 font-semibold text-lg'>Error Loading Data</p>
        <p className='text-sm text-gray-500 mt-2'>{traderError}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='w-full p-4 md:p-6 space-y-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Trader Analytics</h1>
          <p className='text-gray-600'>
            Monitor trader activity and performance
          </p>
        </div>
        <div className='mt-4 md:mt-0'>
          <div className='inline-flex bg-gray-100 rounded-lg p-1'>
            {['month', 'all'].map((timeframe) => (
              <button
                key={timeframe}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  traderTimeFrame === timeframe
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() =>
                  setTraderTimeFrame(timeframe as 'month' | 'all')
                }>
                {timeframe === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {metrics.map((metric, i) => (
          <div
            key={i}
            className={`${metric.color} rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition`}>
            <div className='flex items-center justify-between'>
              <p className='font-medium text-gray-500'>{metric.label}</p>
              <div className='p-2 rounded-lg bg-opacity-30'>{metric.icon}</div>
            </div>
            <p className='mt-3 text-2xl font-semibold'>
              {metric.isMoney ? formatMoney(metric.value) : metric.value}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {traderTimeFrame === 'month' ? 'This month' : 'All time'}
            </p>
          </div>
        ))}
      </div>

      {/* Trader List */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full'>
        <div className='p-6 border-b border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800'>Top Traders</h3>
          <p className='text-gray-500 mt-1'>
            {traderTimeFrame === 'month' ? 'This month' : 'All time'} ranked by
            trading value
          </p>
        </div>

        <div className='divide-y divide-gray-200'>
          {traderLoading ? (
            <div className='flex items-center justify-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : processedTraders.length > 0 ? (
            processedTraders.map((trader) => (
              <button
                key={trader.id}
                className={`w-full text-left p-5 hover:bg-gray-50 transition-colors ${
                  selectedTraderId === trader.id
                    ? 'bg-blue-50 ring-2 ring-blue-200'
                    : ''
                }`}
                onClick={() =>
                  setSelectedTraderId(
                    trader.id === selectedTraderId ? null : trader.id
                  )
                }>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex-shrink-0'>
                      <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium'>
                        {trader.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {trader.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {trader.receipts} receipts • {trader.quantity} kg
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold text-gray-900'>
                      {formatMoney(trader.value)}
                    </div>
                    <div className='text-xs text-gray-500'>Total value</div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className='flex items-center justify-center h-32 text-gray-500'>
              No trader data available for this period.
            </div>
          )}
        </div>
      </div>

      {/* Trader Detailed Analytics Card */}
      {selectedTraderId && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6'>
          {detailedLoading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : detailedError ? (
            <div className='text-center py-8'>
              <div className='text-red-500 font-semibold'>
                Error loading detailed analytics.
              </div>
              <div className='text-sm text-gray-500 mt-2'>{detailedError}</div>
            </div>
          ) : detailedTraderData ? (
            (() => {
              const displayAnalytics =
                traderTimeFrame === 'all'
                  ? detailedTraderData.overallAnalytics
                  : detailedTraderData.monthlyAnalytics?.[0];

              // Prepare data for the graph
              const monthlyChartData = [...detailedTraderData.monthlyAnalytics]
                .slice(0, 6)
                .reverse();
              const maxChartValue = Math.max(
                ...monthlyChartData.map((item) => item.totalValue),
                1
              ); // Avoid division by zero

              return (
                <>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-4'>
                    <div className='flex-grow'>
                      <div className='text-2xl font-bold flex items-center gap-2'>
                        <span>📈</span> {detailedTraderData.trader.name} -
                        Detailed Analytics
                      </div>
                      <div className='text-gray-500 text-sm mt-1'>
                        Comprehensive performance analysis
                      </div>
                    </div>
                    <button
                      className='text-xs text-blue-600 underline mt-4 md:mt-0'
                      onClick={() => setSelectedTraderId(null)}>
                      Close
                    </button>
                  </div>
                  {/* ... (Stat cards remain the same) ... */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {displayAnalytics?.totalReceipts ?? 0}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Receipts
                      </div>
                    </div>
                    <div className='bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {formatMoney(displayAnalytics?.totalValue ?? 0)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Value
                      </div>
                    </div>
                    <div className='bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {formatMoney(displayAnalytics?.totalFeesPaid ?? 0)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Fees
                      </div>
                    </div>
                    <div className='bg-purple-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {(displayAnalytics?.totalQuantity ?? 0).toFixed(1)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Quantity (kg)
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {traderTimeFrame === 'all' && (
                      <div>
                        <div className='font-semibold mb-2'>
                          Monthly Trading Pattern (Last 6 Months) - Total value
                          Traded
                        </div>
                        <div className='bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center'>
                          {monthlyChartData.length > 0 ? (
                            <svg
                              width='100%'
                              height='100%'
                              viewBox='0 0 350 200'>
                              {/* Y-Axis Labels and Gridlines */}
                              {[0, 0.5, 1].map((fraction) => {
                                const y = 180 - fraction * 160;
                                const value = maxChartValue * fraction;
                                return (
                                  <g key={fraction}>
                                    <text
                                      x='45'
                                      y={y + 4}
                                      fontSize='10'
                                      textAnchor='end'
                                      fill='#666'>
                                      {formatMoney(value)}
                                    </text>
                                    <line
                                      x1='50'
                                      y1={y}
                                      x2='350'
                                      y2={y}
                                      stroke='#e5e7eb'
                                      strokeWidth='1'
                                    />
                                  </g>
                                );
                              })}

                              {/* X-Axis Labels */}
                              {monthlyChartData.map((d, i) => (
                                <text
                                  key={`${d.year}-${d.month}-label`}
                                  x={
                                    50 +
                                    i *
                                      (300 / (monthlyChartData.length - 1 || 1))
                                  }
                                  y={195}
                                  fontSize='10'
                                  textAnchor='middle'
                                  fill='#666'>
                                  {d.month.toString().padStart(2, '0')}/
                                  {d.year.toString().slice(-2)}
                                </text>
                              ))}

                              {/* Line Chart */}
                              <polyline
                                fill='none'
                                stroke='#8884d8'
                                strokeWidth='2'
                                points={monthlyChartData
                                  .map((d, i) => {
                                    const x =
                                      50 +
                                      i *
                                        (300 /
                                          (monthlyChartData.length - 1 || 1));
                                    const y =
                                      180 -
                                      (d.totalValue / maxChartValue) * 160;
                                    return `${x},${y}`;
                                  })
                                  .join(' ')}
                              />

                              {/* Data Points with Tooltips */}
                              {monthlyChartData.map((d, i) => {
                                const x =
                                  50 +
                                  i *
                                    (300 / (monthlyChartData.length - 1 || 1));
                                const y =
                                  180 - (d.totalValue / maxChartValue) * 160;
                                return (
                                  <g key={`${d.year}-${d.month}-point`}>
                                    <circle cx={x} cy={y} r='4' fill='#8884d8'>
                                      {/* Simple tooltip on hover */}
                                      <title>{`Value: ${formatMoney(
                                        d.totalValue
                                      )}`}</title>
                                    </circle>
                                  </g>
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
                    )}
                    <div>
                      <div className='font-semibold mb-2'>
                        Performance Insights
                      </div>
                      <div className='space-y-2'>
                        {detailedTraderData.insights.length > 0 ? (
                          detailedTraderData.insights.map((insight, index) => (
                            <div
                              key={index}
                              className='text-sm text-gray-700 bg-gray-50 p-3 rounded-lg'>
                              {insight}
                            </div>
                          ))
                        ) : (
                          <div className='text-sm text-gray-500 bg-gray-50 p-3 rounded-lg'>
                            No specific insights for this trader.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          ) : (
            <div className='text-center py-8 text-gray-500'>
              No detailed analytics available for this trader.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
