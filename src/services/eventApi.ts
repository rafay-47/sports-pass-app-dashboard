import { BaseApiService } from './baseApi';
import type { ClubEvent, Sport, Club, ClubOwner } from '../types';

export interface CreateEventRequest {
  title: string;
  description: string;
  sport_id: string;
  location_type: 'club' | 'custom';
  club_id?: string;
  custom_address?: string;
  custom_city?: string;
  custom_state?: string;
  event_date: string; // ISO date string
  event_time: string; // Full datetime string in Y-m-d H:i:s format
  end_date: string; // ISO date string
  end_time: string; // Full datetime string in Y-m-d H:i:s format
  type: string;
  category: string;
  difficulty: string;
  fee: string; // Send as string to match API
  max_participants: number;
  organizer: string;
  requirements: string[];
  prizes: string[];
  registration_deadline: string;
}

export interface ApiEventResponse {
  id: string;
  title: string;
  description: string;
  sport_id: string;
  event_date: string;
  event_time: string;
  end_date: string;
  end_time: string;
  type: string;
  category: string;
  difficulty: string;
  fee: string; // API returns fee as string
  max_participants: number;
  current_participants: number;
  requirements: string[];
  prizes: string[];
  is_active: boolean;
  registration_deadline: string;
  created_at: string;
  updated_at: string;
  club_id: string | null;
  custom_address: string | null;
  custom_city: string | null;
  custom_state: string | null;
  location_type: 'club' | 'custom';
  organizer_id: string;
  formatted_location: string;
  sport: Sport; // Sport object
  club: Club | null; // Club object
  organizer: ClubOwner; // ClubOwner object
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
}

export interface EventResponse {
  status: string;
  data: {
    events: ApiEventResponse[];
  };
}

export interface EventRegistrationResponse {
  status: string;
  data: {
    registrations: EventRegistration[];
  };
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: string;
  payment_status: string;
  payment_amount: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  event: ApiEventResponse;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    date_of_birth: string | null;
    gender: string | null;
    profile_image_url: string | null;
    user_role: string;
    is_trainer: boolean;
    is_verified: boolean;
    is_active: boolean;
    join_date: string;
    last_login: string;
    created_at: string;
    updated_at: string;
  };
}

class EventApiService extends BaseApiService {
  constructor() {
    super('/api');
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventRequest): Promise<ApiEventResponse> {
    try {
      const event = await this.post<ApiEventResponse>('/events', eventData);
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Get events for the organizer
   */
  async getOrganizerEvents(): Promise<EventResponse> {
    try {
      console.log('EventApi - Fetching organizer events...');
      const response = await this.get<{ events: ApiEventResponse[] }>('/events/organizer');
      console.log('EventApi - Raw response from /events/organizer:', response);
      
      // Handle the response structure returned by baseApi
      // baseApi returns data.data || data, so we get the inner data object
      const eventsData = response.events || [];
      
      console.log('EventApi - Events data:', JSON.stringify(eventsData, null, 2));
      console.log('EventApi - Found events:', eventsData.length);
      
      if (eventsData.length > 0) {
        console.log('EventApi - First event sample:', JSON.stringify(eventsData[0], null, 2));
      } else {
        console.log('EventApi - No events found in response');
      }
      
      // Return in the expected format
      return {
        status: 'success',
        data: {
          events: eventsData
        }
      };
    } catch (error) {
      console.error('EventApi - Error fetching organizer events:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, eventData: Partial<CreateEventRequest>): Promise<ApiEventResponse> {
    try {
      const event = await this.put<ApiEventResponse>(`/events/${eventId}`, eventData);
      return event;
    } catch (error) {
      console.error(`Error updating event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.delete(`/events/${eventId}`);
    } catch (error) {
      console.error(`Error deleting event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get event registrations for a specific event
   */
  async getEventRegistrations(eventId: string): Promise<EventRegistrationResponse> {
    try {
      console.log(`EventApi - Fetching registrations for event: ${eventId}`);
      const response = await this.get<{ registrations: EventRegistration[] }>(`/event-registrations/event/${eventId}`);
      console.log('EventApi - Raw response from /event-registrations/event:', response);

      // Handle the response structure returned by baseApi
      // baseApi returns data.data || data, so we get the inner data object
      const registrationsData = response.registrations || [];

      console.log('EventApi - Registrations data:', JSON.stringify(registrationsData, null, 2));
      console.log('EventApi - Found registrations:', registrationsData.length);

      // Return in the expected format
      return {
        status: 'success',
        data: {
          registrations: registrationsData
        }
      };
    } catch (error) {
      console.error(`EventApi - Error fetching registrations for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Postpone an event
   */
  async postponeEvent(eventId: string, postponeData: {
    event_date: string;
    event_time: string;
    end_date?: string;
    end_time?: string;
    registration_deadline?: string;
  }): Promise<{ status: string; message: string }> {
    try {
      const response = await this.post<{ status: string; message: string }>(`/events/${eventId}/postpone`, postponeData);
      return response;
    } catch (error) {
      console.error(`Error postponing event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Convert API event format to component format
   */
  convertApiEventToComponentEvent(apiEvent: ApiEventResponse): ClubEvent {
    // Format date and time from ISO strings
    const eventDate = new Date(apiEvent.event_date);
    const eventTime = new Date(apiEvent.event_time);
    
    // Calculate duration from end_time - event_time (in hours)
    const duration = Math.round((new Date(apiEvent.end_time).getTime() - eventTime.getTime()) / (1000 * 60 * 60));
    
    return {
      id: apiEvent.id,
      hostingClub: apiEvent.location_type === 'custom' ? 'other' : (apiEvent.club_id || ''),
      title: apiEvent.title,
      description: apiEvent.description,
      type: apiEvent.type as 'tournament' | 'workshop' | 'league' | 'social',
      sport: apiEvent.sport_id,
      date: eventDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      time: eventTime.toTimeString().slice(0, 5), // Format as HH:MM
      duration: duration,
      fee: parseFloat(apiEvent.fee), // Convert string to number
      maxParticipants: apiEvent.max_participants,
      currentParticipants: apiEvent.current_participants || 0,
      requirements: {
        hasRequirements: apiEvent.requirements.length > 0,
        description: apiEvent.requirements.join(', ')
      },
      prizes: {
        hasPrizes: apiEvent.prizes.length > 0,
        positions: {
          first: apiEvent.prizes[0] || '',
          second: apiEvent.prizes[1] || '',
          third: apiEvent.prizes[2] || ''
        }
      },
      difficulty: apiEvent.difficulty as 'beginner' | 'intermediate' | 'advanced',
      images: [],
      status: apiEvent.status, // Default status
      createdAt: apiEvent.created_at,
      location: apiEvent.formatted_location,
      customLocation: apiEvent.location_type === 'custom' ? {
        address: apiEvent.custom_address || '',
        city: apiEvent.custom_city || '',
        state: apiEvent.custom_state || ''
      } : undefined
    };
  }

  /**
   * Convert component event format to API format (handles both full and partial updates)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertComponentEventToApiEvent(componentEvent: any): Partial<CreateEventRequest> {
    console.log('Converting component event to API format:', componentEvent);
    
    const result: Partial<CreateEventRequest> = {};
    
    // Basic fields that can be directly mapped
    if (componentEvent.title !== undefined) result.title = componentEvent.title;
    if (componentEvent.description !== undefined) result.description = componentEvent.description;
    if (componentEvent.sport !== undefined) result.sport_id = componentEvent.sport || componentEvent.sport_id;
    if (componentEvent.sport_id !== undefined) result.sport_id = componentEvent.sport_id;
    if (componentEvent.type !== undefined) result.type = componentEvent.type || 'tournament';
    if (componentEvent.category !== undefined) result.category = componentEvent.category || 'intermediate';
    if (componentEvent.difficulty !== undefined) result.difficulty = componentEvent.difficulty || 'medium';
    if (componentEvent.fee !== undefined) result.fee = componentEvent.fee?.toString() || '0';
    if (componentEvent.maxParticipants !== undefined) result.max_participants = componentEvent.maxParticipants || componentEvent.max_participants || 50;
    if (componentEvent.organizer !== undefined) result.organizer = componentEvent.organizer_id || componentEvent.organizer || '';
    if (componentEvent.organizer_id !== undefined) result.organizer = componentEvent.organizer_id;
    
    // Handle requirements
    if (componentEvent.requirements !== undefined) {
      result.requirements = Array.isArray(componentEvent.requirements) 
        ? componentEvent.requirements 
        : (componentEvent.requirements?.hasRequirements 
          ? [componentEvent.requirements.description] 
          : []);
    }
    
    // Handle prizes
    if (componentEvent.prizes !== undefined) {
      result.prizes = Array.isArray(componentEvent.prizes) 
        ? componentEvent.prizes 
        : (componentEvent.prizes?.hasPrizes 
          ? [componentEvent.prizes.positions.first, componentEvent.prizes.positions.second, componentEvent.prizes.positions.third].filter(Boolean)
          : []);
    }
    
    // Handle location
    if (componentEvent.location_type !== undefined) {
      result.location_type = componentEvent.location_type;
    } else if (componentEvent.hostingClub !== undefined) {
      result.location_type = componentEvent.hostingClub && componentEvent.hostingClub !== 'other' ? 'club' : 'custom';
    }
    
    if (componentEvent.club_id !== undefined) {
      result.club_id = componentEvent.club_id;
    } else if (componentEvent.hostingClub !== undefined && componentEvent.hostingClub !== 'other') {
      result.club_id = componentEvent.hostingClub;
    }
    
    if (componentEvent.custom_address !== undefined) result.custom_address = componentEvent.custom_address;
    if (componentEvent.custom_city !== undefined) result.custom_city = componentEvent.custom_city;
    if (componentEvent.custom_state !== undefined) result.custom_state = componentEvent.custom_state;
    
    // Handle custom location object
    if (componentEvent.customLocation !== undefined) {
      result.custom_address = componentEvent.customLocation.address;
      result.custom_city = componentEvent.customLocation.city;
      result.custom_state = componentEvent.customLocation.state;
    }
    
    // Handle date and time - this is the critical part for the API format
    if (componentEvent.date !== undefined && componentEvent.time !== undefined) {
      // Parse date string manually to avoid timezone issues
      const [year, month, day] = componentEvent.date.split('-').map(Number);
      const [hours, minutes] = componentEvent.time.split(':').map(Number);
      
      // Create date object in local timezone
      const eventDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
      
      // Calculate end time based on duration
      const duration = componentEvent.duration || 2;
      const endDateTime = new Date(eventDateTime);
      endDateTime.setHours(endDateTime.getHours() + duration);
      
      // Format dates as Y-m-d and times as H:i:s
      const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
      
      const formatTime = (date: Date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
      };
      
      result.event_date = formatDate(eventDateTime);
      result.event_time = `${formatDate(eventDateTime)} ${formatTime(eventDateTime)}`; // Y-m-d H:i:s format
      result.end_date = formatDate(endDateTime);
      result.end_time = `${formatDate(endDateTime)} ${formatTime(endDateTime)}`; // Y-m-d H:i:s format
      
      // Set registration deadline if not provided
      if (!result.registration_deadline) {
        const deadlineDateTime = new Date(eventDateTime);
        deadlineDateTime.setHours(deadlineDateTime.getHours() - 24);
        result.registration_deadline = formatDate(deadlineDateTime) + ' ' + formatTime(deadlineDateTime);
      }
    } else if (componentEvent.date !== undefined || componentEvent.time !== undefined) {
      // Handle partial date/time updates (like postpone)
      // For partial updates, we need the existing event data, but for now assume we have the full context
      console.warn('Partial date/time update detected. This may not work correctly without full event context.');
    }
    
    // Handle registration deadline
    if (componentEvent.registration_deadline !== undefined) {
      result.registration_deadline = componentEvent.registration_deadline;
    }
    
    console.log('Converted API event data:', result);
    return result;
  }
}

export const eventApi = new EventApiService();