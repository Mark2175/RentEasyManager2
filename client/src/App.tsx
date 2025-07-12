import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import AuthScreen from "@/pages/AuthScreen";
import HomeScreen from "@/pages/HomeScreen";
import PropertiesScreen from "@/pages/PropertiesScreen";
import ServicesScreen from "@/pages/ServicesScreen";
import FDOfferScreen from "@/pages/FDOfferScreen";
import ProfileScreen from "@/pages/ProfileScreen";
import BottomNavigation from "@/components/BottomNavigation";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import { useUser } from "@/contexts/UserContext";

function AppContent() {
  const { user, loading } = useAuth();
  const { selectedProperty, showPropertyModal, setShowPropertyModal } = useUser();
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'properties':
        return <PropertiesScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'fd-offer':
        return <FDOfferScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rent-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rent-accent mx-auto mb-4"></div>
          <p className="text-rent-accent">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <PropertyDetailModal 
        property={selectedProperty}
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <UserProvider>
            <Toaster />
            <AppContent />
          </UserProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
