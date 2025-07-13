import React from 'react';
import { Check, Star, Users, Home, Wrench, Phone, FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PricingScreenProps {
  onNavigate?: (screen: string) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ onNavigate }) => {
  const plans = [
    {
      name: "Basic Tenant",
      price: "₹0",
      period: "Forever",
      description: "Perfect for budget-conscious tenants",
      features: [
        "Browse unlimited properties",
        "Contact landlords directly",
        "Basic property search filters",
        "View property photos",
        "Standard customer support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
      color: "border-gray-200",
    },
    {
      name: "Premium Tenant",
      price: "₹999",
      period: "One-time brokerage fee",
      description: "Pay once, get everything free forever",
      features: [
        "Everything in Basic",
        "FREE moving & packing services",
        "FREE maintenance & repairs",
        "FREE legal documentation",
        "24/7 priority customer support",
        "Virtual property tours",
        "Advanced search filters",
        "Wishlist & favorites",
        "Instant booking requests",
      ],
      buttonText: "Choose Premium",
      buttonVariant: "default" as const,
      popular: true,
      color: "border-rent-primary",
      highlight: "Most Popular",
    },
    {
      name: "Landlord Basic",
      price: "₹499",
      period: "Per property/month",
      description: "Essential tools for property owners",
      features: [
        "List up to 3 properties",
        "Basic property management",
        "Tenant screening tools",
        "Rent collection tracking",
        "Standard customer support",
      ],
      buttonText: "Start Listing",
      buttonVariant: "outline" as const,
      popular: false,
      color: "border-gray-200",
    },
    {
      name: "Landlord Pro",
      price: "₹1,499",
      period: "Per property/month",
      description: "Complete property management solution",
      features: [
        "Unlimited property listings",
        "Advanced tenant screening",
        "Automated rent collection",
        "Maintenance request management",
        "Financial reporting & analytics",
        "Legal document templates",
        "24/7 priority support",
        "Dedicated account manager",
        "Bajaj Finance FD integration",
      ],
      buttonText: "Go Pro",
      buttonVariant: "default" as const,
      popular: false,
      color: "border-rent-accent",
      highlight: "Best Value",
    },
  ];

  const brokerFeatures = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Lead Management",
      description: "Manage tenant and landlord leads efficiently",
    },
    {
      icon: <Home className="h-5 w-5" />,
      title: "Property Portfolio",
      description: "Showcase your complete property portfolio",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for your clients",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Documentation",
      description: "Handle all legal paperwork seamlessly",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate('home')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Pricing Plans
            </h1>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you. Pay brokerage once, get services free forever.
            </p>
          </div>
        </div>
      </div>

      {/* USP Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <span className="font-semibold">
              Our Promise: Pay brokerage, get moving & maintenance services FREE for life!
            </span>
            <Star className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'shadow-lg scale-105' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-rent-primary text-white px-4 py-1">
                    {plan.highlight}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-rent-primary">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 text-sm ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.buttonVariant === 'default' ? 'bg-rent-primary hover:bg-rent-primary/90' : ''}`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Broker Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              For Real Estate Brokers
            </h2>
            <p className="text-gray-600">
              Join our network of verified brokers and grow your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="grid grid-cols-2 gap-4">
                {brokerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-rent-primary">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button className="bg-rent-accent hover:bg-rent-accent/90">
                  Apply as Broker
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Broker Commission Structure
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly rent ≤ ₹15,000</span>
                  <span className="font-semibold">2% commission</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly rent ₹15,001 - ₹30,000</span>
                  <span className="font-semibold">2.5% commission</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly rent &gt; ₹30,000</span>
                  <span className="font-semibold">3% commission</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-xs">
                  <strong>Bonus:</strong> Get additional ₹500 for every successful tenant referral
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What's included in the free services?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                When you pay brokerage through us, you get moving & packing services, 
                maintenance & repairs, legal documentation, and 24/7 support completely free.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                How does the one-time brokerage fee work?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Pay ₹999 once when you book a property through our platform. 
                This unlocks all premium features and free services for life.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, you can upgrade to Premium at any time. Landlords can change 
                their plan based on their property management needs.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                We accept all major credit cards, debit cards, UPI, net banking, 
                and digital wallets. All payments are secure and encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who chose RentEasy Solutions
          </p>
          <Button className="bg-rent-primary hover:bg-rent-primary/90 px-8 py-3 text-lg">
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingScreen;