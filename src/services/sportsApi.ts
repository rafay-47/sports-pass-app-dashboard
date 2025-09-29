import { BaseApiService } from './baseApi';
import type { Sport } from '../types';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class SportsApiService extends BaseApiService {
  constructor() {
    super('/api/sports');
  }

  /**
   * Fetch all sports from the API
   */
  async getActiveSports(): Promise<Sport[]> {
    try {
      const response = await this.get<unknown>('');
      const apiResponse = response as { status?: string; message?: string; data?: { sports?: Sport[] }; sports?: Sport[] };

      //console.log('Sports API response:', response);

      // Handle both wrapped and unwrapped response formats
      if (apiResponse.status === 'error') {
        throw new Error(apiResponse.message || 'Failed to fetch sports data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = apiResponse.data || apiResponse;
      const responseData = data as Sport[] | { sports?: Sport[]; data?: Sport[] };
      
      // Handle different response formats
      if (Array.isArray(responseData)) {
        return responseData;
      } else if (responseData.sports && Array.isArray(responseData.sports)) {
        return responseData.sports;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      } else {
        console.warn('Unexpected sports response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching active sports:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific sport by ID
   */
  async getSportById(sportId: string): Promise<Sport | null> {
    try {
      const response = await this.get<unknown>(`/${sportId}`);
      const apiResponse = response as { status?: string; message?: string; data?: Sport; };

      // Handle both wrapped and unwrapped response formats
      if (apiResponse.status === 'error') {
        if (apiResponse.message?.includes('not found')) {
          return null;
        }
        throw new Error(apiResponse.message || 'Failed to fetch sport data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = apiResponse.data || apiResponse;
      return data as Sport;
    } catch (error) {
      console.error(`Error fetching sport ${sportId}:`, error);
      throw error;
    }
  }

  /**
   * Search sports by query
   */
  async searchSports(query: string): Promise<Sport[]> {
    try {
      const data: ApiResponse<{ sports: Sport[] }> = await this.get(`/search?q=${encodeURIComponent(query)}`);

      if (data.status !== 'success' || !data.data?.sports) {
        throw new Error(data.message || 'Failed to search sports');
      }

      return data.data.sports;
    } catch (error) {
      console.error('Error searching sports:', error);
      throw error;
    }
  }

  /**
   * Create a new sport (admin functionality)
   */
  async createSport(sportData: Omit<Sport, 'id' | 'created_at' | 'updated_at'>): Promise<Sport> {
    try {
      const data: ApiResponse<Sport> = await this.post('', sportData);

      if (data.status !== 'success' || !data.data) {
        throw new Error(data.message || 'Failed to create sport');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating sport:', error);
      throw error;
    }
  }

  /**
   * Update an existing sport (admin functionality)
   */
  async updateSport(sportId: string, sportData: Partial<Sport>): Promise<Sport> {
    try {
      const data: ApiResponse<Sport> = await this.put(`/${sportId}`, sportData);

      if (data.status !== 'success' || !data.data) {
        throw new Error(data.message || 'Failed to update sport');
      }

      return data.data;
    } catch (error) {
      console.error(`Error updating sport ${sportId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const sportsApi = new SportsApiService();
