import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  useTraderAnalytics,
  useTraderDetailedAnalytics,
} from '@/hooks/analytics/useTraderAnalytics';
import { formatMoney } from '@/lib/helpers';

export default function TraderAnalysis() {
  const [traderTimeFrame, setTraderTimeFrame] = useState<'month' | 'all'>('month');
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const detailedSectionRef = useRef<HTMLDivElement>(null);

  const { committee } = useAuthStore();
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
        detailedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Total Receipts',
      value: traderData?.totalMonthlyReceipts || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Market Fees',
      value: traderData?.totalMonthyFees || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-600',
      isMoney: true,
    },
    {
      label: 'Avg Fees/Trader',
      value: traderData?.avgMonthlyFees || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
      isMoney: true,
    },
  ];

  if (!committeeId) {
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <div>
          <p className="text-gray-600 text-lg font-semibold">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Please login again if this persists.</p>
        </div>
      </div>
    );
  }

  if (traderError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <p className="text-red-500 font-semibold text-lg">Error Loading Data</p>
        <p className="text-sm text-gray-500 mt-2">{traderError.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trader Analytics</h1>
          <p className="text-gray-600">Monitor trader activity and performance</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {['month', 'all'].map((timeframe) => (
              <button
                key={timeframe}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  traderTimeFrame === timeframe
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setTraderTimeFrame(timeframe as 'month' | 'all')}
              >
                {timeframe === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className={`${metric.color} rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-500">{metric.label}</p>
              <div className="p-2 rounded-lg bg-opacity-30">{metric.icon}</div>
            </div>
            <p className="mt-3 text-2xl font-semibold">
              {metric.isMoney ? formatMoney(metric.value) : metric.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {traderTimeFrame === 'month' ? 'This month' : 'All time'}
            </p>
          </div>
        ))}
      </div>

      {/* Trader List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Top Traders</h3>
          <p className="text-gray-500 mt-1">
            {traderTimeFrame === 'month' ? 'This month' : 'All time'} ranked by trading value
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {traderLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : processedTraders.length > 0 ? (
            processedTraders.map((trader) => (
              <button
                key={trader.id}
                className={`w-full text-left p-5 hover:bg-gray-50 transition-colors ${
                  selectedTraderId === trader.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                }`}
                onClick={() => setSelectedTraderId(trader.id === selectedTraderId ? null : trader.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {trader.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{trader.name}</div>
                      <div className="text-sm text-gray-500">
                        {trader.receipts} receipts • {trader.quantity} kg
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatMoney(trader.value)}</div>
                    <div className="text-xs text-gray-500">Total value</div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No trader data available for this period.
            </div>
          )}
        </div>
      </div>

      {/* Trader Details Section */}
      {selectedTraderId && (
        <div 
          ref={detailedSectionRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full transition-all duration-300"
        >
          {detailedLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : detailedError ? (
            <div className="p-6 text-red-500">
              Error loading trader details: {detailedError.message}
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Trader Details</h3>
                    <p className="text-gray-600 mt-1">
                      Detailed performance metrics for {processedTraders.find(t => t.id === selectedTraderId)?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTraderId(null)}
                    className="mt-4 md:mt-0 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
                  >
                    Close Details
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm font-medium text-blue-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatMoney(detailedTraderData?.totalValue || 0)}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">All transactions</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-sm font-medium text-green-600">Total Fees</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatMoney(detailedTraderData?.totalFees || 0)}
                    </p>
                    <p className="text-xs text-green-500 mt-1">Paid to committee</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm font-medium text-purple-600">Total Receipts</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {detailedTraderData?.totalReceipts || 0}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">Completed trades</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-medium text-amber-600">Avg. Trade Value</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatMoney(detailedTraderData?.averageValue || 0)}
                    </p>
                    <p className="text-xs text-amber-500 mt-1">Per transaction</p>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h4>
                  <div className="space-y-3">
                    {Array.isArray(detailedTraderData?.insights) && detailedTraderData.insights.length > 0 ? (
                      detailedTraderData.insights.map((insight: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white transition"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">{insight}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        No specific insights available for this trader.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity (example) */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detailedTraderData?.recentTransactions?.length > 0 ? (
                          detailedTraderData.recentTransactions.map((tx: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMoney(tx.value)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMoney(tx.fees)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                              No recent transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}