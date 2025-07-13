import React from 'react';
import { ArrowLeft, FileText, Download, Eye, Calendar, User, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RentalAgreementsScreenProps {
  onNavigate?: (screen: string) => void;
}

const RentalAgreementsScreen: React.FC<RentalAgreementsScreenProps> = ({ onNavigate }) => {
  const agreements = [
    {
      id: 1,
      propertyId: 'RE628373001',
      propertyTitle: '2BHK Apartment in HSR Layout',
      landlordName: 'Mohan Rao',
      tenantName: 'Swati Saxena',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      monthlyRent: 35000,
      securityDeposit: 70000,
      status: 'active',
      documentUrl: '/documents/agreement-1.pdf',
      createdAt: '2024-01-10',
    },
    {
      id: 2,
      propertyId: 'RE628373002',
      propertyTitle: '1BHK Studio in Koramangala',
      landlordName: 'Priya Sharma',
      tenantName: 'Swati Saxena',
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      monthlyRent: 28000,
      securityDeposit: 56000,
      status: 'expired',
      documentUrl: '/documents/agreement-2.pdf',
      createdAt: '2023-05-25',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (agreement: any) => {
    // In a real app, this would trigger a download
    console.log('Downloading agreement:', agreement.id);
    alert(`Downloading agreement for ${agreement.propertyTitle}`);
  };

  const handleView = (agreement: any) => {
    // In a real app, this would open the agreement in a viewer
    console.log('Viewing agreement:', agreement.id);
    alert(`Opening agreement for ${agreement.propertyTitle}`);
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
            <h1 className="text-xl font-bold text-gray-900">Rental Agreements</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {agreements.length > 0 ? (
          <div className="space-y-4">
            {agreements.map((agreement) => (
              <Card key={agreement.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Agreement #{agreement.id}
                    </CardTitle>
                    <Badge className={getStatusColor(agreement.status)}>
                      {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-gray-400" />
                          <span>{agreement.propertyTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Property ID:</span>
                          <span className="font-medium">{agreement.propertyId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>Landlord: {agreement.landlordName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Agreement Terms</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(agreement.startDate).toLocaleDateString()} - {new Date(agreement.endDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="ml-2 font-semibold">₹{agreement.monthlyRent.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="ml-2 font-semibold">₹{agreement.securityDeposit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleView(agreement)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(agreement)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  {agreement.status === 'active' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Active Agreement:</strong> This rental agreement is currently active and legally binding.
                      </p>
                    </div>
                  )}
                  
                  {agreement.status === 'expired' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>Expired Agreement:</strong> This rental agreement has expired. Contact support for renewal options.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rental Agreements</h3>
            <p className="text-gray-600 mb-4">
              You don't have any rental agreements yet. They will appear here once you complete a booking.
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

export default RentalAgreementsScreen;