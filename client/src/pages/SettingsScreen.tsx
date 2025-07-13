import React, { useState } from 'react';
import { ArrowLeft, Bell, Lock, Globe, Moon, Sun, Smartphone, Shield, CreditCard, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsScreenProps {
  onNavigate?: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      propertyAlerts: true,
      bookingUpdates: true,
      serviceReminders: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: 'public',
      showPhoneNumber: false,
      shareLocation: true,
      dataCollection: true,
    },
    preferences: {
      language: 'en',
      currency: 'INR',
      theme: 'light',
      autoLocation: true,
    },
    security: {
      twoFactor: false,
      biometric: true,
      sessionTimeout: '30',
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'push', label: 'Push Notifications', type: 'switch', value: settings.notifications.push },
        { key: 'email', label: 'Email Notifications', type: 'switch', value: settings.notifications.email },
        { key: 'sms', label: 'SMS Notifications', type: 'switch', value: settings.notifications.sms },
        { key: 'propertyAlerts', label: 'Property Alerts', type: 'switch', value: settings.notifications.propertyAlerts },
        { key: 'bookingUpdates', label: 'Booking Updates', type: 'switch', value: settings.notifications.bookingUpdates },
        { key: 'serviceReminders', label: 'Service Reminders', type: 'switch', value: settings.notifications.serviceReminders },
        { key: 'marketingEmails', label: 'Marketing Emails', type: 'switch', value: settings.notifications.marketingEmails },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { 
          key: 'profileVisibility', 
          label: 'Profile Visibility', 
          type: 'select', 
          value: settings.privacy.profileVisibility,
          options: [
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'contacts', label: 'Contacts Only' }
          ]
        },
        { key: 'showPhoneNumber', label: 'Show Phone Number', type: 'switch', value: settings.privacy.showPhoneNumber },
        { key: 'shareLocation', label: 'Share Location', type: 'switch', value: settings.privacy.shareLocation },
        { key: 'dataCollection', label: 'Allow Data Collection', type: 'switch', value: settings.privacy.dataCollection },
        { key: 'twoFactor', label: 'Two-Factor Authentication', type: 'switch', value: settings.security.twoFactor },
        { key: 'biometric', label: 'Biometric Login', type: 'switch', value: settings.security.biometric },
        { 
          key: 'sessionTimeout', 
          label: 'Session Timeout', 
          type: 'select', 
          value: settings.security.sessionTimeout,
          options: [
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '0', label: 'Never' }
          ]
        },
      ]
    },
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        { 
          key: 'language', 
          label: 'Language', 
          type: 'select', 
          value: settings.preferences.language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'kn', label: 'Kannada' },
            { value: 'te', label: 'Telugu' },
            { value: 'ta', label: 'Tamil' }
          ]
        },
        { 
          key: 'currency', 
          label: 'Currency', 
          type: 'select', 
          value: settings.preferences.currency,
          options: [
            { value: 'INR', label: 'Indian Rupee (₹)' },
            { value: 'USD', label: 'US Dollar ($)' },
            { value: 'EUR', label: 'Euro (€)' }
          ]
        },
        { 
          key: 'theme', 
          label: 'Theme', 
          type: 'select', 
          value: settings.preferences.theme,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System Default' }
          ]
        },
        { key: 'autoLocation', label: 'Auto-detect Location', type: 'switch', value: settings.preferences.autoLocation },
      ]
    }
  ];

  const actionItems = [
    {
      icon: Lock,
      title: 'Change Password',
      description: 'Update your account password',
      action: () => alert('Password change feature coming soon!'),
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment methods',
      action: () => alert('Payment methods management coming soon!'),
    },
    {
      icon: Smartphone,
      title: 'Device Management',
      description: 'Manage logged-in devices',
      action: () => alert('Device management feature coming soon!'),
    },
    {
      icon: HelpCircle,
      title: 'Data & Privacy',
      description: 'Download your data or delete account',
      action: () => alert('Data management feature coming soon!'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate('profile')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">
                      {item.label}
                    </label>
                  </div>
                  <div className="flex-shrink-0">
                    {item.type === 'switch' ? (
                      <Switch
                        checked={item.value as boolean}
                        onCheckedChange={(checked) => 
                          handleSettingChange(
                            section.title === 'Notifications' ? 'notifications' :
                            section.title === 'Privacy & Security' ? (item.key.includes('twoFactor') || item.key.includes('biometric') || item.key.includes('sessionTimeout') ? 'security' : 'privacy') :
                            'preferences',
                            item.key,
                            checked
                          )
                        }
                      />
                    ) : (
                      <Select
                        value={item.value as string}
                        onValueChange={(value) => 
                          handleSettingChange(
                            section.title === 'Notifications' ? 'notifications' :
                            section.title === 'Privacy & Security' ? (item.key.includes('twoFactor') || item.key.includes('biometric') || item.key.includes('sessionTimeout') ? 'security' : 'privacy') :
                            'preferences',
                            item.key,
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={item.action}
                >
                  <div className="p-2 rounded-lg bg-gray-100">
                    <item.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
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

        {/* Save Button */}
        <Button 
          className="w-full bg-rent-primary hover:bg-rent-primary/90"
          onClick={() => {
            alert('Settings saved successfully!');
          }}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;