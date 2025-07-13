import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Property {
  id: string;
  propertyId: string;
  title: string;
  area: string;
  city: string;
  propertyType: string;
  rent: number;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: string;
  securityPersonAvailable?: boolean;
  images?: string[];
  amenities?: string[];
  landlordName?: string;
  brokerName?: string;
  brokerageFee?: number;
  description?: string;
  hasVirtualTour?: boolean;
  isAvailable?: boolean;
}

interface ComparisonContextType {
  comparisonProperties: Property[];
  isComparisonOpen: boolean;
  maxComparisonItems: number;
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
  openComparison: () => void;
  closeComparison: () => void;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const maxComparisonItems = 4; // Maximum 4 properties for comparison

  const addToComparison = (property: Property) => {
    setComparisonProperties(prev => {
      // Check if property is already in comparison
      if (prev.some(p => p.id === property.id)) {
        return prev;
      }
      
      // Check if we've reached the maximum
      if (prev.length >= maxComparisonItems) {
        return prev;
      }
      
      return [...prev, property];
    });
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const clearComparison = () => {
    setComparisonProperties([]);
  };

  const isInComparison = (propertyId: string) => {
    return comparisonProperties.some(p => p.id === propertyId);
  };

  const openComparison = () => {
    setIsComparisonOpen(true);
  };

  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  const canAddMore = comparisonProperties.length < maxComparisonItems;

  const value: ComparisonContextType = {
    comparisonProperties,
    isComparisonOpen,
    maxComparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    openComparison,
    closeComparison,
    canAddMore
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};