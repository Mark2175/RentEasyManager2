import React, { useState } from 'react';
import { ArrowLeft, Calendar, CreditCard, FileText, CheckCircle, Home, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';

interface BookingFlowScreenProps {
  onNavigate?: (screen: string) => void;
  property?: any;
}

const BookingFlowScreen: React.FC<BookingFlowScreenProps> = ({ onNavigate, property }) => {
  const { userProfile } = useAuth();
  const { selectedProperty } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    moveInDate: '',
    leaseDuration: '11',
    tenantName: userProfile?.name || '',
    tenantPhone: userProfile?.phoneNumber || '',
    tenantEmail: userProfile?.email || '',
    emergencyContact: '',
    additionalRequests: '',
    agreeToTerms: false,
    agreeToInspection: false,
  });

  const bookingProperty = property || selectedProperty;
  
  if (!bookingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Property Selected</h3>
          <p className="text-gray-600 mb-4">Please select a property to start booking.</p>
          <Button onClick={() => onNavigate && onNavigate('properties')}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  const calculateCosts = () => {
    const monthlyRent = bookingProperty.rent || 0;
    const securityDeposit = monthlyRent * 2; // 2 months security
    const brokerageFee = 999; // Premium tenant plan
    const total = monthlyRent + securityDeposit + brokerageFee;
    
    return {
      monthlyRent,
      securityDeposit,
      brokerageFee,
      total
    };
  };

  const costs = calculateCosts();

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      const bookingPayload = {
        propertyId: bookingProperty.id,
        moveInDate: bookingData.moveInDate,
        leaseDuration: parseInt(bookingData.leaseDuration),
        monthlyRent: costs.monthlyRent,
        securityDeposit: costs.securityDeposit,
        brokerageFee: costs.brokerageFee,
        totalAmount: costs.total,
        status: 'pending',
        tenantDetails: {
          name: bookingData.tenantName,
          phone: bookingData.tenantPhone,
          email: bookingData.tenantEmail,
          emergencyContact: bookingData.emergencyContact,
        },
        additionalRequests: bookingData.additionalRequests,
      };

      console.log('Submitting booking:', bookingPayload);
      // Here you would make API call to create booking
      alert('Booking request submitted successfully! Redirecting to payment...');
      
      // Navigate to payment screen
      onNavigate && onNavigate('payment');
    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Booking submission failed. Please try again.');
    }
  };

  const steps = [
    { number: 1, title: 'Property Details', icon: Home },
    { number: 2, title: 'Tenant Information', icon: User },
    { number: 3, title: 'Payment Summary', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate('properties')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Book Apartment</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.number 
                  ? 'bg-rent-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              {step.number < steps.length && (
                <div className={`w-8 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-rent-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Step 1: Property Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={bookingProperty.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'} 
                      alt={bookingProperty.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{bookingProperty.title}</h3>
                      <p className="text-sm text-gray-600">{bookingProperty.area}, Bangalore</p>
                      <p className="text-lg font-bold text-rent-primary">₹{bookingProperty.rent?.toLocaleString()}/month</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{bookingProperty.bedrooms}BHK</Badge>
                        <Badge variant="outline">{bookingProperty.sqft} sqft</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={bookingData.moveInDate}
                      onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="leaseDuration">Lease Duration *</Label>
                    <Select value={bookingData.leaseDuration} onValueChange={(value) => handleInputChange('leaseDuration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="11">11 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleNextStep} 
              className="w-full bg-rent-primary hover:bg-rent-primary/90"
              disabled={!bookingData.moveInDate}
            >
              Continue to Tenant Information
            </Button>
          </div>
        )}

        {/* Step 2: Tenant Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tenant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenantName">Full Name *</Label>
                    <Input
                      id="tenantName"
                      value={bookingData.tenantName}
                      onChange={(e) => handleInputChange('tenantName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tenantPhone">Phone Number *</Label>
                    <Input
                      id="tenantPhone"
                      value={bookingData.tenantPhone}
                      onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tenantEmail">Email Address *</Label>
                    <Input
                      id="tenantEmail"
                      type="email"
                      value={bookingData.tenantEmail}
                      onChange={(e) => handleInputChange('tenantEmail', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={bookingData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="additionalRequests">Additional Requests</Label>
                  <Textarea
                    id="additionalRequests"
                    value={bookingData.additionalRequests}
                    onChange={(e) => handleInputChange('additionalRequests', e.target.value)}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                onClick={handlePreviousStep}
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="flex-1 bg-rent-primary hover:bg-rent-primary/90"
                disabled={!bookingData.tenantName || !bookingData.tenantPhone || !bookingData.tenantEmail}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Summary */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Rent</span>
                    <span className="font-semibold">₹{costs.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit (2 months)</span>
                    <span className="font-semibold">₹{costs.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brokerage Fee (Premium Plan)</span>
                    <span className="font-semibold">₹{costs.brokerageFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-rent-primary">₹{costs.total.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Included FREE Services</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Moving & Packing services</li>
                    <li>• Property maintenance & repairs</li>
                    <li>• Legal documentation</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={bookingData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the <span className="text-rent-primary underline">Terms & Conditions</span> and <span className="text-rent-primary underline">Rental Agreement</span>
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={bookingData.agreeToInspection}
                      onChange={(e) => handleInputChange('agreeToInspection', e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to property inspection within 48 hours of move-in
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                onClick={handlePreviousStep}
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="flex-1 bg-rent-primary hover:bg-rent-primary/90"
                disabled={!bookingData.agreeToTerms || !bookingData.agreeToInspection}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Confirm Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Submit</h3>
                  <p className="text-gray-600 mb-4">
                    Your booking request is ready. Click submit to proceed with payment.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <h4 className="font-semibold">Booking Summary:</h4>
                  <p><strong>Property:</strong> {bookingProperty.title}</p>
                  <p><strong>Move-in Date:</strong> {new Date(bookingData.moveInDate).toLocaleDateString()}</p>
                  <p><strong>Lease Duration:</strong> {bookingData.leaseDuration} months</p>
                  <p><strong>Total Amount:</strong> ₹{costs.total.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                onClick={handlePreviousStep}
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              <Button 
                onClick={handleSubmitBooking} 
                className="flex-1 bg-rent-primary hover:bg-rent-primary/90"
              >
                Submit Booking & Pay
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlowScreen;