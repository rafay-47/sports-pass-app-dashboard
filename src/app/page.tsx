"use client"

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  DollarSign, 
  Settings, 
  Menu,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ThemeProvider } from '../components/ThemeContext';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import DashboardOverview from '../components/DashboardOverview';
import ClubProfileScreen from '../components/ClubProfileScreen';
import EventManagementScreen from '../components/EventManagementScreen';
import FinancialScreen from '../components/FinancialScreen';
import SettingsScreen from '../components/SettingsScreen';
import AuthScreen from '../components/AuthScreen';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

// Import types and utilities
import { type ClubOwner, type Club, type FinancialData, type ClubEvent, type NotificationItem, type CheckInAnalytics, type ServiceCommission } from '../types';
import { generateMockAnalytics } from '../utils/helpers';

function AppContent() {
  const [clubOwner, setClubOwner] = useState<ClubOwner | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    checkInRevenue: 0,
    serviceCommissions: 0,
    pendingWithdrawals: 0,
    availableBalance: 0,
    analytics: [],
    commissions: []
  });
  const [events, setEvents] = useState<ClubEvent[]>([]);

  // Helper to coerce runtime data (unknown) into the expected FinancialData unions without using `any`
  const sanitizeFinancialData = (data: unknown): FinancialData => {
    const raw = (typeof data === 'object' && data !== null) ? (data as Partial<FinancialData>) : {};

    return {
      totalRevenue: raw.totalRevenue ?? 0,
      monthlyRevenue: raw.monthlyRevenue ?? 0,
      checkInRevenue: raw.checkInRevenue ?? 0,
      serviceCommissions: raw.serviceCommissions ?? 0,
      pendingWithdrawals: raw.pendingWithdrawals ?? 0,
      availableBalance: raw.availableBalance ?? 0,
      analytics: Array.isArray(raw.analytics) ? raw.analytics.map((a: Partial<CheckInAnalytics>) => {
        const membershipType: CheckInAnalytics['membershipType'] = (a.membershipType === 'basic' || a.membershipType === 'standard' || a.membershipType === 'premium') ? a.membershipType as CheckInAnalytics['membershipType'] : 'basic';
        return {
          date: a.date ?? '',
          checkIns: typeof a.checkIns === 'number' ? a.checkIns : 0,
          revenue: typeof a.revenue === 'number' ? a.revenue : 0,
          membershipType
        } as CheckInAnalytics;
      }) : [],
      commissions: Array.isArray(raw.commissions) ? raw.commissions.map((c: Partial<ServiceCommission>) => {
        const status: ServiceCommission['status'] = (c.status === 'completed' || c.status === 'pending' || c.status === 'cancelled') ? c.status as ServiceCommission['status'] : 'pending';
        return {
          id: c.id ?? '',
          serviceName: c.serviceName ?? '',
          memberName: c.memberName ?? '',
          amount: typeof c.amount === 'number' ? c.amount : 0,
          commission: typeof c.commission === 'number' ? c.commission : 0,
          date: c.date ?? '',
          status
        } as ServiceCommission;
      }) : []
    } as FinancialData;
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedOwner = localStorage.getItem('clubOwner');
    const savedClub = localStorage.getItem('clubData');
    const savedNotifications = localStorage.getItem('clubNotifications');
    const savedFinancialData = localStorage.getItem('clubFinancialData');
    const savedEvents = localStorage.getItem('clubEvents');
    
    if (savedOwner) setClubOwner(JSON.parse(savedOwner));
    if (savedClub) setClub(JSON.parse(savedClub));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  if (savedFinancialData) setFinancialData(sanitizeFinancialData(JSON.parse(savedFinancialData)));
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    // Generate mock data if first time
    if (!savedFinancialData && savedClub) {
      const mockData = generateMockAnalytics();
      setFinancialData(sanitizeFinancialData(mockData));
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (clubOwner) localStorage.setItem('clubOwner', JSON.stringify(clubOwner));
  }, [clubOwner]);

  useEffect(() => {
    if (club) localStorage.setItem('clubData', JSON.stringify(club));
  }, [club]);

  useEffect(() => {
    localStorage.setItem('clubNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('clubFinancialData', JSON.stringify(financialData));
  }, [financialData]);

  useEffect(() => {
    localStorage.setItem('clubEvents', JSON.stringify(events));
  }, [events]);

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleLogin = async (userData: { email: string; password: string }) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOwner: ClubOwner = {
      id: 'owner_1',
      name: 'Ahmed Sports',
      email: userData.email,
      phone: '+92 300 1234567',
      joinDate: '2024-01-15'
    };

    setClubOwner(mockOwner);
    setIsLoading(false);
    
    toast.success('Welcome to your dashboard!', {
      description: `Logged in as ${mockOwner.name}`,
      duration: 3000,
    });

    addNotification({
      title: 'Welcome Back!',
      message: 'You have successfully logged in to your club dashboard.',
      type: 'success'
    });
  };

  const handleSignup = async (userData: { name: string; email: string; phone: string; password: string }) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newOwner: ClubOwner = {
      id: `owner_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setClubOwner(newOwner);
    setIsLoading(false);
    
    toast.success('Account created successfully!', {
      description: `Welcome ${userData.name}! Please complete your club profile.`,
      duration: 4000,
    });

    addNotification({
      title: 'Account Created!',
      message: 'Welcome! Complete your club profile to get started.',
      type: 'success'
    });

    setActiveTab('profile');
  };

  const handleLogout = () => {
    setClubOwner(null);
    setClub(null);
    setNotifications([]);
    setFinancialData({
      totalRevenue: 0,
      monthlyRevenue: 0,
      checkInRevenue: 0,
      serviceCommissions: 0,
      pendingWithdrawals: 0,
      availableBalance: 0,
      analytics: [],
      commissions: []
    });
    setEvents([]);
    setActiveTab('dashboard');
    
    ['clubOwner', 'clubData', 'clubNotifications', 'clubFinancialData', 'clubEvents'].forEach(key => {
      localStorage.removeItem(key);
    });
    
    toast.success('Logged out successfully');
  };

  const handleClubSave = (clubData: Partial<Club>) => {
    if (clubOwner) {
      const newClub: Club = {
        id: club?.id || `club_${Date.now()}`,
        ownerId: clubOwner.id,
        status: 'active',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        qrCode: `QR_${Date.now()}`,
        ...clubData
      } as Club;

      setClub(newClub);
      
      if (!club) {
  const mockData = generateMockAnalytics();
  setFinancialData(sanitizeFinancialData(mockData));
        addNotification({
          title: 'Club Profile Created!',
          message: 'Your club profile has been created and is pending verification.',
          type: 'success'
        });
      } else {
        addNotification({
          title: 'Club Profile Updated!',
          message: 'Your club profile has been successfully updated.',
          type: 'info'
        });
      }
      
      toast.success(club ? 'Club updated successfully!' : 'Club created successfully!');
    }
  };

  const handleEventSave = (eventData: Partial<ClubEvent>) => {
    if (club) {
      const newEvent: ClubEvent = {
        id: `event_${Date.now()}`,
        clubId: club.id,
        createdAt: new Date().toISOString(),
        currentParticipants: 0,
        status: 'draft',
        ...eventData
      } as ClubEvent;

      setEvents(prev => [...prev, newEvent]);
      
      addNotification({
        title: 'Event Created!',
        message: `Event "${eventData.title}" has been created successfully.`,
        type: 'success'
      });
      
      toast.success('Event created successfully!');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  // Show auth screen if not logged in
  if (!clubOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" richColors />
        <AuthScreen
          onLogin={handleLogin}
          onSignup={handleSignup}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      <Toaster position="top-center" richColors />
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-foreground">Club Dashboard</h1>
                <p className="text-xs text-muted-foreground">Sports Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'profile', icon: Building2, label: 'Club Profile' },
              { id: 'events', icon: Calendar, label: 'Events' },
              { id: 'financial', icon: DollarSign, label: 'Financials' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">{label}</span>}
              </Button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Button
            className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : ''}`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">Collapse</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'profile' && 'Club Profile'}
              {activeTab === 'events' && 'Event Management'}
              {activeTab === 'financial' && 'Financial Management'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            {club && (
              <p className="text-sm text-muted-foreground">{club.name}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <Button >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                      {clubOwner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{clubOwner.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              club={club}
              financialData={financialData}
              events={events}
              notifications={notifications}
            />
          )}
          {activeTab === 'profile' && (
            <ClubProfileScreen 
              clubOwner={clubOwner}
              club={club}
              onSave={handleClubSave}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'events' && (
            <EventManagementScreen 
              club={club}
              events={events}
              onEventSave={handleEventSave}
              onEventUpdate={(id, updates) => {
                setEvents(prev => prev.map(event => 
                  event.id === id ? { ...event, ...updates } : event
                ));
              }}
            />
          )}
          {activeTab === 'financial' && (
            <FinancialScreen 
              club={club}
              financialData={financialData}
              onWithdrawal={(request) => {
                addNotification({
                  title: 'Withdrawal Requested',
                  message: `Withdrawal of Rs ${request.amount.toLocaleString()} has been requested.`,
                  type: 'info'
                });
                toast.success('Withdrawal request submitted successfully!');
              }}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsScreen 
              clubOwner={clubOwner}
              club={club}
              onOwnerUpdate={setClubOwner}
              onClubUpdate={setClub}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}