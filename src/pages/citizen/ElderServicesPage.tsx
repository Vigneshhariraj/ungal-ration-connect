import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  Truck, 
  Smartphone,
  AlertCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { mockDeliveryRequests } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
  isElderly: boolean;
}

// Dummy data for eligibility check
const getRationCardEligibility = (cardNumber: string): { 
  eligible: boolean; 
  elderlyMembers: FamilyMember[];
  cardHolderName: string;
} => {
  if (cardNumber === 'TN1234567891' || cardNumber.startsWith('TN12345678')) {
    return {
      eligible: false,
      elderlyMembers: [],
      cardHolderName: 'Arun Kumar',
    };
  }
  
  if (cardNumber === 'TN2345678912' || cardNumber.startsWith('TN23456789')) {
    return {
      eligible: true,
      elderlyMembers: [
        { id: 'e1', name: 'Lakshmi Devi', age: 72, relation: 'Mother', isElderly: true },
        { id: 'e2', name: 'Krishnan', age: 75, relation: 'Father', isElderly: true },
      ],
      cardHolderName: 'Rajesh Kumar',
    };
  }

  // Default: Show 1 elderly member
  return {
    eligible: true,
    elderlyMembers: [
      { id: 'e1', name: 'Grandmother Parvathi', age: 68, relation: 'Grandmother', isElderly: true },
    ],
    cardHolderName: 'Verified Card Holder',
  };
};

type Step = 'input' | 'eligibility' | 'service' | 'otp_setup' | 'delivery' | 'status';

const ElderServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('input');
  const [rationCard, setRationCard] = useState(user?.rationCardNumber || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [eligibilityData, setEligibilityData] = useState<ReturnType<typeof getRationCardEligibility> | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<'otp' | 'delivery' | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    address: '',
    date: '',
    time: '',
    contact: user?.phone || '',
    notes: '',
  });
  const [otpPhone, setOtpPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyCard = async () => {
    if (!rationCard) {
      toast({ title: 'Error', description: 'Please enter ration card number', variant: 'destructive' });
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = getRationCardEligibility(rationCard.toUpperCase());
    setEligibilityData(result);
    setIsVerifying(false);
    setStep('eligibility');
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleServiceSelect = (type: 'otp' | 'delivery') => {
    setServiceType(type);
    if (type === 'otp') {
      setStep('otp_setup');
    } else {
      setStep('delivery');
    }
  };

  const handleSubmitOTPService = async () => {
    if (!otpPhone || otpPhone.length !== 10) {
      toast({ title: 'Error', description: 'Please enter a valid 10-digit phone number', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: language === 'en' ? 'OTP Service Enabled!' : 'OTP சேவை இயக்கப்பட்டது!',
      description: language === 'en' 
        ? 'OTP-based authentication has been set up successfully.' 
        : 'OTP அடிப்படையிலான அங்கீகாரம் வெற்றிகரமாக அமைக்கப்பட்டது.',
    });

    setStep('status');
  };

  const handleSubmitDeliveryRequest = async () => {
    if (!deliveryForm.address || !deliveryForm.date || !deliveryForm.time) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: language === 'en' ? 'Request Submitted!' : 'கோரிக்கை சமர்ப்பிக்கப்பட்டது!',
      description: language === 'en' 
        ? 'Your delivery request has been submitted successfully.' 
        : 'உங்கள் டெலிவரி கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.',
    });

    setStep('status');
  };

  const existingRequest = mockDeliveryRequests.find(r => r.userId === user?.id);

  return (
    <MainLayout title={t('elder.title')} showBack>
      <div className="space-y-4">
        {/* Header */}
        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold">{t('elder.title')}</h2>
                <p className="text-sm opacity-90">
                  {language === 'en' 
                    ? 'Special services for elderly & disabled'
                    : 'மூத்தோர் & ஊனமுற்றோருக்கான சிறப்பு சேவைகள்'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Enter Ration Card Number */}
        {step === 'input' && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">{t('elder.verification')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('rationCard.number')}</Label>
                <Input
                  value={rationCard}
                  onChange={(e) => setRationCard(e.target.value.toUpperCase())}
                  placeholder="TN123456789012"
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'en' 
                    ? 'Enter your ration card number to check eligibility for elder services'
                    : 'மூத்தோர் சேவைகளுக்கான தகுதியை சரிபார்க்க உங்கள் ரேஷன் கார்டு எண்ணை உள்ளிடவும்'}
                </p>
              </div>
              <Button className="w-full" onClick={handleVerifyCard} disabled={isVerifying}>
                {isVerifying ? t('common.loading') : (language === 'en' ? 'Check Eligibility' : 'தகுதியை சரிபார்க்கவும்')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Eligibility Result */}
        {step === 'eligibility' && eligibilityData && (
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              {!eligibilityData.eligible ? (
                // Not Eligible
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'en' ? 'No Elderly Members' : 'மூத்த உறுப்பினர்கள் இல்லை'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'en' 
                      ? `The ration card ${rationCard} does not have any elderly members (age 60+) registered. Elder services are only available for families with elderly or disabled members.`
                      : `ரேஷன் கார்டு ${rationCard} இல் 60+ வயதுடைய மூத்த உறுப்பினர்கள் எவரும் பதிவு செய்யப்படவில்லை.`}
                  </p>
                  <div className="p-4 bg-muted rounded-lg text-left mb-4">
                    <p className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'Card Holder' : 'கார்டு வைத்திருப்பவர்'}</p>
                    <p className="font-medium">{eligibilityData.cardHolderName}</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setStep('input')}>
                    {language === 'en' ? 'Try Different Card' : 'வேறு கார்டை முயற்சிக்கவும்'}
                  </Button>
                </div>
              ) : (
                // Eligible
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {language === 'en' 
                          ? `${eligibilityData.elderlyMembers.length} Elderly Members Found`
                          : `${eligibilityData.elderlyMembers.length} மூத்த உறுப்பினர்கள் கண்டறியப்பட்டனர்`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? 'Card Holder: ' : 'கார்டு வைத்திருப்பவர்: '}{eligibilityData.cardHolderName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Label>{language === 'en' ? 'Select Elderly Members' : 'மூத்த உறுப்பினர்களைத் தேர்ந்தெடுக்கவும்'}</Label>
                    {eligibilityData.elderlyMembers.map((member) => (
                      <div
                        key={member.id}
                        className={cn(
                          "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                          selectedMembers.includes(member.id) ? "border-primary bg-primary/5" : "hover:bg-muted"
                        )}
                        onClick={() => handleMemberToggle(member.id)}
                      >
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleMemberToggle(member.id)}
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.age} {language === 'en' ? 'years' : 'வயது'} • {member.relation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep('input')}>
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => setStep('service')}
                      disabled={selectedMembers.length === 0}
                    >
                      {language === 'en' ? 'Continue' : 'தொடரவும்'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Service Type */}
        {step === 'service' && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'Select Service Type' : 'சேவை வகையைத் தேர்ந்தெடுக்கவும்'}
            </h3>

            {/* OTP Service Card */}
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleServiceSelect('otp')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{t('elder.otpAuth')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Use OTP instead of biometric for ration collection'
                        : 'ரேஷன் சேகரிப்பிற்கு பயோமெட்ரிக்கிற்கு பதிலாக OTP பயன்படுத்தவும்'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Home Delivery Card */}
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleServiceSelect('delivery')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Truck className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{t('elder.homeDelivery')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Request home delivery for elderly or disabled members'
                        : 'மூத்த அல்லது ஊனமுற்ற உறுப்பினர்களுக்கு வீட்டு டெலிவரி கோரவும்'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={() => setStep('eligibility')}>
              {t('common.cancel')}
            </Button>
          </div>
        )}

        {/* Step 4a: OTP Setup Form */}
        {step === 'otp_setup' && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {language === 'en' ? 'Setup OTP Authentication' : 'OTP அங்கீகாரத்தை அமைக்கவும்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'Register a phone number to receive OTP during ration collection. This will replace biometric verification.'
                  : 'ரேஷன் சேகரிப்பின் போது OTP பெற ஒரு தொலைபேசி எண்ணை பதிவு செய்யுங்கள்.'}
              </p>

              <div className="space-y-2">
                <Label>{language === 'en' ? 'Phone Number for OTP' : 'OTP க்கான தொலைபேசி எண்'}</Label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-muted-foreground">
                    +91
                  </span>
                  <Input
                    type="tel"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="rounded-l-none"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Selected members for OTP service:'
                    : 'OTP சேவைக்குத் தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள்:'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eligibilityData?.elderlyMembers
                    .filter(m => selectedMembers.includes(m.id))
                    .map(m => (
                      <span key={m.id} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {m.name}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('service')}>
                  {t('common.cancel')}
                </Button>
                <Button className="flex-1" onClick={handleSubmitOTPService} disabled={isSubmitting}>
                  {isSubmitting ? t('common.loading') : (language === 'en' ? 'Enable OTP Service' : 'OTP சேவையை இயக்கு')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4b: Delivery Form */}
        {step === 'delivery' && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">{t('elder.homeDelivery')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('elder.address')} *</Label>
                <Textarea
                  value={deliveryForm.address}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                  placeholder={language === 'en' ? 'Enter complete address' : 'முழு முகவரியை உள்ளிடவும்'}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('elder.preferredDate')} *</Label>
                  <Input
                    type="date"
                    value={deliveryForm.date}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('elder.preferredTime')} *</Label>
                  <Input
                    type="time"
                    value={deliveryForm.time}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('elder.contact')} *</Label>
                <Input
                  type="tel"
                  value={deliveryForm.contact}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, contact: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label>{language === 'en' ? 'Additional Notes' : 'கூடுதல் குறிப்புகள்'}</Label>
                <Textarea
                  value={deliveryForm.notes}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                  placeholder={language === 'en' ? 'Any special instructions...' : 'ஏதேனும் சிறப்பு அறிவுறுத்தல்கள்...'}
                  rows={2}
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Delivery for elderly members:' : 'மூத்த உறுப்பினர்களுக்கான டெலிவரி:'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eligibilityData?.elderlyMembers
                    .filter(m => selectedMembers.includes(m.id))
                    .map(m => (
                      <span key={m.id} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {m.name}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('service')}>
                  {t('common.cancel')}
                </Button>
                <Button className="flex-1" onClick={handleSubmitDeliveryRequest} disabled={isSubmitting}>
                  {isSubmitting ? t('common.loading') : t('elder.submit')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Status */}
        {step === 'status' && (
          <Card className="animate-slide-up">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {serviceType === 'otp' 
                  ? (language === 'en' ? 'OTP Service Enabled!' : 'OTP சேவை இயக்கப்பட்டது!')
                  : (language === 'en' ? 'Request Submitted!' : 'கோரிக்கை சமர்ப்பிக்கப்பட்டது!')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {serviceType === 'otp'
                  ? (language === 'en' 
                      ? 'OTP authentication has been enabled for the selected elderly members.'
                      : 'தேர்ந்தெடுக்கப்பட்ட மூத்த உறுப்பினர்களுக்கு OTP அங்கீகாரம் இயக்கப்பட்டது.')
                  : (language === 'en' 
                      ? 'Your request has been submitted. You will be notified once approved.'
                      : 'உங்கள் கோரிக்கை சமர்ப்பிக்கப்பட்டது. அங்கீகரிக்கப்பட்டதும் உங்களுக்கு தெரிவிக்கப்படும்.')}
              </p>

              {serviceType === 'delivery' && existingRequest && (
                <div className="p-4 bg-muted rounded-lg text-left mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="font-medium">{t('elder.trackDelivery')}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">{existingRequest.status.replace('_', ' ')}</span>
                    </div>
                    {existingRequest.volunteerName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volunteer:</span>
                        <span className="font-medium">{existingRequest.volunteerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={() => navigate('/dashboard')}>
                {language === 'en' ? 'Back to Dashboard' : 'டாஷ்போர்டுக்கு திரும்பு'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ElderServicesPage;