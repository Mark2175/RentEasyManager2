import React from 'react';
import { User, FileText, CreditCard, Calendar, Headphones, Settings, LogOut, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { userProfile, logout } = useAuth();

  const menuItems = [
    { icon: DollarSign, label: 'Pricing Plans', color: 'text-rent-accent', action: 'pricing' },
    { icon: FileText, label: 'Rental Agreements', color: 'text-rent-accent', action: 'rental-agreements' },
    { icon: CreditCard, label: 'Payment History', color: 'text-rent-accent', action: 'payment-history' },
    { icon: Calendar, label: 'Neighborhood Events', color: 'text-rent-accent', action: 'neighborhood-events' },
    { icon: Headphones, label: 'Support', color: 'text-rent-accent', action: 'support' },
    { icon: Settings, label: 'Settings', color: 'text-rent-accent', action: 'settings' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tenant': return 'bg-blue-100 text-blue-800';
      case 'landlord': return 'bg-green-100 text-green-800';
      case 'broker': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-rent-blue px-6 py-4">
        <h1 className="text-xl font-bold text-rent-accent mb-4">Profile</h1>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* User Info */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-rent-blue text-rent-accent text-lg font-semibold">
                  {userProfile?.name ? getInitials(userProfile.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-800">{userProfile?.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{userProfile?.phoneNumber || 'Phone not set'}</p>
                <Badge className={`mt-1 ${getRoleColor(userProfile?.role || 'tenant')}`}>
                  {userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 'Tenant'}
                </Badge>
              </div>
            </div>
            <Button 
              className="w-full bg-rent-blue text-rent-accent hover:bg-rent-blue-dark"
              onClick={() => onNavigate && onNavigate('edit-profile')}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Role-specific Dashboard */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">My Dashboard</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="text-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onNavigate && onNavigate('bookings')}
              >
                <div className="text-2xl font-bold text-rent-accent">2</div>
                <div className="text-sm text-gray-600">Active Bookings</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₹500</div>
                <div className="text-sm text-gray-600">Referral Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {menuItems.map(({ icon: Icon, label, color, action }, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (action && onNavigate) {
                      onNavigate(action);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-gray-800">{label}</span>
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

        {/* Logout */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <Button 
              onClick={logout}
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
