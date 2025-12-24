import { useNavigate } from 'react-router-dom';
import { BarChart3, Package, Truck, RefreshCw, ShoppingCart, LogOut, Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockDeliveryRequests } from '@/data/mockData';

const AuthorityDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardCards = [
    {
      title: language === 'en' ? 'Ration Purchase Analytics' : 'ரேஷன் வாங்கும் பகுப்பாய்வு',
      value: '85% Regular Buyers',
      icon: BarChart3,
      path: '/authority/purchase-analytics',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: language === 'en' ? 'Stock Overview' : 'கையிருப்பு மேலோட்டம்',
      value: '10 Items in Stock',
      icon: Package,
      path: '/authority/stock-overview',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: language === 'en' ? 'Delivery Management' : 'டெலிவரி மேலாண்மை',
      value: `${mockDeliveryRequests.filter(d => d.status === 'pending').length} Pending Deliveries`,
      icon: Truck,
      path: '/authority/deliveries',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: language === 'en' ? 'Redistribution Management' : 'மறுவிநியோக மேலாண்மை',
      value: language === 'en' ? 'Unclaimed Stock Available' : 'கோரப்படாத கையிருப்பு உள்ளது',
      icon: RefreshCw,
      path: '/authority/redistribution',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: language === 'en' ? 'Order Analysis' : 'ஆர்டர் பகுப்பாய்வு',
      value: language === 'en' ? 'Review & Place Orders' : 'ஆர்டர்களை மதிப்பாய்வு செய்து வைக்கவும்',
      icon: ShoppingCart,
      path: '/authority/order-analysis',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">உR</span>
            </div>
            <span className="font-semibold">{language === 'en' ? 'Authority Panel' : 'அதிகாரி பேனல்'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}>
              <Globe className="w-4 h-4 mr-1" />
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold">
            {language === 'en' ? 'Welcome, Ward Supervisor' : 'வரவேற்கிறோம், வார்டு மேற்பார்வையாளர்'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage your ward\'s ration distribution' : 'உங்கள் வார்டின் ரேஷன் விநியோகத்தை நிர்வகிக்கவும்'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98] animate-slide-up min-h-[120px]"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(card.path)}
            >
              <CardContent className="p-5 h-full flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AuthorityDashboardPage;