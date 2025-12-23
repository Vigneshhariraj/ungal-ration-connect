import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, MapPin, Calendar, Clock, User, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { mockDeliveryRequests } from '@/data/mockData';

const ElderServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState<'verification' | 'members' | 'service' | 'delivery' | 'status'>('verification');
  const [rationCard, setRationCard] = useState(user?.rationCardNumber || '');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<'otp' | 'delivery'>('delivery');
  const [deliveryForm, setDeliveryForm] = useState({
    address: '',
    date: '',
    time: '',
    contact: user?.phone || '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const familyMembers = user?.familyMembers || [];
  const elderlyMembers = familyMembers.filter(m => m.isElderly);

  const handleVerify = () => {
    if (!rationCard) {
      toast({ title: 'Error', description: 'Please enter ration card number', variant: 'destructive' });
      return;
    }
    setStep('members');
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSubmitRequest = async () => {
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

        {/* Step 1: Verification */}
        {step === 'verification' && (
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
              </div>
              <Button className="w-full" onClick={handleVerify}>
                {language === 'en' ? 'Verify & Continue' : 'சரிபார்த்து தொடரவும்'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Members */}
        {step === 'members' && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">{t('elder.selectMembers')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {elderlyMembers.length > 0 ? (
                <div className="space-y-3">
                  {elderlyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer"
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
                          {member.age} years • {member.relation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? 'No elderly members found in your family.'
                      : 'உங்கள் குடும்பத்தில் மூத்த உறுப்பினர்கள் இல்லை.'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('verification')}>
                  {t('common.cancel')}
                </Button>
                <Button className="flex-1" onClick={() => setStep('service')}>
                  {language === 'en' ? 'Continue' : 'தொடரவும்'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Service */}
        {step === 'service' && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'en' ? 'Select Service' : 'சேவையைத் தேர்ந்தெடுக்கவும்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={serviceType} onValueChange={(v) => setServiceType(v as 'otp' | 'delivery')}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setServiceType('otp')}>
                  <RadioGroupItem value="otp" id="otp" />
                  <div className="flex-1">
                    <Label htmlFor="otp" className="font-medium cursor-pointer">
                      {t('elder.otpAuth')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Use OTP instead of biometric verification'
                        : 'பயோமெட்ரிக் சரிபார்ப்புக்கு பதிலாக OTP பயன்படுத்தவும்'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setServiceType('delivery')}>
                  <RadioGroupItem value="delivery" id="delivery" />
                  <div className="flex-1">
                    <Label htmlFor="delivery" className="font-medium cursor-pointer">
                      {t('elder.homeDelivery')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Get ration delivered to your doorstep'
                        : 'உங்கள் வீட்டு வாசலில் ரேஷன் பெறுங்கள்'}
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('members')}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => serviceType === 'delivery' ? setStep('delivery') : setStep('status')}
                >
                  {language === 'en' ? 'Continue' : 'தொடரவும்'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Delivery Form */}
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

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('service')}>
                  {t('common.cancel')}
                </Button>
                <Button className="flex-1" onClick={handleSubmitRequest} disabled={isSubmitting}>
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
                {language === 'en' ? 'Request Submitted!' : 'கோரிக்கை சமர்ப்பிக்கப்பட்டது!'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'en' 
                  ? 'Your request has been submitted. You will be notified once approved.'
                  : 'உங்கள் கோரிக்கை சமர்ப்பிக்கப்பட்டது. அங்கீகரிக்கப்பட்டதும் உங்களுக்கு தெரிவிக்கப்படும்.'}
              </p>

              {existingRequest && (
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
