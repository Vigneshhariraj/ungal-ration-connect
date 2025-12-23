import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  Truck,
  Vote,
  BarChart3,
  RefreshCw,
  LogOut,
  ArrowUp,
  ArrowDown,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockFoodItems, mockDeliveryRequests, mockUsers } from '@/data/mockData';

const AuthorityDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    {
      title: t('authority.totalBeneficiaries'),
      value: mockUsers.length.toString(),
      icon: Users,
      change: '+12%',
      isPositive: true,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('authority.stockLevels'),
      value: '85%',
      icon: Package,
      change: '-5%',
      isPositive: false,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: t('authority.pendingDeliveries'),
      value: mockDeliveryRequests.filter(d => d.status === 'pending').length.toString(),
      icon: Truck,
      change: '+2',
      isPositive: false,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: t('authority.activeVotes'),
      value: mockFoodItems.filter(i => i.isVotingEnabled).length.toString(),
      icon: Vote,
      change: '0',
      isPositive: true,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const menuItems = [
    {
      title: t('authority.stockManagement'),
      description: language === 'en' ? 'Update stock levels' : 'கையிருப்பு நிலையை புதுப்பிக்க',
      icon: Package,
      path: '/authority/stocks',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('authority.deliveryManagement'),
      description: language === 'en' ? 'Manage delivery requests' : 'டெலிவரி கோரிக்கைகளை நிர்வகிக்க',
      icon: Truck,
      path: '/authority/deliveries',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: t('authority.redistribution'),
      description: language === 'en' ? 'Redistribute unclaimed rations' : 'கோரப்படாத ரேஷனை மறுவிநியோகம் செய்ய',
      icon: RefreshCw,
      path: '/authority/redistribution',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: t('authority.analytics'),
      description: language === 'en' ? 'View reports & analytics' : 'அறிக்கைகள் & பகுப்பாய்வைப் பார்க்க',
      icon: BarChart3,
      path: '/authority/analytics',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const recentActivities = [
    { action: 'Stock updated', item: 'Rice - Added 500kg', time: '2 hours ago' },
    { action: 'Delivery approved', item: 'Order #DEL001', time: '3 hours ago' },
    { action: 'Voting closed', item: 'January Items', time: '1 day ago' },
    { action: 'New registration', item: 'User #1234', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">உR</span>
            </div>
            <span className="font-semibold">{t('authority.dashboard')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold">{t('dashboard.welcome')}, {user?.name}</h1>
          <p className="text-muted-foreground">{user?.nameTamil}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${stat.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {stat.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98] animate-slide-up"
              style={{ animationDelay: `${(index + 4) * 50}ms` }}
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-3`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stock Overview */}
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{language === 'en' ? 'Stock Overview' : 'கையிருப்பு கண்ணோட்டம்'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockFoodItems.slice(0, 5).map((item, index) => {
              const percentage = (item.availableQuantity / item.totalQuantity) * 100;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.availableQuantity}/{item.totalQuantity} {item.unit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${percentage < 30 ? '[&>div]:bg-destructive' : ''}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="animate-slide-up" style={{ animationDelay: '450ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{language === 'en' ? 'Recent Activities' : 'சமீபத்திய செயல்பாடுகள்'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthorityDashboardPage;
