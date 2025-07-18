import api from "@/lib/axiosInstance";
import { useState, useEffect } from "react";

interface ChartData {
  date: string;
  mf: number;
}

interface CurrentMonthData {
  totalValue: number | null;
  marketFees: number | null;
  officeFees: number | null;
  checkpostMarketFees: number | null;
  otherFees: number | null;
}
interface currentFinancialYearData {
  fyPeriod: string;
  totalFees: number;
  totalCheckpostFees: number;
  totalOfficeFees: number;
  otalOtherFees: number;
}

interface CommitteeAnalyticsData {
  currentMonth: CurrentMonthData | null;
  chartData: ChartData[] | null;
  currentFinancialYear: currentFinancialYearData;
  locationData: LocationData[] | null;
  allTimeLocationData: LocationData[] | null;
}

interface UseCommitteeAnalyticsProps {
  committeeId: string;
  year: number;
  month: number;
}

interface UseCommitteeAnalyticsReturn {
  data: CommitteeAnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
interface LocationData {
  name: string;
  value: number;
}

export const useCommitteeAnalytics = ({
  committeeId,
  year,
  month,
}: UseCommitteeAnalyticsProps): UseCommitteeAnalyticsReturn => {
  const [data, setData] = useState<CommitteeAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!committeeId || !year || !month) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        `analytics/committee/${committeeId}/${year}/${month}`,
      );

      // Process location data from current month data
      const locationData: LocationData[] = [];
      if (response.data.currentMonth) {
        locationData.push(
          {
            name: "Office",
            value: Number(response.data.currentMonth.officeFees) || 0,
          },
          {
            name: "Checkpost",
            value: Number(response.data.currentMonth.checkpostMarketFees) || 0,
          },
          {
            name: "Other",
            value: Number(response.data.currentMonth.otherFees) || 0,
          },
        );
      }

      const allTimeLocationData: LocationData[] = [];
      if (response.data.currentFinancialYear) {
        allTimeLocationData.push(
          {
            name: "Office",
            value:
              Number(response.data.currentFinancialYear.totalOfficeFees) || 0,
          },
          {
            name: "Checkpost",
            value:
              Number(response.data.currentFinancialYear.totalCheckpostFees) ||
              0,
          },
          {
            name: "Other",
            value:
              Number(response.data.currentFinancialYear.totalOtherFees) || 0,
          },
        );
      }

      setData({
        ...response.data,
        locationData,
        allTimeLocationData,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch analytics",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [committeeId, year, month]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
