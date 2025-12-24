import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import OTPVerifyPage from "@/pages/auth/OTPVerifyPage";
import LinkRationCardPage from "@/pages/auth/LinkRationCardPage";
import VerifyRationCardPage from "@/pages/auth/VerifyRationCardPage";

// Citizen Pages
import DashboardPage from "@/pages/citizen/DashboardPage";
import FoodStocksPage from "@/pages/citizen/FoodStocksPage";
import VotingPage from "@/pages/citizen/VotingPage";
import RationDetailsPage from "@/pages/citizen/RationDetailsPage";
import ElderServicesPage from "@/pages/citizen/ElderServicesPage";
import NotificationsPage from "@/pages/citizen/NotificationsPage";
import ProfilePage from "@/pages/citizen/ProfilePage";

// Authority Pages
import AuthorityDashboardPage from "@/pages/authority/AuthorityDashboardPage";
import StockManagementPage from "@/pages/authority/StockManagementPage";
import DeliveryManagementPage from "@/pages/authority/DeliveryManagementPage";
import PurchaseAnalyticsPage from "@/pages/authority/PurchaseAnalyticsPage";
import StockOverviewPage from "@/pages/authority/StockOverviewPage";
import RedistributionPage from "@/pages/authority/RedistributionPage";
import OrderAnalysisPage from "@/pages/authority/OrderAnalysisPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'authority') {
      return <Navigate to="/authority/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/otp-verify" element={<PublicRoute><OTPVerifyPage /></PublicRoute>} />
      <Route path="/verify-ration-card" element={<VerifyRationCardPage />} />
      <Route path="/link-ration-card" element={<ProtectedRoute><LinkRationCardPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><DashboardPage /></ProtectedRoute>} />
      <Route path="/stocks" element={<ProtectedRoute allowedRoles={['citizen']}><FoodStocksPage /></ProtectedRoute>} />
      <Route path="/voting" element={<ProtectedRoute allowedRoles={['citizen']}><VotingPage /></ProtectedRoute>} />
      <Route path="/ration" element={<ProtectedRoute allowedRoles={['citizen']}><RationDetailsPage /></ProtectedRoute>} />
      <Route path="/elder-services" element={<ProtectedRoute allowedRoles={['citizen']}><ElderServicesPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['citizen']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/authority/dashboard" element={<ProtectedRoute allowedRoles={['authority']}><AuthorityDashboardPage /></ProtectedRoute>} />
      <Route path="/authority/stocks" element={<ProtectedRoute allowedRoles={['authority']}><StockManagementPage /></ProtectedRoute>} />
      <Route path="/authority/deliveries" element={<ProtectedRoute allowedRoles={['authority']}><DeliveryManagementPage /></ProtectedRoute>} />
      <Route path="/authority/purchase-analytics" element={<ProtectedRoute allowedRoles={['authority']}><PurchaseAnalyticsPage /></ProtectedRoute>} />
      <Route path="/authority/stock-overview" element={<ProtectedRoute allowedRoles={['authority']}><StockOverviewPage /></ProtectedRoute>} />
      <Route path="/authority/redistribution" element={<ProtectedRoute allowedRoles={['authority']}><RedistributionPage /></ProtectedRoute>} />
      <Route path="/authority/order-analysis" element={<ProtectedRoute allowedRoles={['authority']}><OrderAnalysisPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
