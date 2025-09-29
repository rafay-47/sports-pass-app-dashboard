import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Eye,
  Users,
  DollarSign,
  Clock,
  Trophy,
  Star,
  Award,
  CheckCircle,
  X,
  MapPin,
  Building2,
  AlertCircle,
  Gift,
  Phone,
  Mail,
  User,
  UserCheck,
  Shirt,
  Heart,
  Utensils,
  Megaphone,
  CalendarClock,
  Trash2,
  Save,
  Send
} from 'lucide-react';
import { type Club, type ClubEvent, type EventParticipant, type ClubOwner, type Sport } from '../types';
import { sportsApi } from '../services/sportsApi';
import { eventApi, type EventRegistration } from '../services/eventApi';
import { useSports } from '../hooks';

// Define constants locally to avoid import issues

const EVENT_TYPES = [
  { id: 'tournament', label: 'Tournament', icon: Trophy, color: 'text-yellow-600' },
  { id: 'workshop', label: 'Workshop', icon: Star, color: 'text-blue-600' },
  { id: 'training', label: 'Training', icon: Award, color: 'text-purple-600' },
  { id: 'social', label: 'Social Event', icon: Users, color: 'text-green-600' }
];


interface EventManagementScreenProps {
  club: Club | null;
  clubs: Club[];
  events: ClubEvent[];
  onEventSave: (eventData: Partial<ClubEvent>, isDraft?: boolean) => void;
  onEventUpdate: (id: string, updates: Partial<ClubEvent>) => void;
  onEventPostpone: (id: string, updates: Partial<ClubEvent>) => void;
  onEventDelete: (id: string) => void;
  onEventAnnouncement: (id: string, message: string) => void;
  addNotification: (notification: any) => void;
}

