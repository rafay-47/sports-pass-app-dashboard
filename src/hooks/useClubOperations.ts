import { useState } from 'react';
import { clubApi } from '../services';
import type { Club } from '../types';

interface CreateClubData {
  name: string;
  sport_id: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  category: 'male' | 'female' | 'mixed';
  timings: Record<string, { open: string; close: string }>;
  is_active: boolean;
  amenities: string[];
  facilities: string[];
}

interface UseClubOperationsReturn {
  createClub: (data: CreateClubData) => Promise<Club>;
  updateClub: (clubId: string, data: Partial<CreateClubData>) => Promise<Club>;
  getClub: (clubId: string) => Promise<Club>;
  getUserClubs: () => Promise<Club[]>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for club operations (create, update, fetch)
 */
export const useClubOperations = (): UseClubOperationsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClub = async (data: CreateClubData): Promise<Club> => {
    try {
      setLoading(true);
      setError(null);
      const club = await clubApi.createClub(data);
      return club;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create club';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClub = async (clubId: string, data: Partial<CreateClubData>): Promise<Club> => {
    try {
      setLoading(true);
      setError(null);
      const club = await clubApi.updateClub(clubId, data);
      return club;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update club';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getClub = async (clubId: string): Promise<Club> => {
    try {
      setLoading(true);
      setError(null);
      const club = await clubApi.getClub(clubId);
      return club;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch club';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserClubs = async (): Promise<Club[]> => {
    try {
      setLoading(true);
      setError(null);
      const clubs = await clubApi.getUserClubs();
      return clubs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch clubs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return {
    createClub,
    updateClub,
    getClub,
    getUserClubs,
    loading,
    error,
  };
};
