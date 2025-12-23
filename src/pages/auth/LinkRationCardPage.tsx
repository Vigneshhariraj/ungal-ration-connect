import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

const LinkRationCardPage = () => {
  const navigate = useNavigate();
  const { linkRationCard, user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkedCard, setLinkedCard] = useState<typeof user | null>(null);

  const handleSearch = async () => {
    if (!cardNumber || cardNumber.length < 12) {
      toast({ title: 'Error', description: 'Please enter valid ration card number', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await linkRationCard(cardNumber);
      if (result) {
        setLinkedCard(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    toast({ title: 'Success', description: 'Ration card linked successfully!' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{t('rationCard.link')}</h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' 
              ? 'Link your ration card to access all services'
              : 'அனைத்து சேவைகளையும் அணுக உங்கள் ரேஷன் கார்டை இணைக்கவும்'}
          </p>
        </div>

        {/* Search Card */}
        <Card className="animate-slide-up">
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('rationCard.number')}</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="TN123456789012"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.toUpperCase())}
                  className="pl-11 uppercase"
                  maxLength={14}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'en' 
                  ? 'Enter your 14-digit ration card number'
                  : '14 இலக்க ரேஷன் கார்டு எண்ணை உள்ளிடவும்'}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={isLoading || cardNumber.length < 12}
            >
              {isLoading ? t('common.loading') : t('common.search')}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <LoadingSkeleton variant="card" />
        )}

        {/* Card Details */}
        {linkedCard && !isLoading && (
          <Card className="animate-slide-up border-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t('rationCard.holder')}</CardTitle>
                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {linkedCard.cardType}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xl font-semibold">{linkedCard.name}</p>
                <p className="text-muted-foreground">{linkedCard.nameTamil}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('rationCard.familyMembers')}</p>
                    <p className="font-medium">{(linkedCard.familyMembers?.length || 0) + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('rationCard.taluk')}</p>
                    <p className="font-medium">{linkedCard.taluk}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('rationCard.area')}</p>
                  <p className="font-medium">{linkedCard.area}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('rationCard.lastRation')}</p>
                    <p className="font-medium">Dec 15, 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('rationCard.nextRation')}</p>
                    <p className="font-medium text-primary">Jan 15, 2024</p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                variant="accent"
                onClick={handleConfirm}
              >
                <CheckCircle className="w-5 h-5" />
                {t('rationCard.confirm')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Demo Hint */}
        <p className="text-xs text-center text-muted-foreground">
          Demo: Enter any card number (e.g., TN123456789012)
        </p>
      </div>
    </div>
  );
};

export default LinkRationCardPage;
