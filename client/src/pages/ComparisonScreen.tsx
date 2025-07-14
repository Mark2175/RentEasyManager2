import React from 'react';
import { ArrowLeft, X, MapPin, Bed, Bath, Square, DollarSign, Shield, Building, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/contexts/ComparisonContext';

interface ComparisonScreenProps {
  onNavigate: (screen: string) => void;
}

const ComparisonScreen: React.FC<ComparisonScreenProps> = ({ onNavigate }) => {
  const { comparisonProperties, removeFromComparison, clearComparison } = useComparison();

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  const getComparisonMetrics = () => {
    if (comparisonProperties.length === 0) return null;
    
    const rents = comparisonProperties.map(p => p.rent);
    const sqfts = comparisonProperties.map(p => p.sqft || 0);
    const bedrooms = comparisonProperties.map(p => p.bedrooms || 0);
    
    return {
      avgRent: rents.reduce((a, b) => a + b, 0) / rents.length,
      minRent: Math.min(...rents),
      maxRent: Math.max(...rents),
      avgSqft: sqfts.reduce((a, b) => a + b, 0) / sqfts.length,
      avgBedrooms: bedrooms.reduce((a, b) => a + b, 0) / bedrooms.length,
    };
  };

  const metrics = getComparisonMetrics();

  if (comparisonProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Property Comparison</h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Properties to Compare</h2>
            <p className="text-gray-500 mb-4">Add properties to your comparison list to see them here</p>
            <Button onClick={() => onNavigate('properties')}>
              Browse Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Property Comparison</h1>
            <Badge variant="outline">{comparisonProperties.length} Properties</Badge>
          </div>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={clearComparison}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Comparison Summary */}
        {metrics && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Average Rent:</span>
                  <span className="font-semibold ml-2">{formatRent(metrics.avgRent)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price Range:</span>
                  <span className="font-semibold ml-2">{formatRent(metrics.minRent)} - {formatRent(metrics.maxRent)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Average Area:</span>
                  <span className="font-semibold ml-2">{Math.round(metrics.avgSqft)} sq ft</span>
                </div>
                <div>
                  <span className="text-gray-600">Average Bedrooms:</span>
                  <span className="font-semibold ml-2">{metrics.avgBedrooms.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisonProperties.map((property) => (
            <Card key={property.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                onClick={() => removeFromComparison(property.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant={property.isAvailable ? "default" : "secondary"} className="bg-green-100 text-green-800">
                      {property.isAvailable ? "Available" : "Occupied"}
                    </Badge>
                    {property.hasVirtualTour && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Virtual Tour
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-rent-accent">{formatRent(property.rent)}</p>
                      <p className="text-sm text-gray-500">/month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.area}, {property.city}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{property.bedrooms} Bed</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{property.bathrooms} Bath</span>
                      </div>
                    )}
                    {property.sqft && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{property.sqft} sq ft</span>
                      </div>
                    )}
                  </div>
                  
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-1">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Book Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonScreen;