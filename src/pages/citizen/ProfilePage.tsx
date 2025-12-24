import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Camera,
  Pencil,
  Save,
  X,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    wardNumber: user?.wardNumber?.toString() || '1',
  });
  const [editErrors, setEditErrors] = useState<{ phone?: string; email?: string }>({});
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: language === 'en' ? 'Logged out' : 'வெளியேறினார்',
      description: language === 'en' ? 'You have been logged out successfully.' : 'நீங்கள் வெற்றிகரமாக வெளியேறிவிட்டீர்கள்.',
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStartEdit = () => {
    setEditForm({
      phone: user?.phone || '',
      email: user?.email || '',
      wardNumber: user?.wardNumber?.toString() || '1',
    });
    setEditErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditErrors({});
  };

  const handleSaveChanges = async () => {
    const errors: { phone?: string; email?: string } = {};
    
    if (!validatePhone(editForm.phone)) {
      errors.phone = language === 'en' ? 'Phone must be 10 digits' : 'தொலைபேசி 10 இலக்கங்கள் இருக்க வேண்டும்';
    }
    
    if (!validateEmail(editForm.email)) {
      errors.email = language === 'en' ? 'Invalid email format' : 'தவறான மின்னஞ்சல் வடிவம்';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: language === 'en' ? 'Profile updated successfully' : 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    });

    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    const errors: { current?: string; new?: string; confirm?: string } = {};

    if (!passwordForm.currentPassword) {
      errors.current = language === 'en' ? 'Current password is required' : 'தற்போதைய கடவுச்சொல் தேவை';
    }

    if (passwordForm.newPassword.length < 6) {
      errors.new = language === 'en' ? 'Password must be at least 6 characters' : 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirm = language === 'en' ? 'Passwords do not match' : 'கடவுச்சொற்கள் பொருந்தவில்லை';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: language === 'en' ? 'Password changed successfully' : 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது',
    });

    setShowPasswordDialog(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
  };

  const settingsItems = [
    {
      icon: Globe,
      label: t('common.language'),
      value: language === 'en' ? 'English' : 'தமிழ்',
      action: toggleLanguage,
      hasToggle: false,
    },
    {
      icon: isDarkMode ? Moon : Sun,
      label: t('common.theme'),
      value: isDarkMode ? (language === 'en' ? 'Dark' : 'இருண்ட') : (language === 'en' ? 'Light' : 'ஒளி'),
      action: toggleTheme,
      hasToggle: true,
      toggleValue: isDarkMode,
    },
    {
      icon: Bell,
      label: language === 'en' ? 'Notifications' : 'அறிவிப்புகள்',
      value: notificationsEnabled 
        ? (language === 'en' ? 'Enabled' : 'இயக்கப்பட்டது') 
        : (language === 'en' ? 'Disabled' : 'முடக்கப்பட்டது'),
      action: () => setNotificationsEnabled(!notificationsEnabled),
      hasToggle: true,
      toggleValue: notificationsEnabled,
    },
    {
      icon: Shield,
      label: language === 'en' ? 'Privacy Settings' : 'தனியுரிமை அமைப்புகள்',
      value: '',
      action: () => {},
      hasToggle: false,
      hasArrow: true,
    },
  ];

  // Generate ward options 1-100
  const wardOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profilePhoto} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.nameTamil}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {user?.cardType}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.taluk}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {language === 'en' ? 'Personal Details' : 'தனிப்பட்ட விவரங்கள்'}
              </CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleStartEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Edit Profile' : 'திருத்து'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                    <X className="w-4 h-4 mr-1" />
                    {t('common.cancel')}
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? t('common.loading') : (language === 'en' ? 'Save Changes' : 'சேமி')}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Phone */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Phone' : 'தொலைபேசி'}</p>
                {isEditing ? (
                  <div>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="9876543210"
                      className="h-8 mt-1"
                      maxLength={10}
                    />
                    {editErrors.phone && <p className="text-xs text-destructive mt-1">{editErrors.phone}</p>}
                  </div>
                ) : (
                  <p className="font-medium truncate">+91 {user?.phone || '-'}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Email' : 'மின்னஞ்சல்'}</p>
                {isEditing ? (
                  <div>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="email@example.com"
                      className="h-8 mt-1"
                    />
                    {editErrors.email && <p className="text-xs text-destructive mt-1">{editErrors.email}</p>}
                  </div>
                ) : (
                  <p className="font-medium truncate">{user?.email || '-'}</p>
                )}
              </div>
            </div>

            {/* Ward */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Ward' : 'வார்டு'}</p>
                {isEditing ? (
                  <Select
                    value={editForm.wardNumber}
                    onValueChange={(value) => setEditForm({ ...editForm, wardNumber: value })}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wardOptions.map((ward) => (
                        <SelectItem key={ward} value={ward.toString()}>
                          Ward {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium truncate">Ward {user?.wardNumber || '-'}</p>
                )}
              </div>
            </div>

            {/* Ration Card (Read Only) */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t('rationCard.number')}</p>
                <p className="font-medium truncate">{user?.rationCardNumber || '-'}</p>
              </div>
            </div>

            {/* Change Password Button */}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowPasswordDialog(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Change Password' : 'கடவுச்சொல்லை மாற்று'}
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('dashboard.settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={!item.hasToggle ? item.action : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
                  {item.hasToggle && (
                    <Switch
                      checked={item.toggleValue}
                      onCheckedChange={item.action}
                    />
                  )}
                  {item.hasArrow && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full animate-slide-up"
          style={{ animationDelay: '150ms' }}
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t('common.logout')}
        </Button>

        {/* Logout Confirmation */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'en' ? 'Confirm Logout' : 'வெளியேற்றத்தை உறுதிப்படுத்து'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'en' 
                  ? 'Are you sure you want to logout from your account?'
                  : 'உங்கள் கணக்கிலிருந்து வெளியேற விரும்புகிறீர்களா?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>{t('common.logout')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {language === 'en' ? 'Change Password' : 'கடவுச்சொல்லை மாற்று'}
              </DialogTitle>
              <DialogDescription>
                {language === 'en' 
                  ? 'Enter your current password and choose a new password.'
                  : 'உங்கள் தற்போதைய கடவுச்சொல்லை உள்ளிட்டு புதிய கடவுச்சொல்லைத் தேர்ந்தெடுக்கவும்.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === 'en' ? 'Current Password' : 'தற்போதைய கடவுச்சொல்'}</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                {passwordErrors.current && <p className="text-xs text-destructive">{passwordErrors.current}</p>}
              </div>
              <div className="space-y-2">
                <Label>{language === 'en' ? 'New Password' : 'புதிய கடவுச்சொல்'}</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                {passwordErrors.new && <p className="text-xs text-destructive">{passwordErrors.new}</p>}
              </div>
              <div className="space-y-2">
                <Label>{language === 'en' ? 'Confirm New Password' : 'புதிய கடவுச்சொல்லை உறுதிப்படுத்து'}</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                {passwordErrors.confirm && <p className="text-xs text-destructive">{passwordErrors.confirm}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={isSaving}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleChangePassword} disabled={isSaving}>
                {isSaving ? t('common.loading') : (language === 'en' ? 'Change Password' : 'மாற்று')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;