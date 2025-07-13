import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, TrendingUp, TrendingDown, Calendar, Filter, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface HeatmapData {
  area: string;
  averageRent: number;
  priceChange: number;
  propertyCount: number;
  demandLevel: 'high' | 'medium' | 'low';
  coordinates: [number, number];
  popularPropertyTypes: string[];
  amenitiesInDemand: string[];
}

interface PropertyHeatmapProps {
  onAreaSelect?: (area: string) => void;
  selectedArea?: string;
}

const PropertyHeatmap: React.FC<PropertyHeatmapProps> = ({ onAreaSelect, selectedArea }) => {
  const [viewMode, setViewMode] = useState<'rent' | 'demand' | 'growth'>('rent');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [timeFrame, setTimeFrame] = useState<string>('30d');

  // Mock heatmap data - in production, this would come from your backend
  const heatmapData: HeatmapData[] = [
    {
      area: "Koramangala",
      averageRent: 45000,
      priceChange: 8.5,
      propertyCount: 124,
      demandLevel: 'high',
      coordinates: [12.9352, 77.6245],
      popularPropertyTypes: ['2BHK', '3BHK'],
      amenitiesInDemand: ['Parking', 'Gym', 'Security']
    },
    {
      area: "Indiranagar",
      averageRent: 38000,
      priceChange: 5.2,
      propertyCount: 89,
      demandLevel: 'high',
      coordinates: [12.9784, 77.6408],
      popularPropertyTypes: ['2BHK', '1BHK'],
      amenitiesInDemand: ['Metro Access', 'Restaurants', 'Shopping']
    },
    {
      area: "Whitefield",
      averageRent: 28000,
      priceChange: 12.3,
      propertyCount: 156,
      demandLevel: 'high',
      coordinates: [12.9698, 77.7500],
      popularPropertyTypes: ['2BHK', '3BHK'],
      amenitiesInDemand: ['IT Park Access', 'Schools', 'Hospitals']
    },
    {
      area: "HSR Layout",
      averageRent: 35000,
      priceChange: 6.8,
      propertyCount: 98,
      demandLevel: 'medium',
      coordinates: [12.9116, 77.6460],
      popularPropertyTypes: ['2BHK', '3BHK'],
      amenitiesInDemand: ['Parks', 'Restaurants', 'Shopping']
    },
    {
      area: "Marathahalli",
      averageRent: 25000,
      priceChange: 15.2,
      propertyCount: 187,
      demandLevel: 'high',
      coordinates: [12.9591, 77.6974],
      popularPropertyTypes: ['1BHK', '2BHK'],
      amenitiesInDemand: ['IT Companies', 'Bus Connectivity', 'Affordable']
    },
    {
      area: "Jayanagar",
      averageRent: 32000,
      priceChange: 3.1,
      propertyCount: 67,
      demandLevel: 'medium',
      coordinates: [12.9279, 77.5619],
      popularPropertyTypes: ['2BHK', '3BHK'],
      amenitiesInDemand: ['Traditional Markets', 'Temples', 'Parks']
    },
    {
      area: "Electronic City",
      averageRent: 22000,
      priceChange: 18.5,
      propertyCount: 203,
      demandLevel: 'high',
      coordinates: [12.8458, 77.6603],
      popularPropertyTypes: ['1BHK', '2BHK'],
      amenitiesInDemand: ['IT Parks', 'Metro', 'Affordable Housing']
    },
    {
      area: "Rajajinagar",
      averageRent: 30000,
      priceChange: 2.8,
      propertyCount: 54,
      demandLevel: 'low',
      coordinates: [12.9991, 77.5552],
      popularPropertyTypes: ['2BHK', '3BHK'],
      amenitiesInDemand: ['Metro Access', 'Markets', 'Hospitals']
    }
  ];

  const getColorForValue = (value: number, metric: string): string => {
    switch (metric) {
      case 'rent':
        if (value > 40000) return 'bg-red-500';
        if (value > 30000) return 'bg-orange-500';
        if (value > 25000) return 'bg-yellow-500';
        return 'bg-green-500';
      case 'demand':
        return value === 'high' ? 'bg-red-500' : value === 'medium' ? 'bg-orange-500' : 'bg-green-500';
      case 'growth':
        if (value > 10) return 'bg-green-500';
        if (value > 5) return 'bg-yellow-500';
        if (value > 0) return 'bg-orange-500';
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredData = useMemo(() => {
    return heatmapData.filter(item => {
      if (propertyType === 'all') return true;
      return item.popularPropertyTypes.includes(propertyType);
    });
  }, [propertyType]);

  const getMetricValue = (area: HeatmapData, metric: string) => {
    switch (metric) {
      case 'rent':
        return area.averageRent;
      case 'demand':
        return area.demandLevel;
      case 'growth':
        return area.priceChange;
      default:
        return 0;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rent-accent" />
            Bangalore Property Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <TabsList>
                <TabsTrigger value="rent">Rent Prices</TabsTrigger>
                <TabsTrigger value="demand">Demand</TabsTrigger>
                <TabsTrigger value="growth">Growth</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="1BHK">1BHK</SelectItem>
                <SelectItem value="2BHK">2BHK</SelectItem>
                <SelectItem value="3BHK">3BHK</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {filteredData.map((area) => (
              <Card
                key={area.area}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedArea === area.area ? 'ring-2 ring-rent-accent' : ''
                }`}
                onClick={() => onAreaSelect?.(area.area)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{area.area}</h3>
                    <div
                      className={`w-4 h-4 rounded-full ${getColorForValue(
                        getMetricValue(area, viewMode),
                        viewMode
                      )}`}
                    />
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    {viewMode === 'rent' && (
                      <p className="font-medium">{formatCurrency(area.averageRent)}</p>
                    )}
                    {viewMode === 'demand' && (
                      <p className="font-medium capitalize">{area.demandLevel} Demand</p>
                    )}
                    {viewMode === 'growth' && (
                      <p className="font-medium flex items-center gap-1">
                        {area.priceChange > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        {area.priceChange.toFixed(1)}%
                      </p>
                    )}
                    <p className="text-gray-600">{area.propertyCount} properties</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>
                {viewMode === 'rent' && 'Low (< ₹25K)'}
                {viewMode === 'demand' && 'Low Demand'}
                {viewMode === 'growth' && 'High Growth (>10%)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span>
                {viewMode === 'rent' && 'Medium (₹25K-₹40K)'}
                {viewMode === 'demand' && 'Medium Demand'}
                {viewMode === 'growth' && 'Medium Growth (0-10%)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>
                {viewMode === 'rent' && 'High (> ₹40K)'}
                {viewMode === 'demand' && 'High Demand'}
                {viewMode === 'growth' && 'Negative Growth'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area Details */}
      {selectedArea && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-rent-accent" />
              {selectedArea} - Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const areaData = heatmapData.find(area => area.area === selectedArea);
              if (!areaData) return null;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Market Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Average Rent:</span>
                        <span className="font-medium">{formatCurrency(areaData.averageRent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Change:</span>
                        <span className={`font-medium ${areaData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {areaData.priceChange > 0 ? '+' : ''}{areaData.priceChange.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Properties:</span>
                        <span className="font-medium">{areaData.propertyCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Demand Level:</span>
                        <Badge variant={areaData.demandLevel === 'high' ? 'destructive' : 'secondary'}>
                          {areaData.demandLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Popular Features</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Property Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {areaData.popularPropertyTypes.map(type => (
                            <Badge key={type} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">In-Demand Amenities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {areaData.amenitiesInDemand.map(amenity => (
                            <Badge key={amenity} variant="outline">{amenity}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyHeatmap;