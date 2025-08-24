import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Award, 
  Users, 
  Lock,
  Phone,
  MessageCircle,
  Crown,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { SPORTS, TRAINER_FEES } from '../constants';
import type { User, Membership, Sport } from '../types';

interface TrainerListScreenProps {
  sport: string;
  userTier: 'basic' | 'standard' | 'premium' | null;
  user: User | null;
  memberships: Membership[];
  onBack: () => void;
  onSignup: () => void;
}

// Mock trainer data with tier-based organization
const MOCK_TRAINERS = {
  basic: [
    {
      id: '1',
      name: 'Ali Hassan',
      sport: 'gym',
      membershipTier: 'basic' as const,
      experience: 3,
      rating: 4.5,
      totalSessions: 120,
      verified: true,
      bio: 'Dedicated fitness trainer specializing in basic workout routines and beginner-friendly programs.',
      specialties: ['Basic Training', 'Weight Loss', 'Cardio'],
      locations: ['DHA Gym', 'Clifton Fitness'],
      availability: 'Mon-Fri: 6AM-8AM, 6PM-8PM',
      gender: 'both' as const
    },
    {
      id: '2',
      name: 'Fatima Khan',
      sport: 'gym',
      membershipTier: 'basic' as const,
      experience: 4,
      rating: 4.3,
      totalSessions: 95,
      verified: true,
      bio: 'Female fitness trainer focusing on women\'s health and basic strength training.',
      specialties: ['Women\'s Fitness', 'Basic Strength', 'Flexibility'],
      locations: ['Ladies Gym', 'Home Training'],
      availability: 'Tue-Sat: 7AM-10AM, 5PM-7PM',
      gender: 'female' as const
    }
  ],
  standard: [
    {
      id: '3',
      name: 'Ahmed Malik',
      sport: 'gym',
      membershipTier: 'standard' as const,
      experience: 6,
      rating: 4.7,
      totalSessions: 280,
      verified: true,
      bio: 'Experienced trainer specializing in intermediate programs and sports conditioning.',
      specialties: ['Sports Conditioning', 'Strength Training', 'Nutrition Planning'],
      locations: ['Elite Fitness', 'Sports Complex DHA', 'Online Sessions'],
      availability: 'Daily: 6AM-10AM, 4PM-8PM',
      gender: 'both' as const
    },
    {
      id: '4',
      name: 'Sarah Ahmed',
      sport: 'gym',
      membershipTier: 'standard' as const,
      experience: 5,
      rating: 4.6,
      totalSessions: 190,
      verified: true,
      bio: 'Certified trainer with focus on functional fitness and intermediate level training.',
      specialties: ['Functional Training', 'CrossFit', 'Injury Prevention'],
      locations: ['CrossFit Box', 'Fitness Studio'],
      availability: 'Mon-Fri: 5AM-9AM, 5PM-9PM',
      gender: 'female' as const
    }
  ],
  premium: [
    {
      id: '5',
      name: 'Muhammad Rizwan',
      sport: 'gym',
      membershipTier: 'premium' as const,
      experience: 12,
      rating: 4.9,
      totalSessions: 650,
      verified: true,
      bio: 'Elite trainer with international certifications, specializing in advanced training methods.',
      specialties: ['Advanced Training', 'Competition Prep', 'Sports Science', 'Recovery'],
      locations: ['Premium Fitness Club', 'Private Studios', 'Client Homes'],
      availability: 'By Appointment - Flexible Schedule',
      gender: 'both' as const
    },
    {
      id: '6',
      name: 'Dr. Ayesha Ali',
      sport: 'gym',
      membershipTier: 'premium' as const,
      experience: 10,
      rating: 4.8,
      totalSessions: 450,
      verified: true,
      bio: 'Sports medicine doctor and elite trainer, offering comprehensive fitness solutions.',
      specialties: ['Sports Medicine', 'Rehabilitation', 'Elite Training', 'Medical Fitness'],
      locations: ['Medical Fitness Center', 'Elite Sports Club'],
      availability: 'Mon-Sat: Flexible Timing',
      gender: 'both' as const
    }
  ]
};

export default function TrainerListScreen({ sport, userTier, user, memberships, onBack, onSignup }: TrainerListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>(userTier || 'basic');

  if (!user) {
    return (
      <div className="h-full bg-[#252525] text-white flex flex-col items-center justify-center p-6 rounded-[19px]">
        <div className="absolute top-[100px] right-8 w-16 h-16 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-[150px] left-6 w-20 h-20 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
        
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-[#FFB948]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Trainer Access Restricted</h2>
          <p className="text-white/70 text-base mb-6 leading-relaxed">
            Find and book certified trainers for personalized coaching sessions. Sign up to access our trainer network and book sessions.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Users className="w-5 h-5 text-[#A148FF]" />
              <span>Certified professional trainers</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Star className="w-5 h-5 text-[#FFB948]" />
              <span>Verified profiles with ratings</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Clock className="w-5 h-5 text-green-400" />
              <span>Flexible scheduling options</span>
            </div>
          </div>
          
          <Button
            onClick={onSignup}
            className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-3 text-base"
          >
            Sign Up to Book Trainers
          </Button>
          
          <div className="mt-4 text-xs text-white/50">
            Get personalized coaching from certified professionals
          </div>
        </div>
      </div>
    );
  }

  const selectedSport = SPORTS.find(s => s.id === sport) as Sport | undefined;
  const userMembership = memberships.find(m => m.sportId === sport);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium': return <Crown className="w-4 h-4" />;
      case 'standard': return <Star className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'text-yellow-400';
      case 'standard': return 'text-purple-400';
      default: return 'text-blue-400';
    }
  };

  const canAccessTier = (tier: 'basic' | 'standard' | 'premium') => {
    if (!userMembership) return false;
    const tierLevels = { basic: 1, standard: 2, premium: 3 };
    return tierLevels[userMembership.tier as keyof typeof tierLevels] >= tierLevels[tier];
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'both': return '👥';
      default: return '👤';
    }
  };

  return (
    <div className="screen-container bg-[#252525] text-white rounded-[19px]">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSport?.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{selectedSport?.name} Trainers</h1>
              <p className="text-white/60 text-sm">
                Your membership: {userMembership?.tier || 'None'} • Choose from verified trainers
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Tier Tabs */}
      <Tabs value={selectedTier} onValueChange={(value) => setSelectedTier(value as 'basic' | 'standard' | 'premium')} className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            {(['basic', 'standard', 'premium'] as const).map((tier) => {
              const hasAccess = canAccessTier(tier);
              return (
                <TabsTrigger 
                  key={tier}
                  value={tier} 
                  disabled={!hasAccess}
                  className={`data-[state=active]:bg-[#A148FF] data-[state=active]:text-white relative ${
                    !hasAccess ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getTierIcon(tier)}
                    <span className="capitalize">{tier}</span>
                    {!hasAccess && <Lock className="w-3 h-3" />}
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Badge className={`text-xs px-1 py-0 ${getTierColor(tier)} bg-white/10`}>
                      Rs {TRAINER_FEES[tier] / 1000}K
                    </Badge>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {(['basic', 'standard', 'premium'] as const).map((tier) => (
            <TabsContent key={tier} value={tier} className="h-full m-0">
              {!canAccessTier(tier) ? (
                // Restricted Access View
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-10 h-10 text-yellow-400" />
                  </div>
                  
                  <h3 className="text-white text-lg font-bold mb-2">
                    {tier.charAt(0).toUpperCase() + tier.slice(1)} Trainers Locked
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <p className="text-white/70 text-sm">
                      Upgrade to {tier} membership to access these trainers
                    </p>
                    
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white/80 text-sm font-medium mb-2">
                        {tier.charAt(0).toUpperCase() + tier.slice(1)} Trainers Include:
                      </div>
                      <div className="space-y-1 text-xs text-white/60">
                        <div>• Fixed rate training sessions</div>
                        <div>• {tier === 'premium' ? 'Elite certified trainers' : `${tier === 'standard' ? 'Advanced' : 'Professional'} training methods`}</div>
                        <div>• {tier === 'premium' ? 'Personalized meal planning' : 'Customized workout plans'}</div>
                        <div>• Priority booking & flexible scheduling</div>
                      </div>
                    </div>
                    
                    <div className="text-white/60 text-sm">
                      You can see {MOCK_TRAINERS[tier].length} {tier} trainers but cannot contact them
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90">
                    Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Button>
                </div>
              ) : (
                // Accessible Trainers List
                <ScrollArea className="h-full">
                  <div className="px-6 py-4 space-y-4">
                    {/* Tier Info Header */}
                    <Card className="bg-gradient-to-r from-[#A148FF]/20 to-[#FFB948]/20 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTierColor(tier)} bg-white/20`}>
                              {getTierIcon(tier)}
                            </div>
                            <div>
                              <div className="text-white font-bold capitalize">{tier} Trainers</div>
                              <div className="text-white/70 text-sm">
                                Rs {TRAINER_FEES[tier].toLocaleString()}/hour • {MOCK_TRAINERS[tier].length} available
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accessible
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Trainers List */}
                    {MOCK_TRAINERS[tier]
                      .filter(trainer => !searchQuery || 
                        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        trainer.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())))
                      .map((trainer) => (
                      <Card key={trainer.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Trainer Avatar */}
                            <div className="w-16 h-16 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-8 h-8 text-white" />
                            </div>

                            {/* Trainer Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold">{trainer.name}</h3>
                                    {trainer.verified && (
                                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                        <Award className="w-3 h-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                    <Badge className="bg-white/10 text-white/70 text-xs">
                                      {getGenderIcon(trainer.gender)} {trainer.gender}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mb-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-white text-sm">{trainer.rating}</span>
                                      <span className="text-white/60 text-sm">({trainer.totalSessions})</span>
                                    </div>
                                    <div className="text-white/60 text-sm">
                                      {trainer.experience} years exp.
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Bio */}
                              <p className="text-white/70 text-sm mb-3 line-clamp-2">{trainer.bio}</p>

                              {/* Specialties */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {trainer.specialties.slice(0, 3).map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70">
                                    {specialty}
                                  </Badge>
                                ))}
                                {trainer.specialties.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                                    +{trainer.specialties.length - 3} more
                                  </Badge>
                                )}
                              </div>

                              {/* Location & Availability */}
                              <div className="space-y-1 mb-3">
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                  <MapPin className="w-4 h-4" />
                                  <span>{trainer.locations.slice(0, 2).join(', ')}</span>
                                  {trainer.locations.length > 2 && <span>+{trainer.locations.length - 2} more</span>}
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                  <Clock className="w-4 h-4" />
                                  <span>{trainer.availability}</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    <Phone className="w-4 h-4 mr-1" />
                                    Call
                                  </Button>
                                  <Button size="sm" className="bg-[#A148FF] hover:bg-[#A148FF]/90">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Book Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {MOCK_TRAINERS[tier].length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-white/40 text-lg mb-2">No trainers found</div>
                        <div className="text-white/60 text-sm">Try adjusting your search</div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}