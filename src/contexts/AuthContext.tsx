import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, mockUsers, mockAuthority, mockVolunteer, simulateApiCall } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithOTP: (phone: string, otp: string) => Promise<boolean>;
  register: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<boolean>;
  linkRationCard: (cardNumber: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('ungal_ration_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 1000);
      
      let foundUser: User | null = null;
      
      if (role === 'authority') {
        // For demo, accept any authority login
        foundUser = mockAuthority;
      } else if (role === 'volunteer') {
        foundUser = mockVolunteer;
      } else {
        // Find citizen by phone
        foundUser = mockUsers.find(u => u.phone === phone) || mockUsers[0];
      }
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('ungal_ration_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOTP = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 1000);
      
      // For demo, accept OTP "123456"
      if (otp === '123456') {
        const foundUser = mockUsers.find(u => u.phone === phone) || mockUsers[0];
        setUser(foundUser);
        localStorage.setItem('ungal_ration_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 1000);
      // For demo, create a new user based on first mock user
      const newUser: User = {
        ...mockUsers[0],
        id: `user_${Date.now()}`,
        phone,
        rationCardNumber: undefined,
      };
      setUser(newUser);
      localStorage.setItem('ungal_ration_user', JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ungal_ration_user');
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    await simulateApiCall(null, 500);
    // In production, this would send actual OTP
    return true;
  };

  const linkRationCard = async (cardNumber: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 1000);
      
      // Find a user with this ration card (for demo)
      const foundUser = mockUsers.find(u => u.rationCardNumber === cardNumber);
      
      if (foundUser && user) {
        const updatedUser = { ...user, ...foundUser, id: user.id };
        setUser(updatedUser);
        localStorage.setItem('ungal_ration_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      // For demo, link with first user's data if card not found
      if (user) {
        const updatedUser = { ...user, ...mockUsers[0], id: user.id, rationCardNumber: cardNumber };
        setUser(updatedUser);
        localStorage.setItem('ungal_ration_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOTP,
        register,
        logout,
        sendOTP,
        linkRationCard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
