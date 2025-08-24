import React from 'react';
import { Banknote, Wallet, CreditCard, Trophy, Star, Award, Users } from 'lucide-react';

export const SPORTS_TYPES = [
  { id: 'gym', name: 'Gym', icon: '💪', color: '#FFB948' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: '#A148FF' },
  { id: 'tennis', name: 'Table Tennis', icon: '🏓', color: '#FF6B6B' },
  { id: 'snooker', name: 'Snooker', icon: '🎱', color: '#4ECDC4' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', color: '#95E1D3' },
  { id: 'multi-sport', name: 'Multi-Sport Complex', icon: '🏟️', color: '#FF6B6B' }
];

export const EVENT_TYPES = [
  { id: 'tournament', label: 'Tournament', icon: Trophy, color: 'text-yellow-600' },
  { id: 'workshop', label: 'Workshop', icon: Star, color: 'text-blue-600' },
  { id: 'league', label: 'League', icon: Award, color: 'text-purple-600' },
  { id: 'social', label: 'Social Event', icon: Users, color: 'text-green-600' }
];

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

export const PAYMENT_METHODS = [
  { id: 'bank', label: 'Bank Account', icon: Banknote, color: 'bg-blue-100 text-blue-800' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: Wallet, color: 'bg-green-100 text-green-800' },
  { id: 'jazzcash', label: 'JazzCash', icon: Wallet, color: 'bg-orange-100 text-orange-800' },
  { id: 'sadapay', label: 'SadaPay', icon: CreditCard, color: 'bg-purple-100 text-purple-800' }
];

export const DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

export const AMENITIES = [
  'Free WiFi', 'Parking', 'Locker Rooms', 'Shower Facilities', 'Air Conditioning',
  'Equipment Rental', 'First Aid', 'Security', 'Cafeteria', 'Pro Shop',
  'Personal Training', 'Group Classes', 'Towel Service', 'Water Fountain'
];