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
  type: 'info' | 'success' | 'warning' | 'error' | 'checkin' | 'commission' | 'withdrawal';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
};