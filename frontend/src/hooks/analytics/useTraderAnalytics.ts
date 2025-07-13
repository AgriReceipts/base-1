import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import api from '@/lib/axiosInstance';

interface TraderData {
  traderId: string;
  trader: {
    id: string;
    name: string;
  };
  totalReceipts: number;
  totalValue: number;
  totalFeesPaid: number;
  totalQuantity: number;
}

interface TraderAnalyticsResponse {
  success: boolean;
  data: {
    period: string;
    topTradersMonthly: TraderData[];
    topTradersOverall: TraderData[];
    totalMonthlyTraders: number;
    totalMonthyFees: number;
    totalMonthlyReceipts: number;
    avgMonthlyFees: number;
    limit: number;
  };
}

interface DetailedTraderAnalytics {
  trader: {
    id: string;
    name: string;
  };
  monthlyAnalytics: Array<{
    year: number;
    month: number;
    totalReceipts: number;
    totalValue: number;
    totalFeesPaid: number;
    totalQuantity: number;
  }>;
  overallAnalytics: {
    totalReceipts: number;
    totalValue: number;
    totalFeesPaid: number;
    totalQuantity: number;
  } | null;
  trends: {
    valueGrowth: number;
    quantityGrowth: number;
    receiptsGrowth: number;
    trend: string;
  };
  insights: string[];
}

interface UseTraderAnalyticsProps {
  committeeId: string;
  year?: number;
  month?: number;
  limit?: number;
}

interface UseTraderAnalyticsReturn {
  data: TraderAnalyticsResponse['data'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTraderAnalytics = ({
  committeeId,
  year,
  month,
  limit = 5,
}: UseTraderAnalyticsProps): UseTraderAnalyticsReturn => {
  const [data, setData] = useState<TraderAnalyticsResponse['data'] | null>(
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
        `analytics/traderAnalytics/${committeeId}?${params}`
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch trader analytics');
      }
    } catch (err) {
      console.error('Error fetching trader analytics:', err);
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'An error occurred while fetching trader analytics'
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

// Hook for detailed Trader analytics
interface UseTraderDetailedAnalyticsProps {
  committeeId: string;
  traderId: string;
  year?: number;
  month?: number;
}

interface UseTraderDetailedAnalyticsReturn {
  data: DetailedTraderAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTraderDetailedAnalytics = ({
  committeeId,
  traderId,
  year,
  month,
}: UseTraderDetailedAnalyticsProps): UseTraderDetailedAnalyticsReturn => {
  const [data, setData] = useState<DetailedTraderAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!committeeId || !traderId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...(year && {year: year.toString()}),
        ...(month && {month: month.toString()}),
      });

      const response = await api.get<{
        success: boolean;
        data: DetailedTraderAnalytics;
      }>(
        `analytics/traderDetailedAnalytics/${committeeId}/${traderId}?${params}`
      );

      if (response.data.success) {
        setData(response.data.data);
        console.log('trader detailed analytics', response.data);
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
  }, [committeeId, traderId, year, month]);

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
