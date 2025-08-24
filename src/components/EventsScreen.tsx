import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { 
  Calendar, 
  Lock, 
  Trophy, 
  Users, 
  Clock, 
  MapPin,
  DollarSign,
  Star,
  Award,
  Target,
  Zap,
  Filter,
  Search,
  TrendingUp,
  Gift,
  AlertCircle
} from 'lucide-react';
import { type User, type Membership, type Event } from '../types';

interface EventsScreenProps {
  user: User | null;
  memberships: Membership[];
  onSignup: () => void;
  onEventRegister: (event: Event) => void;
}

// Enhanced mock events data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Cricket Championship 2024',
    sport: 'Cricket',
    date: 'Dec 15, 2024',
    time: '9:00 AM',
    type: 'Tournament',
    fee: 2500,
    participants: 24,
    maxParticipants: 32,
    location: 'National Stadium, Karachi',
    description: 'Annual cricket championship featuring teams from all over Pakistan. Join the most exciting cricket tournament of the year!',
    requirements: ['Valid cricket membership', 'Team registration required', 'Minimum 11 players per team'],
    prizes: ['1st Place: Rs 200,000', '2nd Place: Rs 150,000', '3rd Place: Rs 100,000', 'Best Player: Rs 50,000'],
    difficulty: 'intermediate',
    category: 'tournament',
    organizer: 'Pakistan Cricket Association'
  },
  {
    id: '2',
    title: 'High-Intensity Fitness Bootcamp',
    sport: 'Gym',
    date: 'Dec 20, 2024',
    time: '6:00 AM',
    type: 'Workshop',
    fee: 1500,
    participants: 12,
    maxParticipants: 15,
    location: 'Elite Fitness Center, DHA',
    description: 'Transform your fitness with our intensive bootcamp. Professional trainers will guide you through challenging workouts.',
    requirements: ['Gym membership required', 'Bring water bottle and towel', 'Wear comfortable workout clothes'],
    prizes: ['Fitness assessment report', 'Personalized workout plan', 'Nutrition guide'],
    difficulty: 'intermediate',
    category: 'workshop',
    organizer: 'Elite Fitness Team'
  },
  {
    id: '3',
    title: 'Table Tennis Champions League',
    sport: 'Table Tennis',
    date: 'Dec 22, 2024',
    time: '7:00 PM',
    type: 'League',
    fee: 1200,
    participants: 18,
    maxParticipants: 24,
    location: 'TT Arena, Nazimabad',
    description: 'Monthly table tennis league with exciting matches and prizes. All skill levels welcome!',
    requirements: ['Table tennis membership', 'Bring your own paddle (optional)', 'Registration deadline: Dec 20'],
    prizes: ['Champion Trophy', 'Runner-up Medal', 'Participation Certificates'],
    difficulty: 'beginner',
    category: 'league',
    organizer: 'TT Arena Management'
  },
  {
    id: '4',
    title: 'Badminton Doubles Championship',
    sport: 'Badminton',
    date: 'Dec 25, 2024',
    time: '4:00 PM',
    type: 'Tournament',
    fee: 2000,
    participants: 14,
    maxParticipants: 16,
    location: 'Sports Complex DHA, Phase 5',
    description: 'Professional doubles badminton championship with exciting cash prizes. Partner up and compete!',
    requirements: ['Badminton membership', 'Partner required', 'Intermediate level minimum'],
    prizes: ['Winners: Rs 30,000', 'Runners-up: Rs 20,000', 'Semi-finalists: Rs 10,000 each'],
    difficulty: 'advanced',
    category: 'tournament',
    organizer: 'DHA Sports Complex'
  },
  {
    id: '5',
    title: 'Snooker Masters Tournament',
    sport: 'Snooker',
    date: 'Dec 28, 2024',
    time: '2:00 PM',
    type: 'Tournament',
    fee: 3000,
    participants: 8,
    maxParticipants: 16,
    location: 'Elite Snooker Club, Clifton',
    description: 'Elite snooker tournament with knockout format. Showcase your skills against the best players.',
    requirements: ['Snooker club membership', 'Registration fee includes table time', 'Dress code: Formal attire'],
    prizes: ['Champion: Rs 50,000', 'Runner-up: Rs 25,000', 'Highest Break Prize: Rs 10,000'],
    difficulty: 'advanced',
    category: 'tournament',
    organizer: 'Elite Snooker Club'
  },
  {
    id: '6',
    title: 'Beginner\'s Gym Orientation',
    sport: 'Gym',
    date: 'Jan 5, 2025',
    time: '10:00 AM',
    type: 'Workshop',
    fee: 500,
    participants: 8,
    maxParticipants: 20,
    location: 'Community Fitness Center',
    description: 'Perfect for beginners! Learn proper form, equipment usage, and create your first workout plan.',
    requirements: ['No experience needed', 'Comfortable workout clothes', 'Water bottle'],
    prizes: ['Free nutrition consultation', 'Beginner workout plan', 'Equipment usage guide'],
    difficulty: 'beginner',
    category: 'workshop',
    organizer: 'Fitness Community'
  }
];

