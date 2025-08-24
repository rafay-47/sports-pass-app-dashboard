import React, { useState, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Bell, User, Settings, Plus, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { SPORTS } from '../constants';
import type { Membership, User as UserType, NotificationItem, ServicePurchase, Sport } from '../types';
import DigitalCard from './DigitalCard';
import SportsSelector from './SportsSelector';
import ServicesList from './ServicesList';
import MembershipOptions from './MembershipOptions';
import LoadingSpinner from './LoadingSpinner';
import MembershipManagement from './MembershipManagement';

interface MainScreenProps {
  user: UserType | null;
  memberships: Membership[];
  selectedSport: string | null;
  setSelectedSport: (sportId: string | null) => void;
  onPurchaseAttempt: (sportId: string, tier: 'basic' | 'standard' | 'premium') => void;
  onServicePurchase: (service: ServicePurchase) => void;
  onUpdateMembership: (membershipId: string, updates: Partial<Membership>) => void;
  onDeleteMembership: (membershipId: string) => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onMembershipCardClick: (membership: Membership) => void;
  onTrainerListClick: (sportId: string, tier: 'basic' | 'standard' | 'premium') => void;
  isLoading: boolean;
  notifications: NotificationItem[];
  setNotifications: (notifications: NotificationItem[]) => void;
}

export default function MainScreen({ 
  user,
  memberships, 
  selectedSport, 
  setSelectedSport, 
  onPurchaseAttempt,
  onServicePurchase,
  onUpdateMembership,
  onDeleteMembership,
  onLogout,
  onProfileClick,
  onNotificationsClick,
  onMembershipCardClick,
  onTrainerListClick,
  isLoading,
  notifications,
  setNotifications
}: MainScreenProps) {
  
  const [showManagement, setShowManagement] = useState(false);
  const [managedMembershipId, setManagedMembershipId] = useState<string | null>(null);
  const [animateCard, setAnimateCard] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Get the membership for the currently selected sport (if exists)
  const selectedSportMembership = selectedSport ? 
    memberships.find(m => m.sportId === selectedSport) : null;
  
  // Get the sport data for the selected sport
  const displaySport = selectedSport ? 
    (SPORTS.find(s => s.id === selectedSport) ?? null) : null;

  // If no sport is selected, default to the most recent membership or first sport
  useEffect(() => {
    if (!selectedSport) {
      if (memberships.length > 0) {
        // Default to the most recent membership
        const latestMembership = memberships[memberships.length - 1];
        setSelectedSport(latestMembership.sportId);
      } else {
        // Default to first sport if no memberships
        setSelectedSport(SPORTS[0].id);
      }
    }
  }, [selectedSport, memberships, setSelectedSport]);

  // Animate card when membership changes
  useEffect(() => {
    if (selectedSportMembership) {
      setAnimateCard(true);
      const timer = setTimeout(() => setAnimateCard(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedSportMembership?.membershipNumber]);

  const handleManageMembership = (membershipId: string) => {
    setManagedMembershipId(membershipId);
    setShowManagement(true);
  };

  const handleServiceClick = (serviceName: string) => {
    if (!user) return;
    
    // Check if it's a trainer/coach service
    if (serviceName.toLowerCase().includes('trainer') || 
        serviceName.toLowerCase().includes('coach')) {
      
      // Get user's membership tier for this sport
      const userMembership = memberships.find(m => m.sportId === selectedSport);
      if (userMembership) {
        onTrainerListClick(selectedSport!, userMembership.tier.toLowerCase() as 'basic' | 'standard' | 'premium');
      }
      return;
    }

    const service: ServicePurchase = {
      serviceId: `${selectedSport}_${serviceName.toLowerCase().replace(/\s+/g, '_')}`,
      serviceName: serviceName,
      sportId: selectedSport!,
      price: Math.floor(Math.random() * 3000) + 500,
      description: `Professional ${serviceName.toLowerCase()} service for ${displaySport?.name}`,
      duration: '1 hour',
      type: serviceName.toLowerCase().includes('booking') ? 'booking' : 
            serviceName.toLowerCase().includes('rental') ? 'rental' :
            serviceName.toLowerCase().includes('consultation') ? 'consultation' : 'session'
    };

    onServicePurchase(service);
  };

  const handleCardClick = () => {
    if (selectedSportMembership && user) {
      onMembershipCardClick(selectedSportMembership);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  const managedMembership = managedMembershipId ? 
    memberships.find(m => m.membershipNumber === managedMembershipId) : null;

  if (showManagement && managedMembership) {
    return (
      <MembershipManagement
        membership={managedMembership}
        sport={SPORTS.find(s => s.id === managedMembership.sportId)!}
        onUpdate={onUpdateMembership}
        onDelete={onDeleteMembership}
        onBack={() => {
          setShowManagement(false);
          setManagedMembershipId(null);
        }}
      />
    );
  }

  return (
    <div className="screen-container bg-[#252525] text-white relative rounded-[19px]">
      {/* Animated Background Elements */}
      <div className="absolute top-[33px] left-6 w-10 h-10 bg-[#A148FF]/66 rounded-full animate-pulse"></div>
      <div className="absolute top-[200px] right-8 w-6 h-6 bg-[#A148FF]/40 rounded-full animate-ping"></div>
      
      {/* Header with Enhanced Design */}
      <div className="flex items-center justify-between p-6 pt-8 relative z-10 flex-shrink-0">
        <button 
          onClick={user ? onProfileClick : undefined}
          className={`flex items-center gap-3 ${user ? 'hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors' : ''}`}
          disabled={!user}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white text-base font-medium">
              {user ? user.name : 'Guest User'}
            </span>
            <div className="text-white/60 text-xs">
              {user ? 
                (memberships.length > 0 ? `${memberships.length} Active Memberships` : 'Welcome back!') :
                'Browse memberships • Sign up to purchase'
              }
              {user?.isTrainer && (
                <span className="ml-2 text-[#FFB948]">• Trainer</span>
              )}
            </div>
          </div>
        </button>
        
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 bg-[#A148FF]/66 rounded-[9px] hover:bg-[#A148FF] transition-all duration-300"
              onClick={onNotificationsClick}
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-[#FFB948] text-white text-xs flex items-center justify-center animate-bounce">
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Logout Button for logged in users */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 rounded-[9px] transition-all duration-300"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="w-5 h-5 text-red-300" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="scrollable-content">
        <div className="px-6 pb-6">
          {/* Loading Overlay */}
          {isLoading && <LoadingSpinner />}

          {/* Guest User Notice */}
          {!user && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#A148FF]/20 to-[#FFB948]/20 rounded-[15px] border border-white/10">
              <div className="text-center">
                <div className="text-white font-medium mb-2">👋 Welcome to Sports Club</div>
                <div className="text-white/70 text-sm mb-3">
                  Browse our memberships below. Sign up to purchase and unlock premium features!
                </div>
                <Badge className="bg-[#FFB948]/20 text-[#FFB948] border-[#FFB948]/30">
                  Guest Mode
                </Badge>
              </div>
            </div>
          )}

          {/* Digital Membership Card with Enhanced Height */}
          <div className={`mb-6 transition-all duration-600 ${animateCard ? 'scale-105 rotate-1' : 'scale-100 rotate-0'}`}>
            {selectedSportMembership && displaySport && user ? (
              // Show purchased membership card (only for logged in users) - clickable
              <div onClick={handleCardClick} className="cursor-pointer">
                <DigitalCard 
                  membership={selectedSportMembership}
                  sport={displaySport}
                  onManage={() => handleManageMembership(selectedSportMembership.membershipNumber)}
                  clickable={true}
                />
              </div>
            ) : displaySport ? (
              // Show preview card for selected sport
              <div 
                className="bg-gradient-to-br from-gray-600/50 to-gray-700/50 rounded-[19px] h-[180px] shadow-xl flex items-center justify-center backdrop-blur-sm border border-white/10 relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${displaySport.color}40 0%, ${displaySport.color}20 50%, ${displaySport.color}10 100%)` 
                }}
              >
                {/* Background decorative elements */}
                <div 
                  className="absolute top-[20px] right-[20px] w-24 h-24 rounded-full opacity-10"
                  style={{ backgroundColor: displaySport.color }}
                ></div>
                <div 
                  className="absolute bottom-[-10px] left-[-10px] w-16 h-16 rounded-full opacity-20"
                  style={{ backgroundColor: displaySport.color }}
                ></div>
                
                <div className="text-center z-10">
                  <div className="text-5xl mb-4 animate-bounce">{displaySport.icon}</div>
                  <div 
                    className="font-extrabold text-xl mb-2"
                    style={{ color: displaySport.color }}
                  >
                    {displaySport.displayName}
                  </div>
                  <div className="text-white/70 text-sm mb-3">
                    {user ? 'Choose your membership plan' : 'Sign up to unlock this membership'}
                  </div>
                  <Badge 
                    className="bg-white/10 text-white/80 border-white/20"
                  >
                    {displaySport.services.length} services available
                  </Badge>
                </div>
              </div>
            ) : (
              // Default card when no sport is selected
              <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-[19px] h-[180px] shadow-lg flex items-center justify-center border border-white/10 border-dashed">
                <div className="text-center">
                  <Plus className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <div className="text-white/60 text-base mb-2">
                    Select a sport to get started
                  </div>
                  <div className="text-white/40 text-sm">
                    Choose from {SPORTS.length} available sports
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sports Selector */}
          <SportsSelector 
            sports={SPORTS}
            selectedSport={selectedSport}
            ownedSports={memberships.map(m => m.sportId)}
            onSelectSport={setSelectedSport}
            isLoading={isLoading}
          />

          {/* Content based on membership status */}
          {displaySport && (
            <>
              {selectedSportMembership && user ? (
                // Show services for active membership (only for logged in users)
                <ServicesList 
                  sport={displaySport}
                  membership={selectedSportMembership}
                  onServiceClick={handleServiceClick}
                />
              ) : (
                // Show membership options for selected sport
                <MembershipOptions 
                  sport={displaySport}
                  onPurchase={onPurchaseAttempt}
                  isLoading={isLoading}
                  isLoggedIn={!!user}
                />
              )}
            </>
          )}

          {/* Multi-Membership Overview - Only for logged in users */}
          {user && memberships.length > 1 && (
            <div className="mt-6 bg-white/5 rounded-[15px] p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-white text-sm font-medium mb-3">Your Memberships</h3>
              <div className="space-y-2">
                {memberships.map((membership) => {
                  const sport = SPORTS.find(s => s.id === membership.sportId);
                  if (!sport) return null;
                  
                  return (
                    <button
                      key={membership.membershipNumber}
                      onClick={() => setSelectedSport(membership.sportId)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        selectedSport === membership.sportId 
                          ? 'bg-white/15 border border-white/30' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{sport.icon}</span>
                        <div className="text-left">
                          <div className="text-white text-sm font-medium">{sport.name}</div>
                          <div className="text-white/60 text-xs">{membership.tier} • {membership.membershipNumber}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`text-xs ${
                            membership.status === 'active' ? 'bg-green-600' : 
                            membership.status === 'paused' ? 'bg-yellow-600' : 'bg-red-600'
                          } text-white`}
                        >
                          {membership.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageMembership(membership.membershipNumber);
                          }}
                        >
                          <Settings className="w-3 h-3 text-white/60" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Stats for Members - Only for logged in users */}
          {user && memberships.length > 0 && (
            <div className="mt-6 bg-white/5 rounded-[15px] p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-white text-sm font-medium mb-3">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-[#FFB948] text-xl font-bold">{memberships.length}</div>
                  <div className="text-white/60 text-xs">Memberships</div>
                </div>
                <div className="text-center">
                  <div className="text-[#A148FF] text-xl font-bold">
                    {memberships.reduce((total, m) => {
                      const sport = SPORTS.find(s => s.id === m.sportId);
                      return total + (sport?.services.length || 0);
                    }, 0)}
                  </div>
                  <div className="text-white/60 text-xs">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-xl font-bold">
                    {memberships.filter(m => m.status === 'active').length}
                  </div>
                  <div className="text-white/60 text-xs">Active</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="h-20"></div> {/* Bottom padding for navigation */}
        </div>
      </ScrollArea>

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