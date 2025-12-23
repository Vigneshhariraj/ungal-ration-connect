import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package, Vote, FileText, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('nav.home') },
    { path: '/stocks', icon: Package, label: t('nav.stocks') },
    { path: '/voting', icon: Vote, label: t('nav.voting') },
    { path: '/ration', icon: FileText, label: t('nav.ration') },
    { path: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full px-2 py-2 transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'animate-scale-in')} />
              </div>
              <span className="text-[10px] font-medium mt-0.5">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
