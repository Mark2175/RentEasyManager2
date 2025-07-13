import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MessageCircle, HelpCircle, Clock, CheckCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SupportScreenProps {
  onNavigate?: (screen: string) => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [ticketForm, setTicketForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const supportOptions = [
    {
      icon: Phone,
      title: '24/7 Phone Support',
      description: 'Call us anytime for immediate assistance',
      contact: '+91 80-4567-8900',
      available: true,
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'support@renteasy.com',
      available: true,
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9 AM - 9 PM',
      available: true,
      color: 'text-purple-600'
    },
  ];

  const faqData = [
    {
      question: 'How do I get free moving services?',
      answer: 'When you pay the one-time brokerage fee of ₹999, you automatically get free moving and packing services. Our team will contact you to schedule the service.',
    },
    {
      question: 'What is included in free maintenance?',
      answer: 'Free maintenance includes plumbing repairs, electrical work, appliance servicing, and general property maintenance. Emergency repairs are prioritized.',
    },
    {
      question: 'How long does property approval take?',
      answer: 'Property approval typically takes 24-48 hours. We verify all documents and conduct background checks before approval.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 7 days before the move-in date. Cancellation charges may apply based on the timing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. EMI options are also available.',
    },
  ];

  const tickets = [
    {
      id: 'TK001',
      subject: 'Moving service scheduling',
      category: 'Service Request',
      status: 'In Progress',
      priority: 'high',
      createdAt: '2024-01-15',
      lastUpdate: '2024-01-16',
    },
    {
      id: 'TK002',
      subject: 'Payment receipt not received',
      category: 'Billing',
      status: 'Resolved',
      priority: 'medium',
      createdAt: '2024-01-10',
      lastUpdate: '2024-01-11',
    },
  ];

  const handleTicketSubmit = () => {
    if (!ticketForm.category || !ticketForm.subject || !ticketForm.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert('Support ticket submitted successfully! We will get back to you soon.');
    setTicketForm({
      category: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Open': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <h1 className="text-xl font-bold text-gray-900">Support</h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex space-x-8">
            {['contact', 'faq', 'tickets'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-rent-primary text-rent-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'contact' && 'Contact Us'}
                {tab === 'faq' && 'FAQ'}
                {tab === 'tickets' && 'My Tickets'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === 'contact' && (
          <div className="space-y-6">
            {/* Contact Options */}
            <div className="grid gap-4">
              {supportOptions.map((option, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gray-50 ${option.color}`}>
                        <option.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        <p className="text-sm font-medium text-gray-900">{option.contact}</p>
                      </div>
                      <Button
                        className="bg-rent-primary hover:bg-rent-primary/90"
                        onClick={() => {
                          if (option.title.includes('Phone')) {
                            window.open(`tel:${option.contact}`, '_self');
                          } else if (option.title.includes('Email')) {
                            window.open(`mailto:${option.contact}`, '_self');
                          } else {
                            alert('Live chat will be available soon!');
                          }
                        }}
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Ticket Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({...ticketForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="service">Service Request</SelectItem>
                        <SelectItem value="property">Property Related</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <Input
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <Textarea
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                    placeholder="Detailed description of your issue"
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleTicketSubmit} className="w-full bg-rent-primary hover:bg-rent-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">#{ticket.id}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status === 'Resolved' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Subject:</span>
                      <span className="text-sm text-gray-600 ml-2">{ticket.subject}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Category:</span>
                      <span className="text-sm text-gray-600 ml-2">{ticket.category}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Created:</span>
                      <span className="text-sm text-gray-600 ml-2">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Last Update:</span>
                      <span className="text-sm text-gray-600 ml-2">{new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportScreen;