import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: language === 'en' ? 'Logged out' : 'வெளியேறினார்',
      description: language === 'en' ? 'You have been logged out successfully.' : 'நீங்கள் வெற்றிகரமாக வெளியேறிவிட்டீர்கள்.',
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const profileDetails = [
    { icon: Phone, label: language === 'en' ? 'Phone' : 'தொலைபேசி', value: `+91 ${user?.phone}` },
    { icon: Mail, label: language === 'en' ? 'Email' : 'மின்னஞ்சல்', value: user?.email },
    { icon: MapPin, label: language === 'en' ? 'Ward' : 'வார்டு', value: `Ward ${user?.wardNumber}` },
    { icon: CreditCard, label: t('rationCard.number'), value: user?.rationCardNumber },
  ];

  const settingsItems = [
    {
      icon: Globe,
      label: t('common.language'),
      value: language === 'en' ? 'English' : 'தமிழ்',
      action: toggleLanguage,
      hasToggle: false,
    },
    {
      icon: isDarkMode ? Moon : Sun,
      label: t('common.theme'),
      value: isDarkMode ? (language === 'en' ? 'Dark' : 'இருண்ட') : (language === 'en' ? 'Light' : 'ஒளி'),
      action: toggleTheme,
      hasToggle: true,
      toggleValue: isDarkMode,
    },
    {
      icon: Bell,
      label: language === 'en' ? 'Notifications' : 'அறிவிப்புகள்',
      value: notificationsEnabled 
        ? (language === 'en' ? 'Enabled' : 'இயக்கப்பட்டது') 
        : (language === 'en' ? 'Disabled' : 'முடக்கப்பட்டது'),
      action: () => setNotificationsEnabled(!notificationsEnabled),
      hasToggle: true,
      toggleValue: notificationsEnabled,
    },
    {
      icon: Shield,
      label: language === 'en' ? 'Privacy Settings' : 'தனியுரிமை அமைப்புகள்',
      value: '',
      action: () => {},
      hasToggle: false,
      hasArrow: true,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profilePhoto} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.nameTamil}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {user?.cardType}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.taluk}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Personal Details' : 'தனிப்பட்ட விவரங்கள்'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profileDetails.map((detail, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <detail.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="font-medium truncate">{detail.value || '-'}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('dashboard.settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={!item.hasToggle ? item.action : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
                  {item.hasToggle && (
                    <Switch
                      checked={item.toggleValue}
                      onCheckedChange={item.action}
                    />
                  )}
                  {item.hasArrow && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full animate-slide-up"
          style={{ animationDelay: '150ms' }}
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t('common.logout')}
        </Button>

        {/* Logout Confirmation */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'en' ? 'Confirm Logout' : 'வெளியேற்றத்தை உறுதிப்படுத்து'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'en' 
                  ? 'Are you sure you want to logout from your account?'
                  : 'உங்கள் கணக்கிலிருந்து வெளியேற விரும்புகிறீர்களா?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>{t('common.logout')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
