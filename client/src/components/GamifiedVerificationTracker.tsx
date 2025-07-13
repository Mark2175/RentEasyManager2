import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Award, 
  CheckCircle, 
  Clock, 
  Shield, 
  User, 
  FileText, 
  CreditCard, 
  MapPin,
  Gift,
  Zap,
  Target,
  Medal
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  required: boolean;
  estimatedTime: string;
  category: 'basic' | 'documents' | 'verification' | 'premium';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

interface GamifiedVerificationTrackerProps {
  onOpenVerification?: () => void;
}

const GamifiedVerificationTracker: React.FC<GamifiedVerificationTrackerProps> = ({ 
  onOpenVerification 
}) => {
  const { user } = useUser();
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(100);
  const [streak, setStreak] = useState(0);

  const verificationSteps: VerificationStep[] = [
    {
      id: 'basic-profile',
      title: 'Complete Basic Profile',
      description: 'Add your full name, email, and phone number',
      icon: <User className="h-5 w-5" />,
      points: 50,
      completed: !!user?.email && !!user?.phoneNumber,
      required: true,
      estimatedTime: '2 minutes',
      category: 'basic'
    },
    {
      id: 'address-verification',
      title: 'Verify Address',
      description: 'Add your complete address as per government documents',
      icon: <MapPin className="h-5 w-5" />,
      points: 75,
      completed: false, // This would be based on user's address completion
      required: true,
      estimatedTime: '3 minutes',
      category: 'basic'
    },
    {
      id: 'aadhaar-upload',
      title: 'Upload Aadhaar Card',
      description: 'Upload clear photos of your Aadhaar card',
      icon: <FileText className="h-5 w-5" />,
      points: 100,
      completed: false, // This would be based on document upload status
      required: true,
      estimatedTime: '5 minutes',
      category: 'documents'
    },
    {
      id: 'pan-upload',
      title: 'Upload PAN Card',
      description: 'Upload clear photo of your PAN card',
      icon: <CreditCard className="h-5 w-5" />,
      points: 100,
      completed: false,
      required: true,
      estimatedTime: '3 minutes',
      category: 'documents'
    },
    {
      id: 'address-proof',
      title: 'Upload Address Proof',
      description: 'Upload utility bill, bank statement, or rental agreement',
      icon: <Shield className="h-5 w-5" />,
      points: 100,
      completed: false,
      required: true,
      estimatedTime: '5 minutes',
      category: 'documents'
    },
    {
      id: 'income-proof',
      title: 'Upload Income Proof',
      description: 'Upload employment letter from company HR on letterhead',
      icon: <Award className="h-5 w-5" />,
      points: 150,
      completed: false,
      required: true,
      estimatedTime: '5 minutes',
      category: 'documents'
    },
    {
      id: 'phone-verification',
      title: 'Phone Verification',
      description: 'Verify your phone number with OTP',
      icon: <CheckCircle className="h-5 w-5" />,
      points: 50,
      completed: !!user?.phoneNumber,
      required: true,
      estimatedTime: '2 minutes',
      category: 'verification'
    },
    {
      id: 'premium-verification',
      title: 'Premium Verification',
      description: 'Complete video verification call with our team',
      icon: <Trophy className="h-5 w-5" />,
      points: 200,
      completed: false,
      required: false,
      estimatedTime: '15 minutes',
      category: 'premium'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-step',
      title: 'Getting Started',
      description: 'Complete your first verification step',
      icon: <Star className="h-5 w-5" />,
      points: 25,
      unlocked: verificationSteps.filter(step => step.completed).length >= 1,
      rarity: 'common'
    },
    {
      id: 'halfway-hero',
      title: 'Halfway Hero',
      description: 'Complete 50% of verification steps',
      icon: <Medal className="h-5 w-5" />,
      points: 100,
      unlocked: verificationSteps.filter(step => step.completed).length >= 4,
      rarity: 'rare'
    },
    {
      id: 'document-master',
      title: 'Document Master',
      description: 'Upload all required documents',
      icon: <FileText className="h-5 w-5" />,
      points: 200,
      unlocked: verificationSteps.filter(step => step.category === 'documents' && step.completed).length >= 4,
      rarity: 'epic'
    },
    {
      id: 'verification-champion',
      title: 'Verification Champion',
      description: 'Complete all verification steps',
      icon: <Trophy className="h-5 w-5" />,
      points: 500,
      unlocked: verificationSteps.filter(step => step.required && step.completed).length === verificationSteps.filter(step => step.required).length,
      rarity: 'legendary'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete verification in under 30 minutes',
      icon: <Zap className="h-5 w-5" />,
      points: 150,
      unlocked: false,
      rarity: 'rare'
    }
  ];

  const completedSteps = verificationSteps.filter(step => step.completed);
  const totalSteps = verificationSteps.filter(step => step.required).length;
  const completionPercentage = (completedSteps.length / totalSteps) * 100;

  useEffect(() => {
    const points = completedSteps.reduce((sum, step) => sum + step.points, 0);
    const achievementPoints = achievements.filter(a => a.unlocked).reduce((sum, achievement) => sum + achievement.points, 0);
    const total = points + achievementPoints;
    
    setTotalPoints(total);
    setLevel(Math.floor(total / 100) + 1);
    setPointsToNextLevel(100 - (total % 100));
  }, [completedSteps, achievements]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'documents': return 'bg-blue-100 text-blue-800';
      case 'verification': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-rent-accent" />
            Verification Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rent-accent">{totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rent-accent">Level {level}</div>
              <div className="text-sm text-gray-600">{pointsToNextLevel} points to next level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rent-accent">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedSteps.length} of {totalSteps} steps</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verificationSteps.map((step) => (
              <div key={step.id} className={`flex items-center gap-4 p-4 rounded-lg border ${
                step.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}>
                <div className={`p-2 rounded-full ${
                  step.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <Badge className={getCategoryColor(step.category)} variant="outline">
                      {step.category}
                    </Badge>
                    {step.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {step.points} points
                    </span>
                  </div>
                </div>
                
                {!step.completed && (
                  <Button 
                    size="sm" 
                    onClick={onOpenVerification}
                    className="bg-rent-accent hover:bg-rent-accent/90"
                  >
                    Start
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-lg border ${
                achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {achievement.points} points
                      </span>
                      {achievement.unlocked && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Verification Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-500 text-white rounded-full">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold">Complete Basic Verification</h4>
                <p className="text-sm text-gray-600">Unlock property booking feature</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-500 text-white rounded-full">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold">Complete Document Verification</h4>
                <p className="text-sm text-gray-600">Get verified badge + priority booking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-500 text-white rounded-full">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold">Complete Premium Verification</h4>
                <p className="text-sm text-gray-600">Unlock exclusive properties + concierge support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedVerificationTracker;