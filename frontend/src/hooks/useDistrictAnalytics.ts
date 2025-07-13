import api from '@/lib/axiosInstance';
import type {
  CheckPostsRes,
  CommitteeWiseAcheivementRes,
  DistrictAnalyticsResponse,
  DistrictMetadataRes,
  HeatMapRes,
  MonthlyTrend,
  TopCommodityRes,
} from '@/types/districtAnalytics';
import {useState, useEffect, useCallback} from 'react';
import {toast} from 'react-hot-toast';

interface UseDistrictAnalyticsParams {
  financialYearStart: string;
  month?: string;
}

const useDistrictAnalytics = (params: UseDistrictAnalyticsParams) => {
  const [districtMetadata, setDistrictMetadata] =
    useState<DistrictMetadataRes | null>(null);
  const [committeeWiseAchievement, setCommitteeWiseAchievement] =
    useState<CommitteeWiseAcheivementRes>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend | null>(null);
  const [topCommodities, setTopCommodities] = useState<TopCommodityRes>([]);
  const [checkPosts, setCheckPosts] = useState<CheckPostsRes>([]);
  const [heatMapData, setHeatMapData] = useState<HeatMapRes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDistrictAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params.financialYearStart) {
        queryParams.append('financialYearStart', params.financialYearStart);
      }

      if (params.month) {
        queryParams.append('month', params.month);
      }

      const response = await api.get(
        `analytics/districtAnalytics?${queryParams.toString()}`
      );
      const data: DistrictAnalyticsResponse = response.data;

      setDistrictMetadata(data.districtMetadataRes);
      setCommitteeWiseAchievement(data.committeeWiseAcheivementRes);
      setMonthlyTrend(data.monthlyTrend);
      setTopCommodities(data.topCommodityRes);
      setCheckPosts(data.checkPostsRes);
      setHeatMapData(data.heatMapRes);
    } catch (error) {
      console.error('Failed to fetch district analytics:', error);
      setError(error as Error);
      toast.error('Failed to fetch district analytics.');
    } finally {
      setLoading(false);
    }
  }, [params.financialYearStart, params.month]);

  useEffect(() => {
    fetchDistrictAnalytics();
  }, [fetchDistrictAnalytics]);

  return {
    districtMetadata,
    committeeWiseAchievement,
    monthlyTrend,
    topCommodities,
    checkPosts,
    heatMapData,
    loading,
    error,
    refetch: fetchDistrictAnalytics,
  };
};

export default useDistrictAnalytics;
