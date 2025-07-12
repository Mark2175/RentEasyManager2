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
  wishlist: any[];
  addToWishlist: (property: any) => void;
  removeFromWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
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
  const [wishlist, setWishlist] = useState<any[]>([]);

  const addToWishlist = (property: any) => {
    setWishlist(prev => [...prev, property]);
  };

  const removeFromWishlist = (propertyId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== propertyId));
  };

  const isInWishlist = (propertyId: string) => {
    return wishlist.some(p => p.id === propertyId);
  };

  const value = {
    selectedProperty,
    setSelectedProperty,
    showPropertyModal,
    setShowPropertyModal,
    searchFilters,
    setSearchFilters,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
