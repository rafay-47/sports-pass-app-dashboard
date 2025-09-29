import { BaseApiService } from './baseApi';
import type { Club } from '../types';

export interface CreateClubRequest {
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

class ClubApiService extends BaseApiService {
  constructor() {
    super('/api');
  }

  /**
   * Create a new club
   */
  async createClub(clubData: CreateClubRequest): Promise<Club> {
    try {
      const club = await this.post<Club>('/clubs', clubData);
      return club;
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  }

  /**
   * Update an existing club
   */
  async updateClub(clubId: string, clubData: Partial<CreateClubRequest>): Promise<Club> {
    try {
      const club = await this.put<Club>(`/clubs/${clubId}`, clubData);
      return club;
    } catch (error) {
      console.error(`Error updating club ${clubId}:`, error);
      throw error;
    }
  }

  /**
   * Get club by ID
   */
  async getClub(clubId: string): Promise<Club> {
    try {
      const club = await this.get<Club>(`/clubs/${clubId}`);
      return club;
    } catch (error) {
      console.error(`Error fetching club ${clubId}:`, error);
      throw error;
    }
  }

  /**
   * Get clubs for current user
   */
  async getUserClubs(): Promise<Club[]> {
    try {
      const data = await this.get<unknown>('/clubs/my-clubs');
      const response = data as { clubs?: Club[]; data?: Club[]; } | Club[];
      //console.log('ClubApi - Raw response from /clubs/my-clubs:', data);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.clubs && Array.isArray(response.clubs)) {
        return response.clubs;
      } else if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('ClubApi - Unexpected response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching user clubs:', error);
      throw error;
    }
  }

  /**
   * Update club using /clubs endpoint
   */
  async updateClubById(clubId: string, clubData: Partial<CreateClubRequest>): Promise<Club> {
    try {
      const club = await this.put<Club>(`/clubs/${clubId}`, clubData);
      return club;
    } catch (error) {
      console.error(`Error updating club ${clubId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const clubApi = new ClubApiService();
