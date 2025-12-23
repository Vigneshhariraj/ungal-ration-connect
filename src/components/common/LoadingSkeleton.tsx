import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'list' | 'text' | 'avatar' | 'button';
  count?: number;
}

const LoadingSkeleton = ({
  className,
  variant = 'card',
  count = 1,
}: LoadingSkeletonProps) => {
  const renderSkeleton = (index: number) => {
    switch (variant) {
      case 'card':
        return (
          <div
            key={index}
            className={cn(
              'bg-card rounded-xl border border-border p-5 space-y-3 animate-pulse',
              className
            )}
          >
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-10 bg-muted rounded w-full" />
          </div>
        );

      case 'list':
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-4 p-4 border-b border-border animate-pulse',
              className
            )}
          >
            <div className="w-12 h-12 bg-muted rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={index} className={cn('space-y-2 animate-pulse', className)}>
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        );

      case 'avatar':
        return (
          <div
            key={index}
            className={cn(
              'w-16 h-16 bg-muted rounded-full animate-pulse',
              className
            )}
          />
        );

      case 'button':
        return (
          <div
            key={index}
            className={cn(
              'h-11 bg-muted rounded-lg w-full animate-pulse',
              className
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

export default LoadingSkeleton;
