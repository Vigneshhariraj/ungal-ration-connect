import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Globe, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

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

const VerifyRationCardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [cardData, setCardData] = useState<RationCardData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  const rationCardNumber = location.state?.rationCardNumber || '';
  const phone = location.state?.phone || '';
  const password = location.state?.password || '';

  useEffect(() => {
    if (rationCardNumber) {
      // Simulate API loading
      setIsLoading(true);
      setTimeout(() => {
        const data = getRationCardData(rationCardNumber);
        setCardData(data);
        setIsLoading(false);
        
        // If data found, show registration success
        if (data) {
          setRegistered(true);
          toast.success(
            language === 'en' 
              ? 'Registration Successful! Your ration card has been linked.' 
              : 'பதிவு வெற்றிகரமாக முடிந்தது! உங்கள் ரேஷன் கார்டு இணைக்கப்பட்டது.'
          );
        }
      }, 1000);
    }
  }, [rationCardNumber, language]);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">
            {language === 'en' ? 'Verifying ration card...' : 'ரேஷன் கார்டை சரிபார்க்கிறது...'}
          </p>
        </div>
      </div>
    );
  }

  // No data found (card ends with 9)
  if (cardData === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg">
              {language === 'en' ? 'Verify Ration Card' : 'ரேஷன் கார்டை சரிபார்க்கவும்'}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1.5"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'தமிழ்' : 'EN'}
          </Button>
        </header>

        {/* No Data Found Content */}
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'en' ? 'No Data Found' : 'தரவு கிடைக்கவில்லை'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? `No ration card found with number "${rationCardNumber}". Please check the card number and try again.`
                  : `"${rationCardNumber}" என்ற எண்ணில் ரேஷன் கார்டு இல்லை. கார்டு எண்ணை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.`
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
        </main>
      </div>
    );
  }

  // Data found - show card details
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-lg">
            {language === 'en' ? 'Registration Successful' : 'பதிவு வெற்றிகரமாக முடிந்தது'}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="gap-1.5"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'தமிழ்' : 'EN'}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="space-y-4">
          {/* Success Banner */}
          {registered && (
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
          )}

          {/* Card Number Display */}
          <Card className="gradient-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">
                      {language === 'en' ? 'Ration Card Number' : 'ரேஷன் கார்டு எண்'}
                    </p>
                    <p className="font-bold text-lg">{rationCardNumber}</p>
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
          <div className="pt-4">
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
      </main>
    </div>
  );
};

export default VerifyRationCardPage;