export default function EventsScreen({ user, memberships, onSignup, onEventRegister }: EventsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tournament' | 'workshop' | 'league' | 'social'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [showFilters, setShowFilters] = useState(false);

  if (!user) {
    return (
      <div className="screen-container bg-[#252525] text-white rounded-[19px] relative">
        <div className="absolute top-[80px] right-6 w-20 h-20 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-[120px] left-8 w-16 h-16 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
        
        <div className="flex items-center justify-center h-full p-6">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-[#FFB948]" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Events Access Restricted</h2>
            <p className="text-white/70 text-base mb-6 leading-relaxed">
              Join tournaments, competitions, and community events. Sign up to participate in exclusive sports activities and win amazing prizes.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Trophy className="w-5 h-5 text-[#A148FF]" />
                <span>Competitive tournaments</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Users className="w-5 h-5 text-[#FFB948]" />
                <span>Community events & workshops</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Gift className="w-5 h-5 text-green-400" />
                <span>Amazing prizes & rewards</span>
              </div>
            </div>
            
            <Button
              onClick={onSignup}
              className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-3 text-base"
            >
              Sign Up to Join Events
            </Button>
            
            <div className="mt-4 text-xs text-white/50">
              Be part of our vibrant sports community
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tournament': return <Trophy className="w-5 h-5" />;
      case 'workshop': return <Star className="w-5 h-5" />;
      case 'league': return <Award className="w-5 h-5" />;
      case 'social': return <Users className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getEventColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tournament': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'workshop': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'league': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'social': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const filteredEvents = MOCK_EVENTS.filter(event => {
    // Search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.sport.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && event.category !== categoryFilter) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && event.difficulty !== difficultyFilter) {
      return false;
    }

    return true;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const featuredEvents = upcomingEvents.slice(0, 2);

  return (
    <div className="screen-container bg-[#252525] text-white rounded-[19px]">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Sports Events</h1>
            <p className="text-white/60 text-sm">
              {memberships.length > 0 ? 
                `${upcomingEvents.length} events available for your memberships` :
                'Sign up for memberships to unlock exclusive events'
              }
            </p>
          </div>
          <Badge className="bg-[#FFB948]/20 text-[#FFB948] border-[#FFB948]/30 text-xs">
            {upcomingEvents.length} Upcoming
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-white/10 h-8 w-8 p-0"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 space-y-3">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Category</label>
                <div className="flex gap-1 flex-wrap">
                  {(['all', 'tournament', 'workshop', 'league', 'social'] as const).map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                      className={`text-xs h-7 px-2 ${categoryFilter === category ? 
                        'bg-[#A148FF] hover:bg-[#A148FF]/90' : 
                        'border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="capitalize">{category}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Difficulty</label>
                <div className="flex gap-1 flex-wrap">
                  {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={difficultyFilter === difficulty ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDifficultyFilter(difficulty)}
                      className={`text-xs h-7 px-2 ${difficultyFilter === difficulty ? 
                        'bg-[#FFB948] hover:bg-[#FFB948]/90' : 
                        'border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="capitalize">{difficulty}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="scrollable-content">
        <div className="p-4 space-y-4">
          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FFB948]" />
                <h2 className="text-white text-lg font-bold">Featured Events</h2>
                <Badge className="bg-[#FFB948]/20 text-[#FFB948] border-[#FFB948]/30 text-xs">
                  Hot
                </Badge>
              </div>
              
              <div className="space-y-3">
                {featuredEvents.map((event) => {
                  const hasAccess = memberships.some(m => 
                    m.sportName.toLowerCase().includes(event.sport.toLowerCase()) ||
                    event.sport.toLowerCase().includes(m.sportName.toLowerCase())
                  );
                  const spotsLeft = event.maxParticipants - event.participants;
                  
                  return (
                    <Card key={event.id} className="bg-gradient-to-r from-[#A148FF]/10 to-[#FFB948]/10 border-[#A148FF]/30 hover:from-[#A148FF]/20 hover:to-[#FFB948]/20 transition-all">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getEventColor(event.category)}`}>
                                {getEventIcon(event.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h3 className="text-white font-bold text-base leading-tight">{event.title}</h3>
                                  <Badge className={`${getEventColor(event.category)} text-xs`}>
                                    {event.type}
                                  </Badge>
                                  <Badge className={`${getDifficultyColor(event.difficulty)} text-xs`}>
                                    {event.difficulty}
                                  </Badge>
                                </div>
                                
                                <p className="text-white/70 text-sm mb-2 leading-relaxed line-clamp-2">{event.description}</p>
                              </div>
                            </div>
                            
                            <div className="text-right ml-2 flex-shrink-0">
                              <div className="text-[#FFB948] font-bold text-lg">
                                Rs {event.fee.toLocaleString()}
                              </div>
                              <div className="text-white/60 text-xs mb-1">Fee</div>
                              <div className={`text-sm font-medium ${spotsLeft <= 3 ? 'text-red-400' : 'text-green-400'}`}>
                                {spotsLeft > 0 ? `${spotsLeft} left` : 'Full'}
                              </div>
                            </div>
                          </div>

                          {/* Event Details Grid */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-white/70">
                              <Calendar className="w-4 h-4 text-[#A148FF]" />
                              <span className="truncate">{event.date}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-white/70">
                              <Clock className="w-4 h-4 text-[#FFB948]" />
                              <span className="truncate">{event.time}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-white/70 col-span-2">
                              <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30 text-xs">
                                {event.sport}
                              </Badge>
                              {hasAccess ? (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                  ✓ Eligible
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                  Need Membership
                                </Badge>
                              )}
                              {spotsLeft <= 5 && spotsLeft > 0 && (
                                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 animate-pulse text-xs">
                                  Limited!
                                </Badge>
                              )}
                            </div>
                            
                            <Button 
                              size="sm"
                              onClick={() => onEventRegister(event)}
                              className={`ml-2 ${hasAccess && spotsLeft > 0 ? 
                                "bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90" :
                                "bg-gray-600 cursor-not-allowed"
                              }`}
                              disabled={!hasAccess || spotsLeft === 0}
                            >
                              <div className="flex items-center gap-1">
                                {!hasAccess ? (
                                  <AlertCircle className="w-3 h-3" />
                                ) : spotsLeft === 0 ? (
                                  <Users className="w-3 h-3" />
                                ) : (
                                  <DollarSign className="w-3 h-3" />
                                )}
                                <span className="text-xs">
                                  {!hasAccess ? 'Need Membership' : 
                                   spotsLeft === 0 ? 'Full' : 'Register'}
                                </span>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Events */}
          <div className="space-y-3">
            <h2 className="text-white text-lg font-bold">All Events</h2>
            
            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const hasAccess = memberships.some(m => 
                  m.sportName.toLowerCase().includes(event.sport.toLowerCase()) ||
                  event.sport.toLowerCase().includes(m.sportName.toLowerCase())
                );
                const spotsLeft = event.maxParticipants - event.participants;
                
                return (
                  <Card key={event.id} className={`bg-white/10 border-white/20 hover:bg-white/15 transition-all ${!hasAccess ? 'opacity-70' : ''}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getEventColor(event.category)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-white font-bold text-sm">{event.title}</h3>
                              <Badge className={`${getEventColor(event.category)} text-xs`}>
                                {event.type}
                              </Badge>
                              <Badge className={`${getDifficultyColor(event.difficulty)} text-xs`}>
                                {event.difficulty}
                              </Badge>
                            </div>
                            
                            <p className="text-white/70 text-xs mb-2 line-clamp-2">{event.description}</p>
                            
                            <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.participants}/{event.maxParticipants}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="text-[#FFB948] font-bold text-sm">
                            Rs {event.fee.toLocaleString()}
                          </div>
                          <div className="text-white/60 text-xs mb-1">Fee</div>
                          <div className={`text-xs font-medium ${spotsLeft <= 3 ? 'text-red-400' : 'text-green-400'}`}>
                            {spotsLeft > 0 ? `${spotsLeft} left` : 'Full'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30 text-xs">
                            {event.sport}
                          </Badge>
                          {hasAccess ? (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              ✓ Eligible
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                              Need Membership
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => onEventRegister(event)}
                          className={`h-8 px-3 text-xs ${hasAccess && spotsLeft > 0 ? 
                            "bg-[#A148FF] hover:bg-[#A148FF]/90" :
                            "bg-gray-600 cursor-not-allowed"
                          }`}
                          disabled={!hasAccess || spotsLeft === 0}
                        >
                          {!hasAccess ? 'Need Membership' : 
                           spotsLeft === 0 ? 'Full' : 'Register'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-white/40 text-lg mb-2">No events found</div>
                  <div className="text-white/60 text-sm">Try adjusting your search or filters</div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom padding for navigation */}
          <div className="h-8"></div>
        </div>
      </ScrollArea>
    </div>
  );
}