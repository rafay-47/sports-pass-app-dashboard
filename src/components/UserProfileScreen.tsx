import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { ArrowLeft, User, Mail, Phone, Calendar, Star, Award, Settings, LogOut, Users, Sun, Moon } from 'lucide-react';
import { SPORTS } from '../constants';
import type { User as UserType, Membership } from '../types';
import { useTheme } from './ThemeContext';

interface UserProfileScreenProps {
  user: UserType;
  memberships: Membership[];
  onBack: () => void;
  onBecomeTrainer: () => void;
  onLogout: () => void;
}

export default function UserProfileScreen({ 
  user, 
  memberships, 
  onBack, 
  onBecomeTrainer, 
  onLogout 
}: UserProfileScreenProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const activeMemberships = memberships.filter(m => m.status === 'active');
  const totalServices = memberships.reduce((total, m) => {
    const sport = SPORTS.find(s => s.id === m.sportId);
    return total + (sport?.number_of_services || 0);
  }, 0);

  return (
    <div className="screen-container bg-background text-foreground relative rounded-[19px]">
      {/* Background Elements */}
      <div className="absolute top-[50px] right-8 w-20 h-20 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[100px] left-6 w-16 h-16 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-8 relative z-10 flex-shrink-0">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">My Profile</h1>
            <p className="text-white/60 text-sm">Manage your account</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="w-5 h-5 text-red-300" />
        </Button>
      </div>

      <div className="scrollable-content">
        <div className="px-6 pb-6 space-y-6">
          {/* Profile Header */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-white text-2xl font-bold">{user.name}</h2>
                    {user.is_trainer && (
                      <Badge className="bg-[#FFB948]/20 text-[#FFB948] border-[#FFB948]/30">
                        <Award className="w-3 h-3 mr-1" />
                        Trainer
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Member since {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Toggle */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    {theme === 'light' ? (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">Theme</div>
                    <div className="text-white/60 text-sm">
                      {theme === 'light' ? 'Light mode' : 'Dark mode'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={theme === 'light'}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-[#FFB948] data-[state=unchecked]:bg-white/20"
                />
              </div>
              <div className="mt-3 text-xs text-white/50">
                Switch between light and dark theme for better visibility
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-[#FFB948] text-2xl font-bold">{memberships.length}</div>
                <div className="text-white/60 text-sm">Memberships</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-[#A148FF] text-2xl font-bold">{totalServices}</div>
                <div className="text-white/60 text-sm">Services</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-green-400 text-2xl font-bold">{activeMemberships.length}</div>
                <div className="text-white/60 text-sm">Active</div>
              </CardContent>
            </Card>
          </div>

          {/* Trainer Profile */}
          {user.is_trainer && user.trainer_profile && (
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Trainer Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-white/80 text-sm font-medium mb-2">Sport</div>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const sport = SPORTS.find(s => s.id === user.trainer_profile?.sport);
                        return sport ? (
                          <Badge className="bg-[#A148FF]/20 text-[#A148FF] border-[#A148FF]/30">
                            {sport.icon} {sport.name}
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/80 text-sm font-medium">Experience</div>
                      <div className="text-white">{user.trainer_profile.experience} years</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-sm font-medium">Membership Tier</div>
                      <div className="text-[#FFB948] font-bold capitalize">{user.trainer_profile.membership_tier}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{user.trainer_profile.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {user.trainer_profile.total_sessions} sessions completed
                    </div>
                    <Badge className={user.trainer_profile.verified ? 
                      "bg-green-500/20 text-green-300 border-green-500/30" :
                      "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }>
                      {user.trainer_profile.verified ? 'Verified' : 'Under Review'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Memberships */}
          {memberships.length > 0 && (
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">My Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memberships.map((membership) => {
                    const sport = SPORTS.find(s => s.id === membership.sportId);
                    if (!sport) return null;
                    
                    return (
                      <div key={membership.membershipNumber} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{sport.icon}</span>
                          <div>
                            <div className="text-white font-medium">{sport.name}</div>
                            <div className="text-white/60 text-sm">{membership.tier} • {membership.membershipNumber}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${
                            membership.status === 'active' ? 'bg-green-600' : 
                            membership.status === 'paused' ? 'bg-yellow-600' : 'bg-red-600'
                          } text-white`}>
                            {membership.status}
                          </Badge>
                          <div className="text-white/60 text-xs">
                            Expires {new Date(membership.expiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-4">
            {!user.is_trainer && (
              <Button
                onClick={onBecomeTrainer}
                className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-3"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Trainer
              </Button>
            )}
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-white/70 text-sm">
                    Need help or want to update your profile?
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-[#252525] border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to log out? You will need to sign in again to access your memberships and services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}