import React, {useState, useMemo} from 'react';
import PieChartComponent from './PieChartComponent';
import AreaChartComponent from './AreaChartComponent';
import {useAuthStore} from '@/stores/authStore';
import {useCommitteeAnalytics} from '@/hooks/analytics/useCommitteeAnalytics';
import {
  useCommodityAnalytics,
  useCommodityDetailedAnalytics,
} from '@/hooks/analytics/useCommodityAnalytics';

function formatLakh(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

// Enhanced Target Performance Component
const TargetPerformanceCard = ({currentData, timeFrame}: any) => {
  // Mock target data - in real implementation, this would come from API
  const mockTargetData = {
    month: {
      target: 450000,
      achieved: currentData?.marketFees || 0,
      previousMonth: 380000,
    },
    year: {
      target: 5400000,
      achieved: (currentData?.marketFees || 0) * 12, // Extrapolated
      previousYear: 4800000,
    }
  };

  const targetInfo = timeFrame === 'month' ? mockTargetData.month : mockTargetData.year;
  const achievementPercentage = (targetInfo.achieved / targetInfo.target) * 100;
  const variance = targetInfo.achieved - targetInfo.target;
  const isPositive = variance >= 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-900">
          🎯 Target Performance ({timeFrame === 'month' ? 'Monthly' : 'Annual'})
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? '✅' : '⚠️'} {achievementPercentage.toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Target</div>
          <div className="text-xl font-bold text-blue-600">{formatLakh(targetInfo.target)}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Achieved</div>
          <div className="text-xl font-bold text-green-600">{formatLakh(targetInfo.achieved)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{achievementPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              achievementPercentage >= 100 ? 'bg-green-500' : 
              achievementPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{width: `${Math.min(achievementPercentage, 100)}%`}}
          ></div>
        </div>
      </div>

      {/* Variance Analysis */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Variance</div>
            <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{formatLakh(variance)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">vs Previous {timeFrame === 'month' ? 'Month' : 'Year'}</div>
            <div className="text-lg font-bold text-blue-600">
              +{formatLakh(targetInfo.achieved - (timeFrame === 'month' ? targetInfo.previousMonth : targetInfo.previousYear))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Market Fee Trend Analysis Component
const MarketFeeTrendAnalysis = ({chartData}: any) => {
  const trendData = useMemo(() => {
    if (!chartData || chartData.length < 2) return null;
    
    const recent = chartData.slice(-6);
    const growth = recent.map((item: any, index: number) => {
      if (index === 0) return {...item, growth: 0};
      const prevValue = recent[index - 1].mf;
      const currentValue = item.mf;
      const growthRate = prevValue > 0 ? ((currentValue - prevValue) / prevValue) * 100 : 0;
      return {...item, growth: growthRate};
    });

    const avgGrowth = growth.reduce((sum: number, item: any) => sum + item.growth, 0) / growth.length;
    const trend = avgGrowth > 5 ? 'Excellent' : avgGrowth > 0 ? 'Growing' : avgGrowth > -5 ? 'Stable' : 'Declining';
    
    return {
      data: growth,
      avgGrowth,
      trend,
      maxValue: Math.max(...recent.map((item: any) => item.mf)),
      minValue: Math.min(...recent.map((item: any) => item.mf)),
    };
  }, [chartData]);

  if (!trendData) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
      <h3 className="text-lg font-bold text-purple-900 mb-4">📈 Market Fee Trend Analysis</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">Trend Status</div>
          <div className={`text-lg font-bold ${
            trendData.trend === 'Excellent' ? 'text-green-600' :
            trendData.trend === 'Growing' ? 'text-blue-600' :
            trendData.trend === 'Stable' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {trendData.trend}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">Avg Growth</div>
          <div className={`text-lg font-bold ${trendData.avgGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trendData.avgGrowth >= 0 ? '+' : ''}{trendData.avgGrowth.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">Peak Collection</div>
          <div className="text-lg font-bold text-purple-600">
            {formatLakh(trendData.maxValue)}
          </div>
        </div>
      </div>

      {/* Mini Trend Chart */}
      <div className="bg-white rounded-lg p-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">6-Month Growth Pattern</div>
        <div className="flex items-end justify-between h-16">
          {trendData.data.map((item: any, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-6 rounded-t transition-all duration-500 ${
                  item.growth > 0 ? 'bg-green-400' : item.growth < 0 ? 'bg-red-400' : 'bg-gray-400'
                }`}
                style={{
                  height: `${Math.max(Math.abs(item.growth) * 2, 4)}px`,
                  maxHeight: '48px'
                }}
              ></div>
              <div className="text-xs text-gray-500 mt-1">
                {item.date.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Performance Insights Component
const PerformanceInsights = ({currentData, timeFrame}: any) => {
  const insights = useMemo(() => {
    const marketFees = currentData?.marketFees || 0;
    const totalFees = currentData?.totalFeesPaid || 0;
    const receipts = currentData?.totalReceipts || 0;
    const avgPerReceipt = receipts > 0 ? marketFees / receipts : 0;

    const insights = [];

    if (marketFees > 400000) {
      insights.push({
        type: 'success',
        icon: '🎉',
        title: 'Excellent Performance',
        message: `Market fees collection of ${formatLakh(marketFees)} exceeds expectations!`
      });
    } else if (marketFees > 200000) {
      insights.push({
        type: 'good',
        icon: '👍',
        title: 'Good Progress',
        message: `Steady collection of ${formatLakh(marketFees)} shows consistent performance.`
      });
    } else {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Needs Attention',
        message: `Collection of ${formatLakh(marketFees)} is below optimal levels.`
      });
    }

    if (avgPerReceipt > 1000) {
      insights.push({
        type: 'info',
        icon: '💰',
        title: 'High Value Transactions',
        message: `Average ${formatLakh(avgPerReceipt)} per receipt indicates quality trades.`
      });
    }

    const marketFeeRatio = totalFees > 0 ? (marketFees / totalFees) * 100 : 0;
    if (marketFeeRatio > 80) {
      insights.push({
        type: 'success',
        icon: '📊',
        title: 'Optimal Fee Structure',
        message: `${marketFeeRatio.toFixed(1)}% market fees shows healthy trading activity.`
      });
    }

    return insights;
  }, [currentData, timeFrame]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
      <h3 className="text-lg font-bold text-green-900 mb-4">🧠 AI Performance Insights</h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className={`bg-white rounded-lg p-4 border-l-4 ${
            insight.type === 'success' ? 'border-green-500' :
            insight.type === 'good' ? 'border-blue-500' :
            insight.type === 'warning' ? 'border-yellow-500' : 'border-purple-500'
          }`}>
            <div className="flex items-start">
              <span className="text-xl mr-3">{insight.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{insight.title}</div>
                <div className="text-sm text-gray-600 mt-1">{insight.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'targets' | 'trends'>('overview');

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

  // Replace API hooks with static mock data
  // const {
  //   data: committeeData,
  //   loading: committeeLoading,
  //   error: committeeError,
  // } = useCommitteeAnalytics({
  //   committeeId,
  //   year: locationTimeFrame === 'month' ? currentYear : currentYear,
  //   month: locationTimeFrame === 'month' ? currentMonth : currentMonth,
  // });
  const committeeData = {
    chartData: [
      { date: '2024-01', mf: 100000, officeFees: 40000, checkpostFees: 30000, otherFees: 30000 },
      { date: '2024-02', mf: 120000, officeFees: 50000, checkpostFees: 40000, otherFees: 30000 },
      { date: '2024-03', mf: 90000, officeFees: 30000, checkpostFees: 30000, otherFees: 30000 },
      { date: '2024-04', mf: 150000, officeFees: 60000, checkpostFees: 50000, otherFees: 40000 },
      { date: '2024-05', mf: 130000, officeFees: 50000, checkpostFees: 50000, otherFees: 30000 },
      { date: '2024-06', mf: 170000, officeFees: 70000, checkpostFees: 60000, otherFees: 40000 },
    ],
    locationData: [
      { name: 'Office', value: 270000 },
      { name: 'Checkpost', value: 200000 },
      { name: 'Other', value: 130000 },
    ],
    currentMonth: {
      marketFees: 170000,
      totalFeesPaid: 200000,
      totalReceipts: 120,
    },
  };
  const committeeLoading = false;
  const committeeError = null;

  // const {
  //   data: commodityData,
  //   loading: commodityLoading,
  //   error: commodityError,
  // } = useCommodityAnalytics({
  //   committeeId,
  //   year: commodityTimeFrame === 'month' ? currentYear : undefined,
  //   month: commodityTimeFrame === 'month' ? currentMonth : undefined,
  //   limit: 5,
  // });
  const commodityData = {
    topCommoditiesMonthly: [
      { commodityId: '1', commodity: { id: '1', name: 'Wheat', category: 'Grain' }, totalReceipts: 40, totalValue: 80000, totalFeesPaid: 10000, totalQuantity: 2000, averageValuePerReceipt: 2000 },
      { commodityId: '2', commodity: { id: '2', name: 'Rice', category: 'Grain' }, totalReceipts: 30, totalValue: 60000, totalFeesPaid: 8000, totalQuantity: 1500, averageValuePerReceipt: 2000 },
      { commodityId: '3', commodity: { id: '3', name: 'Maize', category: 'Grain' }, totalReceipts: 20, totalValue: 40000, totalFeesPaid: 6000, totalQuantity: 1000, averageValuePerReceipt: 2000 },
    ],
    topCommoditiesOverall: [
      { commodityId: '1', commodity: { id: '1', name: 'Wheat', category: 'Grain' }, totalReceipts: 200, totalValue: 400000, totalFeesPaid: 50000, totalQuantity: 10000, averageValuePerReceipt: 2000 },
      { commodityId: '2', commodity: { id: '2', name: 'Rice', category: 'Grain' }, totalReceipts: 150, totalValue: 300000, totalFeesPaid: 40000, totalQuantity: 8000, averageValuePerReceipt: 2000 },
      { commodityId: '3', commodity: { id: '3', name: 'Maize', category: 'Grain' }, totalReceipts: 100, totalValue: 200000, totalFeesPaid: 30000, totalQuantity: 5000, averageValuePerReceipt: 2000 },
    ],
  };
  const commodityLoading = false;
  const commodityError = null;

  // const {
  //   data: detailedCommodityData,
  //   loading: detailedLoading,
  //   error: detailedError,
  // } = useCommodityDetailedAnalytics({
  //   committeeId,
  //   commodityId: selectedCommodityId || '',
  //   year: commodityTimeFrame === 'month' ? currentYear : undefined,
  //   month: commodityTimeFrame === 'month' ? currentMonth : undefined,
  // });
  const detailedCommodityData = selectedCommodityId
    ? {
        commodity: { id: selectedCommodityId, name: 'Wheat', category: 'Grain' },
        monthlyAnalytics: [
          { year: 2024, month: 1, totalReceipts: 10, totalValue: 20000, totalFeesPaid: 2500, totalQuantity: 500, averageValuePerReceipt: 2000 },
          { year: 2024, month: 2, totalReceipts: 8, totalValue: 16000, totalFeesPaid: 2000, totalQuantity: 400, averageValuePerReceipt: 2000 },
        ],
        overallAnalytics: { totalReceipts: 100, totalValue: 200000, totalFeesPaid: 25000, totalQuantity: 5000, averageValuePerReceipt: 2000 },
        trends: { valueGrowth: 5, quantityGrowth: 3, receiptsGrowth: 2, trend: 'Growing' },
        insights: ['Strong demand in recent months', 'Consistent price growth'],
      }
    : null;
  const detailedLoading = false;
  const detailedError = null;

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
      value: item.totalValue,
      feesPaid: item.totalFeesPaid,
      quantity: item.totalQuantity,
      avgPerReceipt: item.averageValuePerReceipt,
    }));
  }, [commodityData, commodityTimeFrame]);

  if (committeeLoading && commodityLoading) {
    return (
      <div className='w-full p-4 md:p-6 flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <div className='text-lg font-semibold text-gray-600 mt-2'>
            Loading Advanced Analytics...
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
      {/* Enhanced Header with Analytics View Toggle */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Committee Analytics</h2>
            <p className="text-gray-600">Market Fee Performance & Target Analysis</p>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1 mt-4 md:mt-0">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analyticsView === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setAnalyticsView('overview')}>
              📊 Overview
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analyticsView === 'targets'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setAnalyticsView('targets')}>
              🎯 Targets
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analyticsView === 'trends'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setAnalyticsView('trends')}>
              📈 Trends
            </button>
          </div>
        </div>
      </div>

      {/* Market Fee Chart - Always Visible */}
      <div className='mb-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full'>
          <div className='h-64 md:h-80 w-full flex items-center justify-center'>
            {committeeData?.chartData ? (
              <AreaChartComponent data={committeeData.chartData} />
            ) : (
              <div className='text-gray-500'>No chart data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Content Based on Selected View */}
      {analyticsView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  All Time
                </button>
              </div>
            </div>
            <div className='h-64 md:h-80'>
              {committeeLoading ? (
                <div className='flex items-center justify-center h-full'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                </div>
              ) : committeeData?.locationData ? (
                <PieChartComponent
                  data={committeeData.locationData.map((d) => {
                    let color = '#8884d8';
                    if (d.name === 'Office') color = '#2563eb';
                    else if (d.name === 'Checkpost') color = '#22c55e';
                    else if (d.name === 'Other') color = '#f59e42';
                    return {...d, color};
                  })}
                  onClickData={() => {}}
                />
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
                      <div className='font-bold text-xl'>
                        {formatLakh(c.value)}
                      </div>
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
      )}

      {analyticsView === 'targets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TargetPerformanceCard currentData={committeeData?.currentMonth} timeFrame={locationTimeFrame} />
          <PerformanceInsights currentData={committeeData?.currentMonth} timeFrame={locationTimeFrame} />
        </div>
      )}

      {analyticsView === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MarketFeeTrendAnalysis chartData={committeeData?.chartData} />
          <PerformanceInsights currentData={committeeData?.currentMonth} timeFrame={locationTimeFrame} />
        </div>
      )}

      {/* Detailed Commodity Analytics - Always at Bottom */}
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
                        {formatLakh(displayAnalytics?.totalValue || 0)}
                      </div>
                      <div className='text-gray-600 text-sm mt-1'>
                        Total Value
                      </div>
                    </div>
                    <div className='bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center'>
                      <div className='text-2xl font-bold'>
                        {formatLakh(displayAnalytics?.totalFeesPaid || 0)}
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
                                      {formatLakh(value)}
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
