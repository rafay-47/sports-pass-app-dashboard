import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Settings, Info, Crown, Star, Shield } from 'lucide-react';
import { type Membership, type Sport } from '../types';

interface DigitalCardProps {
  membership: Membership;
  sport: Sport;
  onManage: () => void;
  clickable?: boolean;
}

export default function DigitalCard({ membership, sport, onManage, clickable = false }: DigitalCardProps) {
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

  return (
    <div className={`relative rounded-[19px] h-[180px] shadow-2xl overflow-hidden transition-all duration-300 ${
      clickable ? 'hover:scale-[1.02] cursor-pointer' : ''
    }`}>
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{ 
          background: `linear-gradient(135deg, ${sport.color} 0%, ${sport.color}CC 50%, ${sport.color}99 100%)` 
        }}
      />
      
      {/* Animated Background Elements */}
      <div 
        className="absolute top-[20px] right-[20px] w-24 h-24 rounded-full opacity-20 animate-pulse"
        style={{ backgroundColor: sport.color }}
      />
      <div 
        className="absolute bottom-[-10px] left-[-10px] w-16 h-16 rounded-full opacity-30 animate-pulse"
        style={{ backgroundColor: sport.color }}
      />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{sport.icon}</div>
            <div>
              <div className="text-white font-extrabold text-lg tracking-wide">
                {sport.name}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={`${getTierColor(membership.tier)} bg-white/20 border-white/30 text-xs uppercase tracking-wider`}
                >
                  {getTierIcon(membership.tier)}
                  <span className="ml-1">{membership.tier}</span>
                </Badge>
                <Badge 
                  className={`text-xs ${
                    membership.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    membership.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}
                >
                  {membership.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {clickable && (
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <Info className="w-3 h-3" />
                <span>Tap for details</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onManage();
              }}
            >
              <Settings className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-2">
          <div className="text-white/90 text-sm font-medium">
            Member ID: {membership.membershipNumber}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white/80 text-xs">
              Valid until: {new Date(membership.expiryDate).toLocaleDateString()}
            </div>
            <div className="text-white/80 text-xs">
              {membership.autoRenew ? 'Auto-renew ON' : 'Auto-renew OFF'}
            </div>
          </div>
        </div>

        {/* Services Access */}
        <div className="flex items-center justify-between">
          <div className="text-white/90 text-sm">
            Access to {sport.number_of_services} premium services
          </div>
          <div className="text-white/70 text-xs">
            Since {new Date(membership.purchaseDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      {/* Animated border for clickable cards */}
      {clickable && (
        <div className="absolute inset-0 rounded-[19px] border-2 border-white/20 animate-pulse" />
      )}
    </div>
  );
}