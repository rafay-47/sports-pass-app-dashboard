import { useState, useEffect } from 'react';
import { facilitiesApi, amenitiesApi, type Facility, type Amenity } from '../services';

interface UseFacilitiesReturn {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing facilities data
 */
export const useFacilities = (): UseFacilitiesReturn => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const facilitiesData = await facilitiesApi.getActiveFacilities();
      setFacilities(facilitiesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load facilities';
      setError(errorMessage);
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return {
    facilities,
    loading,
    error,
    refetch: fetchFacilities,
  };
};

interface UseAmenitiesReturn {
  amenities: Amenity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing amenities data
 */
export const useAmenities = (): UseAmenitiesReturn => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      setError(null);
      const amenitiesData = await amenitiesApi.getActiveAmenities();
      setAmenities(amenitiesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load amenities';
      setError(errorMessage);
      console.error('Error fetching amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  return {
    amenities,
    loading,
    error,
    refetch: fetchAmenities,
  };
};
