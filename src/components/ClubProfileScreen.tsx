import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Plus,
  X,
  QrCode,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { type ClubOwner, type Club, type ClubFormData } from '../types';
import { DAYS } from '../constants';
import { useSports, useFacilities, useAmenities, useClubOperations } from '../hooks';
import LocationPicker from './GoogleMapPicker';
import { toast } from 'sonner';

interface ClubProfileScreenProps {
  clubOwner: ClubOwner;
  club: Club | null;
  onSave: (clubData: Partial<Club>) => void;
  isLoading: boolean;
}

export default function ClubProfileScreen({ clubOwner, club, onSave, isLoading }: ClubProfileScreenProps) {
  const [formData, setFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    sport_id: '',
    address: '',
    city: '',
    latitude: '0',
    longitude: '0',
    facilities: [],
    amenities: [],
    timings: {},
    category: 'mixed',
    primary_image: []
  });

  const { sports, loading: sportsLoading, error: sportsError, refetch: refetchSports } = useSports();
  const { facilities, loading: facilitiesLoading, error: facilitiesError, refetch: refetchFacilities } = useFacilities();
  const { amenities, loading: amenitiesLoading, error: amenitiesError, refetch: refetchAmenities } = useAmenities();
    const { createClub, updateClub, getUserClubs, loading: clubOperationLoading, error: clubOperationError } = useClubOperations();

  // Function to fetch club data from API
  const fetchClubData = async () => {
    if (!clubOwner?.id) return;

    try {
      //console.log('Fetching club data for owner:', clubOwner.id);
      const clubs = await getUserClubs();
      
      if (clubs && clubs.length > 0) {
        const fetchedClub = clubs[0]; // Get the first club (assuming one club per owner)
        //console.log('Fetched club data:', fetchedClub);
        
        // Update the form data with fetched data
        setFormData({
          name: fetchedClub.name || '',
          description: fetchedClub.description || '',
          sport_id: fetchedClub.sport_id || '',
          address: fetchedClub.address || '',
          city: fetchedClub.city || '',
          latitude: fetchedClub.latitude || '0',
          longitude: fetchedClub.longitude || '0',
          facilities: fetchedClub.facilities?.map((f: any) => f.id) || [],
          amenities: fetchedClub.amenities?.map((a: any) => a.id) || [],
          timings: Object.fromEntries(
            Object.entries(fetchedClub.timings || {}).map(([day, timing]: [string, any]) => [
              day,
              {
                open: timing.open || '06:00',
                close: timing.close || '22:00',
                isOpen: true
              }
            ])
          ),
          category: fetchedClub.category || 'mixed',
          primary_image: fetchedClub.primary_image || []
        });
        
        // Call the parent's onSave callback with the fetched club data
        onSave(fetchedClub);
        
        toast.success('Club data refreshed');
      } else {
        //console.log('No clubs found for owner');
        toast.info('No club data found. Please create your club profile.');
      }
    } catch (error) {
      console.error('Error fetching club data:', error);
      toast.error('Failed to fetch latest club data');
    }
  };

  useEffect(() => {
    if (club) {
      // Convert Club to ClubFormData format
      const formDataFromClub: ClubFormData = {
        name: club.name || '',
        description: club.description || '',
        sport_id: club.sport_id || '',
        address: club.address || '',
        city: club.city || '',
        latitude: club.latitude || '0',
        longitude: club.longitude || '0',
        facilities: club.facilities?.map((f: any) => f.id) || [],
        amenities: club.amenities?.map((a: any) => a.id) || [],
        timings: Object.fromEntries(
          Object.entries(club.timings || {}).map(([day, timing]: [string, any]) => [
            day,
            {
              open: timing.open || '06:00',
              close: timing.close || '22:00',
              isOpen: true
            }
          ])
        ),
        category: club.category || 'mixed',
        primary_image: club.primary_image || []
      };
      setFormData(formDataFromClub);
    } else {
      // Initialize timings for new club
      const defaultTimings: Record<string, { open: string; close: string; isOpen: boolean }> = {};
      DAYS?.forEach(day => {
        defaultTimings[day.id] = {
          open: '06:00',
          close: '22:00',
          isOpen: true
        };
      });
      setFormData(prev => ({ ...prev, timings: defaultTimings }));
    }
  }, [club]);

  // Fetch club data on component mount if no club data exists
  useEffect(() => {
    if (!club && clubOwner?.id && !clubOperationLoading) {
      //console.log('No club data found, fetching from API...');
      fetchClubData();
    }
  }, [clubOwner?.id, club]);

  const handleInputChange = (field: string, value: string | number | boolean | object) => {
    if (field === 'coordinates') {
      const coords = value as { lat: number; lng: number };
      setFormData(prev => ({ 
        ...prev, 
        latitude: coords.lat.toString(), 
        longitude: coords.lng.toString() 
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleTimingChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: {
          open: prev.timings?.[day]?.open ?? '06:00',
          close: prev.timings?.[day]?.close ?? '22:00',
          isOpen: prev.timings?.[day]?.isOpen ?? true,
          [field]: value
        }
      }
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...(prev.amenities || []), amenityId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.name?.trim()) {
        throw new Error('Club name is required');
      }
      if (!formData.sport_id) {
        throw new Error('Sport type is required');
      }
      
      // Validate that the selected sport exists
      const selectedSport = sports.find(sport => sport.id === formData.sport_id);
      if (!selectedSport) {
        throw new Error('Please select a valid sport type');
      }
      
      if (!formData.description?.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.address?.trim()) {
        throw new Error('Address is required');
      }
      if (!formData.city?.trim()) {
        throw new Error('City is required');
      }
      
      if (!formData.latitude || parseFloat(formData.latitude) === 0) {
        throw new Error('Please select a location on the map');
      }
      if (!formData.longitude || parseFloat(formData.longitude) === 0) {
        throw new Error('Please select a location on the map');
      }
      
      // Validate amenities and facilities are valid UUIDs
      if (formData.amenities?.some(id => !id || id.trim() === '')) {
        throw new Error('Invalid amenity selection');
      }
      if (formData.facilities?.some(id => !id || id.trim() === '')) {
        throw new Error('Invalid facility selection');
      }

      // Transform form data to match API schema
      const apiData = {
        name: formData.name.trim(),
        sport_id: formData.sport_id,
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        category: formData.category || 'mixed',
        timings: Object.fromEntries(
          Object.entries(formData.timings || {}).map(([day, timing]) => [
            day,
            {
              open: timing?.open || '06:00',
              close: timing?.close || '22:00'
            }
          ])
        ),
        is_active: true,
        amenities: formData.amenities || [],
        facilities: formData.facilities || []
      };

      //console.log('Submitting club data:', apiData);
      //console.log('Selected sport ID:', formData.sport_id);
      //console.log('Sports list:', sports);
      //console.log('Amenities:', formData.amenities);
      //console.log('Facilities:', formData.facilities);
      //console.log('Sports data:', sports);
      //console.log('Selected sport ID:', formData.sport_id);

      let result: Club;
      if (club) {
        // Update existing club
        result = await updateClub(club.id, apiData);
        //console.log('Club update response:', result);
      } else {
        // Create new club
        result = await createClub(apiData);
        //console.log('Club creation response:', result);
      }

      // Ensure the result has all required fields
      const completeClubData: Club = {
        id: result.id,
        owner_id: result.owner_id || clubOwner.id,
        name: result.name,
        description: result.description,
        address: result.address,
        city: result.city,
        latitude: result.latitude || '0',
        longitude: result.longitude || '0',
        phone: result.phone || null,
        email: result.email || null,
        rating: result.rating || '0.00',
        category: result.category || 'mixed',
        qr_code: result.qr_code || `QR_${Date.now()}`,
        status: result.status || 'active',
        verification_status: result.verification_status || 'pending',
        timings: Object.fromEntries(
          Object.entries(result.timings || {}).map(([day, timing]: [string, any]) => [
            day,
            {
              open: timing.open || '06:00',
              close: timing.close || '22:00'
            }
          ])
        ),
        is_active: result.is_active ?? true,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
        sport_id: result.sport_id,
        owner: result.owner || {
          id: clubOwner.id,
          email: clubOwner.email || '',
          name: clubOwner.name,
          phone: clubOwner.phone || '',
          date_of_birth: null,
          gender: null,
          profile_image_url: null,
          user_role: 'owner',
          is_trainer: false,
          is_verified: true,
          is_active: true,
          join_date: clubOwner.join_date || new Date().toISOString(),
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        sport: result.sport || {
          id: formData.sport_id,
          name: '',
          display_name: '',
          icon: '',
          color: '',
          description: '',
          number_of_services: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        amenities: result.amenities || [],
        facilities: result.facilities || [],
        primary_image: result.primary_image || [],
      };

      //console.log('Complete club data being saved:', completeClubData);

      // Call the parent's onSave callback with the complete result
      onSave(completeClubData);
      
      // Show success message
      toast.success(`Club ${club ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving club:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save club';
      toast.error(errorMessage);
    }
  };

  // Safe access to selected sport with fallback
  const selectedSport = sports.find(sport => sport.id === formData.sport_id) || sports[0];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Club Profile</h1>
        <p className="text-muted-foreground">
          {club ? 'Manage your club information and settings' : 'Complete your club profile to get started'}
        </p>
      </div>

      {/* Status Banner */}
      {club && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  {selectedSport ? (
                    <img 
                      src={selectedSport.icon} 
                      alt={selectedSport.name} 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to emoji if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-emoji')) {
                          const fallback = document.createElement('span');
                          fallback.textContent = '🏸'; // Default sport emoji
                          fallback.className = 'fallback-emoji text-2xl';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span className="text-2xl">🏸</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{club.name}</h3>
                  <p className="text-sm text-muted-foreground">{club.address}, {club.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${
                  club.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                  club.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {club.verification_status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {club.verification_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {club.verification_status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {club.verification_status}
                </Badge>
                <Badge className={`${
                  club.status === 'active' ? 'bg-green-100 text-green-800' :
                  club.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {club.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Tell us about your sports club
                </CardDescription>
              </div>
              {club && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fetchClubData}
                  disabled={clubOperationLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {clubOperationLoading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Club Name *</Label>
                <Input
                  id="name"
                  placeholder="Elite Fitness Center"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Sport Type *</Label>
                <Select 
                  value={formData.sport_id || ''} 
                  onValueChange={(value) => handleInputChange('sport_id', value)}
                  disabled={sportsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={sportsLoading ? "Loading sports..." : sportsError ? "Error loading sports" : "Select sport type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sportsError ? (
                      <div className="p-2 text-sm text-red-600">
                        {sportsError}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={refetchSports}
                          className="ml-2"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={sport.icon} 
                              alt={sport.name} 
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                // Fallback to emoji if image fails
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('span');
                                  fallback.textContent = '🏸'; // Default sport emoji
                                  parent.insertBefore(fallback, target);
                                }
                              }}
                            />
                            <span>{sport.display_name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your club, facilities, and what makes it special..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Facility Type *</Label>
              <Select 
                value={formData.category || 'mixed'} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male Only</SelectItem>
                  <SelectItem value="female">Female Only</SelectItem>
                  <SelectItem value="mixed">Mixed (Male & Female)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </CardTitle>
            <CardDescription>
              Where is your club located?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                placeholder="Street address, area, landmarks..."
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Karachi"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Picker */}
        <LocationPicker
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          selectedLocation={formData.latitude && formData.longitude && parseFloat(formData.latitude) !== 0 && parseFloat(formData.longitude) !== 0 ? {
            lat: parseFloat(formData.latitude),
            lng: parseFloat(formData.longitude)
          } : undefined}
          onLocationSelect={(location) => {
            handleInputChange('coordinates', {
              lat: location.lat,
              lng: location.lng
            });
          }}
        />

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Operating Hours
            </CardTitle>
            <CardDescription>
              Set your club&apos;s opening and closing times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS?.map((day) => (
              <div key={day.id} className="flex items-center gap-4">
                <div className="w-24">
                  <Checkbox
                    checked={formData.timings?.[day.id]?.isOpen || false}
                    onCheckedChange={(checked) => handleTimingChange(day.id, 'isOpen', checked)}
                  />
                  <span className="ml-2 text-sm font-medium">{day.label}</span>
                </div>
                
                {formData.timings?.[day.id]?.isOpen && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formData.timings[day.id]?.open || '06:00'}
                      onChange={(e) => handleTimingChange(day.id, 'open', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={formData.timings[day.id]?.close || '22:00'}
                      onChange={(e) => handleTimingChange(day.id, 'close', e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}
                
                {!formData.timings?.[day.id]?.isOpen && (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>


        {/* Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Facilities
            </CardTitle>
            <CardDescription>
              Select the facilities available at your club
            </CardDescription>
          </CardHeader>
          <CardContent>
            {facilitiesError ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-600 mb-2">{facilitiesError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetchFacilities}
                >
                  Retry
                </Button>
              </div>
            ) : facilitiesLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading facilities...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.facilities?.includes(facility.id) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            facilities: [...(prev.facilities || []), facility.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            facilities: prev.facilities?.filter(f => f !== facility.id) || []
                          }));
                        }
                      }}
                    />
                    <span className="text-sm">{facility.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Amenities
            </CardTitle>
            <CardDescription>
              Select the amenities your club offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {amenitiesError ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-600 mb-2">{amenitiesError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetchAmenities}
                >
                  Retry
                </Button>
              </div>
            ) : amenitiesLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading amenities...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.amenities?.includes(amenity.id) || false}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Info */}
        {club && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                QR Code
              </CardTitle>
              <CardDescription>
                Your unique QR code for member check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="font-medium">{club.qr_code}</p>
                  <p className="text-sm text-muted-foreground">
                    Display this QR code at your facility for member check-ins
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          {clubOperationError && (
            <div className="flex-1 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {clubOperationError}
            </div>
          )}
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            disabled={isLoading || clubOperationLoading}
          >
            {(isLoading || clubOperationLoading) ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {club ? 'Update Club Profile' : 'Create Club Profile'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}