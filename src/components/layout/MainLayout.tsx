import { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
  showNotification?: boolean;
  showLanguage?: boolean;
  className?: string;
}

const MainLayout = ({
  children,
  title,
  showBack = false,
  showNav = true,
  showNotification = true,
  showLanguage = true,
  className,
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header
        title={title}
        showBack={showBack}
        showNotification={showNotification}
        showLanguage={showLanguage}
      />
      <main
        className={cn(
          'px-4 py-4 pb-20 md:pb-4 max-w-4xl mx-auto',
          showNav && 'pb-24',
          className
        )}
      >
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default MainLayout;
