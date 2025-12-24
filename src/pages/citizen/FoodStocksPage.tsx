import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Circle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockFoodItems, mockUserVotes, simulateApiCall, FoodItem } from '@/data/mockData';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'voted' | 'not_voted';
type StockStatusFilter = 'all' | 'high' | 'medium' | 'low';

interface StockStatus {
  level: 'high' | 'medium' | 'low';
  color: string;
  bgColor: string;
  label: string;
  labelTamil: string;
}

const getStockStatus = (available: number, total: number): StockStatus => {
  const percentage = (available / total) * 100;
  
  if (percentage > 50) {
    return {
      level: 'high',
      color: 'text-[#4CAF50]',
      bgColor: 'bg-[#4CAF50]',
      label: 'High Stock',
      labelTamil: 'அதிக இருப்பு',
    };
  } else if (percentage >= 20) {
    return {
      level: 'medium',
      color: 'text-[#FFA726]',
      bgColor: 'bg-[#FFA726]',
      label: 'Medium Stock',
      labelTamil: 'நடுத்தர இருப்பு',
    };
  } else {
    return {
      level: 'low',
      color: 'text-[#EF5350]',
      bgColor: 'bg-[#EF5350]',
      label: 'Low Stock',
      labelTamil: 'குறைந்த இருப்பு',
    };
  }
};

// Enhanced mock data with varied stock levels
const enhancedFoodItems: FoodItem[] = mockFoodItems.map((item, index) => {
  const stockMultipliers = [0.25, 0.20, 0.14, 0.60, 0.55, 0.08, 0.45, 0.70, 0.18, 0.35];
  const multiplier = stockMultipliers[index % stockMultipliers.length];
  return {
    ...item,
    availableQuantity: Math.round(item.totalQuantity * multiplier),
  };
});

const FoodStocksPage = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<StockStatusFilter>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(enhancedFoodItems);
    setFoodItems(data);
    setIsLoading(false);
  };

  const userVotedItemIds = mockUserVotes.map(v => v.itemId);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameTamil.includes(searchQuery);

    if (!matchesSearch) return false;

    // Vote filter
    let matchesVoteFilter = true;
    switch (activeFilter) {
      case 'voted':
        matchesVoteFilter = userVotedItemIds.includes(item.id);
        break;
      case 'not_voted':
        matchesVoteFilter = !userVotedItemIds.includes(item.id) && item.isVotingEnabled;
        break;
    }

    if (!matchesVoteFilter) return false;

    // Stock status filter
    if (stockStatusFilter !== 'all') {
      const status = getStockStatus(item.availableQuantity, item.totalQuantity);
      if (status.level !== stockStatusFilter) return false;
    }

    return true;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('stocks.filterAll') },
    { key: 'voted', label: t('stocks.filterVoted') },
    { key: 'not_voted', label: t('stocks.filterNotVoted') },
  ];

  const stockStatusOptions = [
    { value: 'all', label: language === 'en' ? 'All Stock Levels' : 'அனைத்து இருப்பு நிலைகள்' },
    { value: 'high', label: language === 'en' ? 'High Stock' : 'அதிக இருப்பு' },
    { value: 'medium', label: language === 'en' ? 'Medium Stock' : 'நடுத்தர இருப்பு' },
    { value: 'low', label: language === 'en' ? 'Low Stock' : 'குறைந்த இருப்பு' },
  ];

  return (
    <MainLayout title={t('stocks.title')} showBack>
      <TooltipProvider>
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

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Vote Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
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

            {/* Stock Status Filter */}
            <Select
              value={stockStatusFilter}
              onValueChange={(value) => setStockStatusFilter(value as StockStatusFilter)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stockStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <Circle className="w-3 h-3 fill-[#4CAF50] text-[#4CAF50]" />
                  <span className="text-muted-foreground">{language === 'en' ? 'High' : 'அதிக'}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'en' ? 'Green = Adequate supply (>50%)' : 'பச்சை = போதுமான இருப்பு (>50%)'}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <Circle className="w-3 h-3 fill-[#FFA726] text-[#FFA726]" />
                  <span className="text-muted-foreground">{language === 'en' ? 'Medium' : 'நடுத்தர'}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'en' ? 'Yellow = Limited stock (20-50%)' : 'மஞ்சள் = குறைவான இருப்பு (20-50%)'}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <Circle className="w-3 h-3 fill-[#EF5350] text-[#EF5350]" />
                  <span className="text-muted-foreground">{language === 'en' ? 'Low' : 'குறைந்த'}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'en' ? 'Red = Almost depleted (<20%)' : 'சிவப்பு = கிட்டத்தட்ட தீர்ந்துவிட்டது (<20%)'}</p>
              </TooltipContent>
            </Tooltip>
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
                const stockStatus = getStockStatus(item.availableQuantity, item.totalQuantity);
                
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Circle className={cn("w-3 h-3", stockStatus.bgColor, stockStatus.color, "fill-current cursor-help")} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{language === 'en' ? stockStatus.label : stockStatus.labelTamil}</p>
                              </TooltipContent>
                            </Tooltip>
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {item.itemNumber}
                            </span>
                            <h3 className="font-semibold">{item.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground ml-12">{item.nameTamil}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
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
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              stockStatus.level === 'high' && "border-[#4CAF50] text-[#4CAF50]",
                              stockStatus.level === 'medium' && "border-[#FFA726] text-[#FFA726]",
                              stockStatus.level === 'low' && "border-[#EF5350] text-[#EF5350]"
                            )}
                          >
                            {language === 'en' ? stockStatus.label : stockStatus.labelTamil}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('stocks.available')}</span>
                          <span className="font-medium">
                            {item.availableQuantity} / {item.totalQuantity} {item.unit}
                          </span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={availablePercent} 
                            className={cn(
                              "h-2",
                              stockStatus.level === 'high' && "[&>div]:bg-[#4CAF50]",
                              stockStatus.level === 'medium' && "[&>div]:bg-[#FFA726]",
                              stockStatus.level === 'low' && "[&>div]:bg-[#EF5350]"
                            )} 
                          />
                        </div>
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
      </TooltipProvider>
    </MainLayout>
  );
};

export default FoodStocksPage;