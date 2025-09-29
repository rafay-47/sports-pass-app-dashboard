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
      const response = await this.get('') as any;

      //console.log('Sports API response:', response);

      // Handle both wrapped and unwrapped response formats
      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to fetch sports data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = response.data || response;
      
      // Handle different response formats
      if (Array.isArray(data)) {
        return data;
      } else if (data.sports && Array.isArray(data.sports)) {
        return data.sports;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
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
      const response = await this.get(`/${sportId}`) as any;

      // Handle both wrapped and unwrapped response formats
      if (response.status === 'error') {
        if (response.message?.includes('not found')) {
          return null;
        }
        throw new Error(response.message || 'Failed to fetch sport data');
      }

      // Get the data object (either from wrapped response or direct)
      const data = response.data || response;
      return data;
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
