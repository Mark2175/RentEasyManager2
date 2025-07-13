import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Volume2, 
  VolumeX,
  Camera,
  MapPin,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Home,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Shield,
  Zap
} from 'lucide-react';

interface VirtualTourRoom {
  id: string;
  name: string;
  type: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony' | 'other';
  thumbnail: string;
  panoramaUrl: string;
  description: string;
  highlights: string[];
  dimensions?: string;
}

interface VirtualTourData {
  propertyId: string;
  title: string;
  totalRooms: number;
  duration: string;
  viewCount: number;
  rooms: VirtualTourRoom[];
  propertyDetails: {
    area: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    amenities: string[];
  };
}

interface VirtualTourIntegrationProps {
  propertyId: string;
  onClose?: () => void;
  onBookProperty?: () => void;
}

const VirtualTourIntegration: React.FC<VirtualTourIntegrationProps> = ({
  propertyId,
  onClose,
  onBookProperty
}) => {
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const tourRef = useRef<HTMLDivElement>(null);

  // Mock virtual tour data - in production, this would come from your backend
  const tourData: VirtualTourData = {
    propertyId: propertyId,
    title: 'Modern 2BHK Apartment in Koramangala',
    totalRooms: 5,
    duration: '8:30',
    viewCount: 1247,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        type: 'living',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        panoramaUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        description: 'Spacious living room with modern furniture and city view',
        highlights: ['City View', 'Modern Furniture', 'Air Conditioning', 'LED TV'],
        dimensions: '15\' x 18\''
      },
      {
        id: 'master-bedroom',
        name: 'Master Bedroom',
        type: 'bedroom',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
        panoramaUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        description: 'Comfortable master bedroom with attached bathroom',
        highlights: ['King Size Bed', 'Wardrobe', 'Attached Bathroom', 'Balcony Access'],
        dimensions: '12\' x 14\''
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        type: 'kitchen',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
        panoramaUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        description: 'Modern modular kitchen with all appliances',
        highlights: ['Modular Kitchen', 'Refrigerator', 'Microwave', 'Chimney'],
        dimensions: '8\' x 10\''
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        type: 'bathroom',
        thumbnail: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=200&fit=crop',
        panoramaUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
        description: 'Modern bathroom with premium fixtures',
        highlights: ['Hot Water', 'Modern Fixtures', 'Ventilation', 'Storage'],
        dimensions: '6\' x 8\''
      },
      {
        id: 'balcony',
        name: 'Balcony',
        type: 'balcony',
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
        panoramaUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        description: 'Spacious balcony with garden view',
        highlights: ['Garden View', 'Morning Sun', 'Seating Area', 'Plants'],
        dimensions: '4\' x 12\''
      }
    ],
    propertyDetails: {
      area: 'Koramangala',
      rent: 45000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      amenities: ['Parking', 'Gym', 'Security', 'Power Backup', 'Wifi', 'Swimming Pool']
    }
  };

  useEffect(() => {
    if (tourData.rooms.length > 0 && !activeRoom) {
      setActiveRoom(tourData.rooms[0].id);
    }
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const currentRoom = tourData.rooms.find(room => room.id === activeRoom);

  const handleRoomChange = (roomId: string) => {
    setActiveRoom(roomId);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (tourRef.current) {
      if (!isFullscreen) {
        tourRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'living': return <Home className="h-4 w-4" />;
      case 'bedroom': return <Bed className="h-4 w-4" />;
      case 'kitchen': return <Square className="h-4 w-4" />;
      case 'bathroom': return <Bath className="h-4 w-4" />;
      case 'balcony': return <Eye className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rent-accent mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">Loading Virtual Tour...</p>
            <p className="text-sm text-gray-600">Preparing immersive experience</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-bold text-lg">{tourData.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {tourData.propertyDetails.area}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tourData.duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {tourData.viewCount.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button 
            size="sm" 
            className="bg-rent-accent hover:bg-rent-accent/90"
            onClick={onBookProperty}
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Virtual Tour Viewer */}
        <div className="flex-1 relative bg-gray-900" ref={tourRef}>
          {currentRoom && (
            <div className="relative w-full h-full">
              <img
                src={currentRoom.panoramaUrl}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
              
              {/* Tour Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    
                    <span className="text-white text-sm">
                      {currentRoom.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handleFullscreen}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-300 h-1 rounded-full">
                  <div 
                    className="bg-rent-accent h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / totalTime) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms" className="space-y-4 p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Tour Rooms ({tourData.totalRooms})</h3>
                <div className="space-y-2">
                  {tourData.rooms.map((room) => (
                    <Card 
                      key={room.id}
                      className={`cursor-pointer transition-all ${
                        activeRoom === room.id ? 'ring-2 ring-rent-accent' : ''
                      }`}
                      onClick={() => handleRoomChange(room.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <img
                            src={room.thumbnail}
                            alt={room.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getRoomIcon(room.type)}
                              <h4 className="font-medium">{room.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{room.description}</p>
                            {room.dimensions && (
                              <p className="text-xs text-gray-500">{room.dimensions}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Room Highlights */}
              {currentRoom && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Room Highlights</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentRoom.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="justify-center">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Property Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span className="font-medium">{formatCurrency(tourData.propertyDetails.rent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <span className="font-medium">{tourData.propertyDetails.sqft} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bedrooms:</span>
                      <span className="font-medium">{tourData.propertyDetails.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bathrooms:</span>
                      <span className="font-medium">{tourData.propertyDetails.bathrooms}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {tourData.propertyDetails.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {amenity === 'Parking' && <Car className="h-3 w-3" />}
                        {amenity === 'Gym' && <Zap className="h-3 w-3" />}
                        {amenity === 'Security' && <Shield className="h-3 w-3" />}
                        {amenity === 'Wifi' && <Wifi className="h-3 w-3" />}
                        {!['Parking', 'Gym', 'Security', 'Wifi'].includes(amenity) && <Square className="h-3 w-3" />}
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-rent-accent hover:bg-rent-accent/90"
                    onClick={onBookProperty}
                  >
                    Book This Property
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Visit
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Owner
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourIntegration;