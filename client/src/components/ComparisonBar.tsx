import React from 'react';
import { X, ArrowRightLeft, Home, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/contexts/ComparisonContext';

const ComparisonBar: React.FC = () => {
  const { 
    comparisonProperties, 
    removeFromComparison, 
    clearComparison, 
    openComparison,
    maxComparisonItems 
  } = useComparison();

  if (comparisonProperties.length === 0) {
    return null;
  }

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-rent-accent" />
              <span className="font-semibold text-gray-900">
                Compare Properties ({comparisonProperties.length}/{maxComparisonItems})
              </span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto">
              {comparisonProperties.map((property) => (
                <Card key={property.id} className="flex-shrink-0 p-2 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Home className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{property.title}</div>
                      <div className="text-xs text-gray-600 truncate">{property.area}</div>
                      <div className="text-xs font-semibold text-rent-accent">
                        {formatRent(property.rent)}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => removeFromComparison(property.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparison}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
            
            <Button
              onClick={openComparison}
              className="bg-rent-accent hover:bg-rent-accent/90"
              disabled={comparisonProperties.length < 2}
            >
              Compare Now
              {comparisonProperties.length < 2 && (
                <Badge variant="secondary" className="ml-2">
                  Min 2 required
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;