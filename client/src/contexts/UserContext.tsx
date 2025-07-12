import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  selectedProperty: any;
  setSelectedProperty: (property: any) => void;
  showPropertyModal: boolean;
  setShowPropertyModal: (show: boolean) => void;
  searchFilters: {
    area: string;
    propertyType: string;
    minRent: number;
    maxRent: number;
  };
  setSearchFilters: (filters: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    area: '',
    propertyType: '',
    minRent: 0,
    maxRent: 100000,
  });

  const value = {
    selectedProperty,
    setSelectedProperty,
    showPropertyModal,
    setShowPropertyModal,
    searchFilters,
    setSearchFilters,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
