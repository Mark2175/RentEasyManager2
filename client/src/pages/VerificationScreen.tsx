import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Award, Target } from 'lucide-react';
import GamifiedVerificationTracker from '@/components/GamifiedVerificationTracker';
import ProfileVerificationModal from '@/components/ProfileVerificationModal';
import { useUser } from '@/contexts/UserContext';

interface VerificationScreenProps {
  onNavigate: (screen: string) => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleOpenVerification = () => {
    setShowVerificationModal(true);
  };

  const handleCloseVerification = () => {
    setShowVerificationModal(false);
  };

  const handleVerificationComplete = () => {
    setShowVerificationModal(false);
    // Handle verification completion
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('profile')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Profile Verification</h1>
                <p className="text-sm text-gray-600">Complete verification to unlock booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <GamifiedVerificationTracker 
          onOpenVerification={handleOpenVerification}
        />
      </div>

      {/* Verification Modal */}
      {showVerificationModal && user && (
        <ProfileVerificationModal
          isOpen={showVerificationModal}
          onClose={handleCloseVerification}
          userId={user.id}
          onComplete={handleVerificationComplete}
        />
      )}
    </div>
  );
};

export default VerificationScreen;