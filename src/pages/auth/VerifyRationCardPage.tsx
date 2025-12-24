import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Globe, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';

interface FamilyMember {
  name: string;
  relation: string;
  age: number;
}

interface RationCardData {
  holderName: string;
  wardNumber: string;
  area: string;
  familyMembers: FamilyMember[];
}

const getRationCardData = (cardNumber: string): RationCardData => {
  if (cardNumber.startsWith('TN12')) {
    return {
      holderName: 'Rajesh Kumar',
      wardNumber: '15',
      area: 'Mylapore, Chennai South',
      familyMembers: [
        { name: 'Rajesh Kumar', relation: 'Self', age: 48 },
        { name: 'Lakshmi', relation: 'Wife', age: 45 },
        { name: 'Arun', relation: 'Son', age: 22 },
        { name: 'Priya', relation: 'Daughter', age: 18 },
      ],
    };
  } else if (cardNumber.startsWith('TN34')) {
    return {
      holderName: 'Lakshmi Devi',
      wardNumber: '8',
      area: 'T. Nagar, Chennai Central',
      familyMembers: [
        { name: 'Lakshmi Devi', relation: 'Self', age: 52 },
        { name: 'Ramesh', relation: 'Husband', age: 55 },
        { name: 'Kavitha', relation: 'Daughter', age: 25 },
      ],
    };
  } else {
    return {
      holderName: 'Verified Card Holder',
      wardNumber: '10',
      area: 'Anna Nagar, Chennai',
      familyMembers: [
        { name: 'Card Holder', relation: 'Self', age: 40 },
        { name: 'Family Member', relation: 'Spouse', age: 38 },
      ],
    };
  }
};

const VerifyRationCardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [cardData, setCardData] = useState<RationCardData | null>(null);

  const rationCardNumber = location.state?.rationCardNumber || '';
  const phone = location.state?.phone || '';
  const password = location.state?.password || '';

  useEffect(() => {
    if (rationCardNumber) {
      setCardData(getRationCardData(rationCardNumber));
    }
  }, [rationCardNumber]);

  const handleConfirm = () => {
    navigate('/link-ration-card', { 
      state: { 
        rationCardNumber, 
        phone, 
        password, 
        verified: true,
        cardData 
      } 
    });
  };

  const handleEditCard = () => {
    navigate('/login', { state: { tab: 'register' } });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  if (!cardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleEditCard}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
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

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="space-y-4">
          {/* Card Number Display */}
          <Card className="gradient-primary text-primary-foreground">
            <CardContent className="p-4">
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
            </CardContent>
          </Card>

          {/* Card Details */}
          <Card className="animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'en' ? 'Card Holder Details' : 'கார்டு வைத்திருப்பவர் விவரங்கள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Card Holder Name' : 'கார்டு வைத்திருப்பவர் பெயர்'}
                  </p>
                  <p className="font-semibold">{cardData.holderName}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Ward Number' : 'வார்டு எண்'}
                  </p>
                  <p className="font-semibold">Ward {cardData.wardNumber}</p>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  {language === 'en' ? 'Area' : 'பகுதி'}
                </p>
                <p className="font-semibold">{cardData.area}</p>
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
                        {language === 'en' ? 'Relation' : 'உறவு'}
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
                        <TableCell>{member.relation}</TableCell>
                        <TableCell className="pr-6 text-right">{member.age}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button className="w-full" size="lg" onClick={handleConfirm}>
              {language === 'en' ? 'Confirm & Continue' : 'உறுதிப்படுத்தி தொடரவும்'}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground" 
              onClick={handleEditCard}
            >
              {language === 'en' ? 'Edit Card Number' : 'கார்டு எண்ணை மாற்றவும்'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyRationCardPage;