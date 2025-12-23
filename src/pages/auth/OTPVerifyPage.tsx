import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const OTPVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOTP, sendOTP } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const phone = location.state?.phone || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when complete
    if (newOtp.every(digit => digit) && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 6) {
      toast({ title: 'Error', description: 'Please enter complete OTP', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginWithOTP(phone, code);
      if (success) {
        toast({ title: 'Success', description: 'OTP verified successfully!' });
        navigate('/dashboard');
      } else {
        toast({ title: 'Error', description: 'Invalid OTP. Try: 123456', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(30);
    await sendOTP(phone);
    toast({ title: 'OTP Sent', description: 'New OTP has been sent to your phone' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-lg">{t('auth.verifyOTP')}</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('auth.enterOTP')}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-foreground">+91 {phone}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              ))}
            </div>

            {/* Resend */}
            <div className="text-center">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('auth.resendOTP')}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in <span className="font-medium text-primary">{countdown}s</span>
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              className="w-full"
              onClick={() => handleVerify()}
              disabled={isLoading || otp.some(d => !d)}
            >
              {isLoading ? t('common.loading') : t('auth.verifyOTP')}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo OTP: <span className="font-mono font-medium">123456</span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OTPVerifyPage;
