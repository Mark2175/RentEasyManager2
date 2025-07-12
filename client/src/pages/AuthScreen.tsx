import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth, sendOTP, verifyOTP, createUserProfile } from '@/lib/firebase';
import { Loader2, Phone, Shield } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    role: 'tenant',
  });
  const { toast } = useToast();

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
        },
      });
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const confirmationResult = await sendOTP(phoneNumber, (window as any).recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setShowOtpInput(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(verificationId, otp);
      if (result.user) {
        // Check if user profile exists
        const userProfile = await fetch(`/api/users/${result.user.uid}`);
        if (!userProfile.ok) {
          // New user, show registration form
          setShowUserForm(true);
        }
      }
      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
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
      const user = auth.currentUser;
      if (user) {
        await createUserProfile(user.uid, {
          ...userForm,
          phoneNumber: phoneNumber,
          isVerified: true,
          createdAt: new Date(),
        });
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
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
            {showOtpInput ? (
              <>
                <Shield className="h-5 w-5" />
                Verify OTP
              </>
            ) : (
              <>
                <Phone className="h-5 w-5" />
                Login with Phone
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showOtpInput ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-rent-accent text-white hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-rent-accent text-white hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              <Button 
                onClick={() => setShowOtpInput(false)}
                variant="outline"
                className="w-full"
              >
                Change Phone Number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
      
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default AuthScreen;
