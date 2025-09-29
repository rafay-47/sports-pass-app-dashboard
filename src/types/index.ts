import type { ReactNode } from 'react';

export type Facility = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    club_id: string;
    facility_id: string;
    custom_name: string | null;
  };
};

export type Amenity = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    club_id: string;
    amenity_id: string;
    custom_name: string | null;
  };
};

export type ClubOwner = {
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

export type Club = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  phone: string | null;
  email: string | null;
  rating: string;
  category: 'male' | 'female' | 'mixed';
  qr_code: string;
  status: string;
  verification_status: string;
  timings: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sport_id: string;
  owner: ClubOwner;
  sport: Sport;
  amenities: Amenity[];
  facilities: Facility[];
  primary_image: {
    id: string;
    club_id: string;
    image_url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
  }[];
};

export type ClubFormData = {
  name: string;
  description: string;
  sport_id: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  facilities: string[];
  amenities: string[];
  timings: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  category: 'male' | 'female' | 'mixed';
  primary_image: {
    id: string;
    club_id: string;
    image_url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
  }[];
};

export type CreateClubRequest = {
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
};

export type CheckInAnalytics = {
  date: string;
  checkIns: number;
  revenue: number;
  membershipType: 'basic' | 'standard' | 'premium';
};

export type ServiceCommission = {
  id: string;
  serviceName: string;
  memberName: string;
  amount: number;
  commission: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
};

// Updated ClubEvent to match usage in EventManagementScreen.tsx
export type ClubEvent = {
  id: string;
  hostingClub: string; // Changed from clubId to match component usage (e.g., form state and JSX)
  title: string;
  description: string;
  type: 'tournament' | 'workshop' | 'league' | 'social';
  sport: string;
  date: string;
  time: string;
  duration: number; // in hours
  fee: number;
  maxParticipants: number;
  currentParticipants: number;
  requirements: { // Changed from string[] to object to match form usage
    hasRequirements: boolean;
    description: string;
  };
  prizes: { // Changed from string[] to object to match form usage
    hasPrizes: boolean;
    positions: {
      first: string;
      second: string;
      third: string;
    };
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  images: string[];
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'postponed'; // Added 'postponed' to match possible statuses
  createdAt: string;
  location?: string; // Optional, as it's set dynamically in the component
  customLocation?: { // Added to match form usage for "other" locations
    address: string;
    city: string;
    state: string;
  };
  announcement?: { // Added to match component usage (e.g., selectedEvent.announcement?.message)
    message: string;
    createdAt: string;
  };
  participants?: EventParticipant[]; // Added for consistency with component usage
  sports?: Sport[]; // Added to match component state usage
  // API-specific fields
  location_type?: 'club' | 'custom';
  club_id?: string;
  custom_address?: string;
  custom_city?: string;
  custom_state?: string;
  organizer_id?: string;
  registration_deadline?: string;
  category?: string;
};

// New EventParticipant type (inferred from usage in EventManagementScreen.tsx)
export type EventParticipant = {
  id: string;
  name: string;
  phone: string;
  emergencyContact: {
    phone: string;
  };
  tshirtSize?: string;
  medicalConditions?: string;
  dietaryRestrictions?: string;
  joinedAt: string; // Likely a date string (ISO or display-friendly)
  memberId?: string;
  membershipTier?: string;
};

export type FinancialData = {
  totalRevenue: number;
  monthlyRevenue: number;
  checkInRevenue: number;
  serviceCommissions: number;
  pendingWithdrawals: number;
  availableBalance: number;
  analytics: CheckInAnalytics[];
  commissions: ServiceCommission[];
};

export type WithdrawalRequest = {
  id: string;
  amount: number;
  method: 'bank' | 'easypaisa' | 'jazzcash' | 'sadapay';
  accountDetails: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  processedDate?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'checkin' | 'commission' | 'withdrawal' | 'membership' | 'event' | 'trainer';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
};

// Types used across the UI
export type Membership = {
  id: string;
  memberId?: string;
  sportId: string;
  membershipNumber: string;
  sportName: string;
  tier: 'basic' | 'standard' | 'premium' | string;
  status: 'active' | 'paused' | 'cancelled' | 'expired' | string;
  expiryDate: string; // ISO date string
  purchaseDate: string; // ISO date string
  autoRenew: boolean;
  price?: number;
  createdAt?: string;
  checkIns?: CheckIn[];
};

export type Sport = {
  id: string;
  name: string;
  display_name: string | null;
  icon: string;
  color: string;
  description: string | null;
  number_of_services: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  pricing?: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  // join date used in the UI (display-friendly or ISO)
  join_date?: string;
  // If the user is a registered trainer
  is_trainer?: boolean;
  // Optional trainer profile shown in the UI when isTrainer is true
  trainer_profile?: {
    sport: string;
    experience: number; // years
    membership_tier: 'basic' | 'standard' | 'premium' | string;
    rating: number; // average rating
    total_sessions: number;
    verified: boolean;
  };
  // optional membership reference
  membership_id?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  sport: string; // e.g., 'cricket', 'tennis'
  type: string; // e.g., 'tournament' | 'workshop' | 'league'
  date: string; // display-friendly or ISO date
  time: string;
  location: string;
  fee: number;
  participants: number;
  maxParticipants: number;
  requirements: string[];
  prizes: string[];
  difficulty: string;
  category: string;
  organizer: string;
  images?: string[];
  status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  createdAt?: string;
};

export type ServiceUsageHistory = {
  id: string;
  serviceName: string;
  date: string; // ISO or display
  amount: number;
  provider?: string;
  status?: 'completed' | 'upcoming' | 'cancelled' | string;
};

export type TrainerHistory = {
  id: string;
  trainerName: string;
  sessions: number;
  totalCost: number;
  lastSession?: string;
  rating?: number;
  feedback?: string;
};

export type TraineeInfo = {
  id: string;
  name: string;
  joinDate: string;
  sessionsCompleted: number;
  totalPaid: number;
  membershipTier: 'basic' | 'standard' | 'premium' | string;
  lastSession?: string;
  rating?: number;
};

export type CheckIn = {
  id: string;
  facilityName: string;
  facilityId: string;
  date: string; // ISO or display
  time?: string;
  sportType?: string;
  location?: string;
};

export type TrainerApplication = {
  sport: string; // sport id
  membershipTier: 'basic' | 'standard' | 'premium';
  experience: number;
  certifications: string[];
  availability: Array<{
    day: string;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      available: boolean;
    }>;
  }>;
  locations: string[];
  bio: string;
  specialties: string[];
  gender: 'male' | 'female' | 'both';
};

export type ServicePurchase = {
  serviceId: string;
  serviceName: string;
  sportId: string;
  price: number;
  description?: string;
  duration?: string; // e.g., '1 hour'
  type?: 'booking' | 'rental' | 'consultation' | 'session' | string;
  purchaserId?: string;
  purchasedAt?: string; // ISO date
  quantity?: number;
};