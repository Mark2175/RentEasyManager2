import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Star, TrendingUp, MapPin, Clock, Users, Zap, Target, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';

interface AIRecommendation {
  id: string;
  property: {
    id: string;
    title: string;
    area: string;
    city: string;
    rent: number;
    propertyType: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    sqft: number;
  // Mark added fields
   
    AptFloor: number;
    AptFacing: string;
    AptAge: number;
    AptFurnished: boolean;
    AptParking: boolean;
    AptBalcony: boolean;
    AptSecurity: boolean;
    AptPowerBackup: boolean;
    AptGym: boolean;
    AptClubHouse: boolean;
    AptSwimmingPool: boolean;
    AptKidsPlayArea: boolean;
    AptPetFriendly: boolean;
    AptMaintenance: number;
    AptDeposit: number;
    AptRent: number;
    AptRentNegotiable: boolean;
   
    // Mark added fields
    
    amenities: string[];
  };
  matchScore: number;
  reasons: string[];
  category: 'perfect_match' | 'trending' | 'budget_friendly' | 'location_based' | 'amenity_match';
  confidence: number;
  personalizedInsights: string[];
}

interface UserPreferences {
  budget: { min: number; max: number };
  preferredAreas: string[];
  propertyTypes: string[];
  amenities: string[];
  commute: { destination: string; maxTime: number };
  lifestyle: string[];
}

const AIRecommendationEngine: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<string>('recommendations');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLearning, setIsLearning] = useState(false);

  // Mock AI recommendations - in production, this would come from your AI service
  const recommendations: AIRecommendation[] = [
    {
      id: 'rec_1',
      property: {
        id: '1',
        title: 'Modern 2BHK in Koramangala',
        area: 'Koramangala',
        city: 'Bangalore',
        rent: 42000,
        propertyType: '2BHK',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        amenities: ['Parking', 'Gym', 'Security', 'Power Backup']
      },
      matchScore: 95,
      reasons: [
        'Perfect budget match within your ₹40K-₹45K range',
        'Located in your preferred area (Koramangala)',
        'Has all your must-have amenities',
        '15-minute commute to your workplace'
      ],
      category: 'perfect_match',
      confidence: 92,
      personalizedInsights: [
        'Based on your previous searches for 2BHK in IT corridor',
        'Matches your preference for modern amenities',
        'Similar to properties you bookmarked earlier'
      ]
    },
    {
      id: 'rec_2',
      property: {
        id: '2',
        title: 'Spacious 3BHK in HSR Layout',
        area: 'HSR Layout',
        city: 'Bangalore',
        rent: 38000,
        propertyType: '3BHK',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1400,
        amenities: ['Parking', 'Club House', 'Swimming Pool', 'Kids Play Area']
      },
      matchScore: 87,
      reasons: [
        'Great value - 3BHK within your 2BHK budget',
        'Family-friendly amenities match your profile',
        'Trending area with 15% price appreciation',
        'Near good schools and hospitals'
      ],
      category: 'trending',
      confidence: 85,
      personalizedInsights: [
        'Upgraded space recommendation based on your profile',
        'Popular among professionals in your age group',
        'Potential for good investment returns'
      ]
    },
    {
      id: 'rec_3',
      property: {
        id: '3',
        title: 'Budget-Friendly 2BHK in Marathahalli',
        area: 'Marathahalli',
        city: 'Bangalore',
        rent: 28000,
        propertyType: '2BHK',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1000,
        amenities: ['Parking', 'Security', 'Power Backup']
      },
      matchScore: 78,
      reasons: [
        'Save ₹14,000 per month compared to your budget',
        'Good IT corridor connectivity',
        'Basic amenities covered',
        'Emerging area with growth potential'
      ],
      category: 'budget_friendly',
      confidence: 82,
      personalizedInsights: [
        'Cost-effective option for budget-conscious users',
        'Good starter property in IT hub',
        'Savings can be invested in other priorities'
      ]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'perfect_match': return <Target className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'budget_friendly': return <Star className="h-4 w-4" />;
      case 'location_based': return <MapPin className="h-4 w-4" />;
      case 'amenity_match': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'perfect_match': return 'bg-green-100 text-green-800';
      case 'trending': return 'bg-blue-100 text-blue-800';
      case 'budget_friendly': return 'bg-yellow-100 text-yellow-800';
      case 'location_based': return 'bg-purple-100 text-purple-800';
      case 'amenity_match': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'perfect_match': return 'Perfect Match';
      case 'trending': return 'Trending';
      case 'budget_friendly': return 'Budget Friendly';
      case 'location_based': return 'Location Based';
      case 'amenity_match': return 'Amenity Match';
      default: return 'Recommended';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const simulateAILearning = () => {
    setIsLearning(true);
    setTimeout(() => {
      setIsLearning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-rent-accent" />
            AI Property Recommendations
            <Badge variant="outline" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">For You</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="preferences">My Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {recommendations.length} personalized recommendations based on your preferences
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateAILearning}
                  disabled={isLearning}
                >
                  {isLearning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rent-accent mr-2" />
                      Learning...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Refresh AI
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={rec.property.images[0]}
                          alt={rec.property.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{rec.property.title}</h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {rec.property.area}, {rec.property.city}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-rent-accent">
                                {formatCurrency(rec.property.rent)}/month
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-sm font-medium">{rec.matchScore}% match</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(rec.category)}>
                              {getCategoryIcon(rec.category)}
                              <span className="ml-1">{getCategoryLabel(rec.category)}</span>
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {rec.confidence}% confidence
                            </span>
                          </div>

                          <div className="mb-3">
                            <Progress value={rec.matchScore} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium mb-1">Why this matches you:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {rec.reasons.slice(0, 2).map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <div className="w-1 h-1 bg-rent-accent rounded-full mt-2" />
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" className="bg-rent-accent hover:bg-rent-accent/90">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Market Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Market Trends</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 2BHK properties in Koramangala are 12% more expensive than last month</li>
                        <li>• HSR Layout showing strong growth in family-friendly amenities</li>
                        <li>• IT corridor areas have 23% higher demand this quarter</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Personalized Insights</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Your budget aligns with 67% of available properties</li>
                        <li>• Properties with gyms are 89% likely to match your preferences</li>
                        <li>• You typically prefer newer constructions (under 5 years old)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendation Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>AI Accuracy Score</span>
                      <span className="font-semibold">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Properties Viewed</p>
                        <p className="text-gray-600">Based on AI recommendations: 73%</p>
                      </div>
                      <div>
                        <p className="font-medium">Booking Success</p>
                        <p className="text-gray-600">From AI recommendations: 45%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Budget Range</h4>
                      <p className="text-sm text-gray-600">₹35,000 - ₹45,000 per month</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Preferred Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Koramangala', 'HSR Layout', 'Indiranagar'].map(area => (
                          <Badge key={area} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Must-Have Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Parking', 'Gym', 'Security', 'Power Backup'].map(amenity => (
                          <Badge key={amenity} variant="outline">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Commute Preferences</h4>
                      <p className="text-sm text-gray-600">
                        Maximum 30 minutes to Electronic City
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Update AI Preferences
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendationEngine;