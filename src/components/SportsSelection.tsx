import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Star, Crown, Zap, Check } from 'lucide-react';
import { SPORTS } from '../constants';
import type { Membership } from '../types';

interface SportsSelectionProps {
  onPurchaseMembership: (sportId: string, tier: 'basic' | 'premium' | 'elite') => void;
  onBack: () => void;
  existingMemberships: Membership[];
}

export default function SportsSelection({ onPurchaseMembership, onBack, existingMemberships }: SportsSelectionProps) {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Safely read pricing from the sport object and provide sensible fallbacks
  const getPricing = (sport: any) => {
    if (sport && sport.pricing && typeof sport.pricing === 'object') {
      return sport.pricing as { basic: number; premium: number; elite: number | null };
    }
    return { basic: 0, premium: 0, elite: null };
  };

  const hasMembership = (sportId: string) => {
    return existingMemberships.some(m => m.sportId === sportId);
  };

  const handlePurchase = (tier: 'basic' | 'premium' | 'elite') => {
    if (selectedSport) {
      onPurchaseMembership(selectedSport, tier);
      onBack();
    }
  };

  if (selectedSport) {
    const sport = SPORTS.find(s => s.id === selectedSport);
    if (!sport) return null;

    const pricing = getPricing(sport);

    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedSport(null)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{sport.icon}</span>
            <h1 className="text-xl font-bold">{sport.name} Membership</h1>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Basic Tier */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Basic Membership
                  <Badge variant="outline">Popular</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${pricing.basic}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {sport.services.slice(0, 2).map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handlePurchase('basic')}
                  className="w-full"
                  variant="outline"
                >
                  Choose Basic
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="relative border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  Premium Membership
                  <Badge>Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${pricing.premium}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {sport.services.slice(0, 3).map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority Booking</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePurchase('premium')}
                  className="w-full"
                >
                  Choose Premium
                </Button>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            {pricing.elite && (
              <Card className="relative border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    Elite Membership
                    <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">VIP</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${pricing.elite}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {sport.services.map((service, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{service}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">VIP Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Personal Concierge</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handlePurchase('elite')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    Choose Elite
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Choose Your Sport</h1>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPORTS.map((sport) => {
            const cardPricing = getPricing(sport);
            return (
              <Card 
                key={sport.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  hasMembership(sport.id) ? 'opacity-50' : 'hover:scale-105'
                }`}
                onClick={() => !hasMembership(sport.id) && setSelectedSport(sport.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{sport.icon}</div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {sport.name}
                    {hasMembership(sport.id) && (
                      <Badge variant="secondary">Owned</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-sm text-muted-foreground mb-3">
                    Starting from
                  </div>
                  <div className="text-2xl font-bold mb-4">
                    ${cardPricing.basic}/month
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {sport.services.slice(0, 2).map((service, index) => (
                      <div key={index}>• {service}</div>
                    ))}
                    <div>+ more services</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}