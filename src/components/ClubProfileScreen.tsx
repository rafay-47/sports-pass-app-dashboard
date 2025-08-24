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
  AlertCircle
} from 'lucide-react';
import { type ClubOwner, type Club } from '../types';
import { SPORTS_TYPES, DAYS, AMENITIES } from '../constants';
import { getSportInfo } from '../utils/helpers';

interface ClubProfileScreenProps {
  clubOwner: ClubOwner;
  club: Club | null;
  onSave: (clubData: Partial<Club>) => void;
  isLoading: boolean;
}

export default function ClubProfileScreen({ clubOwner, club, onSave, isLoading }: ClubProfileScreenProps) {
  const [formData, setFormData] = useState<Partial<Club>>({
    name: '',
    description: '',
    type: 'gym',
    address: '',
    city: '',
    coordinates: { lat: 0, lng: 0 },
    facilities: [],
    amenities: [],
    timings: {},
    pricing: { basic: 2000, standard: 4000, premium: 6000 },
    category: 'mixed',
    images: []
  });

  useEffect(() => {
    if (club) {
      setFormData(club);
    } else {
      // Initialize timings for new club
      const defaultTimings: any = {};
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimingChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: {
          ...prev.timings?.[day],
          [field]: value
        }
      }
    }));
  };

  const handlePricingChange = (tier: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [tier]: value
      }
    }));
  };

  const addFacility = () => {
    setFormData(prev => ({
      ...prev,
      facilities: [...(prev.facilities || []), '']
    }));
  };

  const updateFacility = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities?.map((facility, i) => i === index ? value : facility) || []
    }));
  };

  const removeFacility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities?.filter((_, i) => i !== index) || []
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Safe access to selected sport with fallback
  const selectedSport = getSportInfo(formData.type);

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
                  {selectedSport?.icon && <span className="text-2xl">{selectedSport.icon}</span>}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{club.name}</h3>
                  <p className="text-sm text-muted-foreground">{club.address}, {club.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${
                  club.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                  club.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {club.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {club.verificationStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {club.verificationStatus === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {club.verificationStatus}
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
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell us about your sports club
            </CardDescription>
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
                  value={formData.type || 'gym'} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS_TYPES?.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        <div className="flex items-center gap-2">
                          <span>{sport.icon}</span>
                          <span>{sport.name}</span>
                        </div>
                      </SelectItem>
                    ))}
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

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Operating Hours
            </CardTitle>
            <CardDescription>
              Set your club's opening and closing times
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

        {/* Membership Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Membership Pricing
            </CardTitle>
            <CardDescription>
              Set your membership tier prices (in PKR)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-price">Basic Membership</Label>
                <Input
                  id="basic-price"
                  type="number"
                  placeholder="2000"
                  value={formData.pricing?.basic || ''}
                  onChange={(e) => handlePricingChange('basic', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Entry-level access</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="standard-price">Standard Membership</Label>
                <Input
                  id="standard-price"
                  type="number"
                  placeholder="4000"
                  value={formData.pricing?.standard || ''}
                  onChange={(e) => handlePricingChange('standard', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Most popular choice</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="premium-price">Premium Membership</Label>
                <Input
                  id="premium-price"
                  type="number"
                  placeholder="6000"
                  value={formData.pricing?.premium || ''}
                  onChange={(e) => handlePricingChange('premium', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Full access + perks</p>
              </div>
            </div>
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
              List the main facilities and equipment available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.facilities?.map((facility, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Olympic size pool, Professional boxing ring"
                  value={facility}
                  onChange={(e) => updateFacility(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFacility(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addFacility}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Facility
            </Button>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AMENITIES?.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.amenities?.includes(amenity) || false}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
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
                  <p className="font-medium">{club.qrCode}</p>
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
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            disabled={isLoading}
          >
            {isLoading ? (
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