'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Phone, Mail, User, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setupRecaptchaVerifier, sendVerificationCode, verifyCode, cleanupRecaptcha, formatPhoneNumber, validateIndianPhoneNumber } from '@/lib/phoneAuth';
import type { Job } from '@/lib/jobs';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
}

export default function JobApplicationModal({ isOpen, onClose, job }: JobApplicationModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<'phone-input' | 'phone-verification' | 'application-form' | 'success'>('phone-input');
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null,
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setStep('phone-input');
    setFormData({
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
      resume: null,
    });
    setVerificationCode('');
    setConfirmationResult(null);
    setError('');
    setUploadProgress(0);
    cleanupRecaptcha();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      setError('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone) {
      setError('Please enter your phone number.');
      return;
    }

    // Validate Indian phone number
    if (!validateIndianPhoneNumber(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format phone number to international format
      const phoneNumber = formatPhoneNumber(formData.phone, '+91');

      // Setup reCAPTCHA verifier
      const appVerifier = setupRecaptchaVerifier('recaptcha-container', 'invisible');

      // Send verification code using Firebase Auth
      const result = await sendVerificationCode(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('phone-verification');
    } catch (error: any) {
      console.error('Phone verification error:', error);
      setError(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.resume) {
      setError('Please fill in all required fields and upload your resume.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload resume to Firebase Storage
      const resumeFile = formData.resume!;
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      const resumeRef = ref(storage, `resumes/${currentUser.uid}/${Date.now()}_${resumeFile.name}`);

      setUploadProgress(10);

      const uploadResult = await uploadBytes(resumeRef, resumeFile);
      setUploadProgress(50);

      const resumeUrl = await getDownloadURL(uploadResult.ref);
      setUploadProgress(80);

      // Save application to Firestore
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        jobSlug: job.slug,
        applicantName: formData.name,
        applicantEmail: formData.email,
        applicantPhone: '+91' + cleanPhone,
        resumeUrl: resumeUrl,
        resumeFileName: resumeFile.name,
        coverLetter: formData.coverLetter,
        appliedDate: serverTimestamp(),
        status: 'pending',
        verifiedPhone: true,
      };

      await addDoc(collection(db, 'jobApplications'), applicationData);
      setUploadProgress(100);

      setStep('success');
    } catch (error: any) {
      console.error('Application submission error:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    if (!confirmationResult) {
      setError('Verification session expired. Please start over.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify the code using our helper function
      const result = await verifyCode(confirmationResult, verificationCode);

      // Phone verified successfully, move to application form
      setStep('application-form');
      console.log('User signed in successfully:', result.user.uid);
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-tight">
              Apply for {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              {job.department} • {job.location}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs sm:text-sm overflow-x-auto">
            <div className={`flex items-center gap-1 sm:gap-2 whitespace-nowrap ${step === 'phone-input' ? 'text-orange-600' : (step === 'phone-verification' || step === 'application-form' || step === 'success') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'phone-input' ? 'bg-orange-100 text-orange-600' : (step === 'phone-verification' || step === 'application-form' || step === 'success') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                1
              </div>
              <span className="hidden sm:inline">Phone Verification</span>
              <span className="sm:hidden">Phone</span>
            </div>
            <div className={`flex items-center gap-1 sm:gap-2 whitespace-nowrap ${step === 'phone-verification' ? 'text-orange-600' : (step === 'application-form' || step === 'success') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'phone-verification' ? 'bg-orange-100 text-orange-600' : (step === 'application-form' || step === 'success') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                2
              </div>
              <span className="hidden sm:inline">Verify Code</span>
              <span className="sm:hidden">Verify</span>
            </div>
            <div className={`flex items-center gap-1 sm:gap-2 whitespace-nowrap ${step === 'application-form' ? 'text-orange-600' : step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'application-form' ? 'bg-orange-100 text-orange-600' : step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                3
              </div>
              <span className="hidden sm:inline">Application Form</span>
              <span className="sm:hidden">Apply</span>
            </div>
            <div className={`flex items-center gap-1 sm:gap-2 whitespace-nowrap ${step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {step === 'success' ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : '4'}
              </div>
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {step === 'phone-input' && (
            <div className="text-center">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Verify Your Phone Number
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                  We'll send you an SMS verification code to confirm your identity
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter Indian mobile number (e.g., 9876543210)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === 'application-form' && (
            <form onSubmit={handleApplicationSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                      placeholder="Enter your phone number"
                      required
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ✓ Phone number verified
                  </p>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resume Upload
                </h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {formData.resume ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.resume.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or Word document (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? 'Sending...' : 'Continue to Verification'}
                </Button>
              </div>
            </form>
          )}

          {step === 'phone-verification' && (
            <div className="text-center">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                  We've sent a 6-digit verification code to{' '}
                  <span className="font-medium">+91{formData.phone}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-lg sm:text-2xl tracking-widest py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('phone-input')}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </div>
              </form>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Uploading resume... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Application Submitted Successfully!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">
                Thank you for applying to the <strong>{job.title}</strong> position. Our HR team will review your application and get back to you within 3-5 business days.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
                <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-400">
                  <strong>What's next?</strong><br />
                  • We'll review your application and resume<br />
                  • If shortlisted, we'll contact you for an interview<br />
                  • You can check your application status via email
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 px-8"
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container" ref={recaptchaRef} className="hidden"></div>
      </div>
    </div>
  );
}