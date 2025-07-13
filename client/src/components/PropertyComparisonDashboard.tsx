import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, MapPin, Home, Bath, Bed, Square, Shield, Zap, Wifi, Car, Camera, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useComparison } from '@/contexts/ComparisonContext';

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

interface PropertyComparisonDashboardProps {
  properties: Property[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProperty: (propertyId: string) => void;
  onViewProperty: (property: Property) => void;
  onBookProperty: (property: Property) => void;
}

const PropertyComparisonDashboard: React.FC<PropertyComparisonDashboardProps> = ({
  properties,
  isOpen,
  onClose,
  onRemoveProperty,
  onViewProperty,
  onBookProperty
}) => {
  const { removeFromComparison } = useComparison();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Common comparison features
  const comparisonFeatures = [
    { key: 'rent', label: 'Monthly Rent', icon: '₹' },
    { key: 'sqft', label: 'Area (sq ft)', icon: Square },
    { key: 'bedrooms', label: 'Bedrooms', icon: Bed },
    { key: 'bathrooms', label: 'Bathrooms', icon: Bath },
    { key: 'floor', label: 'Floor', icon: Home },
    { key: 'securityPersonAvailable', label: 'Security', icon: Shield },
    { key: 'hasVirtualTour', label: 'Virtual Tour', icon: Camera },
    { key: 'brokerageFee', label: 'Brokerage Fee', icon: '₹' },
  ];

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  const formatValue = (feature: string, value: any) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (feature) {
      case 'rent':
        return formatRent(value);
      case 'sqft':
        return `${value} sq ft`;
      case 'securityPersonAvailable':
        return value ? 'Yes' : 'No';
      case 'hasVirtualTour':
        return value ? 'Available' : 'Not Available';
      case 'brokerageFee':
        return value ? formatRent(value) : 'Free';
      case 'floor':
        return value || 'N/A';
      default:
        return value?.toString() || 'N/A';
    }
  };

  const getBestValue = (feature: string, values: any[]) => {
    const validValues = values.filter(v => v !== null && v !== undefined);
    if (validValues.length === 0) return null;

    switch (feature) {
      case 'rent':
      case 'brokerageFee':
        return Math.min(...validValues);
      case 'sqft':
      case 'bedrooms':
      case 'bathrooms':
        return Math.max(...validValues);
      case 'securityPersonAvailable':
      case 'hasVirtualTour':
        return validValues.some(v => v === true);
      default:
        return null;
    }
  };

  const isBestValue = (feature: string, value: any, allValues: any[]) => {
    const best = getBestValue(feature, allValues);
    if (best === null) return false;
    
    switch (feature) {
      case 'rent':
      case 'brokerageFee':
        return value === best;
      case 'sqft':
      case 'bedrooms':
      case 'bathrooms':
        return value === best;
      case 'securityPersonAvailable':
      case 'hasVirtualTour':
        return value === true && best === true;
      default:
        return false;
    }
  };

  const getCommonAmenities = () => {
    if (properties.length === 0) return [];
    
    const allAmenities = properties.map(p => p.amenities || []);
    const common = allAmenities[0]?.filter(amenity => 
      allAmenities.every(propertyAmenities => propertyAmenities.includes(amenity))
    ) || [];
    
    return common;
  };

  const getUniqueAmenities = (property: Property) => {
    const commonAmenities = getCommonAmenities();
    return property.amenities?.filter(amenity => !commonAmenities.includes(amenity)) || [];
  };

  if (!isOpen) {
    return null;
  }

  if (properties.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No properties selected for comparison</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Property Comparison</h2>
            <p className="text-gray-600">Compare {properties.length} properties side by side</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Property Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {properties.map((property) => (
                <Card key={property.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => removeFromComparison(property.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {property.hasVirtualTour && (
                      <Badge className="absolute top-2 left-2 bg-blue-600">
                        <Camera className="h-3 w-3 mr-1" />
                        360° Tour
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg truncate">{property.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.area}, {property.city}
                      </div>
                    </div>

                    <div className="text-xl font-bold text-rent-accent mb-3">
                      {formatRent(property.rent)}/month
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => onViewProperty(property)}
                        variant="outline" 
                        className="w-full"
                      >
                        View Details
                      </Button>
                      <Button 
                        onClick={() => onBookProperty(property)}
                        className="w-full bg-rent-accent hover:bg-rent-accent/90"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Feature</th>
                        {properties.map((property) => (
                          <th key={property.id} className="text-center p-3 font-semibold min-w-[200px]">
                            <div className="truncate">{property.title}</div>
                            <div className="text-sm font-normal text-gray-600">
                              {property.propertyId}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((feature) => {
                        const allValues = properties.map(p => p[feature.key as keyof Property]);
                        
                        return (
                          <tr key={feature.key} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium flex items-center gap-2">
                              {typeof feature.icon === 'string' ? (
                                <span className="text-rent-accent font-bold">{feature.icon}</span>
                              ) : (
                                <feature.icon className="h-4 w-4 text-rent-accent" />
                              )}
                              {feature.label}
                            </td>
                            {properties.map((property, index) => {
                              const value = property[feature.key as keyof Property];
                              const isHighlighted = isBestValue(feature.key, value, allValues);
                              
                              return (
                                <td key={property.id} className="p-3 text-center">
                                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                                    isHighlighted 
                                      ? 'bg-green-100 text-green-800 font-semibold' 
                                      : 'text-gray-700'
                                  }`}>
                                    {isHighlighted && <Check className="h-3 w-3" />}
                                    {formatValue(feature.key, value)}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Comparison */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Amenities Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {getCommonAmenities().length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-700 mb-2">Common Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {getCommonAmenities().map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {properties.map((property) => {
                    const uniqueAmenities = getUniqueAmenities(property);
                    
                    return (
                      <div key={property.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 truncate">{property.title}</h4>
                        {uniqueAmenities.length > 0 ? (
                          <div className="space-y-1">
                            {uniqueAmenities.map((amenity) => (
                              <div key={amenity} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-rent-accent rounded-full"></div>
                                {amenity}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No unique amenities</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyComparisonDashboard;