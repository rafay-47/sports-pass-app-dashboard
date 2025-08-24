import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  TrendingUp,
  Trophy,
  Clock,
  Award,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  History,
  Target,
  Banknote,
  QrCode,
  Building,
  Activity
} from 'lucide-react';
import { SPORTS, TRAINER_FEES } from '../constants';
import type { Membership, User as UserType, ServiceUsageHistory, TrainerHistory, TraineeInfo, CheckIn } from '../types';

interface MembershipDetailsScreenProps {
  membership: Membership;
  user: UserType;
  onBack: () => void;
}

// Mock data for demonstration
const mockServiceHistory: ServiceUsageHistory[] = [
  {
    id: '1',
    serviceName: 'Personal Trainer',
    date: '2024-07-15',
    amount: 5000,
    provider: 'Ahmed Khan',
    status: 'completed'
  },
  {
    id: '2',
    serviceName: 'Diet Plan',
    date: '2024-07-10',
    amount: 1500,
    provider: 'Dr. Sarah Ali',
    status: 'completed'
  },
  {
    id: '3',
    serviceName: 'Equipment Access',
    date: '2024-07-08',
    amount: 500,
    status: 'completed'
  },
  {
    id: '4',
    serviceName: 'Personal Trainer',
    date: '2024-07-25',
    amount: 5000,
    provider: 'Ahmed Khan',
    status: 'upcoming'
  }
];

const mockTrainerHistory: TrainerHistory[] = [
  {
    id: '1',
    trainerName: 'Ahmed Khan',
    sessions: 12,
    totalCost: 60000,
    lastSession: '2024-07-15',
    rating: 4.8,
    feedback: 'Excellent trainer, very knowledgeable and motivating!'
  },
  {
    id: '2',
    trainerName: 'Fatima Ali',
    sessions: 8,
    totalCost: 40000,
    lastSession: '2024-06-20',
    rating: 4.6,
    feedback: 'Great for beginners, very patient and supportive.'
  }
];

const mockTrainees: TraineeInfo[] = [
  {
    id: '1',
    name: 'Muhammad Hassan',
    joinDate: '2024-06-01',
    sessionsCompleted: 15,
    totalPaid: 75000,
    membershipTier: 'basic',
    lastSession: '2024-07-18',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Aisha Khan',
    joinDate: '2024-05-15',
    sessionsCompleted: 22,
    totalPaid: 110000,
    membershipTier: 'standard',
    lastSession: '2024-07-17',
    rating: 4.7
  },
  {
    id: '3',
    name: 'Ali Ahmed',
    joinDate: '2024-07-01',
    sessionsCompleted: 6,
    totalPaid: 30000,
    membershipTier: 'basic',
    lastSession: '2024-07-19',
    rating: 4.8
  }
];

// Mock check-in data
const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    facilityName: 'Elite Fitness Center DHA',
    facilityId: 'gym_dha_001',
    date: '2024-07-20',
    time: '6:30 AM',
    sportType: 'gym',
    location: 'DHA Phase 5, Karachi'
  },
  {
    id: '2',
    facilityName: 'Elite Fitness Center DHA',
    facilityId: 'gym_dha_001',
    date: '2024-07-18',
    time: '7:15 AM',
    sportType: 'gym',
    location: 'DHA Phase 5, Karachi'
  },
  {
    id: '3',
    facilityName: 'Community Fitness Center',
    facilityId: 'gym_comm_001',
    date: '2024-07-15',
    time: '8:00 AM',
    sportType: 'gym',
    location: 'Gulshan-e-Iqbal, Karachi'
  },
  {
    id: '4',
    facilityName: 'Elite Fitness Center DHA',
    facilityId: 'gym_dha_001',
    date: '2024-07-13',
    time: '6:45 AM',
    sportType: 'gym',
    location: 'DHA Phase 5, Karachi'
  },
  {
    id: '5',
    facilityName: 'Elite Fitness Center DHA',
    facilityId: 'gym_dha_001',
    date: '2024-07-10',
    time: '7:30 AM',
    sportType: 'gym',
    location: 'DHA Phase 5, Karachi'
  }
];

