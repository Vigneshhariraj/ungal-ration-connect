import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Vote, 
  FileText, 
  Heart, 
  Bell, 
  Settings,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockRationSchedules, mockNotifications, formatDate } from '@/data/mockData';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const upcomingRation = mockRationSchedules[0];
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;

  const quickStats = [
    {
      label: t('dashboard.nextRation'),
      value: formatDate(upcomingRation.date, language),
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: t('dashboard.itemsSelected'),
      value: upcomingRation.items.length.toString(),
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: t('dashboard.pendingVotes'),
      value: '5',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  const menuItems = [
    {
      icon: Package,
      label: t('dashboard.foodStocks'),
      description: language === 'en' ? 'View available items' : 'கிடைக்கும் பொருட்களைப் பார்க்க',
      path: '/stocks',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Vote,
      label: t('dashboard.votingSystem'),
      description: language === 'en' ? 'Vote for ration items' : 'ரேஷன் பொருட்களுக்கு வாக்களிக்க',
      path: '/voting',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: FileText,
      label: t('dashboard.nextRationDetails'),
      description: language === 'en' ? 'View ration schedule' : 'ரேஷன் அட்டவணையைப் பார்க்க',
      path: '/ration',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Heart,
      label: t('dashboard.elderServices'),
      description: language === 'en' ? 'Home delivery & OTP auth' : 'வீட்டு டெலிவரி & OTP',
      path: '/elder-services',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      icon: Bell,
      label: t('dashboard.notifications'),
      description: language === 'en' ? `${unreadNotifications} unread` : `${unreadNotifications} படிக்கப்படாதவை`,
      path: '/notifications',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      icon: Settings,
      label: t('dashboard.settings'),
      description: language === 'en' ? 'Profile & preferences' : 'சுயவிவரம் & விருப்பங்கள்',
      path: '/profile',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold">
          {t('dashboard.welcome')}, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          {user?.nameTamil || 'பயனர்'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {quickStats.map((stat, index) => (
          <Card 
            key={index} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-3 text-center">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98] animate-slide-up"
            style={{ animationDelay: `${(index + 3) * 50}ms` }}
            onClick={() => navigate(item.path)}
          >
            <CardContent className="p-4 relative">
              {item.badge && (
                <span className="absolute top-3 right-3 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-3`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Ration Banner */}
      <Card className="mt-6 gradient-primary text-primary-foreground animate-slide-up" style={{ animationDelay: '400ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('rationCard.nextRation')}</p>
              <p className="text-xl font-bold">{formatDate(upcomingRation.date, language)}</p>
              <p className="text-sm opacity-90">{upcomingRation.timeSlot}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Slot #{upcomingRation.slotNumber}</p>
              <p className="text-lg font-bold">₹{upcomingRation.totalCost}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default DashboardPage;
