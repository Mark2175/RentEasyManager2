import React from 'react';
import { Percent, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FDOfferScreen: React.FC = () => {
  const benefits = [
    'Higher returns than regular banks',
    'Flexible tenure options',
    'Easy online application',
  ];

  return (
    <div className="pb-20">
      <div className="bg-rent-blue px-6 py-4">
        <h1 className="text-xl font-bold text-rent-accent mb-4">Fixed Deposit Offers</h1>
        <p className="text-gray-600 text-sm">Earn extra 0.25% interest on your deposits</p>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Bajaj Finance FD Offer */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bajaj Finance FD</h3>
                <p className="text-sm text-gray-600">Special rates for landlords</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">8.25%</div>
                <div className="text-sm text-gray-600">Annual Interest Rate</div>
                <div className="text-xs text-green-600 mt-1">+0.25% Extra for RentEasy users</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Minimum Deposit</span>
                <span className="font-medium">₹25,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tenure</span>
                <span className="font-medium">12-60 months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monthly Payout</span>
                <span className="font-medium text-green-600">Available</span>
              </div>
            </div>
            
            <Button className="w-full bg-orange-600 text-white hover:bg-orange-700 mt-4">
              Open FD Account
            </Button>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Why Choose Our FD?</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FDOfferScreen;
