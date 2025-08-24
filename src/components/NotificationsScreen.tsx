import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft, 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Info,
  CheckCircle,
  AlertTriangle,
  Award,
  Calendar,
  Users
} from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onBack: () => void;
  onMarkAllRead: () => void;
}

export default function NotificationsScreen({ 
  notifications, 
  onBack, 
  onMarkAllRead 
}: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'membership' | 'event' | 'trainer'>('all');

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'membership': return <Award className="w-5 h-5 text-[#A148FF]" />;
      case 'event': return <Calendar className="w-5 h-5 text-[#FFB948]" />;
      case 'trainer': return <Users className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'membership': return 'border-[#A148FF]/30 bg-[#A148FF]/10';
      case 'event': return 'border-[#FFB948]/30 bg-[#FFB948]/10';
      case 'trainer': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter !== 'all') return notification.type === filter;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full bg-[#252525] text-white flex flex-col rounded-[19px]">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
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
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notifications
              </h1>
              <p className="text-white/60 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={onMarkAllRead}
              size="sm"
              className="bg-[#A148FF] hover:bg-[#A148FF]/90"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'membership', label: 'Memberships', count: notifications.filter(n => n.type === 'membership').length },
            { key: 'event', label: 'Events', count: notifications.filter(n => n.type === 'event').length },
            { key: 'trainer', label: 'Trainers', count: notifications.filter(n => n.type === 'trainer').length }
          ] as const).map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key)}
              className={filter === filterOption.key ? 
                'bg-[#A148FF] hover:bg-[#A148FF]/90' : 
                'border-white/20 hover:bg-white/10'
              }
            >
              <span className="text-xs">{filterOption.label}</span>
              {filterOption.count > 0 && (
                <Badge className="ml-2 bg-white/20 text-white text-xs">
                  {filterOption.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        {filteredNotifications.length > 0 ? (
          <div className="p-6 space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${getNotificationColor(notification.type)} border transition-all hover:bg-opacity-20 ${
                  !notification.read ? 'border-l-4 border-l-[#A148FF]' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#A148FF] rounded-full"></div>
                          )}
                          <span className="text-white/60 text-xs">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p className="text-white/70 text-sm mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Type Badge */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${
                            notification.type === 'success' ? 'border-green-500/30 text-green-300' :
                            notification.type === 'warning' ? 'border-yellow-500/30 text-yellow-300' :
                            notification.type === 'membership' ? 'border-[#A148FF]/30 text-[#A148FF]' :
                            notification.type === 'event' ? 'border-[#FFB948]/30 text-[#FFB948]' :
                            notification.type === 'trainer' ? 'border-blue-500/30 text-blue-300' :
                            'border-white/20 text-white/70'
                          }`}
                        >
                          {notification.type}
                        </Badge>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button size="sm" variant="ghost" className="text-xs hover:bg-white/10">
                              <Check className="w-3 h-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-xs hover:bg-white/10 text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            {filter === 'unread' ? (
              <>
                <BellRing className="w-16 h-16 text-white/40 mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-white/60 text-sm">You have no unread notifications</p>
              </>
            ) : (
              <>
                <Bell className="w-16 h-16 text-white/40 mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No notifications</h3>
                <p className="text-white/60 text-sm">
                  {filter === 'all' ? 
                    'You have no notifications yet' : 
                    `No ${filter} notifications found`
                  }
                </p>
              </>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer Info */}
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <div className="text-center text-white/60 text-xs">
            Notifications are automatically deleted after 30 days
          </div>
        </div>
      )}
    </div>
  );
}