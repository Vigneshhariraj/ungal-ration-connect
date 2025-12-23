import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Check, X, Clock, Truck, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { mockDeliveryRequests, simulateApiCall, DeliveryRequest, formatDate, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

const DeliveryManagementPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(mockDeliveryRequests);
    setDeliveries(data);
    setIsLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedDelivery) return;
    setIsProcessing(true);
    await simulateApiCall(null, 800);

    setDeliveries(prev =>
      prev.map(d =>
        d.id === selectedDelivery.id
          ? { ...d, status: 'approved' as const, volunteerName: 'Murugan' }
          : d
      )
    );

    toast({
      title: language === 'en' ? 'Delivery Approved' : 'டெலிவரி அங்கீகரிக்கப்பட்டது',
      description: language === 'en' 
        ? `Delivery for ${selectedDelivery.userName} has been approved.`
        : `${selectedDelivery.userName} க்கான டெலிவரி அங்கீகரிக்கப்பட்டது.`,
    });

    setSelectedDelivery(null);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!selectedDelivery) return;
    setIsProcessing(true);
    await simulateApiCall(null, 800);

    setDeliveries(prev =>
      prev.map(d =>
        d.id === selectedDelivery.id ? { ...d, status: 'rejected' as const } : d
      )
    );

    toast({
      title: language === 'en' ? 'Delivery Rejected' : 'டெலிவரி நிராகரிக்கப்பட்டது',
      variant: 'destructive',
    });

    setSelectedDelivery(null);
    setIsProcessing(false);
  };

  const getStatusBadge = (status: DeliveryRequest['status']) => {
    const variants: Record<DeliveryRequest['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: language === 'en' ? 'Pending' : 'நிலுவையில்' },
      approved: { variant: 'default', label: language === 'en' ? 'Approved' : 'அங்கீகரிக்கப்பட்டது' },
      in_progress: { variant: 'outline', label: language === 'en' ? 'In Progress' : 'செயல்பாட்டில்' },
      completed: { variant: 'default', label: language === 'en' ? 'Completed' : 'முடிந்தது' },
      rejected: { variant: 'destructive', label: language === 'en' ? 'Rejected' : 'நிராகரிக்கப்பட்டது' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch = d.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusFilters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: language === 'en' ? 'All' : 'அனைத்தும்' },
    { value: 'pending', label: language === 'en' ? 'Pending' : 'நிலுவையில்' },
    { value: 'approved', label: language === 'en' ? 'Approved' : 'அங்கீகரிக்கப்பட்டது' },
    { value: 'in_progress', label: language === 'en' ? 'In Progress' : 'செயல்பாட்டில்' },
    { value: 'completed', label: language === 'en' ? 'Completed' : 'முடிந்தது' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 h-14 px-4 max-w-6xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">
            {language === 'en' ? 'Delivery Management' : 'டெலிவரி நிர்வாகம்'}
          </h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search by name...' : 'பெயரால் தேடு...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map(filter => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSkeleton variant="card" count={3} />}

        {/* Empty State */}
        {!isLoading && filteredDeliveries.length === 0 && (
          <EmptyState
            icon={Truck}
            title={language === 'en' ? 'No delivery requests' : 'டெலிவரி கோரிக்கைகள் இல்லை'}
            description={language === 'en' ? 'No requests match your filters.' : 'உங்கள் வடிப்பான்களுக்கு பொருந்தும் கோரிக்கைகள் இல்லை.'}
          />
        )}

        {/* Delivery List */}
        {!isLoading && filteredDeliveries.length > 0 && (
          <div className="space-y-3">
            {filteredDeliveries.map((delivery, index) => (
              <Card
                key={delivery.id}
                className="animate-slide-up cursor-pointer hover:shadow-lg transition-all"
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{delivery.userName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(delivery.preferredDate, language)} • {delivery.preferredTime}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>

                  <div className="text-sm text-muted-foreground mb-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{delivery.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">{delivery.items.length} items</span>
                    <span className="font-semibold">
                      {formatCurrency(delivery.items.reduce((sum, i) => sum + i.price, 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delivery Detail Dialog */}
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Delivery Request' : 'டெலிவரி கோரிக்கை'}
              </DialogTitle>
              <DialogDescription>
                {language === 'en' ? 'Review and process this delivery request.' : 'இந்த டெலிவரி கோரிக்கையை மதிப்பாய்வு செய்து செயல்படுத்தவும்.'}
              </DialogDescription>
            </DialogHeader>

            {selectedDelivery && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedDelivery.userName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedDelivery.phone}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">{language === 'en' ? 'Delivery Address' : 'டெலிவரி முகவரி'}</p>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">{language === 'en' ? 'Date' : 'தேதி'}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedDelivery.preferredDate, language)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">{language === 'en' ? 'Time' : 'நேரம்'}</p>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.preferredTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">{language === 'en' ? 'Items' : 'பொருட்கள்'}</p>
                  <div className="space-y-2">
                    {selectedDelivery.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>{item.name} ({item.quantity} {item.unit})</span>
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDelivery.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">{language === 'en' ? 'Notes' : 'குறிப்புகள்'}</p>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.notes}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              {selectedDelivery?.status === 'pending' && (
                <>
                  <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                    <X className="w-4 h-4 mr-1" />
                    {language === 'en' ? 'Reject' : 'நிராகரி'}
                  </Button>
                  <Button onClick={handleApprove} disabled={isProcessing}>
                    <Check className="w-4 h-4 mr-1" />
                    {language === 'en' ? 'Approve' : 'அங்கீகரி'}
                  </Button>
                </>
              )}
              {selectedDelivery?.status !== 'pending' && (
                <Button variant="outline" onClick={() => setSelectedDelivery(null)}>
                  {language === 'en' ? 'Close' : 'மூடு'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DeliveryManagementPage;
