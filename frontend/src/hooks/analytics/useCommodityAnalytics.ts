import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import api from '@/lib/axiosInstance';

interface CommodityData {
  commodityId: string;
  commodity: {
    id: string;
    name: string;
    category: string;
  };
  totalReceipts: number;
  totalValue: number;
  totalFeesPaid: number;
  totalQuantity: number;
  averageValuePerReceipt: number;
}

interface CommodityAnalyticsResponse {
  success: boolean;
  data: {
    period: string;
    topCommoditiesMonthly: CommodityData[];
    topCommoditiesOverall: CommodityData[];
    limit: number;
  };
}

interface DetailedCommodityAnalytics {
  commodity: {
    id: string;
    name: string;
    category: string;
  };
  monthlyAnalytics: Array<{
    year: number;
    month: number;
    totalReceipts: number;
    totalValue: number;
    totalFeesPaid: number;
    totalQuantity: number;
    averageValuePerReceipt: number;
  }>;
  overallAnalytics: {
    totalReceipts: number;
    totalValue: number;
    totalFeesPaid: number;
    totalQuantity: number;
    averageValuePerReceipt: number;
  } | null;
  trends: {
    valueGrowth: number;
    quantityGrowth: number;
    receiptsGrowth: number;
    trend: string;
  };
  insights: string[];
}

interface UseCommodityAnalyticsProps {
  committeeId: string;
  year?: number;
  month?: number;
  limit?: number;
}

interface UseCommodityAnalyticsReturn {
  data: CommodityAnalyticsResponse['data'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCommodityAnalytics = ({
  committeeId,
  year,
  month,
  limit = 5,
}: UseCommodityAnalyticsProps): UseCommodityAnalyticsReturn => {
  const [data, setData] = useState<CommodityAnalyticsResponse['data'] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!committeeId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(year && {year: year.toString()}),
        ...(month && {month: month.toString()}),
      });

      const response = await api.get(
        `analytics/commodityAnalytics/${committeeId}?${params}`
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch commodity analytics');
      }
    } catch (err) {
      console.error('Error fetching commodity analytics:', err);
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'An error occurred while fetching commodity analytics'
      );
    } finally {
      setLoading(false);
    }
  }, [committeeId, year, month, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Hook for detailed commodity analytics
interface UseCommodityDetailedAnalyticsProps {
  committeeId: string;
  commodityId: string;
  year?: number;
  month?: number;
}

interface UseCommodityDetailedAnalyticsReturn {
  data: DetailedCommodityAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCommodityDetailedAnalytics = ({
  committeeId,
  commodityId,
  year,
  month,
}: UseCommodityDetailedAnalyticsProps): UseCommodityDetailedAnalyticsReturn => {
  const [data, setData] = useState<DetailedCommodityAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!committeeId || !commodityId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...(year && {year: year.toString()}),
        ...(month && {month: month.toString()}),
      });

      const response = await api.get<{
        success: boolean;
        data: DetailedCommodityAnalytics;
      }>(
        `analytics/commodityDetailedAnalytics/${committeeId}/${commodityId}?${params}`
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch detailed commodity analytics');
      }
    } catch (err) {
      console.error('Error fetching detailed commodity analytics:', err);
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'An error occurred while fetching detailed commodity analytics'
      );
    } finally {
      setLoading(false);
    }
  }, [committeeId, commodityId, year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
