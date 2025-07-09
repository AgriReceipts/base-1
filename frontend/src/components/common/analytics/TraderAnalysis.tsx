import React, {useState, useMemo} from 'react';
import {useAuthStore} from '@/stores/authStore';
import {
  useTraderAnalytics,
  useTraderDetailedAnalytics,
} from '@/hooks/analytics/useTraderAnalytics';

// Helper function to format large numbers
function formatLakh(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

// Mock data for the top metric cards as requested
const mockMetrics = [
  {
    label: 'Total Trading Value',
    value: 12500000,
    color: 'bg-green-50',
    text: 'text-green-600',
    isMoney: true,
  },
  {
    label: 'Total Receipts Generated',
    value: 8420,
    color: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: 'Active Traders This Month',
    value: 152,
    color: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    label: 'Total Market Fees',
    value: 625000,
    color: 'bg-yellow-50',
    text: 'text-yellow-600',
    isMoney: true,
  },
];

export default function TraderAnalysis() {
  const [traderTimeFrame, setTraderTimeFrame] = useState<'month' | 'all'>(
    'month'
  );
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);

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

  const processedTraders = useMemo(() => {
    // Defensively select the data source
    const source =
      traderTimeFrame === 'month'
        ? traderData?.topTradersMonthly
        : traderData?.topTradersOverall;

    // Ensure source exists before mapping to prevent the error
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

  if (!committeeId) {
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

  // Error display
  if (traderError) {
    return (
      <div className='w-full p-4 md:p-6 flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='text-red-500 text-lg font-semibold'>
            Error Loading Data
          </div>
          <div className='text-sm text-gray-500 mt-2'>{traderError}</div>
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
      {/* Metrics Card Section (Now with Mock Data) */}
      <div className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'>
        {mockMetrics.map((m) => (
          <div
            key={m.label}
            className={`${m.color} rounded-lg p-6 flex flex-col items-center justify-center shadow-sm border`}>
            <div className={`text-3xl font-bold ${m.text}`}>
              {m.isMoney ? formatLakh(m.value) : m.value}
            </div>
            <div className='text-gray-600 text-sm mt-2 text-center'>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Trader Directory List */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-xl font-bold mb-1'>Trader Directory</h3>
            <div className='text-gray-500 text-sm'>Top traders by value</div>
          </div>
          {/* Toggle moved here */}
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                traderTimeFrame === 'month'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setTraderTimeFrame('month')}>
              This Month
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                traderTimeFrame === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setTraderTimeFrame('all')}>
              All Time
            </button>
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-3'>
          {traderLoading ? (
            <div className='flex items-center justify-center h-32'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
            </div>
          ) : processedTraders.length > 0 ? (
            processedTraders.map((t) => (
              <button
                key={t.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition bg-white hover:bg-blue-50 ${
                  selectedTraderId === t.id ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedTraderId(t.id)}>
                <div>
                  <div className='font-semibold text-lg text-left'>
                    {t.name}
                  </div>
                  <div className='text-gray-500 text-sm'>
                    {t.receipts} receipts
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-xl'>{formatLakh(t.value)}</div>
                  <div className='text-xs text-gray-500'>Total Value</div>
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
                        {formatLakh(displayAnalytics?.totalValue ?? 0)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Value
                      </div>
                    </div>
                    <div className='bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {formatLakh(displayAnalytics?.totalFeesPaid ?? 0)}
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
                                      {formatLakh(value)}
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
                                      <title>{`Value: ${formatLakh(
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
