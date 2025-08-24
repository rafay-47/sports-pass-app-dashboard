import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MapPin, 
  Lock, 
  List, 
  Map, 
  Search, 
  Filter, 
  Star,
  Navigation,
  Clock,
  Phone,
  Users,
  Car,
  Wifi,
  Dumbbell,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { type User } from '../types';

interface LocationScreenProps {
  user: User | null;
  onSignup: () => void;
}

// Mock facility data
const MOCK_FACILITIES = [
  {
    id: '1',
    name: 'Elite Fitness Center DHA',
    type: 'Premium Gym',
    distance: '0.8 km',
    rating: 4.8,
    price: 5000,
    category: 'mixed' as const,
    location: {
      address: 'DHA Phase 5, Defence, Karachi',
      lat: 24.8607,
      lng: 67.0011
    },
    amenities: ['AC', 'Parking', 'WiFi', 'Locker', 'Shower'],
    sports: ['Gym', 'Cardio', 'CrossFit'],
    images: ['gym1.jpg', 'gym2.jpg'],
    hours: '5:00 AM - 11:00 PM',
    phone: '+92 21 3500 1234'
  },
  {
    id: '2',
    name: 'Ladies Only Fitness',
    type: 'Women Exclusive',
    distance: '1.2 km',
    rating: 4.6,
    price: 3500,
    category: 'female' as const,
    location: {
      address: 'Clifton Block 2, Karachi',
      lat: 24.8138,
      lng: 67.0299
    },
    amenities: ['AC', 'Parking', 'Female Staff', 'Kids Area'],
    sports: ['Gym', 'Yoga', 'Aerobics'],
    images: ['ladies1.jpg'],
    hours: '6:00 AM - 10:00 PM',
    phone: '+92 21 3500 5678'
  },
  {
    id: '3',
    name: 'Men\'s Power Gym',
    type: 'Male Exclusive',
    distance: '2.1 km',
    rating: 4.5,
    price: 4200,
    category: 'male' as const,
    location: {
      address: 'Gulshan-e-Iqbal, Karachi',
      lat: 24.9056,
      lng: 67.0822
    },
    amenities: ['Heavy Weights', 'Protein Bar', 'Parking'],
    sports: ['Powerlifting', 'Bodybuilding', 'Boxing'],
    images: ['mens1.jpg'],
    hours: '5:30 AM - 11:30 PM',
    phone: '+92 21 3400 9876'
  },
  {
    id: '4',
    name: 'Community Sports Complex',
    type: 'Multi-Sport',
    distance: '3.5 km',
    rating: 4.3,
    price: 2800,
    category: 'mixed' as const,
    location: {
      address: 'North Nazimabad, Karachi',
      lat: 24.9324,
      lng: 67.0454
    },
    amenities: ['Multiple Courts', 'Cafeteria', 'Parking'],
    sports: ['Cricket', 'Badminton', 'Table Tennis'],
    images: ['complex1.jpg'],
    hours: '6:00 AM - 10:00 PM',
    phone: '+92 21 3600 1111'
  },
  {
    id: '5',
    name: 'Affordable Fitness Hub',
    type: 'Budget Friendly',
    distance: '1.8 km',
    rating: 4.0,
    price: 2000,
    category: 'mixed' as const,
    location: {
      address: 'FB Area, Karachi',
      lat: 24.9056,
      lng: 67.0622
    },
    amenities: ['Basic Equipment', 'Locker'],
    sports: ['Gym', 'Cardio'],
    images: ['budget1.jpg'],
    hours: '6:00 AM - 9:00 PM',
    phone: '+92 21 3200 3456'
  },
  {
    id: '6',
    name: 'Premium Sports Club',
    type: 'Luxury',
    distance: '4.2 km',
    rating: 4.9,
    price: 8000,
    category: 'mixed' as const,
    location: {
      address: 'DHA Phase 8, Karachi',
      lat: 24.8467,
      lng: 67.0633
    },
    amenities: ['Pool', 'Spa', 'Restaurant', 'Valet'],
    sports: ['Swimming', 'Tennis', 'Gym', 'Squash'],
    images: ['premium1.jpg'],
    hours: '5:00 AM - 12:00 AM',
    phone: '+92 21 3500 7777'
  }
];

