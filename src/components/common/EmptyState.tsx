import { LucideIcon, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
