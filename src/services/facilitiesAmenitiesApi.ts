import { BaseApiService } from './baseApi';
import type { Facility, Amenity } from '../types';

class FacilitiesApiService extends BaseApiService {
  constructor() {
    super('/api/facilities');
  }

  /**
   * Fetch all facilities
   */
  async getActiveFacilities(): Promise<Facility[]> {
    try {
      const response = await this.get<unknown>('');
      const apiResponse = response as { status?: string; message?: string; data?: { facilities?: Facility[] }; facilities?: Facility[] };

      // Handle both wrapped and unwrapped response formats
      if (apiResponse.status === 'error') {
        throw new Error(apiResponse.message || 'Failed to fetch facilities data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = apiResponse.data || apiResponse;
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
      const response = await this.get<unknown>(`/${facilityId}`);
      const apiResponse = response as { status?: string; message?: string; data?: Facility; };

      // Handle both wrapped and unwrapped response formats
      if (apiResponse.status === 'error') {
        if (apiResponse.message?.includes('not found')) {
          return null;
        }
        throw new Error(apiResponse.message || 'Failed to fetch facility data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = apiResponse.data || apiResponse;
      return data as Facility;
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
      const response = await this.get<unknown>('');
      const apiResponse = response as { status?: string; message?: string; data?: { amenities?: Amenity[] }; amenities?: Amenity[] };

      // Handle both wrapped and unwrapped response formats
      if (apiResponse.status === 'error') {
        throw new Error(apiResponse.message || 'Failed to fetch amenities data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = apiResponse.data || apiResponse;
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
      const response = await this.get<unknown>(`/${amenityId}`);
      const apiResponse = response as { status?: string; message?: string; data?: Amenity; };

      // Handle both wrapped and unwrapped response formats
      if (apiResponse.status === 'error') {
        if (apiResponse.message?.includes('not found')) {
          return null;
        }
        throw new Error(apiResponse.message || 'Failed to fetch amenity data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = apiResponse.data || apiResponse;
      return data as Amenity;
    } catch (error) {
      console.error(`Error fetching amenity ${amenityId}:`, error);
      throw error;
    }
  }
}

// Export singleton instances
export const facilitiesApi = new FacilitiesApiService();
export const amenitiesApi = new AmenitiesApiService();
