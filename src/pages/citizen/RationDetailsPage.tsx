import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Download, QrCode, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { mockRationSchedules, simulateApiCall, RationSchedule, formatDate, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

const RationDetailsPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<RationSchedule[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await simulateApiCall(mockRationSchedules);
    setSchedules(data);
    setIsLoading(false);
  };

  const handleDownloadReceipt = () => {
    toast({
      title: language === 'en' ? 'Downloading...' : 'பதிவிறக்குகிறது...',
      description: language === 'en' ? 'Receipt will be downloaded shortly' : 'ரசீது விரைவில் பதிவிறக்கப்படும்',
    });
  };

  const upcomingSchedules = schedules.filter(s => s.status === 'upcoming');
  const currentSchedule = upcomingSchedules[0];

  return (
    <MainLayout title={t('dashboard.nextRationDetails')} showBack>
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && <LoadingSkeleton variant="card" count={3} />}

        {!isLoading && currentSchedule && (
          <>
            {/* Main Ration Card */}
            <Card className="border-primary animate-slide-up">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t('rationCard.nextRation')}</CardTitle>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    Slot #{currentSchedule.slotNumber}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'en' ? 'Date' : 'தேதி'}</p>
                      <p className="font-semibold">{formatDate(currentSchedule.date, language)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'en' ? 'Time' : 'நேரம்'}</p>
                      <p className="font-semibold">{currentSchedule.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{currentSchedule.shopName}</p>
                      <p className="text-sm text-muted-foreground">{currentSchedule.shopAddress}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${currentSchedule.shopPhone}`} className="text-sm text-primary">
                          {currentSchedule.shopPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <p className="font-medium mb-2">{language === 'en' ? 'Items' : 'பொருட்கள்'}</p>
                  <div className="space-y-2">
                    {currentSchedule.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.quantity} {item.unit}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="font-semibold">{language === 'en' ? 'Total Cost' : 'மொத்த செலவு'}</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(currentSchedule.totalCost)}</p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code & Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-4 text-center">
                  <div className="w-24 h-24 mx-auto mb-2 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? 'Verification QR' : 'சரிபார்ப்பு QR'}</p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '150ms' }}>
                <CardContent className="p-4 flex flex-col justify-center h-full gap-3">
                  <Button variant="outline" className="gap-2" onClick={handleDownloadReceipt}>
                    <Download className="w-4 h-4" />
                    {t('common.downloadReceipt')}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Truck className="w-4 h-4" />
                    {language === 'en' ? 'Request Delivery' : 'டெலிவரி கோரிக்கை'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Schedules */}
            {upcomingSchedules.length > 1 && (
              <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{language === 'en' ? 'Upcoming Schedules' : 'வரவிருக்கும் அட்டவணை'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {upcomingSchedules.slice(1).map((schedule, index) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{formatDate(schedule.date, language)}</p>
                          <p className="text-sm text-muted-foreground">{schedule.timeSlot}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(schedule.totalCost)}</p>
                        <p className="text-xs text-muted-foreground">{schedule.items.length} items</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default RationDetailsPage;
