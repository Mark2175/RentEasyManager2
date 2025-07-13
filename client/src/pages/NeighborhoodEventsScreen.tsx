import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface NeighborhoodEventsScreenProps {
  onNavigate?: (screen: string) => void;
}

const NeighborhoodEventsScreen: React.FC<NeighborhoodEventsScreenProps> = ({ onNavigate }) => {
  const [searchArea, setSearchArea] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/neighborhood-events', selectedArea],
    queryFn: async () => {
      const url = selectedArea ? `/api/neighborhood-events?area=${selectedArea}` : '/api/neighborhood-events';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'community': return 'bg-blue-100 text-blue-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'educational': return 'bg-orange-100 text-orange-800';
      case 'sports': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const areas = ['HSR Layout', 'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate('profile')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Neighborhood Events</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Area
                </label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Areas</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event: any) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-green-600">
                          {formatEventDate(event.eventDate)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {event.cost > 0 ? `₹${event.cost}` : 'Free'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{event.startTime || '6:00 PM'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{event.maxParticipants ? `Max ${event.maxParticipants} participants` : 'Open for all'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Organizer</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Area:</span>
                          <span className="ml-2 font-medium">{event.area}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <span className="ml-2">Available on registration</span>
                        </div>
                        {event.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{event.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {event.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-rent-primary hover:bg-rent-primary/90"
                      onClick={() => alert(`Registered for ${event.title}`)}
                    >
                      Register
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => alert(`Shared ${event.title}`)}
                    >
                      Share
                    </Button>
                  </div>
                  
                  {event.cost === 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">Free Event</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        This is a free community event. All neighbors are welcome!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedArea 
                ? `No events found in ${selectedArea}. Try selecting a different area.`
                : 'No neighborhood events available at the moment. Check back later!'
              }
            </p>
            <Button 
              variant="outline"
              onClick={() => setSelectedArea('')}
              className="mr-2"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeighborhoodEventsScreen;