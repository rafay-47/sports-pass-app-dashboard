import { BaseApiService } from './baseApi';
import type { Facility, Amenity } from '../types';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class FacilitiesApiService extends BaseApiService {
  constructor() {
    super('/api/facilities');
  }

  /**
   * Fetch all facilities
   */
  async getActiveFacilities(): Promise<Facility[]> {
    try {
      const response = await this.get('') as any;

      // Handle both wrapped and unwrapped response formats
      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to fetch facilities data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = response.data || response;
      return data.facilities || [];
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific facility by ID
   */
  async getFacilityById(facilityId: string): Promise<Facility | null> {
    try {
      const response = await this.get(`/${facilityId}`) as any;

      // Handle both wrapped and unwrapped response formats
      if (response.status === 'error') {
        if (response.message?.includes('not found')) {
          return null;
        }
        throw new Error(response.message || 'Failed to fetch facility data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = response.data || response;
      return data;
    } catch (error) {
      console.error(`Error fetching facility ${facilityId}:`, error);
      throw error;
    }
  }
}

class AmenitiesApiService extends BaseApiService {
  constructor() {
    super('/api/amenities');
  }

  /**
   * Fetch all amenities
   */
  async getActiveAmenities(): Promise<Amenity[]> {
    try {
      const response = await this.get('') as any;

      // Handle both wrapped and unwrapped response formats
      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to fetch amenities data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = response.data || response;
      return data.amenities || [];
    } catch (error) {
      console.error('Error fetching amenities:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific amenity by ID
   */
  async getAmenityById(amenityId: string): Promise<Amenity | null> {
    try {
      const response = await this.get(`/${amenityId}`) as any;

      // Handle both wrapped and unwrapped response formats
      if (response.status === 'error') {
        if (response.message?.includes('not found')) {
          return null;
        }
        throw new Error(response.message || 'Failed to fetch amenity data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = response.data || response;
      return data;
    } catch (error) {
      console.error(`Error fetching amenity ${amenityId}:`, error);
      throw error;
    }
  }
}

// Export singleton instances
export const facilitiesApi = new FacilitiesApiService();
export const amenitiesApi = new AmenitiesApiService();
