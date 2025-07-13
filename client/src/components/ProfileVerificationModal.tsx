import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface ProfileVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onComplete: () => void;
}

const ProfileVerificationModal: React.FC<ProfileVerificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  onComplete
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    completeAddress: "",
    company: "",
    phoneNumber: ""
  });
  
  const [documents, setDocuments] = useState({
    aadhaarDocument: null as File | null,
    panDocument: null as File | null,
    addressProof: null as File | null,
    incomeProof: null as File | null
  });
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    profile: false,
    documents: false
  });
  
  const fileInputRefs = {
    aadhaarDocument: useRef<HTMLInputElement>(null),
    panDocument: useRef<HTMLInputElement>(null),
    addressProof: useRef<HTMLInputElement>(null),
    incomeProof: useRef<HTMLInputElement>(null)
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (type: keyof typeof documents, file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }
    
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.completeAddress || !formData.company) {
      alert("Please fill in all required profile fields");
      return;
    }
    
    // Validate documents
    if (!documents.aadhaarDocument || !documents.panDocument || !documents.addressProof || !documents.incomeProof) {
      alert("Please upload all required documents");
      return;
    }

    setUploading(true);
    
    try {
      // Update profile first
      const profileResponse = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }
      
      setUploadProgress(prev => ({ ...prev, profile: true }));
      
      // Upload documents
      const formDataWithFiles = new FormData();
      formDataWithFiles.append('userId', userId.toString());
      
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formDataWithFiles.append(key, file);
        }
      });
      
      const documentsResponse = await fetch('/api/upload-documents', {
        method: 'POST',
        body: formDataWithFiles
      });
      
      if (!documentsResponse.ok) {
        throw new Error('Failed to upload documents');
      }
      
      setUploadProgress(prev => ({ ...prev, documents: true }));
      
      // Success
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Complete Profile Verification</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Complete your profile and upload verification documents to book properties
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Profile Information
                {uploadProgress.profile && <CheckCircle className="h-4 w-4 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Provide your complete details as per government documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name as per Aadhaar"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <Label htmlFor="completeAddress">Complete Address *</Label>
                <Textarea
                  id="completeAddress"
                  value={formData.completeAddress}
                  onChange={(e) => handleInputChange('completeAddress', e.target.value)}
                  placeholder="Enter complete address as per government documents"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company/Organization *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter your company or organization name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Verification
                {uploadProgress.documents && <CheckCircle className="h-4 w-4 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Upload clear copies of your documents (max 2MB each, JPG/PNG/PDF)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'aadhaarDocument', label: 'Aadhaar Card *', desc: 'Front and back sides' },
                { key: 'panDocument', label: 'PAN Card *', desc: 'Clear copy of PAN card' },
                { key: 'addressProof', label: 'Address Proof *', desc: 'Utility bill, bank statement, etc.' },
                { key: 'incomeProof', label: 'Income Proof *', desc: 'Employment letter from company HR on letterhead, salary slip, or ITR' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {documents[key as keyof typeof documents] && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Uploaded
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs[key as keyof typeof fileInputRefs].current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRefs[key as keyof typeof fileInputRefs]}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(key as keyof typeof documents, file);
                      }
                    }}
                    className="hidden"
                  />
                  {documents[key as keyof typeof documents] && (
                    <p className="text-xs text-gray-500 mt-1">
                      {documents[key as keyof typeof documents]?.name}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-800">Important Notice</h4>
                  <ul className="text-sm text-orange-700 mt-1 space-y-1">
                    <li>• Documents will be verified by our team within 24 hours</li>
                    <li>• You can only book properties after document verification</li>
                    <li>• Ensure all documents are clear and valid</li>
                    <li>• Any false information may result in account suspension</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={uploading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {uploading ? "Uploading..." : "Complete Verification"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationModal;