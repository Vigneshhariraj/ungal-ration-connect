import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

const translations: Translations = {
  // Auth
  'auth.citizenLogin': { en: 'Citizen Login', ta: 'குடிமக்கள் உள்நுழைவு' },
  'auth.newRegistration': { en: 'New Registration', ta: 'புதிய பதிவு' },
  'auth.authorityLogin': { en: 'Authority Login', ta: 'அதிகாரி உள்நுழைவு' },
  'auth.phoneNumber': { en: 'Phone Number', ta: 'தொலைபேசி எண்' },
  'auth.password': { en: 'Password', ta: 'கடவுச்சொல்' },
  'auth.sendOTP': { en: 'Send OTP', ta: 'OTP அனுப்பு' },
  'auth.login': { en: 'Login', ta: 'உள்நுழை' },
  'auth.register': { en: 'Register', ta: 'பதிவு செய்' },
  'auth.forgotPassword': { en: 'Forgot Password?', ta: 'கடவுச்சொல் மறந்துவிட்டதா?' },
  'auth.createPassword': { en: 'Create Password', ta: 'கடவுச்சொல் உருவாக்கு' },
  'auth.confirmPassword': { en: 'Confirm Password', ta: 'கடவுச்சொல் உறுதிப்படுத்து' },
  'auth.username': { en: 'Username', ta: 'பயனர்பெயர்' },
  'auth.enterOTP': { en: 'Enter OTP', ta: 'OTP உள்ளிடுக' },
  'auth.verifyOTP': { en: 'Verify OTP', ta: 'OTP சரிபார்' },
  'auth.resendOTP': { en: 'Resend OTP', ta: 'OTP மீண்டும் அனுப்பு' },
  'auth.termsAgree': { en: 'I agree to the Terms and Conditions', ta: 'நான் விதிமுறைகளை ஏற்கிறேன்' },
  
  // Navigation
  'nav.home': { en: 'Home', ta: 'முகப்பு' },
  'nav.stocks': { en: 'Stocks', ta: 'கையிருப்பு' },
  'nav.voting': { en: 'Voting', ta: 'வாக்களிப்பு' },
  'nav.ration': { en: 'Ration', ta: 'ரேஷன்' },
  'nav.profile': { en: 'Profile', ta: 'சுயவிவரம்' },
  
  // Dashboard
  'dashboard.welcome': { en: 'Welcome', ta: 'வரவேற்கிறோம்' },
  'dashboard.nextRation': { en: 'Next Ration', ta: 'அடுத்த ரேஷன்' },
  'dashboard.itemsSelected': { en: 'Items Selected', ta: 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்' },
  'dashboard.pendingVotes': { en: 'Pending Votes', ta: 'நிலுவையில் உள்ள வாக்குகள்' },
  'dashboard.foodStocks': { en: 'Food Stocks Available', ta: 'கிடைக்கும் உணவு பொருட்கள்' },
  'dashboard.votingSystem': { en: 'Voting System', ta: 'வாக்களிப்பு முறை' },
  'dashboard.nextRationDetails': { en: 'Next Ration Details', ta: 'அடுத்த ரேஷன் விவரங்கள்' },
  'dashboard.elderServices': { en: 'Elder Services', ta: 'மூத்தோர் சேவைகள்' },
  'dashboard.notifications': { en: 'Notifications', ta: 'அறிவிப்புகள்' },
  'dashboard.settings': { en: 'Settings', ta: 'அமைப்புகள்' },
  
  // Ration Card
  'rationCard.link': { en: 'Link Ration Card', ta: 'ரேஷன் கார்டை இணைக்கவும்' },
  'rationCard.number': { en: 'Ration Card Number', ta: 'ரேஷன் கார்டு எண்' },
  'rationCard.holder': { en: 'Card Holder Name', ta: 'கார்டுதாரர் பெயர்' },
  'rationCard.familyMembers': { en: 'Family Members', ta: 'குடும்பத்தினர்' },
  'rationCard.taluk': { en: 'Taluk', ta: 'தாலுகா' },
  'rationCard.area': { en: 'Area', ta: 'பகுதி' },
  'rationCard.lastRation': { en: 'Last Ration Date', ta: 'கடைசி ரேஷன் தேதி' },
  'rationCard.nextRation': { en: 'Next Ration Due', ta: 'அடுத்த ரேஷன் தேதி' },
  'rationCard.confirm': { en: 'Confirm Linking', ta: 'இணைப்பை உறுதிப்படுத்து' },
  
  // Food Stocks
  'stocks.title': { en: 'Food Stocks Available', ta: 'கிடைக்கும் உணவு பொருட்கள்' },
  'stocks.itemNumber': { en: '#', ta: '#' },
  'stocks.itemName': { en: 'Item Name', ta: 'பொருள் பெயர்' },
  'stocks.total': { en: 'Total (kg/L)', ta: 'மொத்தம்' },
  'stocks.distributed': { en: 'Distributed', ta: 'விநியோகிக்கப்பட்டது' },
  'stocks.available': { en: 'Available', ta: 'கிடைக்கும்' },
  'stocks.voteStatus': { en: 'Vote Status', ta: 'வாக்கு நிலை' },
  'stocks.filterAll': { en: 'All Items', ta: 'அனைத்து பொருட்கள்' },
  'stocks.filterVoted': { en: 'Voted', ta: 'வாக்களித்தது' },
  'stocks.filterNotVoted': { en: 'Not Voted', ta: 'வாக்களிக்கவில்லை' },
  
  // Voting
  'voting.title': { en: 'Vote for Ration Items', ta: 'ரேஷன் பொருட்களுக்கு வாக்களிக்கவும்' },
  'voting.deadline': { en: 'Voting Deadline', ta: 'வாக்களிப்பு காலக்கெடு' },
  'voting.vote': { en: 'Vote', ta: 'வாக்களி' },
  'voting.voted': { en: 'Voted', ta: 'வாக்களித்தது' },
  'voting.myVotes': { en: 'My Votes', ta: 'எனது வாக்குகள்' },
  'voting.totalVotes': { en: 'Total Votes', ta: 'மொத்த வாக்குகள்' },
  'voting.confirmVote': { en: 'Confirm Vote', ta: 'வாக்கை உறுதிப்படுத்து' },
  'voting.confirmMessage': { en: 'Are you sure you want to vote for this item?', ta: 'இந்த பொருளுக்கு வாக்களிக்க விரும்புகிறீர்களா?' },
  
  // Elder Services
  'elder.title': { en: 'Elder Services', ta: 'மூத்தோர் சேவைகள்' },
  'elder.verification': { en: 'Verification', ta: 'சரிபார்ப்பு' },
  'elder.selectMembers': { en: 'Select Family Members', ta: 'குடும்பத்தினரைத் தேர்ந்தெடுக்கவும்' },
  'elder.otpAuth': { en: 'OTP-based Authentication', ta: 'OTP அடிப்படையிலான அங்கீகாரம்' },
  'elder.homeDelivery': { en: 'Home Delivery Request', ta: 'வீட்டு டெலிவரி கோரிக்கை' },
  'elder.address': { en: 'Delivery Address', ta: 'டெலிவரி முகவரி' },
  'elder.preferredDate': { en: 'Preferred Date', ta: 'விருப்பமான தேதி' },
  'elder.preferredTime': { en: 'Preferred Time', ta: 'விருப்பமான நேரம்' },
  'elder.contact': { en: 'Contact Number', ta: 'தொடர்பு எண்' },
  'elder.submit': { en: 'Submit Request', ta: 'கோரிக்கையை சமர்ப்பிக்கவும்' },
  'elder.trackDelivery': { en: 'Track Delivery', ta: 'டெலிவரியை கண்காணிக்கவும்' },
  
  // Common
  'common.search': { en: 'Search', ta: 'தேடல்' },
  'common.filter': { en: 'Filter', ta: 'வடிகட்டு' },
  'common.cancel': { en: 'Cancel', ta: 'ரத்து செய்' },
  'common.confirm': { en: 'Confirm', ta: 'உறுதிப்படுத்து' },
  'common.submit': { en: 'Submit', ta: 'சமர்ப்பி' },
  'common.save': { en: 'Save', ta: 'சேமி' },
  'common.loading': { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
  'common.error': { en: 'Error', ta: 'பிழை' },
  'common.success': { en: 'Success', ta: 'வெற்றி' },
  'common.retry': { en: 'Retry', ta: 'மீண்டும் முயற்சிக்கவும்' },
  'common.noData': { en: 'No data available', ta: 'தரவு இல்லை' },
  'common.downloadReceipt': { en: 'Download Receipt', ta: 'ரசீதை பதிவிறக்கு' },
  'common.logout': { en: 'Logout', ta: 'வெளியேறு' },
  'common.language': { en: 'Language', ta: 'மொழி' },
  'common.theme': { en: 'Theme', ta: 'தீம்' },
  
  // Authority
  'authority.dashboard': { en: 'Authority Dashboard', ta: 'அதிகாரி டாஷ்போர்டு' },
  'authority.totalBeneficiaries': { en: 'Total Beneficiaries', ta: 'மொத்த பயனாளிகள்' },
  'authority.stockLevels': { en: 'Stock Levels', ta: 'கையிருப்பு நிலை' },
  'authority.pendingDeliveries': { en: 'Pending Deliveries', ta: 'நிலுவையில் உள்ள டெலிவரிகள்' },
  'authority.activeVotes': { en: 'Active Votes', ta: 'செயலில் உள்ள வாக்குகள்' },
  'authority.stockManagement': { en: 'Stock Management', ta: 'கையிருப்பு நிர்வாகம்' },
  'authority.deliveryManagement': { en: 'Delivery Management', ta: 'டெலிவரி நிர்வாகம்' },
  'authority.redistribution': { en: 'Redistribution', ta: 'மறுவிநியோகம்' },
  'authority.analytics': { en: 'Analytics & Reports', ta: 'பகுப்பாய்வு & அறிக்கைகள்' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('ungal_ration_lang');
    return (stored as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ungal_ration_lang', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
