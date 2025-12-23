import { useState, useEffect } from 'react';
import { Search, Filter, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockFoodItems, mockUserVotes, simulateApiCall, FoodItem } from '@/data/mockData';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'voted' | 'not_voted';

const FoodStocksPage = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(mockFoodItems);
    setFoodItems(data);
    setIsLoading(false);
  };

  const userVotedItemIds = mockUserVotes.map(v => v.itemId);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameTamil.includes(searchQuery);

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'voted':
        return userVotedItemIds.includes(item.id);
      case 'not_voted':
        return !userVotedItemIds.includes(item.id) && item.isVotingEnabled;
      default:
        return true;
    }
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('stocks.filterAll') },
    { key: 'voted', label: t('stocks.filterVoted') },
    { key: 'not_voted', label: t('stocks.filterNotVoted') },
  ];

  return (
    <MainLayout title={t('stocks.title')} showBack>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`${t('common.search')}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        {/* Filters */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            <LoadingSkeleton variant="card" count={5} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <EmptyState
            title={language === 'en' ? 'No items found' : 'பொருட்கள் இல்லை'}
            description={language === 'en' ? 'Try adjusting your search or filter' : 'உங்கள் தேடல் அல்லது வடிப்பானை மாற்றி முயற்சிக்கவும்'}
          />
        )}

        {/* Items List */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const isVoted = userVotedItemIds.includes(item.id);
              const availablePercent = (item.availableQuantity / item.totalQuantity) * 100;
              
              return (
                <Card 
                  key={item.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {item.itemNumber}
                          </span>
                          <h3 className="font-semibold">{item.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.nameTamil}</p>
                      </div>
                      {item.isVotingEnabled && (
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          isVoted 
                            ? "bg-success/10 text-success" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {isVoted ? (
                            <>
                              <Check className="w-3 h-3" />
                              {t('voting.voted')}
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" />
                              {t('stocks.filterNotVoted')}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('stocks.available')}</span>
                        <span className="font-medium">
                          {item.availableQuantity} / {item.totalQuantity} {item.unit}
                        </span>
                      </div>
                      <Progress value={availablePercent} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t('stocks.distributed')}: {item.distributedQuantity} {item.unit}</span>
                        <span>₹{item.pricePerUnit}/{item.unit}</span>
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

export default FoodStocksPage;
