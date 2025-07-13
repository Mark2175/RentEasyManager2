import React from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Clock, AlertCircle, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface PaymentHistoryScreenProps {
  onNavigate?: (screen: string) => void;
}

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ onNavigate }) => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['/api/payments/user/8'],
    queryFn: async () => {
      const response = await fetch('/api/payments/user/8');
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'rent': return 'bg-blue-100 text-blue-800';
      case 'security_deposit': return 'bg-purple-100 text-purple-800';
      case 'brokerage': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReceipt = (payment: any) => {
    console.log('Downloading receipt for payment:', payment.id);
    alert(`Downloading receipt for payment #${payment.id}`);
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
            <h1 className="text-xl font-bold text-gray-900">Payment History</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹63,000</div>
                <div className="text-sm text-gray-600">Total Paid</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹35,000</div>
                <div className="text-sm text-gray-600">Next Payment</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment: any) => (
              <Card key={payment.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment #{payment.id}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getPaymentTypeColor(payment.paymentType)}>
                        {payment.paymentType.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(payment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-bold text-lg">₹{payment.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="ml-2 font-medium">{payment.paymentMethod || 'UPI'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="ml-2 font-mono text-xs">{payment.transactionId || `TXN${payment.id}234567`}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Transaction Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Date: {new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Property:</span>
                          <span className="ml-2">RE628373001</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <span className="ml-2">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReceipt(payment)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                  
                  {payment.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Payment Successful</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Your payment has been processed successfully.
                      </p>
                    </div>
                  )}
                  
                  {payment.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Payment Processing</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your payment is being processed. It may take 1-2 business days to complete.
                      </p>
                    </div>
                  )}
                  
                  {payment.status === 'failed' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Payment Failed</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Payment failed. Please try again or contact support.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600 mb-4">
              You haven't made any payments yet. Your payment history will appear here once you make transactions.
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

export default PaymentHistoryScreen;