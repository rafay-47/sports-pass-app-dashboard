import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  X
} from 'lucide-react';
import { type Club, type ClubEvent } from '../types';
import { getEventStatusBadge, getEventTypeInfo, getDifficultyInfo, getSportInfo } from '../utils/helpers';

// Define constants locally to avoid import issues
const SPORTS_TYPES = [
  { id: 'gym', name: 'Gym', icon: '💪', color: '#FFB948' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: '#A148FF' },
  { id: 'tennis', name: 'Table Tennis', icon: '🏓', color: '#FF6B6B' },
  { id: 'snooker', name: 'Snooker', icon: '🎱', color: '#4ECDC4' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', color: '#95E1D3' },
  { id: 'multi-sport', name: 'Multi-Sport Complex', icon: '🏟️', color: '#FF6B6B' }
];

const EVENT_TYPES = [
  { id: 'tournament', label: 'Tournament', icon: Trophy, color: 'text-yellow-600' },
  { id: 'workshop', label: 'Workshop', icon: Star, color: 'text-blue-600' },
  { id: 'league', label: 'League', icon: Award, color: 'text-purple-600' },
  { id: 'social', label: 'Social Event', icon: Users, color: 'text-green-600' }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

interface EventManagementScreenProps {
  club: Club | null;
  events: ClubEvent[];
  onEventSave: (eventData: Partial<ClubEvent>) => void;
  onEventUpdate: (id: string, updates: Partial<ClubEvent>) => void;
}

export default function EventManagementScreen({ club, events, onEventSave, onEventUpdate }: EventManagementScreenProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [eventForm, setEventForm] = useState<Partial<ClubEvent>>({
    title: '',
    description: '',
    type: 'tournament',
    sport: club?.type || 'gym',
    date: '',
    time: '',
    duration: 2,
    fee: 0,
    maxParticipants: 50,
    requirements: [''],
    prizes: [''],
    difficulty: 'beginner',
    images: []
  });

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      type: 'tournament',
      sport: club?.type || 'gym',
      date: '',
      time: '',
      duration: 2,
      fee: 0,
      maxParticipants: 50,
      requirements: [''],
      prizes: [''],
      difficulty: 'beginner',
      images: []
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEvent) {
      onEventUpdate(selectedEvent.id, eventForm);
    } else {
      onEventSave(eventForm);
    }
    
    setShowCreateDialog(false);
    resetForm();
  };

  const addRequirement = () => {
    setEventForm(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setEventForm(prev => ({
      ...prev,
      requirements: prev.requirements?.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setEventForm(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index)
    }));
  };

  const addPrize = () => {
    setEventForm(prev => ({
      ...prev,
      prizes: [...(prev.prizes || []), '']
    }));
  };

  const updatePrize = (index: number, value: string) => {
    setEventForm(prev => ({
      ...prev,
      prizes: prev.prizes?.map((prize, i) => i === index ? value : prize)
    }));
  };

  const removePrize = (index: number) => {
    setEventForm(prev => ({
      ...prev,
      prizes: prev.prizes?.filter((_, i) => i !== index)
    }));
  };

  const filteredEvents = events?.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return new Date(event.date) >= new Date();
    if (activeTab === 'completed') return new Date(event.date) < new Date();
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
                  {events?.reduce((sum, event) => sum + event.currentParticipants, 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Participants</div>
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
                  Rs {events?.reduce((sum, event) => sum + (event.fee * event.currentParticipants), 0).toLocaleString() || '0'}
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
                  {events?.filter(e => new Date(e.date) >= new Date()).length || 0}
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
              const typeInfo = getEventTypeInfo(event.type);
              const sportInfo = getSportInfo(event.sport);
              const statusInfo = getEventStatusBadge(event);
              const difficultyInfo = getDifficultyInfo(event.difficulty);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <typeInfo.icon className="w-4 h-4" />
                          <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{sportInfo?.icon}</span>
                          <span className="text-sm text-muted-foreground">{sportInfo?.name}</span>
                        </div>
                      </div>
                      <Badge className={statusInfo.className}>
                        {statusInfo.label}
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
                        <Users className="w-4 h-4" />
                        <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
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
                    
                    <div className="flex items-center gap-2">
                      <Badge className={difficultyInfo.color}>
                        {difficultyInfo.label}
                      </Badge>
                      <Badge variant="outline" className={typeInfo.color}>
                        {typeInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewEvent(event)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditEvent(event)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update your event details' : 'Fill in the details for your new event'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="type">Event Type *</Label>
                <Select 
                  value={eventForm.type || 'tournament'} 
                  onValueChange={(value: string) => setEventForm(prev => ({ ...prev, type: value as ClubEvent['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select 
                  value={eventForm.difficulty || 'beginner'} 
                  onValueChange={(value: string) => setEventForm(prev => ({ ...prev, difficulty: value as ClubEvent['difficulty'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <Label>Requirements</Label>
              {eventForm.requirements?.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g., Bring your own equipment"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                  />
                  {(eventForm.requirements?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>

            {/* Prizes */}
            <div className="space-y-4">
              <Label>Prizes & Rewards</Label>
              {eventForm.prizes?.map((prize, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g., 1st Place: Rs 10,000"
                    value={prize}
                    onChange={(e) => updatePrize(index, e.target.value)}
                  />
                  {(eventForm.prizes?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removePrize(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPrize}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prize
              </Button>
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
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {selectedEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = getEventTypeInfo(selectedEvent.type).icon;
                    return <Icon className="w-5 h-5" />;
                  })()}
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  Event details and participant information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {(() => {
                    const statusInfo = getEventStatusBadge(selectedEvent);
                    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
                  })()}
                  <Badge className={getDifficultyInfo(selectedEvent.difficulty).color}>
                    {getDifficultyInfo(selectedEvent.difficulty).label}
                  </Badge>
                  <Badge variant="outline">
                    {getEventTypeInfo(selectedEvent.type).label}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Event Details</h4>
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
                        <DollarSign className="w-4 h-4" />
                        <span>Rs {selectedEvent.fee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Revenue</h4>
                    <div className="text-2xl font-bold text-primary">
                      Rs {(selectedEvent.fee * selectedEvent.currentParticipants).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      From {selectedEvent.currentParticipants} participants
                    </div>
                  </div>
                </div>

                {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedEvent.requirements.filter(req => req.trim()).map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.prizes && selectedEvent.prizes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Prizes & Rewards</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedEvent.prizes.filter(prize => prize.trim()).map((prize, index) => (
                        <li key={index}>{prize}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}