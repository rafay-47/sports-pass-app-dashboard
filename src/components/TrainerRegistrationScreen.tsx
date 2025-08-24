import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Upload, Award, Clock, MapPin, Info, CheckCircle, AlertCircle, Crown, Star, Shield, Users, UserCheck } from 'lucide-react';
import { SPORTS, TRAINER_FEES } from '../constants';
import type { User, Membership, TrainerApplication } from '../types';

interface TrainerRegistrationScreenProps {
  user: User;
  memberships: Membership[];
  onSubmit: (trainerData: TrainerApplication) => void;
  onBack: () => void;
  isLoading: boolean;
}

const TIME_SLOTS = [
  { value: '06:00-08:00', label: '6:00 AM - 8:00 AM' },
  { value: '08:00-10:00', label: '8:00 AM - 10:00 AM' },
  { value: '10:00-12:00', label: '10:00 AM - 12:00 PM' },
  { value: '12:00-14:00', label: '12:00 PM - 2:00 PM' },
  { value: '14:00-16:00', label: '2:00 PM - 4:00 PM' },
  { value: '16:00-18:00', label: '4:00 PM - 6:00 PM' },
  { value: '18:00-20:00', label: '6:00 PM - 8:00 PM' },
  { value: '20:00-22:00', label: '8:00 PM - 10:00 PM' }
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function TrainerRegistrationScreen({ 
  user, 
  memberships,
  onSubmit, 
  onBack, 
  isLoading 
}: TrainerRegistrationScreenProps) {
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [experience, setExperience] = useState('');
  const [certifications, setCertifications] = useState<string[]>(['']);
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState<string[]>(['']);
  const [gender, setGender] = useState<'male' | 'female' | 'both'>('both');
  const [availability, setAvailability] = useState(() => {
    const defaultAvailability: { [key: string]: { available: boolean; timeSlots: string[] } } = {};
    DAYS.forEach(day => {
      defaultAvailability[day] = { available: false, timeSlots: [] };
    });
    return defaultAvailability;
  });
  const [locations, setLocations] = useState<string[]>(['']);

  // Get available sports based on user's active memberships
  const availableSports = memberships
    .filter(m => m.status === 'active')
    .map(m => {
      const sport = SPORTS.find(s => s.id === m.sportId);
      return sport ? { ...sport, membershipTier: m.tier } : null;
    })
    .filter(Boolean);

  const addCertification = () => {
    setCertifications(prev => [...prev, '']);
  };

  const updateCertification = (index: number, value: string) => {
    setCertifications(prev => prev.map((cert, i) => i === index ? value : cert));
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const addSpecialty = () => {
    setSpecialties(prev => [...prev, '']);
  };

  const updateSpecialty = (index: number, value: string) => {
    setSpecialties(prev => prev.map((spec, i) => i === index ? value : spec));
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(prev => prev.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    setLocations(prev => [...prev, '']);
  };

  const updateLocation = (index: number, value: string) => {
    setLocations(prev => prev.map((loc, i) => i === index ? value : loc));
  };

  const removeLocation = (index: number) => {
    setLocations(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        timeSlots: !prev[day].available ? [] : prev[day].timeSlots
      }
    }));
  };

  const toggleTimeSlot = (day: string, timeSlot: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.includes(timeSlot)
          ? prev[day].timeSlots.filter(slot => slot !== timeSlot)
          : [...prev[day].timeSlots, timeSlot]
      }
    }));
  };

  const handleSportAndTierSelect = (sportId: string, tier: 'basic' | 'standard' | 'premium') => {
    setSelectedSport(sportId);
    setSelectedTier(tier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trainerData = {
      sport: selectedSport,
      membershipTier: selectedTier,
      experience: parseInt(experience),
      certifications: certifications.filter(cert => cert.trim() !== ''),
      availability: Object.entries(availability)
        .filter(([_, data]) => data.available && data.timeSlots.length > 0)
        .map(([day, data]) => ({
          day,
          timeSlots: data.timeSlots.map(slot => {
            const [start, end] = slot.split('-');
            return {
              startTime: start,
              endTime: end,
              available: true
            };
          })
        })),
      locations: locations.filter(loc => loc.trim() !== ''),
      bio,
      specialties: specialties.filter(spec => spec.trim() !== ''),
      gender
    };

    onSubmit(trainerData);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium': return <Crown className="w-4 h-4" />;
      case 'standard': return <Star className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'standard': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  };

  const getGenderIcon = (genderType: string) => {
    switch (genderType) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'both': return '👥';
      default: return '👤';
    }
  };

  return (
    <div className="screen-container bg-[#252525] text-white relative rounded-[19px]">
      {/* Background Elements */}
      <div className="absolute top-[50px] right-8 w-20 h-20 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[100px] left-6 w-16 h-16 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
      
      {/* Header */}
      <div className="flex items-center p-6 pt-8 relative z-10 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full mr-4"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">Become a Trainer</h1>
          <p className="text-white/60 text-sm">Share your expertise with others</p>
        </div>
      </div>

      <ScrollArea className="scrollable-content">
        <div className="px-6 pb-6">
          {/* Check if user has any active memberships */}
          {availableSports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-16 h-16 text-yellow-400 mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No Active Memberships</h3>
              <p className="text-white/70 text-sm mb-4">
                You need an active membership to register as a trainer for that sport.
              </p>
              <Button
                onClick={onBack}
                className="bg-[#A148FF] hover:bg-[#A148FF]/90"
              >
                Get a Membership First
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Welcome Message */}
              <Card className="bg-gradient-to-r from-[#A148FF]/20 to-[#FFB948]/20 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-[#FFB948]" />
                    <div>
                      <div className="text-white font-medium">Join Our Trainer Community</div>
                      <div className="text-white/70 text-sm">Help others achieve their fitness goals and earn money</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/60">
                    • Flexible schedule • Fixed competitive rates • Professional growth opportunities
                  </div>
                </CardContent>
              </Card>

              {/* Sport & Tier Selection */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Select Sport & Tier *</CardTitle>
                  <p className="text-white/60 text-sm">
                    Choose the sport you want to train for. You can only train at your membership tier level.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableSports.map((sport) => {
                      if (!sport) return null;
                      return (
                      <div key={sport.id} className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <span className="text-2xl">{sport.icon}</span>
                          <div>
                            <div className="text-white font-medium">{sport.name}</div>
                            <div className="text-white/60 text-sm">Your membership tier: {sport.membershipTier}</div>
                          </div>
                        </div>
                        
                        {/* Tier Selection for this sport */}
                        <div className="ml-4 space-y-2">
                          <label className="text-white/80 text-sm font-medium">Available Trainer Tiers:</label>
                          <div className="grid grid-cols-1 gap-2">
                            {(['basic', 'standard', 'premium'] as const).map((tier) => {
                              const isDisabled = tier !== sport.membershipTier;
                              const isSelected = selectedSport === sport.id && selectedTier === tier;
                              
                              return (
                                <button
                                  key={tier}
                                  type="button"
                                  onClick={() => !isDisabled && handleSportAndTierSelect(sport.id, tier)}
                                  disabled={isDisabled}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    isSelected
                                      ? 'border-[#A148FF] bg-[#A148FF]/10'
                                      : isDisabled
                                      ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                                      : 'border-white/20 hover:border-white/40 bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getTierColor(tier)}`}>
                                      {getTierIcon(tier)}
                                    </div>
                                    <div className="text-left">
                                      <div className="text-white font-medium capitalize">{tier} Trainer</div>
                                      <div className="text-white/60 text-sm">
                                        Rs {TRAINER_FEES[tier].toLocaleString()}/hour
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {isDisabled && (
                                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                        Requires {tier} membership
                                      </Badge>
                                    )}
                                    {tier === sport.membershipTier && (
                                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                        Available
                                      </Badge>
                                    )}
                                    {isSelected && (
                                      <CheckCircle className="w-5 h-5 text-[#A148FF]" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Gender Preference */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Training Preference *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-white/80">Which gender do you provide training to?</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['male', 'female', 'both'] as const).map((genderType) => (
                        <button
                          key={genderType}
                          type="button"
                          onClick={() => setGender(genderType)}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            gender === genderType
                              ? 'border-[#A148FF] bg-[#A148FF]/10'
                              : 'border-white/20 hover:border-white/40 bg-white/5'
                          }`}
                        >
                          <span className="text-lg">{getGenderIcon(genderType)}</span>
                          <div className="text-left">
                            <div className="text-white font-medium capitalize">{genderType}</div>
                            <div className="text-white/60 text-xs">
                              {genderType === 'both' ? 'All clients' : `${genderType} only`}
                            </div>
                          </div>
                          {gender === genderType && (
                            <CheckCircle className="w-4 h-4 text-[#A148FF] ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Experience *</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-white/80">Years of Experience</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      required
                      disabled={isLoading}
                      min="0"
                      max="50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">About You *</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-white/80">Professional Bio</Label>
                    <Textarea
                      placeholder="Tell us about your background, training philosophy, and what makes you a great trainer..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none h-24"
                      required
                      disabled={isLoading}
                    />
                    <div className="text-white/60 text-xs">
                      This will be visible to potential clients
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., ACSM Certified Personal Trainer"
                          value={cert}
                          onChange={(e) => updateCertification(index, e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          disabled={isLoading}
                        />
                        {certifications.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeCertification(index)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCertification}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      + Add Certification
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {specialties.map((specialty, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., Weight Loss, Strength Training, Rehabilitation"
                          value={specialty}
                          onChange={(e) => updateSpecialty(index, e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          disabled={isLoading}
                        />
                        {specialties.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeSpecialty(index)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSpecialty}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      + Add Specialty
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Locations */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Training Locations *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {locations.map((location, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., DHA Gym, Clifton Area, Online Sessions"
                          value={location}
                          onChange={(e) => updateLocation(index, e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          disabled={isLoading}
                        />
                        {locations.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLocation(index)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLocation}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      + Add Location
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Availability */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Availability *
                  </CardTitle>
                  <p className="text-white/60 text-sm">
                    Select your available days and time slots for training sessions.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {DAYS.map((day) => (
                      <div key={day} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={availability[day].available}
                            onCheckedChange={() => toggleDayAvailability(day)}
                            className="border-white/30"
                          />
                          <span className="text-white capitalize font-medium text-base">{day}</span>
                          {availability[day].available && availability[day].timeSlots.length > 0 && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              {availability[day].timeSlots.length} slots
                            </Badge>
                          )}
                        </div>
                        
                        {availability[day].available && (
                          <div className="ml-6 space-y-2">
                            <Label className="text-white/80 text-sm">Select available time slots:</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {TIME_SLOTS.map((slot) => (
                                <button
                                  key={slot.value}
                                  type="button"
                                  onClick={() => toggleTimeSlot(day, slot.value)}
                                  className={`p-2 rounded-lg border text-sm transition-all ${
                                    availability[day].timeSlots.includes(slot.value)
                                      ? 'border-[#A148FF] bg-[#A148FF]/10 text-[#A148FF]'
                                      : 'border-white/20 text-white/70 hover:border-white/40 hover:bg-white/5'
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fee Information */}
              {selectedSport && selectedTier && (
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Info className="w-5 h-5 text-green-400" />
                      <div className="text-green-300 font-medium">Your Trainer Fee</div>
                    </div>
                    <div className="text-green-300 text-lg font-bold">
                      Rs {TRAINER_FEES[selectedTier].toLocaleString()}/hour
                    </div>
                    <div className="text-green-300/80 text-sm">
                      Fixed rate for {selectedTier} trainers • 85% goes to you (15% platform fee)
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Terms */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="text-white/70 text-sm space-y-2">
                    <div className="font-medium text-white">Terms & Conditions:</div>
                    <div>• You must provide accurate information and qualifications</div>
                    <div>• All applications are subject to verification and approval</div>
                    <div>• You agree to maintain professional standards at all times</div>
                    <div>• Payment terms: Weekly payments minus 15% platform fee</div>
                    <div>• You can only train members of your tier or below</div>
                    <div>• Gender preference must be clearly stated and respected</div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-4"
                disabled={
                  !selectedSport || 
                  !selectedTier || 
                  !experience || 
                  !bio || 
                  !locations.some(loc => loc.trim()) || 
                  !Object.values(availability).some(day => day.available && day.timeSlots.length > 0) ||
                  isLoading
                }
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Submit Trainer Application</span>
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}