export default function MembershipDetailsScreen({ membership, user, onBack }: MembershipDetailsScreenProps) {
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeInfo | null>(null);
  
  const sport = SPORTS.find(s => s.id === membership.sportId);
  const isTrainer = user.isTrainer && user.trainerProfile?.sport === membership.sportId;
  
  // Mock data - in real app this would come from API
  const serviceHistory = mockServiceHistory;
  const trainerHistory = mockTrainerHistory;
  const trainees = isTrainer ? mockTrainees : [];
  const checkIns = membership.checkIns || mockCheckIns;
  
  const totalSpent = serviceHistory.reduce((total, service) => total + service.amount, 0);
  const monthlySpent = serviceHistory
    .filter(s => new Date(s.date).getMonth() === new Date().getMonth())
    .reduce((total, service) => total + service.amount, 0);
  
  const totalEarnings = trainees.reduce((total, trainee) => total + trainee.totalPaid, 0);
  const monthlyEarnings = Math.floor(totalEarnings * 0.3); // Mock monthly earnings
  
  // Calculate monthly check-ins
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyCheckIns = checkIns.filter(checkIn => {
    const checkInDate = new Date(checkIn.date);
    return checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear;
  }).length;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (selectedTrainee) {
    return (
      <div className="h-screen bg-[#252525] text-white flex flex-col rounded-[19px]">
        {/* Header */}
        <div className="flex items-center p-6 pt-8 relative z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedTrainee(null)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Trainee Details</h1>
            <p className="text-white/60 text-sm">{selectedTrainee.name}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 pb-6">
          {/* Trainee Info */}
          <Card className="bg-white/10 border-white/20 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-white text-xl font-bold">{selectedTrainee.name}</h2>
                    <Badge className={`${getTierColor(selectedTrainee.membershipTier)} bg-white/20 border-white/30`}>
                      {getTierIcon(selectedTrainee.membershipTier)}
                      <span className="ml-1 capitalize">{selectedTrainee.membershipTier}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-white/60 text-sm">Member Since</div>
                      <div className="text-white font-medium">{new Date(selectedTrainee.joinDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-sm">Last Session</div>
                      <div className="text-white font-medium">{selectedTrainee.lastSession ? new Date(selectedTrainee.lastSession).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{selectedTrainee.rating}</span>
                    <span className="text-white/60 text-sm">rating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-[#A148FF] text-2xl font-bold">{selectedTrainee.sessionsCompleted}</div>
                <div className="text-white/60 text-sm">Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-[#FFB948] text-2xl font-bold">Rs {(selectedTrainee.totalPaid * 0.85 / 1000).toFixed(0)}K</div>
                <div className="text-white/60 text-sm">Earned</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-green-400 text-2xl font-bold">{Math.floor(selectedTrainee.sessionsCompleted / 4)}</div>
                <div className="text-white/60 text-sm">Months</div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Actions */}
          <div className="space-y-4">
            <Button className="w-full bg-[#A148FF] hover:bg-[#A148FF]/90">
              <Phone className="w-4 h-4 mr-2" />
              Contact Trainee
            </Button>
            
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Next Session
            </Button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#252525] text-white flex flex-col rounded-[19px] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center p-6 pt-8 relative z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sport?.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{sport?.name} Membership</h1>
            <p className="text-white/60 text-sm">{membership.membershipNumber}</p>
          </div>
        </div>
      </div>

      {/* Membership Card Summary */}
      <div className="flex-shrink-0 px-6 mb-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={`${getTierColor(membership.tier)} bg-white/20 border-white/30`}>
                  {getTierIcon(membership.tier)}
                  <span className="ml-1 capitalize">{membership.tier}</span>
                </Badge>
                <Badge className={`text-xs ${
                  membership.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  membership.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {membership.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm">Expires</div>
                <div className="text-white font-medium">{new Date(membership.expiryDate).toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <TabsList className={`grid w-full ${isTrainer ? 'grid-cols-5' : 'grid-cols-4'} bg-white/10 border-white/20 mb-4 flex-shrink-0`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white text-xs">Overview</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white text-xs">History</TabsTrigger>
            <TabsTrigger value="trainers" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white text-xs">Trainers</TabsTrigger>
            <TabsTrigger value="checkins" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white text-xs">Check-ins</TabsTrigger>
            {isTrainer && (
              <TabsTrigger value="trainees" className="data-[state=active]:bg-[#A148FF] data-[state=active]:text-white text-xs">Trainees</TabsTrigger>
            )}
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="overview" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/10 border-white/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-[#FFB948] text-2xl font-bold">Rs {Math.floor(totalSpent / 1000)}K</div>
                        <div className="text-white/60 text-sm">Total Spent</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/10 border-white/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-[#A148FF] text-2xl font-bold">Rs {Math.floor(monthlySpent / 1000)}K</div>
                        <div className="text-white/60 text-sm">This Month</div>
                      </CardContent>
                    </Card>
                    
                    {isTrainer && (
                      <>
                        <Card className="bg-white/10 border-white/20">
                          <CardContent className="p-4 text-center">
                            <div className="text-green-400 text-2xl font-bold">Rs {Math.floor(totalEarnings * 0.85 / 1000)}K</div>
                            <div className="text-white/60 text-sm">Total Earned</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white/10 border-white/20">
                          <CardContent className="p-4 text-center">
                            <div className="text-green-400 text-2xl font-bold">Rs {Math.floor(monthlyEarnings * 0.85 / 1000)}K</div>
                            <div className="text-white/60 text-sm">Monthly</div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>

                  {/* Check-in Stats */}
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        Check-in Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-[#A148FF] text-2xl font-bold">{monthlyCheckIns}</div>
                          <div className="text-white/60 text-sm">This Month</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#FFB948] text-2xl font-bold">{30 - monthlyCheckIns}</div>
                          <div className="text-white/60 text-sm">Remaining</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 text-2xl font-bold">{checkIns.length}</div>
                          <div className="text-white/60 text-sm">Total</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 text-sm">Monthly Limit</span>
                          <span className="text-white font-medium">{monthlyCheckIns}/30</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#A148FF] to-[#FFB948] h-2 rounded-full transition-all"
                            style={{ width: `${(monthlyCheckIns / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {serviceHistory.slice(0, 3).map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(service.status ? service.status : 'unknown')}
                              <div>
                                <div className="text-white font-medium">{service.serviceName}</div>
                                <div className="text-white/60 text-sm">{new Date(service.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#FFB948] font-medium">Rs {service.amount.toLocaleString()}</div>
                              {service.provider && (
                                <div className="text-white/60 text-sm">{service.provider}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trainer Earnings Info */}
                  {isTrainer && (
                    <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Banknote className="w-5 h-5" />
                          Trainer Earnings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Your Rate</span>
                            <span className="text-green-400 font-bold">Rs {TRAINER_FEES[membership.tier as keyof typeof TRAINER_FEES].toLocaleString()}/hour</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Active Trainees</span>
                            <span className="text-green-400 font-bold">{trainees.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Platform Fee</span>
                            <span className="text-green-400 font-bold">15%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Your Share</span>
                            <span className="text-green-400 font-bold">85%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {serviceHistory.map((service) => (
                    <Card key={service.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              {getStatusIcon(service.status ? service.status : 'unknown')}
                            <div>
                              <div className="text-white font-medium">{service.serviceName}</div>
                              <div className="text-white/60 text-sm">{new Date(service.date).toLocaleDateString()}</div>
                              {service.provider && (
                                <div className="text-white/60 text-sm">with {service.provider}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[#FFB948] font-bold">Rs {service.amount.toLocaleString()}</div>
                            <Badge className={`text-xs ${
                              service.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                              service.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {service.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trainers" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {trainerHistory.map((trainer) => (
                    <Card key={trainer.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-bold">{trainer.trainerName}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white text-sm">{trainer.rating}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <div className="text-white/60 text-sm">Sessions</div>
                                <div className="text-white font-medium">{trainer.sessions}</div>
                              </div>
                              <div>
                                <div className="text-white/60 text-sm">Total Cost</div>
                                <div className="text-[#FFB948] font-bold">Rs {trainer.totalCost.toLocaleString()}</div>
                              </div>
                            </div>
                            
                            <div className="text-white/60 text-sm mb-2">
                              Last session: {trainer.lastSession ? new Date(trainer.lastSession).toLocaleDateString() : 'N/A'}
                            </div>
                            
                            {trainer.feedback && (
                              <div className="p-3 bg-white/5 rounded-lg">
                                <div className="text-white/80 text-sm">&quot;{trainer.feedback}&quot;</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="checkins" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {/* Check-in Summary */}
                  <Card className="bg-gradient-to-r from-[#A148FF]/20 to-[#FFB948]/20 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#A148FF]/20 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-[#A148FF]" />
                          </div>
                          <div>
                            <div className="text-white font-bold">Monthly Check-ins</div>
                            <div className="text-white/70 text-sm">Track your facility visits</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#FFB948] font-bold text-2xl">{monthlyCheckIns}</div>
                          <div className="text-white/60 text-sm">of 30 used</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Check-in History */}
                  {checkIns.map((checkIn) => (
                    <Card key={checkIn.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Building className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{checkIn.facilityName}</div>
                              <div className="text-white/60 text-sm flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                {checkIn.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">{checkIn.time}</div>
                            <div className="text-white/60 text-sm">{new Date(checkIn.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {checkIns.length === 0 && (
                    <div className="text-center py-8">
                      <QrCode className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <div className="text-white/40 text-lg mb-2">No check-ins yet</div>
                      <div className="text-white/60 text-sm">Use the QR scanner to check in to facilities</div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {isTrainer && (
              <TabsContent value="trainees" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    {trainees.map((trainee) => (
                      <Card key={trainee.id} className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <button 
                            onClick={() => setSelectedTrainee(trainee)}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-white font-medium">{trainee.name}</div>
                                  <div className="text-white/60 text-sm">
                                    {trainee.sessionsCompleted} sessions • {trainee.lastSession ? new Date(trainee.lastSession).toLocaleDateString() : 'N/A'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-green-400 font-bold">
                                  Rs {Math.floor(trainee.totalPaid * 0.85 / 1000)}K
                                </div>
                                <div className="text-white/60 text-sm">earned</div>
                              </div>
                            </div>
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}