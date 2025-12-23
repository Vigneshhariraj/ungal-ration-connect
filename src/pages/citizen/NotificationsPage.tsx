import { useState, useEffect } from 'react';
import { Bell, Vote, Package, Truck, Settings, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockNotifications, simulateApiCall, Notification } from '@/data/mockData';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'unread' | 'important';

const NotificationsPage = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(mockNotifications);
    setNotifications(data);
    setIsLoading(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'voting':
        return Vote;
      case 'ration':
        return Package;
      case 'delivery':
        return Truck;
      case 'system':
      default:
        return Settings;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'voting':
        return 'text-accent bg-accent/10';
      case 'ration':
        return 'text-success bg-success/10';
      case 'delivery':
        return 'text-primary bg-primary/10';
      case 'system':
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filteredNotifications = notifications.filter(n => {
    switch (activeFilter) {
      case 'unread':
        return !n.isRead;
      case 'important':
        return n.isImportant;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: language === 'en' ? 'All' : 'அனைத்தும்' },
    { key: 'unread', label: language === 'en' ? 'Unread' : 'படிக்கப்படாதவை' },
    { key: 'important', label: language === 'en' ? 'Important' : 'முக்கியம்' },
  ];

  return (
    <MainLayout title={language === 'en' ? 'Notifications' : 'அறிவிப்புகள்'} showBack showNotification={false}>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {filters.map(filter => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
                className="whitespace-nowrap"
              >
                {filter.label}
              </Button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="shrink-0">
              <Check className="w-4 h-4 mr-1" />
              {language === 'en' ? 'Mark all' : 'அனைத்தும்'}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSkeleton variant="list" count={5} />}

        {/* Empty State */}
        {!isLoading && filteredNotifications.length === 0 && (
          <EmptyState
            icon={Bell}
            title={language === 'en' ? 'No notifications' : 'அறிவிப்புகள் இல்லை'}
            description={language === 'en' ? "You're all caught up!" : 'நீங்கள் அனைத்தையும் படித்துவிட்டீர்கள்!'}
          />
        )}

        {/* Notifications List */}
        {!isLoading && filteredNotifications.length > 0 && (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "animate-slide-up cursor-pointer transition-all",
                    !notification.isRead && "border-primary/50 bg-primary/5"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              "font-medium truncate",
                              !notification.isRead && "font-semibold"
                            )}>
                              {language === 'en' ? notification.title : notification.titleTamil}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                              {language === 'en' ? notification.message : notification.messageTamil}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.createdAt)}
                            </span>
                            {notification.isImportant && (
                              <span className="w-2 h-2 rounded-full bg-accent" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
