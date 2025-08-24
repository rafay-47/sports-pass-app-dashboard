import { type ClubEvent } from '../types';

// Define constants directly in this file to avoid import issues
const SPORTS_TYPES = [
  { id: 'gym', name: 'Gym', icon: '💪', color: '#FFB948' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: '#A148FF' },
  { id: 'tennis', name: 'Table Tennis', icon: '🏓', color: '#FF6B6B' },
  { id: 'snooker', name: 'Snooker', icon: '🎱', color: '#4ECDC4' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', color: '#95E1D3' },
  { id: 'multi-sport', name: 'Multi-Sport Complex', icon: '🏟️', color: '#FF6B6B' }
];

const EVENT_TYPES = [
  { id: 'tournament', label: 'Tournament', color: 'text-yellow-600' },
  { id: 'workshop', label: 'Workshop', color: 'text-blue-600' },
  { id: 'league', label: 'League', color: 'text-purple-600' },
  { id: 'social', label: 'Social Event', color: 'text-green-600' }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

const PAYMENT_METHODS = [
  { id: 'bank', label: 'Bank Account', color: 'bg-blue-100 text-blue-800' },
  { id: 'easypaisa', label: 'EasyPaisa', color: 'bg-green-100 text-green-800' },
  { id: 'jazzcash', label: 'JazzCash', color: 'bg-orange-100 text-orange-800' },
  { id: 'sadapay', label: 'SadaPay', color: 'bg-purple-100 text-purple-800' }
];

export const formatCurrency = (amount: number): string => {
  return `Rs ${amount.toLocaleString()}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const getPaymentMethodInfo = (method: string) => {
  return PAYMENT_METHODS.find(m => m.id === method) || PAYMENT_METHODS[0];
};

export const getEventTypeInfo = (type: string) => {
  return EVENT_TYPES.find(t => t.id === type) || EVENT_TYPES[0];
};

export const getDifficultyInfo = (difficulty: string) => {
  return DIFFICULTY_LEVELS.find(d => d.id === difficulty) || DIFFICULTY_LEVELS[0];
};

export const getSportInfo = (sportId: string | undefined) => {
  if (!sportId) {
    return SPORTS_TYPES[0]; // Return default sport if no ID provided
  }
  return SPORTS_TYPES.find(s => s.id === sportId) || SPORTS_TYPES[0];
};

export const getEventStatusBadge = (event: ClubEvent) => {
  const eventDate = new Date(event.date);
  const now = new Date();
  
  if (event.status === 'draft') {
    return { label: 'Draft', className: 'bg-gray-100 text-gray-800' };
  }
  
  if (event.status === 'cancelled') {
    return { label: 'Cancelled', className: 'bg-red-100 text-red-800' };
  }
  
  if (eventDate < now) {
    return { label: 'Completed', className: 'bg-green-100 text-green-800' };
  }
  
  if (event.currentParticipants >= event.maxParticipants) {
    return { label: 'Full', className: 'bg-orange-100 text-orange-800' };
  }
  
  return { label: 'Open', className: 'bg-blue-100 text-blue-800' };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const generateMockAnalytics = () => {
  const mockAnalytics = [];
  const mockCommissions = [];
  
  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const checkIns = Math.floor(Math.random() * 50) + 10;
    const revenue = checkIns * (Math.random() * 300 + 200);
    
    mockAnalytics.push({
      date: date.toISOString().split('T')[0],
      checkIns,
      revenue,
      membershipType: ['basic', 'standard', 'premium'][Math.floor(Math.random() * 3)]
    });
  }

  // Generate service commissions
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const amount = Math.floor(Math.random() * 5000) + 1000;
    const commission = amount * 0.15; // 15% commission
    
    mockCommissions.push({
      id: `comm_${i}`,
      serviceName: ['Personal Training', 'Diet Plan', 'Equipment Rental', 'Tournament Entry'][Math.floor(Math.random() * 4)],
      memberName: `Member ${i + 1}`,
      amount,
      commission,
      date: date.toISOString().split('T')[0],
      status: ['completed', 'pending'][Math.floor(Math.random() * 2)]
    });
  }

  const totalRevenue = mockAnalytics.reduce((sum, item) => sum + item.revenue, 0) + 
                      mockCommissions.reduce((sum, item) => sum + item.commission, 0);
  const monthlyRevenue = totalRevenue;
  const checkInRevenue = mockAnalytics.reduce((sum, item) => sum + item.revenue, 0);
  const serviceCommissions = mockCommissions.reduce((sum, item) => sum + item.commission, 0);

  return {
    totalRevenue,
    monthlyRevenue,
    checkInRevenue,
    serviceCommissions,
    pendingWithdrawals: 0,
    availableBalance: totalRevenue * 0.8, // 80% available, 20% processing
    analytics: mockAnalytics,
    commissions: mockCommissions
  };
};