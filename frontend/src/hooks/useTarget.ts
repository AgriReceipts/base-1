import {targetService} from '@/lib/axiosInstance';
import type {Target} from '@/types/targets';
import {useState, useEffect} from 'react';

export const useTargets = (year: number, committeeId?: string) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTargets = async ({
    year,
    committeeId,
  }: {
    year: number;
    committeeId?: string;
  }) => {
    if (!year) return;

    setLoading(true);
    setError(null);

    try {
      const data = await targetService.getTargets({year, committeeId});
      setTargets(data);
    } catch (err) {
      setError('Failed to fetch targets');
      console.error('Error fetching targets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets({year, committeeId});
  }, [year, committeeId]);

  const saveTargets = async (newTargets: Omit<Target, 'id'>[]) => {
    setLoading(true);
    setError(null);

    try {
      await targetService.setTargets(newTargets);
      await fetchTargets({year, committeeId}); // Refresh data
      return true;
    } catch (err) {
      setError('Failed to save targets');
      console.error('Error saving targets:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTarget = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await targetService.deleteTarget(id);
      await fetchTargets({year, committeeId});
      return true;
    } catch (err) {
      setError('Failed to save targets');
      console.error('Error saving targets:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    targets,
    loading,
    error,
    fetchTargets,
    saveTargets,
    deleteTarget,
  };
};
