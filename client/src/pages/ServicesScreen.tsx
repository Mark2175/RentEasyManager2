import React from 'react';
import { Truck, Box, Wrench, Zap, PaintBucket, Utensils, ShoppingCart, Gift, Users, Share2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServicesScreenProps {
  onNavigate?: (screen: string) => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ onNavigate }) => {
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
      businesses: [
        { name: 'Truffles', area: 'HSR Layout', discount: '15%' },
        { name: 'Cafe Coffee Day', area: 'Koramangala', discount: '20%' },
        { name: 'Darshini Restaurant', area: 'Electronic City', discount: '10%' },
      ]
    },
    {
      icon: ShoppingCart,
      title: 'Shopping',
      description: 'Malls, markets, pharmacies',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      businesses: [
        { name: 'Forum Mall', area: 'Koramangala', discount: '25%' },
        { name: 'Apollo Pharmacy', area: 'HSR Layout', discount: '12%' },
        { name: 'Big Bazaar', area: 'Electronic City', discount: '30%' },
      ]
    },
  ];

  const handleReferNow = () => {
    const referralMessage = `🏠 Join RentEasy Solutions and get amazing benefits!

💰 Pay brokerage once, get FREE services:
• Moving & Packing services
• Property maintenance
• 24/7 support
• Legal documentation

📱 Download now and use my referral code: RENT2024

Get up to 30% discounts on local businesses too!`;
    
    // For mobile devices, try to share via Web Share API
    if (navigator.share) {
      navigator.share({
        title: 'RentEasy Solutions - Referral',
        text: referralMessage,
        url: window.location.origin
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(referralMessage).then(() => {
        alert('Referral message copied to clipboard! Share it with your friends.');
      }).catch(() => {
        // Final fallback: show in alert
        alert(`Share this message with your friends:\n\n${referralMessage}`);
      });
    }
  };

  const handleBusinessClick = (business: any) => {
    const referralCode = `RENT${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const discountMessage = `🎉 Get ${business.discount} discount at ${business.name}!

📍 Location: ${business.area}
🎟️ Referral Code: ${referralCode}
✨ Valid for 30 days

Show this code at ${business.name} to get your discount!`;
    
    if (navigator.share) {
      navigator.share({
        title: `${business.discount} Discount at ${business.name}`,
        text: discountMessage,
      });
    } else {
      navigator.clipboard.writeText(discountMessage).then(() => {
        alert(`Referral code ${referralCode} copied!\n\nShow this code at ${business.name} to get ${business.discount} discount.`);
      }).catch(() => {
        alert(`Your referral code: ${referralCode}\n\n${discountMessage}`);
      });
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-rent-blue px-6 py-4">
        <h1 className="text-xl font-bold text-rent-accent mb-4">Services</h1>
        <p className="text-gray-600 text-sm">Complete solutions for your rental needs</p>
        
        {/* USP Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg mt-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full p-1">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">FREE Services with Brokerage</p>
              <p className="text-xs opacity-90">These services are complimentary when you pay brokerage through us</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Moving Services */}
        <Card className="bg-white shadow-sm border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-800">Moving & Packing</h3>
              <Badge className="bg-green-500 text-white text-xs">FREE</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {movingServices.map(({ icon: Icon, label, color }, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-6 w-6 text-rent-accent" />
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                  <p className="text-xs text-green-600 mt-1">Free with brokerage</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Services */}
        <Card className="bg-white shadow-sm border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-800">Maintenance & Repairs</h3>
              <Badge className="bg-green-500 text-white text-xs">FREE</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {maintenanceServices.map(({ icon: Icon, label, color }, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-4 w-4 text-rent-accent" />
                  </div>
                  <span className="text-xs text-gray-600">{label}</span>
                  <p className="text-xs text-green-600 mt-1">Free with brokerage</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Local Business Directory */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-800">Local Businesses</h3>
              <Badge className="bg-orange-500 text-white text-xs">DISCOUNTS</Badge>
            </div>
            
            {/* Discount Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg mb-4 shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-1">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">10% to 30% Discounts Available</p>
                  <p className="text-xs opacity-90">Exclusive discounts on select products and services</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {localBusinesses.map(({ icon: Icon, title, description, color, iconColor, businesses }, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{title}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                  
                  {/* Business List */}
                  <div className="ml-4 space-y-2">
                    {businesses.map((business, businessIndex) => (
                      <div 
                        key={businessIndex}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBusinessClick(business)}
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 text-sm">{business.name}</h5>
                          <p className="text-xs text-gray-600">{business.area}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {business.discount} OFF
                          </Badge>
                          <div className="text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card className="bg-gradient-to-r from-rent-blue to-rent-blue-dark text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-8 w-8 text-rent-accent" />
              <Share2 className="h-6 w-6 text-rent-accent" />
            </div>
            <h3 className="font-semibold text-rent-accent mb-2">Refer & Earn</h3>
            <p className="text-sm text-gray-600 mb-3">Earn ₹500 for each successful referral</p>
            <Button 
              className="bg-white text-rent-accent hover:bg-gray-50"
              onClick={handleReferNow}
            >
              Refer Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesScreen;
