import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Hash, Star, Crown, Zap } from 'lucide-react';
import { SPORTS, type Membership } from '../App';

interface MembershipCardProps {
  membership: Membership;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  const sport = SPORTS.find(s => s.id === membership.sportId);
  if (!sport) return null;

  const getTierIcon = () => {
    switch (membership.tier) {
      case 'elite': return <Crown className="w-4 h-4" />;
      case 'premium': return <Star className="w-4 h-4" />;
      case 'basic': return <Zap className="w-4 h-4" />;
    }
  };

  const getTierColor = () => {
    switch (membership.tier) {
      case 'elite': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-purple-700';
      case 'basic': return 'bg-gradient-to-r from-blue-500 to-blue-700';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`${getTierColor()} p-4 text-white`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{sport.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{sport.name}</h3>
              <div className="flex items-center gap-1">
                {getTierIcon()}
                <span className="text-sm capitalize">{membership.tier} Member</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Active
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            <div>
              <div className="text-white/80">Member ID</div>
              <div className="font-mono">{membership.membershipNumber}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <div>
              <div className="text-white/80">Expires</div>
              <div>{new Date(membership.expiryDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Member since {new Date(membership.purchaseDate).toLocaleDateString()}</span>
          <span className="font-mono text-xs">{membership.membershipNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
}