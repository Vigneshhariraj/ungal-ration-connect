import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, MapPin, Calendar, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

interface FamilyMember {
  name: string;
  relation: string;
  age: number;
}

interface RationCardData {
  holderName: string;
  wardNumber: string;
  area: string;
  bplStatus: boolean;
  familyMembers: FamilyMember[];
}

const getRationCardData = (cardNumber: string): RationCardData | null => {
  // If card number ends with 9, return null (no data found)
  if (cardNumber.endsWith('9')) {
    return null;
  }
  
  // If card number ends with 1, show data
  if (cardNumber.endsWith('1')) {
    return {
      holderName: 'Murugan Selvam',
      wardNumber: '12',
      area: 'Adyar, Chennai South',
      bplStatus: true,
      familyMembers: [
        { name: 'Murugan Selvam', relation: 'Self (Card Owner)', age: 52 },
        { name: 'Lakshmi Murugan', relation: 'Wife', age: 48 },
        { name: 'Karthik M', relation: 'Son', age: 24 },
        { name: 'Divya M', relation: 'Daughter', age: 20 },
      ],
    };
  }
  
  // Default case for other numbers
  return {
    holderName: 'Verified Card Holder',
    wardNumber: '10',
    area: 'Anna Nagar, Chennai',
    bplStatus: false,
    familyMembers: [
      { name: 'Card Holder', relation: 'Self (Card Owner)', age: 40 },
      { name: 'Family Member', relation: 'Spouse', age: 38 },
    ],
  };
};

const LinkRationCardPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [cardData, setCardData] = useState<RationCardData | null>(null);

  const handleSearch = async () => {
    if (!cardNumber || cardNumber.length < 10) {
      toast.error(language === 'en' ? 'Please enter valid ration card number' : 'சரியான ரேஷன் கார்டு எண்ணை உள்ளிடவும்');
      return;
    }

    setIsLoading(true);
    setSearchPerformed(false);
    
    // Simulate API call
    setTimeout(() => {
      const data = getRationCardData(cardNumber);
      setCardData(data);
      setSearchPerformed(true);
      setIsLoading(false);
      
      if (data) {
        toast.success(
          language === 'en' 
            ? 'Registered Successfully! Your ration card has been linked.' 
            : 'வெற்றிகரமாக பதிவு செய்யப்பட்டது! உங்கள் ரேஷன் கார்டு இணைக்கப்பட்டது.'
        );
      }
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // No data found state (card ends with 9)
  if (searchPerformed && cardData === null) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'en' ? 'No Data Found' : 'தரவு கிடைக்கவில்லை'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? `No ration card found with number "${cardNumber}". Please check the card number and try again.`
                  : `"${cardNumber}" என்ற எண்ணில் ரேஷன் கார்டு இல்லை. கார்டு எண்ணை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.`
                }
              </p>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to Login Page' : 'உள்நுழைவு பக்கத்திற்கு திரும்பு'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Data found - show card details with success
  if (searchPerformed && cardData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-4 pt-4">
          {/* Success Banner */}
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    {language === 'en' ? 'Registered Successfully!' : 'வெற்றிகரமாக பதிவு செய்யப்பட்டது!'}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {language === 'en' ? 'Your ration card has been linked to your account' : 'உங்கள் ரேஷன் கார்டு உங்கள் கணக்குடன் இணைக்கப்பட்டுள்ளது'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Number Display */}
          <Card className="gradient-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">
                      {language === 'en' ? 'Ration Card Number' : 'ரேஷன் கார்டு எண்'}
                    </p>
                    <p className="font-bold text-lg">{cardNumber}</p>
                  </div>
                </div>
                <Badge className={cardData.bplStatus ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}>
                  {cardData.bplStatus ? 'BPL' : 'APL'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card Owner Details */}
          <Card className="animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'en' ? 'Card Owner Details' : 'கார்டு உரிமையாளர் விவரங்கள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Card Owner Name' : 'கார்டு உரிமையாளர் பெயர்'}
                  </p>
                  <p className="font-semibold">{cardData.holderName}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'BPL Status' : 'BPL நிலை'}
                  </p>
                  <p className="font-semibold">
                    {cardData.bplStatus 
                      ? (language === 'en' ? 'Yes (BPL)' : 'ஆம் (BPL)')
                      : (language === 'en' ? 'No (APL)' : 'இல்லை (APL)')
                    }
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Ward Number' : 'வார்டு எண்'}
                  </p>
                  <p className="font-semibold">Ward {cardData.wardNumber}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Area' : 'பகுதி'}
                  </p>
                  <p className="font-semibold">{cardData.area}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card className="animate-slide-up" style={{ animationDelay: '50ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {language === 'en' ? 'Family Members' : 'குடும்ப உறுப்பினர்கள்'} 
                <span className="text-sm font-normal text-muted-foreground">
                  ({cardData.familyMembers.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">
                        {language === 'en' ? 'Name' : 'பெயர்'}
                      </TableHead>
                      <TableHead>
                        {language === 'en' ? 'Relation to Owner' : 'உரிமையாளருடன் உறவு'}
                      </TableHead>
                      <TableHead className="pr-6 text-right">
                        {language === 'en' ? 'Age' : 'வயது'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cardData.familyMembers.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell className="pl-6 font-medium">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant={member.relation.includes('Self') ? 'default' : 'secondary'}>
                            {member.relation}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">{member.age}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Back to Login Button */}
          <div className="pt-2">
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to Login Page' : 'உள்நுழைவு பக்கத்திற்கு திரும்பு'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial search form
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
                  ? 'Enter your ration card number (ends with 1 for data, 9 for no data)'
                  : 'உங்கள் ரேஷன் கார்டு எண்ணை உள்ளிடவும்'}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={isLoading || cardNumber.length < 10}
            >
              {isLoading ? t('common.loading') : t('common.search')}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <LoadingSkeleton variant="card" />
        )}

        {/* Demo Hint */}
        <p className="text-xs text-center text-muted-foreground">
          {language === 'en' 
            ? 'Demo: Card ending with 1 shows data, ending with 9 shows no data'
            : 'டெமோ: 1 இல் முடிவடையும் கார்டு தரவைக் காட்டும், 9 இல் முடிவடையும் தரவு இல்லை'}
        </p>
      </div>
    </div>
  );
};

export default LinkRationCardPage;
