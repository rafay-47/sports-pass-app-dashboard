import React from 'react';
import { Banknote, Wallet, CreditCard, Trophy, Star, Award, Users } from 'lucide-react';
import type { Sport } from '../types';

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

// A richer SPORTS constant used by UI components (keeps backward compatibility with older imports)
export const SPORTS: Sport[] = [
  {
    id: 'gym',
    name: 'Gym',
    display_name: 'Gym',
    icon: '💪',
    color: '#FFB948',
    description: 'Professional gym facilities with state-of-the-art equipment',
    number_of_services: 3,
    is_active: true,
    created_at: null,
    updated_at: null,
    pricing: { basic: 1000, standard: 2000, premium: 3000 }
  },
  {
    id: 'cricket',
    name: 'Cricket',
    display_name: 'Cricket',
    icon: '🏏',
    color: '#A148FF',
    description: 'Cricket facilities for training and matches',
    number_of_services: 3,
    is_active: true,
    created_at: null,
    updated_at: null,
    pricing: { basic: 1500, standard: 2500, premium: 3500 }
  },
  {
    id: 'tennis',
    name: 'Table Tennis',
    display_name: 'Table Tennis',
    icon: '🏓',
    color: '#FF6B6B',
    description: 'Table tennis courts and training facilities',
    number_of_services: 3,
    is_active: true,
    created_at: null,
    updated_at: null,
    pricing: { basic: 1200, standard: 2200, premium: 3200 }
  },
  {
    id: 'snooker',
    name: 'Snooker',
    display_name: 'Snooker',
    icon: '🎱',
    color: '#4ECDC4',
    description: 'Snooker tables for professional and recreational play',
    number_of_services: 2,
    is_active: true,
    created_at: null,
    updated_at: null,
    pricing: { basic: 800, standard: 1800, premium: 2800 }
  },
  {
    id: 'badminton',
    name: 'Badminton',
    display_name: 'Badminton',
    icon: '🏸',
    color: '#95E1D3',
    description: 'Badminton courts for singles and doubles play',
    number_of_services: 2,
    is_active: true,
    created_at: null,
    updated_at: null,
    pricing: { basic: 900, standard: 1900, premium: 2900 }
  },
  {
    id: 'multi-sport',
    name: 'Multi-Sport Complex',
    display_name: 'Multi-Sport',
    icon: '🏟️',
    color: '#FF6B6B',
    description: 'Comprehensive sports complex with multiple facilities',
    number_of_services: 2,
    is_active: true,
    created_at: null,
    updated_at: null,
    pricing: { basic: 2000, standard: 3000, premium: 4000 }
  }
];

export const TRAINER_FEES = {
  basic: 50000,
  standard: 120000,
  premium: 350000
};

export const MOCK_FACILITIES = [
  { id: 'fac_1', name: 'Elite Fitness Center DHA', type: 'Premium Gym', qrCode: 'QR_GYM_DHA_001', location: 'DHA Phase 5, Defence, Karachi' },
  { id: 'fac_2', name: 'Community Sports Complex', type: 'Multi-Sport', qrCode: 'QR_COMPLEX_002', location: 'North Nazimabad, Karachi' },
  { id: 'fac_3', name: 'Premium Tennis Arena', type: 'Tennis Court', qrCode: 'QR_TENNIS_003', location: 'Clifton, Karachi' }
];