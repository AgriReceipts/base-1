import api from '@/lib/axiosInstance';
import type {Committee} from '@/types/targets';
import {useState, useEffect, useCallback} from 'react';

import {toast} from 'react-hot-toast';

interface Checkpost {
  id: string;
  name: string;
}

const useInitialData = (committeeId: string | null = null) => {
  const [commodities, setCommodities] = useState<string[]>([]);
  const [availableCheckposts, setAvailableCheckposts] = useState<Checkpost[]>(
    []
  );
  const [detailedCommittee, setDetailedCommittee] = useState<Committee[]>([]);
  const [traders, setTraders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = [
        api.get(`metaData/commodities`),
        api.get(`metaData/getDetailedCommittees`),
        api.get('metaData/traders'),
      ];

      // Add committee-specific checkposts if committeeId is provided
      if (committeeId) {
        promises.push(api.get(`/checkpost/${committeeId}`));
      }

      const responses = await Promise.all(promises);
      const [
        commoditiesRes,
        detailedCommitteeRes,
        traderRes,
        committeeCheckpostsRes,
      ] = responses;

      // Sort commodities alphabetically and add "Other" at the top
      const sortedCommodities: string[] = [
        'Other',
        ...commoditiesRes.data.data.sort((a: string, b: string) =>
          a.localeCompare(b)
        ),
      ];

      setCommodities(sortedCommodities);
      setDetailedCommittee(detailedCommitteeRes.data.data);
      setTraders(['New', ...traderRes.data.data]);

      if (committeeCheckpostsRes) {
        setAvailableCheckposts(committeeCheckpostsRes.data.data.checkposts);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      setError(error as Error);
      toast.error('Failed to fetch initial data.');
    } finally {
      setLoading(false);
    }
  }, [committeeId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    detailedCommittee,
    commodities,
    availableCheckposts,
    traders,
    loading,
    error,
    refetch: fetchInitialData,
  };
};

export default useInitialData;
