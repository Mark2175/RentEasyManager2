import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, User } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const AuthScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    role: 'tenant',
  });
  const { toast } = useToast();

  const handlePhoneLogin = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user already exists
      const response = await fetch(`/api/users/phone/${encodeURIComponent(phoneNumber)}`);
      if (response.ok) {
        const userData = await response.json();
        // Store user data in localStorage for temporary session
        localStorage.setItem('tempUser', JSON.stringify(userData));
        toast({
          title: "Success",
          description: "Welcome back! Logging you in...",
        });
        window.location.reload(); // Trigger auth context to recognize user
      } else {
        // New user, show registration form
        setShowUserForm(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify phone number",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!userForm.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        username: userForm.name,
        phoneNumber: phoneNumber,
        role: userForm.role,
        isPhoneVerified: true,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        // Store user data in localStorage for temporary session
        localStorage.setItem('tempUser', JSON.stringify(newUser));
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
        window.location.reload(); // Trigger auth context to recognize user
      } else {
        throw new Error('Failed to create profile');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showUserForm) {
    return (
      <div className="p-6 h-screen flex flex-col justify-center bg-rent-blue">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rent-accent mb-2">RentEasy Solutions</h1>
          <p className="text-gray-600">Complete your profile</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Create Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rent-accent focus:border-transparent"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="broker">Broker</option>
              </select>
            </div>
            
            <Button 
              onClick={handleCreateProfile}
              disabled={loading}
              className="w-full bg-rent-accent text-white hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen flex flex-col justify-center bg-rent-blue">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-rent-accent mb-2">RentEasy Solutions</h1>
        <p className="text-gray-600">Find your perfect home in Bangalore</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Phone className="h-5 w-5" />
            Login with Phone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              For testing: OTP verification is temporarily disabled
            </p>
          </div>
          <Button 
            onClick={handlePhoneLogin}
            disabled={loading}
            className="w-full bg-rent-accent text-white hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Continue with Phone'
            )}
          </Button>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
};

export default AuthScreen;
