import { ArrowLeft, Bell, Globe, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showLanguage?: boolean;
  showSettings?: boolean;
  className?: string;
}

const Header = ({
  title,
  showBack = false,
  showNotification = true,
  showLanguage = true,
  showSettings = true,
  className,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleSettings = () => {
    navigate('/profile');
  };

  // Determine if we should show the back button based on current route
  const isHomePage = location.pathname === '/dashboard' || location.pathname === '/authority/dashboard';
  const isLoginPage = location.pathname === '/login' || location.pathname === '/otp-verify';
  const shouldShowBack = showBack || (!isHomePage && !isLoginPage);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-card border-b border-border safe-top',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {shouldShowBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        {title && (
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        )}
        {!title && !shouldShowBack && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">உR</span>
            </div>
            <span className="font-semibold text-lg">Ungal Ration</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {showLanguage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </span>
          </Button>
        )}
        {showSettings && !isLoginPage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettings}
          >
            <Settings className="w-5 h-5" />
          </Button>
        )}
        {showNotification && location.pathname !== '/notifications' && !isLoginPage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotifications}
            className="relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
