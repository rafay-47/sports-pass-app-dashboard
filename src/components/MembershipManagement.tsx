import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft, 
  Pause, 
  Play, 
  Trash2, 
  CreditCard, 
  Calendar,
  Shield,
  AlertTriangle,
  Crown,
  Star,
  Zap
} from 'lucide-react';
import { type Membership, type Sport } from '../types';
import { toast } from 'sonner';

interface MembershipManagementProps {
  membership: Membership;
  sport: Sport;
  onUpdate: (membershipId: string, updates: Partial<Membership>) => void;
  onDelete: (membershipId: string) => void;
  onBack: () => void;
}

export default function MembershipManagement({
  membership,
  sport,
  onUpdate,
  onDelete,
  onBack
}: MembershipManagementProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handlePauseMembership = () => {
    if (membership.status === 'active') {
      onUpdate(membership.membershipNumber, { status: 'paused' });
      toast.success('Membership paused successfully');
    } else {
      onUpdate(membership.membershipNumber, { status: 'active' });
      toast.success('Membership resumed successfully');
    }
  };

  const handleAutoRenewToggle = (enabled: boolean) => {
    onUpdate(membership.membershipNumber, { autoRenew: enabled });
    toast.success(`Auto-renewal ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleCancelMembership = () => {
    onDelete(membership.membershipNumber);
    onBack();
  };

  const getTierIcon = () => {
    switch (membership.tier) {
      case 'premium': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'standard': return <Star className="w-5 h-5 text-purple-500" />;
      case 'basic': return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTierPrice = () => {
    return membership.price || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiry = new Date(membership.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiry();

  return (
    <div className="h-full flex flex-col bg-[#252525] text-white rounded-[19px]">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 pt-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Manage Membership</h1>
          <p className="text-white/60 text-sm">{sport.name} • {membership.membershipNumber}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        {/* Membership Status Card */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {getTierIcon()}
                <span className="capitalize">{membership.tier} Plan</span>
              </div>
              <Badge 
                className={`${
                  membership.status === 'active' ? 'bg-green-600' : 
                  membership.status === 'paused' ? 'bg-yellow-600' : 'bg-red-600'
                } text-white`}
              >
                {membership.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Membership Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-white/60">Monthly Price</div>
                  <div className="text-white font-bold">Rs {getTierPrice().toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/60">Expires</div>
                  <div className="text-white font-bold">{formatDate(membership.expiryDate)}</div>
                </div>
                <div>
                  <div className="text-white/60">Started</div>
                  <div className="text-white font-bold">{formatDate(membership.purchaseDate)}</div>
                </div>
                <div>
                  <div className="text-white/60">Days Left</div>
                  <div className={`font-bold ${daysLeft <= 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {daysLeft} days
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>Membership Progress</span>
                  <span>{Math.max(0, Math.min(100, ((365 - daysLeft) / 365 * 100))).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#A148FF] to-[#FFB948] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, ((365 - daysLeft) / 365 * 100)))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pause/Resume */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                {membership.status === 'active' ? 
                  <Pause className="w-5 h-5 text-yellow-500" /> : 
                  <Play className="w-5 h-5 text-green-500" />
                }
                <div>
                  <div className="text-white font-medium">
                    {membership.status === 'active' ? 'Pause Membership' : 'Resume Membership'}
                  </div>
                  <div className="text-white/60 text-sm">
                    {membership.status === 'active' ? 
                      'Temporarily pause your subscription' : 
                      'Resume your paused subscription'
                    }
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePauseMembership}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {membership.status === 'active' ? 'Pause' : 'Resume'}
              </Button>
            </div>

            {/* Auto Renewal */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-white font-medium">Auto Renewal</div>
                  <div className="text-white/60 text-sm">
                    Automatically renew before expiry
                  </div>
                </div>
              </div>
              <Switch
                checked={membership.autoRenew}
                onCheckedChange={handleAutoRenewToggle}
              />
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-white font-medium">Payment Method</div>
                  <div className="text-white/60 text-sm">
                    Update billing information
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Update
              </Button>
            </div>

            {/* Renewal Date */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-white font-medium">Next Billing</div>
                  <div className="text-white/60 text-sm">
                    {formatDate(membership.expiryDate)}
                  </div>
                </div>
              </div>
              <div className="text-white font-bold">
                Rs {getTierPrice().toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-900/20 border-red-500/30 mb-20">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showCancelConfirm ? (
              <Button 
                variant="destructive"
                onClick={() => setShowCancelConfirm(true)}
                className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel Membership
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="text-red-400 text-sm">
                  Are you sure you want to cancel this membership? This action cannot be undone.
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    onClick={handleCancelMembership}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Yes, Cancel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Keep It
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}