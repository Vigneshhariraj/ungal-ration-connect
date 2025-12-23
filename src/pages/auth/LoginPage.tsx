import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, User, Eye, EyeOff, Send, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, sendOTP } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleCitizenLogin = async () => {
    if (!phone) {
      toast({ title: 'Error', description: 'Please enter your phone number', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      if (password) {
        const success = await login(phone, password, 'citizen');
        if (success) {
          navigate('/dashboard');
        } else {
          toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
        }
      } else {
        const sent = await sendOTP(phone);
        if (sent) {
          setOtpSent(true);
          toast({ title: 'OTP Sent', description: 'Check your phone for OTP (Demo: 123456)' });
          navigate('/otp-verify', { state: { phone } });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!phone || !password || !confirmPassword) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (!termsAccepted) {
      toast({ title: 'Error', description: 'Please accept terms and conditions', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const success = await register(phone, password);
      if (success) {
        navigate('/link-ration-card');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorityLogin = async () => {
    if (!username || !password) {
      toast({ title: 'Error', description: 'Please enter username and password', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(username, password, 'authority');
      if (success) {
        navigate('/authority/dashboard');
      } else {
        toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">உR</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Ungal Ration</h1>
            <p className="text-xs text-muted-foreground">உங்கள் ரேஷன்</p>
          </div>
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
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-slide-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
              {language === 'en' ? 'Welcome' : 'வரவேற்கிறோம்'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Smart Ration Distribution System' 
                : 'ஸ்மார்ட் ரேஷன் விநியோக அமைப்பு'}
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="citizen" className="text-xs sm:text-sm">
                  {t('auth.citizenLogin')}
                </TabsTrigger>
                <TabsTrigger value="register" className="text-xs sm:text-sm">
                  {t('auth.newRegistration')}
                </TabsTrigger>
                <TabsTrigger value="authority" className="text-xs sm:text-sm">
                  {t('auth.authorityLogin')}
                </TabsTrigger>
              </TabsList>

              {/* Citizen Login */}
              <TabsContent value="citizen" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.phoneNumber')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCitizenLogin()}
                    disabled={isLoading || !phone}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {t('auth.sendOTP')}
                  </Button>
                  <button className="text-sm text-primary hover:underline">
                    {t('auth.forgotPassword')}
                  </button>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCitizenLogin}
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </Button>
              </TabsContent>

              {/* New Registration */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.phoneNumber')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.createPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.confirmPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    {t('auth.termsAgree')}
                  </label>
                </div>

                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.register')}
                </Button>
              </TabsContent>

              {/* Authority Login */}
              <TabsContent value="authority" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.username')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleAuthorityLogin}
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Demo: Enter any username/password to login as authority
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-muted-foreground border-t border-border bg-card">
        <p>© 2024 Tamil Nadu Civil Supplies Corporation</p>
        <p>தமிழ்நாடு சிவில் சப்ளைஸ் கார்ப்பரேஷன்</p>
      </footer>
    </div>
  );
};

export default LoginPage;
