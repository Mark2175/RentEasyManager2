import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle, Smartphone, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentScreenProps {
  onNavigate?: (screen: string) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock booking data - in real app this would come from context/props
  const bookingDetails = {
    propertyTitle: '2BHK Apartment in HSR Layout',
    propertyId: 'RE628373001',
    moveInDate: '2024-02-15',
    leaseDuration: 11,
    monthlyRent: 35000,
    securityDeposit: 70000,
    brokerageFee: 999,
    total: 105999,
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Pay securely with your card' },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone, description: 'Pay using UPI apps like GPay, PhonePe' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, description: 'Direct bank transfer' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock payment success
      setPaymentSuccess(true);
      
      // In real app, you would:
      // 1. Send payment data to your backend
      // 2. Process payment through payment gateway
      // 3. Update booking status
      // 4. Generate receipt
      
      console.log('Payment processed successfully');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900">Payment Successful</h1>
          </div>
        </div>
        
        <div className="px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your booking has been confirmed. You will receive a confirmation email shortly.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Booking Details:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Property:</strong> {bookingDetails.propertyTitle}</p>
                  <p><strong>Property ID:</strong> {bookingDetails.propertyId}</p>
                  <p><strong>Move-in Date:</strong> {new Date(bookingDetails.moveInDate).toLocaleDateString()}</p>
                  <p><strong>Amount Paid:</strong> ₹{bookingDetails.total.toLocaleString()}</p>
                  <p><strong>Transaction ID:</strong> TXN{Date.now()}</p>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-700 space-y-1 text-left">
                  <li>• Landlord will be notified of your booking</li>
                  <li>• You'll receive confirmation within 24 hours</li>
                  <li>• FREE moving services will be scheduled</li>
                  <li>• Property inspection will be arranged</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => onNavigate && onNavigate('bookings')}
                  className="flex-1 bg-rent-primary hover:bg-rent-primary/90"
                >
                  View My Bookings
                </Button>
                <Button 
                  onClick={() => onNavigate && onNavigate('home')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate('booking-flow')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Payment</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Security Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">Secure Payment</p>
              <p className="text-sm text-blue-700">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Monthly Rent</span>
                <span>₹{bookingDetails.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span>₹{bookingDetails.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Brokerage Fee</span>
                <span>₹{bookingDetails.brokerageFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-rent-primary">₹{bookingDetails.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === method.id 
                      ? 'border-rent-primary bg-rent-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">{method.label}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === method.id 
                        ? 'border-rent-primary bg-rent-primary' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        {paymentMethod && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="Enter cardholder name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={paymentData.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    placeholder="yourname@paytm"
                  />
                </div>
              )}
              
              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankAccount">Account Number</Label>
                    <Input
                      id="bankAccount"
                      value={paymentData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                      placeholder="Enter account number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={paymentData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                      placeholder="HDFC0000123"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* EMI Options */}
        <Card>
          <CardHeader>
            <CardTitle>EMI Options Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3 text-center">
                <p className="font-semibold">3 Months</p>
                <p className="text-sm text-gray-600">₹35,333/month</p>
                <p className="text-xs text-green-600">0% Interest</p>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="font-semibold">6 Months</p>
                <p className="text-sm text-gray-600">₹17,667/month</p>
                <p className="text-xs text-green-600">2% Interest</p>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="font-semibold">12 Months</p>
                <p className="text-sm text-gray-600">₹8,833/month</p>
                <p className="text-xs text-green-600">5% Interest</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pay Button */}
        <Button 
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className="w-full bg-rent-primary hover:bg-rent-primary/90 h-12"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ₹${bookingDetails.total.toLocaleString()}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentScreen;