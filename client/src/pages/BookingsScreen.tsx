import React from 'react';
import { ArrowLeft, Calendar, MapPin, User, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface BookingsScreenProps {
  onNavigate?: (screen: string) => void;
}

const BookingsScreen: React.FC<BookingsScreenProps> = ({ onNavigate }) => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings/user/8'],
    queryFn: async () => {
      const response = await fetch('/api/bookings/user/8');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

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
            <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Booking #{booking.id}
                    </CardTitle>
                    <Badge className={getStatusColor(booking.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>Property ID: {booking.propertyId || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Move-in: {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Duration: {booking.leaseDuration || 11} months</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Booking Info</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Booking Date:</span>
                          <span className="ml-2">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="ml-2 font-semibold">₹{booking.monthlyRent?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="ml-2 font-semibold">₹{booking.securityDeposit?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {booking.status === 'active' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Active Booking</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Your booking is confirmed. Contact support for any assistance.
                      </p>
                    </div>
                  )}
                  
                  {booking.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Pending Approval</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Waiting for landlord approval. You'll be notified once approved.
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't made any property bookings yet. Start exploring properties to make your first booking.
            </p>
            <Button 
              onClick={() => onNavigate && onNavigate('properties')}
              className="bg-rent-primary hover:bg-rent-primary/90"
            >
              Browse Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsScreen;