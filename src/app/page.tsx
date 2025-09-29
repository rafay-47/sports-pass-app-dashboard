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
import { AuthProvider, useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import DashboardOverview from '../components/DashboardOverview';
import ClubProfileScreen from '../components/ClubProfileScreen';
import EventManagementScreen from '../components/EventManagementScreen';
import FinancialScreen from '../components/FinancialScreen';
import SettingsScreen from '../components/SettingsScreen';
import AuthScreen from '../components/AuthScreen';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { useClubOperations } from '../hooks';

// Import types and utilities
import { type ClubOwner, type Club, type FinancialData, type ClubEvent, type NotificationItem, type CheckInAnalytics, type ServiceCommission } from '../types';
import { generateMockAnalytics } from '../utils/helpers';
import { eventApi } from '../services';

function AppContent() {
  const { user: clubOwner, isLoading, isHydrating, hasStoredAuthData, login, signup, logout } = useAuth();
  const { getUserClubs, loading: clubApiLoading } = useClubOperations();
  const [club, setClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  // keep sidebar and other states
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
  const [eventsLoading, setEventsLoading] = useState(false);
 

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

  // Load data from API on mount and when clubOwner changes
  useEffect(() => {
    if (clubOwner?.id) {
      fetchClubData();
    } else {
      setClub(null);
    }
  }, [clubOwner?.id]);

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

  // Fetch club data from API when clubOwner is available
  useEffect(() => {
    if (clubOwner?.id && !club && !clubApiLoading) {
      console.log('🔄 AppContent - Triggering club data fetch for owner:', clubOwner.id);
      console.log('🔄 AppContent - Current state: club=', !!club, 'clubApiLoading=', clubApiLoading);
      fetchClubData();
    }
  }, [clubOwner?.id, club, clubApiLoading]);

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
    await login(userData);
  };

  const handleSignup = async (userData: { name: string; email: string; phone: string; password: string; user_role: string }) => {
    await signup(userData);
    setActiveTab('profile');
  };

  const handleLogout = () => {
    logout();
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

    toast.success('Logged out successfully');
  };


  // Function to fetch club data from API
  const fetchClubData = async () => {
    if (!clubOwner?.id) return;

    try {
      console.log('🔄 AppContent - Starting to fetch club data for owner:', clubOwner.id);
      console.log('🔄 AppContent - clubApiLoading state:', clubApiLoading);
      
      const clubs = await getUserClubs();
      
      console.log('✅ AppContent - Club data fetch completed, clubs:', clubs?.length || 0);

      if (clubs && clubs.length > 0) {
        const fetchedClub = clubs[0]; // Get the first club (assuming one club per owner)
        console.log('✅ AppContent - Setting club data:', fetchedClub.name);

        // Update the club state with fetched data
        setClub(fetchedClub);

        // Fetch events for this organizer
        await fetchEvents();

        toast.success('Club data loaded');
      } else {
        console.log('⚠️ AppContent - No clubs found for owner');
        setClub(null);
      }
    } catch (error) {
      console.error('❌ AppContent - Error fetching club data:', error);
      toast.error('Failed to fetch club data');
    }
  };

  const fetchEvents = async () => {
    console.log('🚀 fetchEvents called!');
    console.log('👤 Current clubOwner:', clubOwner);
    console.log('🆔 clubOwner ID:', clubOwner?.id);
    
    if (!clubOwner?.id) {
      console.log('❌ No clubOwner or ID, returning early');
      return;
    }

    setEventsLoading(true);
    try {
      console.log('🔄 AppContent - Fetching events for organizer:', clubOwner.id);
      const response = await eventApi.getOrganizerEvents();
      
      console.log('🔄 AppContent - Raw API response:', JSON.stringify(response, null, 2));
      console.log('🔄 AppContent - Response status:', response?.status);
      console.log('🔄 AppContent - Response data exists:', !!(response?.data));
      console.log('🔄 AppContent - Response data.events exists:', !!(response?.data?.events));
      
      if (response?.data?.events) {
        console.log('🔄 AppContent - Events array length:', response.data.events.length);
        console.log('🔄 AppContent - First event sample:', response.data.events[0] ? JSON.stringify(response.data.events[0], null, 2) : 'No events');
      }
      
      if (response.status === 'success' && response.data.events) {
        // Convert API events to component format
        const componentEvents = response.data.events.map(apiEvent => 
          eventApi.convertApiEventToComponentEvent(apiEvent)
        );
        
        console.log('✅ AppContent - Events converted to component format:', componentEvents.length);
        console.log('✅ AppContent - First converted event:', componentEvents[0] ? JSON.stringify(componentEvents[0], null, 2) : 'No events');
        setEvents(componentEvents);
      } else {
        console.log('⚠️ AppContent - No events found or invalid response structure');
        console.log('⚠️ AppContent - Response structure check:', {
          hasResponse: !!response,
          status: response?.status,
          hasData: !!response?.data,
          dataType: typeof response?.data,
          hasEvents: !!response?.data?.events,
          eventsType: typeof response?.data?.events
        });
        setEvents([]);
      }
    } catch (error) {
      console.error('❌ AppContent - Error fetching events:', error);
      console.error('❌ AppContent - Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      toast.error('Failed to fetch events');
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleClubSave = async (clubData: Partial<Club>) => {
    if (clubOwner) {
      //console.log('Received club data from API:', clubData);

      // The clubData should already be in the correct Club format from ClubProfileScreen
      // Just ensure all required fields are present
      const completeClub: Club = {
        id: clubData.id || club?.id || `club_${Date.now()}`,
        owner_id: clubOwner.id,
        name: clubData.name || '',
        description: clubData.description || '',
        sport_id: clubData.sport_id || '',
        address: clubData.address || '',
        city: clubData.city || '',
        latitude: clubData.latitude || '0',
        longitude: clubData.longitude || '0',
        phone: clubData.phone || null,
        email: clubData.email || null,
        rating: clubData.rating || '0.00',
        category: clubData.category || 'mixed',
        qr_code: clubData.qr_code || `QR_${Date.now()}`,
        status: clubData.status || 'active',
        verification_status: clubData.verification_status || 'pending',
        timings: clubData.timings || {},
        is_active: clubData.is_active ?? true,
        created_at: clubData.created_at || new Date().toISOString(),
        updated_at: clubData.updated_at || new Date().toISOString(),
        owner: clubData.owner || {
          id: clubOwner.id,
          email: clubOwner.email || '',
          name: clubOwner.name || '',
          phone: clubOwner.phone || '',
          date_of_birth: null,
          gender: null,
          profile_image_url: null,
          user_role: 'owner',
          is_trainer: false,
          is_verified: true,
          is_active: true,
          join_date: clubOwner.join_date || new Date().toISOString(),
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        sport: clubData.sport || {
          id: clubData.sport_id || '',
          name: '',
          display_name: '',
          icon: '',
          color: '',
          description: '',
          number_of_services: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        amenities: clubData.amenities || [],
        facilities: clubData.facilities || [],
        primary_image: clubData.primary_image || [],
      };

      //console.log('Saving complete club data:', completeClub);
      setClub(completeClub);

      // Fetch updated data from API to ensure we have the latest
      if (clubOwner?.id) {
        await fetchClubData();
      }

      if (!club) {
        // First time creating club - generate mock financial data
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

    const handleEventSave = async (eventData: any, isDraft?: boolean) => {
    if (!clubOwner) return;

    try {
      // Add organizer information to event data
      const eventDataWithOrganizer = {
        ...eventData,
        organizer: clubOwner.id,
        organizer_id: clubOwner.id
      };
      
      // Convert component format to API format
      const apiEventData = eventApi.convertComponentEventToApiEvent(eventDataWithOrganizer);
      
      console.log('Creating event with data:', apiEventData);
      const createdEvent = await eventApi.createEvent(apiEventData as any);
      
      // Convert API response back to component format
      const componentEvent = eventApi.convertApiEventToComponentEvent(createdEvent);
      
      // Add to local state
      setEvents(prev => [...prev, componentEvent]);
      
      addNotification({
        title: 'Event Created!',
        message: `Event "${createdEvent.title}" has been created successfully.`,
        type: 'success'
      });
      
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  // Show loading screen during hydration if we have stored auth data
  if (isHydrating && hasStoredAuthData) {
    console.log('AppContent - Showing loading screen: isHydrating=', isHydrating, 'hasStoredAuthData=', hasStoredAuthData, 'clubOwner=', !!clubOwner);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in and hydration is complete
  if (!clubOwner && !isHydrating) {
    console.log('AppContent - Showing auth screen: isHydrating=', isHydrating, 'hasStoredAuthData=', hasStoredAuthData, 'clubOwner=', !!clubOwner);
    return (
      <div className="min-h-screen bg-background">
        <AuthScreen
          onLogin={handleLogin}
          onSignup={handleSignup}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // Show main app if we have a user
  console.log('AppContent - Showing main app: isHydrating=', isHydrating, 'hasStoredAuthData=', hasStoredAuthData, 'clubOwner=', !!clubOwner);

  return (
    <div className="h-screen bg-background flex">
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} h-screen bg-card border-r border-border transition-all duration-300 flex flex-col`}>
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
      <div className="flex-1 flex flex-col">
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
                      {clubOwner?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{clubOwner?.name}</span>
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
        <div className="flex-1">
          {clubApiLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card rounded-lg p-6 shadow-lg border max-w-sm w-full mx-4">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Loading Club Data</h3>
                    <p className="text-sm text-muted-foreground">Fetching your club information...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              club={club}
              financialData={financialData}
              events={events}
              notifications={notifications}
              isLoading={clubApiLoading}
            />
          )}
          {activeTab === 'profile' && clubOwner && (
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
              clubs={[club].filter(Boolean) as Club[]} // Assuming clubs is an array; adjust if needed
              events={events}
              onEventSave={handleEventSave}
              onEventUpdate={async (id, updates) => {
                try {
                  // For partial updates like postpone, we need the existing event data
                  const existingEvent = events.find(e => e.id === id);
                  if (!existingEvent) {
                    throw new Error('Event not found');
                  }
                  
                  // Merge updates with existing event data
                  const fullEventData = { ...existingEvent, ...updates };
                  
                  // Convert component format to API format
                  const apiUpdates = eventApi.convertComponentEventToApiEvent(fullEventData);
                  
                  await eventApi.updateEvent(id, apiUpdates);
                  
                  // Update local state
                  setEvents(prev => prev.map(event => 
                    event.id === id ? { ...event, ...updates } : event
                  ));
                  
                  addNotification({
                    title: 'Event Updated',
                    message: 'The event has been updated successfully.',
                    type: 'success'
                  });
                } catch (error) {
                  console.error('Error updating event:', error);
                  toast.error('Failed to update event');
                }
              }}
              onEventPostpone={async (id, updates) => {
                // For postpone operations, only update local state (API call already made)
                setEvents(prev => prev.map(event => 
                  event.id === id ? { ...event, ...updates } : event
                ));
                
                addNotification({
                  title: 'Event Postponed',
                  message: 'The event has been postponed successfully.',
                  type: 'success'
                });
              }}
              onEventDelete={async (id) => {
                try {
                  await eventApi.deleteEvent(id);
                  await fetchEvents(); // Refresh the list
                  
                  addNotification({
                    title: 'Event Deleted',
                    message: 'The event has been deleted successfully.',
                    type: 'info'
                  });
                } catch (error) {
                  console.error('Error deleting event:', error);
                  toast.error('Failed to delete event');
                }
              }}
              onEventAnnouncement={(id, announcement) => {
              // Implement announcement logic, e.g., update event or notify
              addNotification({
                title: 'Announcement Sent',
                message: `Announcement for event ${id}: ${announcement}`,
                type: 'info'
              });
              }}
              addNotification={addNotification}
            />
            )}
            {eventsLoading && activeTab === 'events' && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-card rounded-lg p-6 shadow-lg border max-w-sm w-full mx-4">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <div>
                      <h3 className="font-semibold text-foreground">Loading Events</h3>
                      <p className="text-sm text-muted-foreground">Fetching your events...</p>
                    </div>
                  </div>
                </div>
              </div>
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
          {activeTab === 'settings' && clubOwner && (
            <SettingsScreen 
              clubOwner={clubOwner} 
              club={club}
              onOwnerUpdate={(u) => localStorage.setItem('clubOwner', JSON.stringify(u))}
              onClubUpdate={setClub}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}