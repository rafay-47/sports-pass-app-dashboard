import { useState, useEffect } from 'react';
import { sportsApi, type Sport } from '../services';

interface UseSportsReturn {
  sports: Sport[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing sports data
 */
export const useSports = (): UseSportsReturn => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSports = async () => {
    try {
      setLoading(true);
      setError(null);
      const sportsData = await sportsApi.getActiveSports();
      setSports(sportsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sports';
      setError(errorMessage);
      console.error('Error fetching sports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return {
    sports,
    loading,
    error,
    refetch: fetchSports,
  };
};
