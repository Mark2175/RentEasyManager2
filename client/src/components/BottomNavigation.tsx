import React from 'react';
import { Home, Building, Bell, PiggyBank, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'services', label: 'Services', icon: Bell },
    { id: 'fd-offer', label: 'Bank Offers', icon: PiggyBank },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === id
                ? 'text-rent-accent'
                : 'text-gray-400'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className={`text-xs ${
              activeTab === id ? 'font-medium' : ''
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
