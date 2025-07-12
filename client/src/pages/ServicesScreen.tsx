import React from 'react';
import { Truck, Box, Wrench, Zap, PaintBucket, Utensils, ShoppingCart, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServicesScreen: React.FC = () => {
  const movingServices = [
    { icon: Truck, label: 'Local Moving', color: 'bg-rent-blue' },
    { icon: Box, label: 'Packing Service', color: 'bg-rent-blue' },
  ];

  const maintenanceServices = [
    { icon: Wrench, label: 'Plumbing', color: 'bg-rent-blue' },
    { icon: Zap, label: 'Electrical', color: 'bg-rent-blue' },
    { icon: PaintBucket, label: 'Painting', color: 'bg-rent-blue' },
  ];

  const localBusinesses = [
    {
      icon: Utensils,
      title: 'Food & Dining',
      description: 'Restaurants, cafes, grocery stores',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: ShoppingCart,
      title: 'Shopping',
      description: 'Malls, markets, pharmacies',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="pb-20">
      <div className="bg-rent-blue px-6 py-4">
        <h1 className="text-xl font-bold text-rent-accent mb-4">Services</h1>
        <p className="text-gray-600 text-sm">Complete solutions for your rental needs</p>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Moving Services */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Moving & Packing</h3>
            <div className="grid grid-cols-2 gap-4">
              {movingServices.map(({ icon: Icon, label, color }, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-6 w-6 text-rent-accent" />
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Services */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Maintenance & Repairs</h3>
            <div className="grid grid-cols-3 gap-4">
              {maintenanceServices.map(({ icon: Icon, label, color }, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-4 w-4 text-rent-accent" />
                  </div>
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Local Business Directory */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Local Businesses</h3>
            <div className="space-y-3">
              {localBusinesses.map(({ icon: Icon, title, description, color, iconColor }, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{title}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card className="bg-gradient-to-r from-rent-blue to-rent-blue-dark text-center">
          <CardContent className="p-4">
            <Gift className="h-8 w-8 text-rent-accent mx-auto mb-2" />
            <h3 className="font-semibold text-rent-accent mb-2">Refer & Earn</h3>
            <p className="text-sm text-gray-600 mb-3">Earn ₹500 for each successful referral</p>
            <Button className="bg-white text-rent-accent hover:bg-gray-50">
              Refer Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesScreen;
