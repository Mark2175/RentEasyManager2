import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  userProfile: any;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for temporary user in localStorage
    const tempUser = localStorage.getItem('tempUser');
    if (tempUser) {
      try {
        const userData = JSON.parse(tempUser);
        setUser(userData);
        setUserProfile(userData);
      } catch (error) {
        console.error('Error parsing temp user:', error);
        localStorage.removeItem('tempUser');
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('tempUser');
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
