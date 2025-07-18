import api from "@/lib/axiosInstance";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface OverviewRes {
  marketFees: string; // API returns string
  marketFeeTarget: number | null; // API can return null
  checkpostMarketFees: string; // Fixed typo: was "checkpostMargetFees"
  officeFees: string; // API returns string
  totalReceipts: number;
  uniqueCommodities: number;
  uniqueTraders: number;
  superVisorTarget: number;
  checkPostTarget: number;
}

interface OverViewReturn {
  // Fixed: was "overViewReturn"
  data: OverviewRes | null;
  loading: boolean;
  error: string | null;
}

export const useOverview = ({
  committeeId,
}: {
  committeeId: string;
}): OverViewReturn => {
  const [data, setData] = useState<OverviewRes | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    if (!committeeId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.get(`analytics/overview/${committeeId}`);
      if (result.data) {
        // Note: keeping the typo as it exists in your API
        setData(result.data);
      } else {
        setError("Failed to get Overview data");
      }
    } catch (err) {
      console.error("Error fetching overview analytics:", err);
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "An error occurred while fetching overview analytics",
      );
    } finally {
      setLoading(false);
    }
  }, [committeeId]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    loading,
    error,
  };
};
