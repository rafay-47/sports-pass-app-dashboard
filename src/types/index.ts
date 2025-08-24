import type { ReactNode } from 'react';

export type ClubOwner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar?: string;
};

export type Club = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  type: 'gym' | 'cricket' | 'tennis' | 'snooker' | 'badminton' | 'multi-sport';
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  amenities: string[];
  timings: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  pricing: {
    basic: number;
    standard: number;
    premium: number;
  };
  category: 'male' | 'female' | 'mixed';
  images: string[];
  qrCode: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
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

export type ClubEvent = {
  id: string;
  clubId: string;
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
  requirements: string[];
  prizes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  images: string[];
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
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
  displayName: string;
  color: string; // CSS color string (hex, rgb, etc.)
  icon?: ReactNode;
  services: Array<{ id: string; name: string }> | string[];
  description?: string;
  pricing:{
    basic: number;
    standard: number;
    premium: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  // join date used in the UI (display-friendly or ISO)
  joinDate?: string;
  // If the user is a registered trainer
  isTrainer?: boolean;
  // Optional trainer profile shown in the UI when isTrainer is true
  trainerProfile?: {
    sport: string;
    experience: number; // years
    membershipTier: 'basic' | 'standard' | 'premium' | string;
    rating: number; // average rating
    totalSessions: number;
    verified: boolean;
  };
  // optional membership reference
  membershipId?: string;
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
  status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

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