export default function LocationScreen({ user, onSignup }: LocationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'mixed'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under5000' | '5000to7000' | 'over7000'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);

  if (!user) {
    return (
      <div className="h-full bg-[#252525] text-white flex flex-col items-center justify-center p-6 rounded-[19px] relative overflow-hidden">
        <div className="absolute top-[100px] right-8 w-20 h-20 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-[150px] left-6 w-16 h-16 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
        
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-[#FFB948]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Location Access Restricted</h2>
          <p className="text-white/70 text-base mb-6 leading-relaxed">
            Find sports facilities near you with detailed information, ratings, and directions. Sign up to discover gyms, courts, and clubs in your area.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <MapPin className="w-5 h-5 text-[#A148FF]" />
              <span>Nearby facilities</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Star className="w-5 h-5 text-[#FFB948]" />
              <span>Reviews & ratings</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Navigation className="w-5 h-5 text-green-400" />
              <span>GPS navigation</span>
            </div>
          </div>
          
          <Button
            onClick={onSignup}
            className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-3 text-base"
          >
            Sign Up to Find Locations
          </Button>
          
          <div className="mt-4 text-xs text-white/50">
            Discover the best sports facilities around you
          </div>
        </div>
      </div>
    );
  }

  const getGenderIcon = (category: string) => {
    switch (category) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'mixed': return '👥';
      default: return '🏢';
    }
  };

  const filteredFacilities = MOCK_FACILITIES.filter(facility => {
    // Search filter
    if (searchQuery && !facility.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !facility.type.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !facility.location.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Gender filter
    if (genderFilter !== 'all' && facility.category !== genderFilter) {
      return false;
    }

    // Price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under5000':
          if (facility.price >= 5000) return false;
          break;
        case '5000to7000':
          if (facility.price < 5000 || facility.price > 7000) return false;
          break;
        case 'over7000':
          if (facility.price <= 7000) return false;
          break;
      }
    }

    return true;
  });

  return (
    <div className="h-full bg-[#252525] text-white flex flex-col rounded-[19px] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">Nearby Facilities</h1>
            <p className="text-white/60 text-sm">{filteredFacilities.length} facilities found</p>
          </div>
          <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30">
            <MapPin className="w-3 h-3 mr-1" />
            Active GPS
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-white/10"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
              <TabsTrigger value="list" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white">
                <List className="w-4 h-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white">
                <Map className="w-4 h-4 mr-2" />
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="text-white/60 text-sm">
            Sorted by distance
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 bg-white/5 rounded-lg p-3 border border-white/10 space-y-3">
            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">Gender Preference</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'male', 'female', 'mixed'] as const).map((gender) => (
                  <Button
                    key={gender}
                    variant={genderFilter === gender ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGenderFilter(gender)}
                    className={`text-xs ${genderFilter === gender ? 
                      'bg-[#A148FF] hover:bg-[#A148FF]/90' : 
                      'border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-1">{getGenderIcon(gender)}</span>
                    <span className="capitalize">{gender}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">Price Range</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under5000', label: 'Under Rs 5K' },
                  { value: '5000to7000', label: 'Rs 5K - 7K' },
                  { value: 'over7000', label: 'Over Rs 7K' }
                ].map((price) => (
                  <Button
                    key={price.value}
                    variant={priceFilter === price.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceFilter(price.value as any)}
                    className={`text-xs ${priceFilter === price.value ? 
                      'bg-[#FFB948] hover:bg-[#FFB948]/90' : 
                      'border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {price.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {filteredFacilities.map((facility) => (
                <Card key={facility.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-lg flex items-center justify-center text-2xl">
                            {getGenderIcon(facility.category)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base mb-1">{facility.name}</h3>
                            <p className="text-white/70 text-sm mb-2">{facility.type}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {facility.distance}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                {facility.rating}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Open
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[#FFB948] font-bold text-lg">Rs {facility.price.toLocaleString()}</div>
                          <div className="text-white/60 text-xs">per month</div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="truncate">{facility.location.address}</span>
                      </div>

                      {/* Sports */}
                      <div className="flex flex-wrap gap-1">
                        {facility.sports.map((sport, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70">
                            {sport}
                          </Badge>
                        ))}
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1">
                        {facility.amenities.slice(0, 4).map((amenity, index) => (
                          <Badge key={index} className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30 text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {facility.amenities.length > 4 && (
                          <Badge className="bg-white/10 text-white/70 text-xs">
                            +{facility.amenities.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-[#A148FF] hover:bg-[#A148FF]/90">
                          <Navigation className="w-4 h-4 mr-1" />
                          Directions
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Target className="w-4 h-4 mr-1" />
                          Check In
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredFacilities.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-white/40 text-lg mb-2">No facilities found</div>
                  <div className="text-white/60 text-sm">Try adjusting your search or filters</div>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          /* Map View */
          <div className="h-full bg-white/5 flex items-center justify-center relative">
            <div className="absolute inset-4 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg border border-white/10">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <div className="text-white/60 text-lg mb-2">Interactive Map</div>
                  <div className="text-white/40 text-sm">
                    Map view with {filteredFacilities.length} facilities marked
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Markers Preview */}
            <div className="absolute top-6 left-6 right-6">
              <ScrollArea className="max-h-32">
                <div className="flex gap-2">
                  {filteredFacilities.slice(0, 6).map((facility, index) => (
                    <div key={facility.id} className="flex-shrink-0 bg-white/10 rounded-lg p-2 border border-white/20">
                      <div className="text-white text-xs font-medium">{facility.name}</div>
                      <div className="text-white/60 text-xs">{facility.distance}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}