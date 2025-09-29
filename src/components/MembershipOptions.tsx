import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Crown, Star, Zap, Check, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { type Sport } from '../types';

interface MembershipOptionsProps {
  sport: Sport;
  onPurchase: (sportId: string, tier: 'basic' | 'standard' | 'premium') => void;
  isLoading?: boolean;
  isLoggedIn: boolean;
}

export default function MembershipOptions({ sport, onPurchase, isLoading = false, isLoggedIn }: MembershipOptionsProps) {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium' | null>(null);

  const tiers = [
    { 
      key: 'basic' as const, 
      name: 'Basic', 
      price: 0,
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgColor: 'from-blue-500/10 to-blue-600/20',
      features: ['Basic Access', 'Standard Support', 'Monthly Reports'],
      popular: false,
      savings: null
    },
    { 
      key: 'standard' as const, 
      name: 'Standard', 
      price: 0,
      icon: <Star className="w-5 h-5" />,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      bgColor: 'from-purple-500/10 to-purple-600/20',
      features: ['All Basic Features', 'Priority Booking', 'Extended Hours', '24/7 Support'],
      popular: true,
      savings: '25%'
    },
    { 
      key: 'premium' as const, 
      name: 'Premium', 
      price: 0,
      icon: <Crown className="w-5 h-5" />,
      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      bgColor: 'from-yellow-500/10 to-yellow-600/20',
      features: ['All Standard Features', 'VIP Access', 'Personal Support', 'Premium Equipment', 'Exclusive Events'],
      popular: false,
      savings: '30%'
    }
  ];

  const handlePurchase = (tier: 'basic' | 'standard' | 'premium') => {
    setSelectedTier(tier);
    onPurchase(sport.id, tier);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg font-bold mb-1">Choose Your Plan</h3>
          <p className="text-white/60 text-sm">
            {isLoggedIn ? 
              `Unlock ${sport.name} premium features` : 
              'Sign up to purchase memberships'
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-[#FFB948] text-sm font-medium">Monthly Pricing</div>
          <div className="text-white/60 text-xs">
            {isLoggedIn ? 'Cancel anytime' : 'Sign up required'}
          </div>
        </div>
      </div>

      {/* Authentication Notice for Non-logged in Users */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[#A148FF]/10 to-[#FFB948]/10 rounded-[15px] border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-6 h-6 text-[#FFB948]" />
            <div>
              <div className="text-white font-medium">Sign Up Required</div>
              <div className="text-white/60 text-sm">Create an account to purchase memberships</div>
            </div>
          </div>
          <div className="text-xs text-white/50">
            • Browse plans as a guest • Purchase after sign up • Secure payments
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {tiers.map((tier) => (
          <div 
            key={tier.key}
            className={`relative bg-gradient-to-r ${tier.bgColor} backdrop-blur-sm rounded-[19px] border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
              tier.popular ? 'border-[#FFB948]/50 shadow-lg shadow-[#FFB948]/10' : 'border-white/10 hover:border-white/20'
            } ${
              selectedTier === tier.key && isLoading ? 'animate-pulse scale-[1.02]' : ''
            } ${
              !isLoggedIn ? 'opacity-80' : ''
            }`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-[#A148FF] to-[#FFB948] text-white text-sm px-4 py-1 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Most Popular
                </Badge>
              </div>
            )}

            <button 
              onClick={() => handlePurchase(tier.key)}
              disabled={isLoading}
              className={`w-full p-6 text-left transition-all duration-300 rounded-[19px] ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 active:scale-[0.98]'
              } ${tier.popular ? 'pt-8' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Plan Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${tier.color}`}>
                    {tier.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl mb-1">
                      Rs {tier.price.toLocaleString()}
                      <span className="text-white/60 text-sm font-normal ml-1">/month</span>
                    </div>
                    <div className="text-white font-bold text-lg mb-2">
                      {tier.name} Plan
                    </div>
                    {tier.savings && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        Save {tier.savings}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Purchase Action */}
                <div className="flex flex-col items-end gap-2">
                  {selectedTier === tier.key && isLoading ? (
                    <div className="w-8 h-8 border-2 border-[#FFB948] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#FFB948] hover:text-[#FFB948]/80 transition-colors">
                      <span className="text-sm font-medium">
                        {isLoggedIn ? 'Choose Plan' : 'Sign Up to Buy'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-white/40 text-xs">
                    365 days validity
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-4">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/80 text-sm">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Services Included */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/70">
                    <span className="font-medium">{sport.number_of_services} Premium Services</span> included
                  </div>
                  <div className="text-[#FFB948]">
                    Worth Rs {(sport.number_of_services! * 1000).toLocaleString()}+
                  </div>
                </div>
              </div>

              {/* Premium Features Highlight */}
              {tier.key === 'premium' && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
                  <div className="text-yellow-300 text-sm font-medium mb-1">🔥 Premium Exclusive</div>
                  <div className="text-white/70 text-xs">
                    VIP access, personal trainer sessions, and exclusive events
                  </div>
                </div>
              )}

              {/* Guest User Notice */}
              {!isLoggedIn && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <Lock className="w-4 h-4" />
                    <span>Sign up required to purchase this plan</span>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="text-center space-y-2">
          <div className="text-white/70 text-sm font-medium mb-3">
            ✨ What&apos;s included with every plan
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#A148FF] rounded-full"></div>
              <span>365-day validity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FFB948] rounded-full"></div>
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Easy cancellation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}