export default function EventManagementScreen({ 
  club, 
  clubs = [], 
  events, 
  onEventSave, 
  onEventUpdate,
  onEventPostpone,
  onEventDelete,
  onEventAnnouncement,
  addNotification 
}: EventManagementScreenProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEntriesDialog, setShowEntriesDialog] = useState(false);
  const [showParticipantDialog, setShowParticipantDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<EventParticipant | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showPostponeDialog, setShowPostponeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [postponeLoading, setPostponeLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track which event is being deleted
  const { sports, loading: sportsLoading, error: sportsError, refetch: refetchSports } = useSports();
  
  // Postpone validation state
  const [postponeErrors, setPostponeErrors] = useState<{
    eventDate?: string;
    eventTime?: string;
    endDate?: string;
    endTime?: string;
    registrationDeadline?: string;
    general?: string;
  }>({});
  
  const [eventForm, setEventForm] = useState<Partial<ClubEvent>>({
    title: '',
    description: '',
    hostingClub: club?.id || '',
    sport: '',
    type: 'tournament',
    date: '',
    time: '',
    duration: 2,
    fee: 0,
    maxParticipants: 50,
    location: '',
    customLocation: {
      address: '',
      city: '',
      state: ''
    },
    requirements: {
      hasRequirements: false,
      description: ''
    },
    prizes: {
      hasPrizes: false,
      positions: {
        first: '',
        second: '',
        third: ''
      }
    },
    sports: []
  });

  // Auto-update event statuses based on date/time
  useEffect(() => {
    const updateEventStatuses = () => {
      const now = new Date();
      
      events.forEach(event => {
        if (event.status === 'published') {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          const eventEndTime = new Date(eventDateTime.getTime() + (event.duration * 60 * 60 * 1000));
          
          if (now > eventEndTime) {
            // Event has ended, move to completed
            onEventUpdate(event.id, { status: 'completed' });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(updateEventStatuses, 60000);
    // Check immediately
    updateEventStatuses();

    return () => clearInterval(interval);
  }, [events, onEventUpdate]);



  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      hostingClub: club?.id || '',
      sport: '',
      type: 'tournament',
      date: '',
      time: '',
      duration: 2,
      fee: 0,
      maxParticipants: 50,
      location: '',
      customLocation: {
        address: '',
        city: '',
        state: ''
      },
      requirements: {
        hasRequirements: false,
        description: ''
      },
      prizes: {
        hasPrizes: false,
        positions: {
          first: '',
          second: '',
          third: ''
        }
      },
      sports: []
    });
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    resetForm();
    setShowCreateDialog(true);
  };

  const handleEditEvent = (event: ClubEvent) => {
    setSelectedEvent(event);
    setEventForm(event);
    setShowCreateDialog(true);
  };

  const handleViewEvent = (event: ClubEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleViewEntries = async (event: ClubEvent) => {
    setSelectedEvent(event);
    setShowEntriesDialog(true);
    setRegistrationsLoading(true);

    try {
      const response = await eventApi.getEventRegistrations(event.id);
      if (response.status === 'success' && response.data.registrations) {
        setEventRegistrations(response.data.registrations);
        
        // Update selectedEvent with actual registration count
        setSelectedEvent(prev => prev ? { ...prev, currentParticipants: response.data.registrations.length } : null);
      } else {
        setEventRegistrations([]);
      }
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      setEventRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleViewParticipant = (participant: EventParticipant) => {
    setSelectedParticipant(participant);
    setShowParticipantDialog(true);
  };

  const handlePostEvent = async (eventId: string) => {
    setSubmitLoading(true);
    try {
      onEventUpdate(eventId, { status: 'published' });
      
      addNotification({
        title: 'Event Published!',
        message: 'Your event has been published successfully.',
        type: 'success'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      // Set location and location_type based on hosting club selection
      let finalEventData = { ...eventForm };
      
      if (eventForm.hostingClub && eventForm.hostingClub !== 'other') {
        // Club-based location
        const selectedClub = clubs.find(c => c.id === eventForm.hostingClub);
        if (selectedClub) {
          finalEventData.location = `${selectedClub.name}, ${selectedClub.address}, ${selectedClub.city}`;
          finalEventData.location_type = 'club';
          finalEventData.club_id = eventForm.hostingClub;
          // Clear custom location fields
          finalEventData.custom_address = undefined;
          finalEventData.custom_city = undefined;
          finalEventData.custom_state = undefined;
        }
      } else if (eventForm.hostingClub === 'other' && eventForm.customLocation) {
        // Custom location
        finalEventData.location = `${eventForm.customLocation.address}, ${eventForm.customLocation.city}, ${eventForm.customLocation.state}`;
        finalEventData.location_type = 'custom';
        finalEventData.custom_address = eventForm.customLocation.address;
        finalEventData.custom_city = eventForm.customLocation.city;
        finalEventData.custom_state = eventForm.customLocation.state;
        // Clear club fields
        finalEventData.club_id = undefined;
      }
      
      if (selectedEvent) {
        onEventUpdate(selectedEvent.id, finalEventData);
      } else {
        onEventSave(finalEventData, isDraft);
      }
      
      setShowCreateDialog(false);
      resetForm();
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setDeleteLoading(eventId);
    try {
      onEventDelete(eventId);
      
      addNotification({
        title: 'Event Deleted!',
        message: 'The event has been successfully deleted.',
        type: 'success'
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleAnnouncement = async () => {
    if (selectedEvent && announcementMessage.trim()) {
      setAnnouncementLoading(true);
      try {
        onEventAnnouncement(selectedEvent.id, announcementMessage.trim());
        setAnnouncementMessage('');
        setShowAnnouncementDialog(false);
      } finally {
        setAnnouncementLoading(false);
      }
    }
  };

  const validatePostponeData = (eventDate: string, eventTime: string, endDate?: string, endTime?: string, registrationDeadline?: string) => {
    const errors: typeof postponeErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for date comparison

    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const eventDateOnly = new Date(eventDate);

    // Event date cannot be in the past
    if (eventDateOnly < today) {
      errors.eventDate = 'Event date cannot be in the past';
    }

    // Registration deadline must be before event date (if provided)
    if (registrationDeadline) {
      const deadlineDate = new Date(registrationDeadline);
      if (deadlineDate >= eventDateOnly) {
        errors.registrationDeadline = 'Registration deadline must be before the event date';
      }
    }

    // End date validations (if provided)
    if (endDate) {
      const endDateOnly = new Date(endDate);
      
      // End date cannot be before event date
      if (endDateOnly < eventDateOnly) {
        errors.endDate = 'End date cannot be before the event date';
      }
      
      // If end date is provided, end time should also be provided
      if (!endTime) {
        errors.endTime = 'End time is required when end date is provided';
      }
      
      // If end date is same as event date, end time must be after event time
      if (endDate === eventDate && endTime && eventTime) {
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime <= eventDateTime) {
          errors.endTime = 'End time must be after the event time';
        }
      }
    } else if (endTime) {
      // If end time is provided, end date should also be provided
      errors.endDate = 'End date is required when end time is provided';
    }

    return errors;
  };

  const handlePostpone = async (eventDate: string, eventTime: string, endDate: string, endTime: string, registrationDeadline: string) => {
    if (selectedEvent) {
      setPostponeLoading(true);
      try {
        // Format the data as required for the postpone API
        const postponeData = {
          event_date: eventDate,
          event_time: `${eventDate} ${eventTime}:00`, // Combine date and time
          ...(endDate && { end_date: endDate }),
          ...(endTime && { end_time: `${endDate} ${endTime}:00` }), // Combine date and time
          ...(registrationDeadline && { registration_deadline: registrationDeadline })
        };

        // Call the postpone API
        await eventApi.postponeEvent(selectedEvent.id, postponeData);

        // Update local state directly (since we already called the API)
        // We need to update both the events array and selectedEvent
        const updatedEvent = {
          ...selectedEvent,
          date: eventDate,
          time: eventTime,
          status: 'postponed' as const
        };
        
        // Update the events array (this will trigger a re-render)
        const updatedEvents = events.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        );
        
        // Since we already called the postpone API, just update local state
        onEventPostpone(selectedEvent.id, {
          date: eventDate,
          time: eventTime,
          status: 'postponed'
        });

        setShowPostponeDialog(false);
        
        addNotification({
          title: 'Event Postponed!',
          message: 'The event has been successfully postponed.',
          type: 'success'
        });
      } catch (error) {
        console.error('Error postponing event:', error);
        addNotification({
          title: 'Error',
          message: 'Failed to postpone the event. Please try again.',
          type: 'error'
        });
      } finally {
        setPostponeLoading(false);
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default' as const;
      case 'draft':
        return 'secondary' as const;
      case 'completed':
        return 'outline' as const;
      case 'cancelled':
        return 'destructive' as const;
      case 'postponed':
        return 'secondary' as const;
      default:
        return 'secondary' as const;
    }
  };

  const isEventUpcoming = (event: ClubEvent) => {
    const now = new Date();
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime > now && event.status === 'published';
  };

  const filteredEvents = events?.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return isEventUpcoming(event) || event.status === 'postponed';
    if (activeTab === 'completed') return event.status === 'completed';
    if (activeTab === 'draft') return event.status === 'draft';
    return true;
  }) || [];

  if (!club) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Complete Club Profile First</h2>
            <p className="text-muted-foreground">
              You need to complete your club profile before you can create and manage events.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">
            Create and manage events for your club members
          </p>
        </div>
        
        <Button 
          onClick={handleCreateEvent}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{events?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {events?.reduce((sum, event) => sum + (event.currentParticipants || 0), 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  Rs {events?.reduce((sum, event) => sum + (event.fee * (event.currentParticipants || 0)), 0).toLocaleString() || '0'}
                </div>
                <div className="text-sm text-muted-foreground">Revenue Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {events?.filter(e => isEventUpcoming(e) || e.status === 'postponed').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Upcoming Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const hostingClubName = event.hostingClub && event.hostingClub !== 'other' 
                ? clubs.find(c => c.id === event.hostingClub)?.name 
                : 'Custom Location';
              
              const isUpcoming = isEventUpcoming(event) || event.status === 'postponed';
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                        </div>
                        {hostingClubName && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="w-3 h-3" />
                            <span>{hostingClubName}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={getStatusBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.currentParticipants || 0}/{event.maxParticipants} entries</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>Rs {event.fee.toLocaleString()} entry fee</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{event.duration} hours</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {event.requirements?.hasRequirements && (
                        <Badge variant="outline" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Requirements
                        </Badge>
                      )}
                      {event.prizes?.hasPrizes && (
                        <Badge variant="outline" className="text-xs">
                          <Gift className="w-3 h-3 mr-1" />
                          Prizes
                        </Badge>
                      )}
                      {event.announcement && (
                        <Badge variant="outline" className="text-xs">
                          <Megaphone className="w-3 h-3 mr-1" />
                          Announced
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewEvent(event)}
                          className="text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEntries(event)}
                          disabled={registrationsLoading}
                          className="text-xs"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {registrationsLoading ? 'Loading...' : `Entries (${event.currentParticipants || 0})`}
                        </Button>
                      </div>
                      
                      {/* Management Actions */}
                      {event.status === 'draft' && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handlePostEvent(event.id)}
                            disabled={submitLoading}
                            className="text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            {submitLoading ? 'Posting...' : 'Post Event'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEvent(event)}
                            className="text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit Draft
                          </Button>
                        </div>
                      )}

                      {isUpcoming && (
                        <div className="grid grid-cols-2 gap-1">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowAnnouncementDialog(true);
                            }}
                            className="text-xs"
                          >
                            <Megaphone className="w-3 h-3 mr-1" />
                            Announce
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowPostponeDialog(true);
                            }}
                            className="text-xs"
                          >
                            <CalendarClock className="w-3 h-3 mr-1" />
                            Postpone
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEvent(event)}
                            className="text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                  disabled={deleteLoading === event.id}
                                >
                                  {deleteLoading === event.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === 'all' 
                  ? 'Start by creating your first event'
                  : `No ${activeTab} events at the moment`
                }
              </p>
              {activeTab === 'all' && (
                <Button onClick={handleCreateEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update your event details' : 'Fill in the details for your new event'}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Summer Tennis Championship"
                  value={eventForm.title || ''}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hostingClub">Hosting Club *</Label>
                <Select 
                  value={eventForm.hostingClub || ''} 
                  onValueChange={(value) => setEventForm(prev => ({ ...prev, hostingClub: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hosting club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((clubItem) => (
                      <SelectItem key={clubItem.id} value={clubItem.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{clubItem.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Other Location</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sport">Sport *</Label>
                <Select
                  value={eventForm.sport || ''}
                  onValueChange={(value) => setEventForm(prev => ({ ...prev, sport: value }))}
                  disabled={sportsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={sportsLoading ? "Loading sports..." : sportsError ? "Error loading sports" : "Select sport"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sportsError ? (
                      <div className="p-2 text-sm text-red-600">
                        {sportsError}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={refetchSports}
                          className="ml-2"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={sport.icon}
                              alt={sport.name}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                // Fallback to emoji if image fails
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('span');
                                  fallback.textContent = '�'; // Default sport emoji
                                  parent.insertBefore(fallback, target);
                                }
                              }}
                            />
                            <span>{sport.display_name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select 
                  value={eventForm.type || 'tournament'} 
                  onValueChange={(value) => setEventForm(prev => ({ ...prev, type: value as ClubEvent['type'] }))}
                >
                  <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                  {EVENT_TYPES.map((eventType) => (
                    <SelectItem key={eventType.id} value={eventType.id}>
                    <div className="flex items-center gap-2">
                      <eventType.icon className="w-4 h-4" />
                      <span>{eventType.label}</span>
                    </div>
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Location Fields */}
            {eventForm.hostingClub === 'other' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Custom Location Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="customAddress">Address *</Label>
                    <Input
                      id="customAddress"
                      placeholder="Street address"
                      value={eventForm.customLocation?.address || ''}
                      onChange={(e) => setEventForm(prev => ({ 
                      ...prev, 
                      customLocation: { 
                        address: e.target.value, 
                        city: prev.customLocation?.city || '', 
                        state: prev.customLocation?.state || '' 
                      } 
                      }))}
                      required={eventForm.hostingClub === 'other'}
                    />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="customCity">City *</Label>
                    <Input
                      id="customCity"
                      placeholder="City"
                      value={eventForm.customLocation?.city || ''}
                      onChange={(e) => setEventForm(prev => ({ 
                        ...prev, 
                        customLocation: { 
                          address: prev.customLocation?.address || '',
                          city: e.target.value,
                          state: prev.customLocation?.state || '' 
                        } 
                      }))}
                      required={eventForm.hostingClub === 'other'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customState">State *</Label>
                    <Input
                      id="customState"
                      placeholder="State"
                      value={eventForm.customLocation?.state || ''}
                      onChange={(e) => setEventForm(prev => ({ 
                        ...prev, 
                        customLocation: { 
                          address: prev.customLocation?.address || '',
                          city: prev.customLocation?.city || '',
                          state: e.target.value 
                        } 
                      }))}
                      required={eventForm.hostingClub === 'other'}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event, what participants can expect..."
                value={eventForm.description || ''}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventForm.date || ''}
                  onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventForm.time || ''}
                  onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="24"
                  value={eventForm.duration || 1}
                  onChange={(e) => setEventForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
            </div>

            {/* Participants & Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={eventForm.maxParticipants || 1}
                  onChange={(e) => setEventForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fee">Entry Fee (PKR) *</Label>
                <Input
                  id="fee"
                  type="number"
                  min="0"
                  value={eventForm.fee || 0}
                  onChange={(e) => setEventForm(prev => ({ ...prev, fee: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Requirements Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasRequirements"
                  checked={eventForm.requirements?.hasRequirements || false}
                  onCheckedChange={(checked) => 
                    setEventForm(prev => ({ 
                      ...prev, 
                      requirements: { 
                        hasRequirements: !!checked,
                        description: prev.requirements?.description || ''
                      } 
                    }))
                  }
                />
                <Label htmlFor="hasRequirements" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Specific requirements to join this event
                </Label>
              </div>
              
              {eventForm.requirements?.hasRequirements && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="requirementsDesc">Requirements Description</Label>
                  <Textarea
                    id="requirementsDesc"
                    placeholder="e.g., Minimum skill level, equipment needed, age restrictions..."
                    value={eventForm.requirements?.description || ''}
                    onChange={(e) => setEventForm(prev => ({ 
                      ...prev, 
                      requirements: { 
                        hasRequirements: prev.requirements?.hasRequirements || false,
                        description: e.target.value 
                      } 
                    }))}
                    rows={2}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Prizes Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasPrizes"
                  checked={eventForm.prizes?.hasPrizes || false}
                  onCheckedChange={(checked) => 
                  setEventForm(prev => ({ 
                    ...prev, 
                    prizes: { 
                    hasPrizes: !!checked, 
                    positions: prev.prizes?.positions || { first: '', second: '', third: '' } 
                    } 
                  }))
                  }
                />
                <Label htmlFor="hasPrizes" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  This event has prizes
                </Label>
                </div>
              
              {eventForm.prizes?.hasPrizes && (
                <div className="space-y-4 ml-6">
                  <h4 className="font-medium">Prize Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstPrize">1st Place Prize</Label>
                      <Input
                        id="firstPrize"
                        placeholder="e.g., Rs 5000 cash + trophy"
                        value={eventForm.prizes?.positions?.first || ''}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          prizes: { 
                            hasPrizes: prev.prizes?.hasPrizes || false,
                            positions: { 
                              first: e.target.value,
                              second: prev.prizes?.positions?.second || '',
                              third: prev.prizes?.positions?.third || ''
                            } 
                          } 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondPrize">2nd Place Prize</Label>
                      <Input
                        id="secondPrize"
                        placeholder="e.g., Rs 3000 cash + medal"
                        value={eventForm.prizes?.positions?.second || ''}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          prizes: { 
                            hasPrizes: prev.prizes?.hasPrizes || false,
                            positions: { 
                              first: prev.prizes?.positions?.first || '',
                              second: e.target.value,
                              third: prev.prizes?.positions?.third || ''
                            } 
                          } 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thirdPrize">3rd Place Prize</Label>
                      <Input
                        id="thirdPrize"
                        placeholder="e.g., Rs 1000 cash + certificate"
                        value={eventForm.prizes?.positions?.third || ''}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          prizes: { 
                            hasPrizes: prev.prizes?.hasPrizes || false,
                            positions: { 
                              first: prev.prizes?.positions?.first || '',
                              second: prev.prizes?.positions?.second || '',
                              third: e.target.value
                            } 
                          } 
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              {!selectedEvent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={submitLoading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submitLoading ? 'Saving...' : 'Save as Draft'}
                </Button>
              )}
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={submitLoading}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitLoading ? 'Posting...' : (selectedEvent ? 'Update Event' : 'Post Event')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-3xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  Event details and information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant={getStatusBadgeVariant(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                  {selectedEvent.requirements?.hasRequirements && (
                    <Badge variant="outline">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Has Requirements
                    </Badge>
                  )}
                  {selectedEvent.prizes?.hasPrizes && (
                    <Badge variant="outline">
                      <Gift className="w-3 h-3 mr-1" />
                      Has Prizes
                    </Badge>
                  )}
                  {selectedEvent.announcement && (
                    <Badge variant="outline">
                      <Megaphone className="w-3 h-3 mr-1" />
                      Announced
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Event Details</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedEvent.time} ({selectedEvent.duration} hours)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Rs {selectedEvent.fee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{eventRegistrations.length}/{selectedEvent.maxParticipants}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Revenue</h4>
                    <div className="text-2xl font-bold text-primary">
                      Rs {(selectedEvent.fee * eventRegistrations.length).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      From {eventRegistrations.length} entries
                    </div>
                  </div>
                </div>

                {selectedEvent.announcement && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Megaphone className="w-4 h-4" />
                      Latest Announcement
                    </h4>
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <p className="text-sm">{selectedEvent.announcement.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(selectedEvent.announcement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.requirements?.hasRequirements && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Requirements
                    </h4>
                    <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                      {selectedEvent.requirements.description}
                    </p>
                  </div>
                )}

                {selectedEvent.prizes?.hasPrizes && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Prizes
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedEvent.prizes.positions.first && (
                        <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg">
                          <div className="font-medium text-yellow-800">🥇 1st Place</div>
                          <div className="text-sm text-yellow-700">{selectedEvent.prizes.positions.first}</div>
                        </div>
                      )}
                      {selectedEvent.prizes.positions.second && (
                        <div className="text-center p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                          <div className="font-medium text-gray-800">🥈 2nd Place</div>
                          <div className="text-sm text-gray-700">{selectedEvent.prizes.positions.second}</div>
                        </div>
                      )}
                      {selectedEvent.prizes.positions.third && (
                        <div className="text-center p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                          <div className="font-medium text-orange-800">🥉 3rd Place</div>
                          <div className="text-sm text-orange-700">{selectedEvent.prizes.positions.third}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}


              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Entries Dialog */}
      <Dialog open={showEntriesDialog} onOpenChange={setShowEntriesDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Event Entries - {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  All registered participants for this event
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {registrationsLoading ? 'Loading...' : `${eventRegistrations.length} of ${selectedEvent.maxParticipants} participants registered`}
                  </div>
                  <Badge variant="outline">
                    Revenue: Rs {(eventRegistrations.reduce((sum, reg) => sum + parseFloat(reg.payment_amount || '0'), 0)).toLocaleString()}
                  </Badge>
                </div>

                {registrationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading registrations...</p>
                  </div>
                ) : eventRegistrations.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[180px]">Participant</TableHead>
                          <TableHead className="min-w-[140px]">Contact</TableHead>
                          <TableHead className="min-w-[100px]">Registration Date</TableHead>
                          <TableHead className="min-w-[100px]">Payment Status</TableHead>
                          <TableHead className="min-w-[100px]">Amount</TableHead>
                          <TableHead className="min-w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventRegistrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="min-w-[180px]">
                              <div className="space-y-1">
                                <div className="font-medium">{registration.user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {registration.user.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[140px]">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="w-3 h-3" />
                                <span>{registration.user.phone}</span>
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              <div className="text-sm">
                                {new Date(registration.registration_date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              <Badge variant={registration.payment_status === 'pending' ? 'secondary' : 'default'}>
                                {registration.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              <div className="text-sm font-medium">
                                Rs {parseFloat(registration.payment_amount || '0').toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Create a participant-like object for the dialog
                                  const participantData = {
                                    id: registration.user.id,
                                    name: registration.user.name,
                                    memberId: registration.user.id,
                                    phone: registration.user.phone,
                                    membershipTier: registration.user.user_role,
                                    emergencyContact: { phone: 'N/A' },
                                    tshirtSize: null,
                                    medicalConditions: null,
                                    dietaryRestrictions: null,
                                    joinedAt: registration.registration_date
                                  };
                                  setSelectedParticipant(participantData as any);
                                  setShowParticipantDialog(true);
                                }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h4 className="font-medium text-foreground mb-1">No participants yet</h4>
                    <p className="text-sm text-muted-foreground">
                      Participants will appear here once they register for the event
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Participant Detail Dialog */}
      <Dialog open={showParticipantDialog} onOpenChange={setShowParticipantDialog}>
        <DialogContent className="max-w-md">
          {selectedParticipant && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Participant Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedParticipant.name}</h4>
                  {selectedParticipant.memberId && (
                    <p className="text-sm text-muted-foreground">ID: {selectedParticipant.memberId}</p>
                  )}
                  {selectedParticipant.membershipTier && (
                    <Badge variant="outline" className="mt-1">
                      {selectedParticipant.membershipTier}
                    </Badge>
                  )}
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium mb-2">Contact Information</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedParticipant.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Emergency Contact</h5>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{selectedParticipant.emergencyContact.phone}</span>
                  </div>
                </div>

                {selectedParticipant.tshirtSize && (
                  <div>
                    <h5 className="font-medium mb-2">T-Shirt Size</h5>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Shirt className="w-3 h-3" />
                      {selectedParticipant.tshirtSize}
                    </Badge>
                  </div>
                )}

                {selectedParticipant.medicalConditions && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Medical Conditions
                    </h5>
                    <p className="text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                      {selectedParticipant.medicalConditions}
                    </p>
                  </div>
                )}

                {selectedParticipant.dietaryRestrictions && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-orange-500" />
                      Dietary Restrictions
                    </h5>
                    <p className="text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                      {selectedParticipant.dietaryRestrictions}
                    </p>
                  </div>
                )}

                <div>
                  <h5 className="font-medium mb-2">Registration Date</h5>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedParticipant.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Make Announcement
            </DialogTitle>
            <DialogDescription>
              Send an important message to all registered participants
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcement">Message</Label>
              <Textarea
                id="announcement"
                placeholder="Enter your announcement message..."
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAnnouncementDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAnnouncement}
                disabled={!announcementMessage.trim() || announcementLoading}
                className="flex-1"
              >
                {announcementLoading ? 'Sending...' : 'Send Announcement'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Postpone Dialog */}
      <Dialog open={showPostponeDialog} onOpenChange={(open) => {
        setShowPostponeDialog(open);
        if (!open) {
          setPostponeErrors({});
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5" />
              Postpone Event
            </DialogTitle>
            <DialogDescription>
              Update the event schedule and deadlines
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newEventDate">Event Date *</Label>
                <Input
                  id="newEventDate"
                  type="date"
                  defaultValue={selectedEvent?.date}
                  required
                  disabled={postponeLoading}
                  className={postponeErrors.eventDate ? 'border-red-500' : ''}
                />
                {postponeErrors.eventDate && (
                  <p className="text-sm text-red-500">{postponeErrors.eventDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEventTime">Event Time *</Label>
                <Input
                  id="newEventTime"
                  type="time"
                  defaultValue={selectedEvent?.time}
                  required
                  disabled={postponeLoading}
                  className={postponeErrors.eventTime ? 'border-red-500' : ''}
                />
                {postponeErrors.eventTime && (
                  <p className="text-sm text-red-500">{postponeErrors.eventTime}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newEndDate">End Date</Label>
                <Input
                  id="newEndDate"
                  type="date"
                  defaultValue={selectedEvent?.date}
                  disabled={postponeLoading}
                  className={postponeErrors.endDate ? 'border-red-500' : ''}
                />
                {postponeErrors.endDate && (
                  <p className="text-sm text-red-500">{postponeErrors.endDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEndTime">End Time</Label>
                <Input
                  id="newEndTime"
                  type="time"
                  defaultValue={(() => {
                    if (selectedEvent?.time && selectedEvent?.duration) {
                      const [hours, minutes] = selectedEvent.time.split(':');
                      const eventTime = new Date();
                      eventTime.setHours(parseInt(hours), parseInt(minutes));
                      eventTime.setHours(eventTime.getHours() + selectedEvent.duration);
                      return eventTime.toTimeString().slice(0, 5);
                    }
                    return '';
                  })()}
                  disabled={postponeLoading}
                  className={postponeErrors.endTime ? 'border-red-500' : ''}
                />
                {postponeErrors.endTime && (
                  <p className="text-sm text-red-500">{postponeErrors.endTime}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newRegistrationDeadline">Registration Deadline</Label>
              <Input
                id="newRegistrationDeadline"
                type="date"
                defaultValue={(() => {
                  if (selectedEvent?.date) {
                    const deadlineDate = new Date(selectedEvent.date);
                    deadlineDate.setDate(deadlineDate.getDate() - 5); // 5 days before event
                    return deadlineDate.toISOString().split('T')[0];
                  }
                  return '';
                })()}
                disabled={postponeLoading}
                className={postponeErrors.registrationDeadline ? 'border-red-500' : ''}
              />
              {postponeErrors.registrationDeadline && (
                <p className="text-sm text-red-500">{postponeErrors.registrationDeadline}</p>
              )}
            </div>

            {postponeErrors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{postponeErrors.general}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowPostponeDialog(false)}
                className="flex-1"
                disabled={postponeLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const eventDate = (document.getElementById('newEventDate') as HTMLInputElement)?.value;
                  const eventTime = (document.getElementById('newEventTime') as HTMLInputElement)?.value;
                  const endDate = (document.getElementById('newEndDate') as HTMLInputElement)?.value;
                  const endTime = (document.getElementById('newEndTime') as HTMLInputElement)?.value;
                  const registrationDeadline = (document.getElementById('newRegistrationDeadline') as HTMLInputElement)?.value;

                  // Validate required fields
                  if (!eventDate || !eventTime) {
                    setPostponeErrors({ general: 'Event date and time are required' });
                    return;
                  }

                  // Run validation
                  const validationErrors = validatePostponeData(eventDate, eventTime, endDate, endTime, registrationDeadline);
                  
                  if (Object.keys(validationErrors).length > 0) {
                    setPostponeErrors(validationErrors);
                    return;
                  }

                  // Clear errors and proceed
                  setPostponeErrors({});
                  handlePostpone(eventDate, eventTime, endDate || '', endTime || '', registrationDeadline || '');
                }}
                className="flex-1"
                disabled={postponeLoading}
              >
                {postponeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Postponing...
                  </>
                ) : (
                  'Postpone Event'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}