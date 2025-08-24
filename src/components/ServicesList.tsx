import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Calendar, 
  UserCheck, 
  Utensils, 
  HelpCircle, 
  Dumbbell, 
  Trophy, 
  GraduationCap, 
  Package,
  Clock,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { type Sport, type Membership } from '../App';

interface ServicesListProps {
  sport: Sport;
  membership: Membership;
  onServiceClick: (serviceName: string) => void;
}

const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('trainer') || name.includes('coach')) return <UserCheck className="w-5 h-5" />;
  if (name.includes('diet') || name.includes('nutrition')) return <Utensils className="w-5 h-5" />;
  if (name.includes('consultation') || name.includes('expert')) return <HelpCircle className="w-5 h-5" />;
  if (name.includes('equipment') || name.includes('access')) return <Dumbbell className="w-5 h-5" />;
  if (name.includes('booking') || name.includes('court') || name.includes('table') || name.includes('net')) return <Calendar className="w-5 h-5" />;
  if (name.includes('tournament') || name.includes('entry')) return <Trophy className="w-5 h-5" />;
  if (name.includes('session') || name.includes('class') || name.includes('group')) return <GraduationCap className="w-5 h-5" />;
  if (name.includes('rental') || name.includes('cue')) return <Package className="w-5 h-5" />;
  return <Star className="w-5 h-5" />;
};

const getServiceDescription = (serviceName: string, sportName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('trainer') || name.includes('coach')) return `Find certified ${sportName.toLowerCase()} trainers and coaches`;
  if (name.includes('diet')) return 'Personalized nutrition plans from certified dietitians';
  if (name.includes('consultation')) return 'Expert advice from sports professionals';
  if (name.includes('equipment')) return 'Access to premium sports equipment and facilities';
  if (name.includes('booking')) return 'Reserve courts, tables, or training areas in advance';
  if (name.includes('tournament')) return 'Enter competitive tournaments and championships';
  if (name.includes('session') || name.includes('class')) return 'Join group training sessions and classes';
  if (name.includes('rental')) return 'Rent high-quality sports equipment';
  return `Premium ${serviceName.toLowerCase()} service for ${sportName.toLowerCase()}`;
};

// Fixed service prices (no random generation to prevent hover glitch)
const getServicePrice = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('diet')) return 1500;
  if (name.includes('consultation')) return 800;
  if (name.includes('tournament')) return 1200;
  if (name.includes('booking')) return 600;
  if (name.includes('rental')) return 400;
  if (name.includes('session') || name.includes('class')) return 1000;
  if (name.includes('equipment')) return 300;
  return 800; // Default price
};

export default function ServicesList({ sport, membership, onServiceClick }: ServicesListProps) {
  const getTierBenefit = (tier: string) => {
    switch (tier) {
      case 'premium': return { discount: 30, priority: 'VIP Priority', color: 'text-yellow-400' };
      case 'standard': return { discount: 20, priority: 'High Priority', color: 'text-purple-400' };
      default: return { discount: 10, priority: 'Standard', color: 'text-blue-400' };
    }
  };

  const tierBenefit = getTierBenefit(membership.tier);
  const isTrainerService = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    return name.includes('trainer') || name.includes('coach');
  };

  return (
    <div>
      {/* Services Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-lg font-bold mb-1">Premium Services</h3>
          <p className="text-white/60 text-sm">
            Exclusive services for your {membership.tier} membership
          </p>
        </div>
        <Badge className={`${tierBenefit.color} bg-white/10 border-white/20`}>
          {tierBenefit.discount}% OFF
        </Badge>
      </div>

      {/* Tier Benefits Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#A148FF]/20 to-[#FFB948]/20 rounded-[15px] border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#FFB948]" />
          <span className={`font-medium ${tierBenefit.color}`}>
            {membership.tier.charAt(0).toUpperCase() + membership.tier.slice(1)} Member Benefits
          </span>
        </div>
        <div className="text-white/70 text-sm">
          • {tierBenefit.discount}% discount on all services • {tierBenefit.priority} booking • Extended access hours
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {sport.services.map((service, index) => {
          const isTrainer = isTrainerService(service);
          const basePrice = getServicePrice(service);
          const discountedPrice = Math.floor(basePrice * (1 - tierBenefit.discount / 100));
          
          return (
            <Card 
              key={index}
              className="bg-white/10 border-white/20 backdrop-blur-sm hover:scale-[1.02] hover:bg-white/15 hover:border-[#A148FF]/30 transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-4">
                <button 
                  onClick={() => onServiceClick(service)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors"
                        style={{ 
                          backgroundColor: `${sport.color}20`,
                          borderColor: sport.color,
                          color: sport.color
                        }}
                      >
                        {getServiceIcon(service)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-white font-bold text-base mb-1">{service}</div>
                        <div className="text-white/70 text-sm mb-2 leading-relaxed">
                          {getServiceDescription(service, sport.name)}
                        </div>
                        
                        {/* Service Features */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-white/60 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>1-2 hours</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-400 text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            <span>4.8 rating</span>
                          </div>
                          <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30 text-xs">
                            {tierBenefit.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {!isTrainer ? (
                        <div className="text-right">
                          <div className="text-white/50 text-xs line-through">
                            Rs {basePrice.toLocaleString()}
                          </div>
                          <div className="text-[#FFB948] font-bold text-lg">
                            Rs {discountedPrice.toLocaleString()}
                          </div>
                          <div className="text-green-400 text-xs">
                            Save Rs {(basePrice - discountedPrice).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-[#A148FF] font-bold text-base">
                            Browse Trainers
                          </div>
                          <div className="text-white/60 text-xs">
                            Multiple options available
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-[#FFB948] hover:text-[#FFB948]/80 transition-colors">
                        <span className="text-sm font-medium">
                          {isTrainer ? 'View Options' : 'Book Now'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Special Offers for Premium Members */}
                  {membership.tier === 'premium' && service.toLowerCase().includes('trainer') && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
                      <div className="text-yellow-300 text-sm font-medium">🔥 Premium Exclusive</div>
                      <div className="text-white/70 text-xs">
                        Access to elite trainers + Free consultation
                      </div>
                    </div>
                  )}

                  {/* Popular Service Indicator */}
                  {(service.toLowerCase().includes('trainer') || service.toLowerCase().includes('booking')) && (
                    <div className="mt-3 flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        Most Popular
                      </Badge>
                      <span className="text-white/60 text-xs">
                        {isTrainer ? '50+ certified trainers' : 'Booked 500+ times this month'}
                      </span>
                    </div>
                  )}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Benefits */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="text-center">
          <div className="text-white/70 text-sm font-medium mb-3">
            ✨ Your membership includes
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#A148FF] rounded-full"></div>
              <span>24/7 booking access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FFB948] rounded-full"></div>
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Flexible cancellation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Member rewards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}