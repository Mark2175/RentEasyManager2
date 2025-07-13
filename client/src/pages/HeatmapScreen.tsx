import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, MapPin, BarChart3 } from 'lucide-react';
import PropertyHeatmap from '@/components/PropertyHeatmap';
import AIRecommendationEngine from '@/components/AIRecommendationEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeatmapScreenProps {
  onNavigate: (screen: string) => void;
}

const HeatmapScreen: React.FC<HeatmapScreenProps> = ({ onNavigate }) => {
  const [selectedArea, setSelectedArea] = useState<string>('');

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('home')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Market Intelligence</h1>
                <p className="text-sm text-gray-600">AI-powered insights & trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="heatmap" className="space-y-4 mt-6">
            <PropertyHeatmap 
              onAreaSelect={handleAreaSelect}
              selectedArea={selectedArea}
            />
          </TabsContent>
          
          <TabsContent value="ai-recommendations" className="space-y-4 mt-6">
            <AIRecommendationEngine />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HeatmapScreen;