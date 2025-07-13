import React, {useState, useMemo} from 'react';
import {useAuthStore} from '@/stores/authStore';
import {useCommitteeAnalytics} from '@/hooks/analytics/useCommitteeAnalytics';
import {
  useCommodityAnalytics,
  useCommodityDetailedAnalytics,
} from '@/hooks/analytics/useCommodityAnalytics';
import {formatMoney} from '@/lib/helpers';
import CommitteeAnalysisView from './CommitteeAnalysisView';

type TimeFrame = 'month' | 'all';

export default function CommitteeAnalysisContainer() {
  const [locationTimeFrame, setLocationTimeFrame] =
    useState<TimeFrame>('month');
  const [commodityTimeFrame, setCommodityTimeFrame] =
    useState<TimeFrame>('month');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const {committee} = useAuthStore();
  const committeeId = committee?.id;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const {
    data: committeeData,
    loading: committeeLoading,
    error: committeeError,
  } = useCommitteeAnalytics({
    committeeId: committeeId || '',
    year: currentYear,
    month: currentMonth,
  });

  const {
    data: commodityData,
    loading: commodityLoading,
    error: commodityError,
  } = useCommodityAnalytics({
    committeeId: committeeId || '',
    year: commodityTimeFrame === 'month' ? currentYear : undefined,
    month: commodityTimeFrame === 'month' ? currentMonth : undefined,
    limit: 5,
  });

  const {
    data: detailedCommodityData,
    loading: detailedLoading,
    error: detailedError,
  } = useCommodityDetailedAnalytics({
    committeeId: committeeId || '',
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

  const currentLocationData = useMemo(() => {
    if (!committeeData) return [];
    const dataSource =
      locationTimeFrame === 'month'
        ? committeeData.locationData
        : committeeData.allTimeLocationData;
    return dataSource || [];
  }, [committeeData, locationTimeFrame]);

  const totalFees = useMemo(() => {
    if (!committeeData) return 0;
    if (locationTimeFrame === 'month') {
      return committeeData.currentMonth?.totalFeesPaid || 0;
    } else {
      return committeeData.allTime?.totalFees || 0;
    }
  }, [committeeData, locationTimeFrame]);

  const targetAchievement = useMemo(() => {
    if (!committeeData) return 0;
    const target = committeeData.currentMonth?.target || 1;
    const collected = committeeData.currentMonth?.totalFeesPaid || 0;
    return Math.min(Math.round((collected / target) * 100), 100);
  }, [committeeData]);

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
            {committeeError?.message || commodityError?.message}
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
    <CommitteeAnalysisView
      viewMode={viewMode}
      setViewMode={setViewMode}
      locationTimeFrame={locationTimeFrame}
      setLocationTimeFrame={setLocationTimeFrame}
      commodityTimeFrame={commodityTimeFrame}
      setCommodityTimeFrame={setCommodityTimeFrame}
      selectedCommodityId={selectedCommodityId}
      setSelectedCommodityId={setSelectedCommodityId}
      committeeData={committeeData}
      processedCommodityData={processedCommodityData}
      currentLocationData={currentLocationData}
      totalFees={totalFees}
      targetAchievement={targetAchievement}
      detailedCommodityData={detailedCommodityData}
      detailedLoading={detailedLoading}
      detailedError={detailedError}
      commodityLoading={commodityLoading}
    />
  );
}
