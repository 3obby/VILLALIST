'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Page404 from '@/app/not-found';

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [contactDetail, setContactDetail] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Additional user details
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Validation states
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [cardCvcError, setCardCvcError] = useState('');
  const [cardNameError, setCardNameError] = useState('');
  
  // Card brand detection
  const [cardBrand, setCardBrand] = useState('');
  
  useEffect(() => {
    // Verify the token
    const verifyAccess = () => {
      setIsVerifying(true);
      
      // Get token from URL and sessionStorage
      const urlToken = searchParams.get('token');
      const storedToken = sessionStorage.getItem('luxePaymentToken');
      
      // If tokens don't match or don't exist, access is invalid
      if (!urlToken || !storedToken || urlToken !== storedToken) {
        setIsValidAccess(false);
        setIsVerifying(false);
        return;
      }
      
      // Check if token is expired (optional - tokens older than 10 minutes are invalid)
      try {
        const timestamp = parseInt(urlToken.split('.')[0]);
        const now = Date.now();
        const tenMinutesInMs = 10 * 60 * 1000;
        
        if (now - timestamp > tenMinutesInMs) {
          // Token expired
          setIsValidAccess(false);
          setIsVerifying(false);
          return;
        }
      } catch (e) {
        // If we can't parse the timestamp, token is invalid
        setIsValidAccess(false);
        setIsVerifying(false);
        return;
      }
      
      // If we get here, access is valid
      setIsValidAccess(true);
      
      // Get selected services, contact detail, and name from URL params
      const servicesParam = searchParams.get('services');
      const contactDetailParam = searchParams.get('contactDetail');
      const nameParam = searchParams.get('name');
      
      if (servicesParam) {
        try {
          setSelectedServices(JSON.parse(decodeURIComponent(servicesParam)));
        } catch (e) {
          console.error('Error parsing services:', e);
        }
      }
      
      if (contactDetailParam) {
        const decodedContactDetail = decodeURIComponent(contactDetailParam);
        setContactDetail(decodedContactDetail);
        
        // Check if it's an email using a simple regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValue = emailRegex.test(decodedContactDetail);
        setIsEmail(isEmailValue);
        
        // Check if it's a phone number using a simple regex
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        const isPhoneValue = !isEmailValue && phoneRegex.test(decodedContactDetail.replace(/\s+/g, ''));
        setIsPhone(isPhoneValue);
      }
      
      if (nameParam) {
        setCardName(decodeURIComponent(nameParam));
      }
      
      setIsVerifying(false);
    };
    
    verifyAccess();
  }, [searchParams]);
  
  // If still verifying, show loading
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }
  
  // If access is invalid, show 404 page
  if (!isValidAccess) {
    return <Page404 />;
  }
  
  // Detect card brand based on first digits
  const detectCardBrand = (number) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const discoverRegex = /^6(?:011|5)/;
    
    if (visaRegex.test(number)) return 'visa';
    if (mastercardRegex.test(number)) return 'mastercard';
    if (amexRegex.test(number)) return 'amex';
    if (discoverRegex.test(number)) return 'discover';
    return '';
  };
  
  // Validate card number with Luhn algorithm (used by Stripe)
  const validateCardNumber = (number) => {
    if (!number) return 'Card number is required';
    
    // Remove spaces
    const value = number.replace(/\s+/g, '');
    
    if (!/^\d+$/.test(value)) return 'Card number can only contain digits';
    if (value.length < 13 || value.length > 19) return 'Card number must be between 13 and 19 digits';
    
    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    if (sum % 10 !== 0) return 'Invalid card number';
    return '';
  };
  
  // Validate expiry date
  const validateExpiry = (expiry) => {
    if (!expiry) return 'Expiry date is required';
    
    const [month, year] = expiry.split('/');
    
    if (!month || !year) return 'Expiry date must be in MM/YY format';
    if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) return 'Expiry date must contain only digits';
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // Jan is 0
    
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);
    
    if (expiryMonth < 1 || expiryMonth > 12) return 'Invalid month';
    
    // Check if card is expired
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return 'Card has expired';
    }
    
    return '';
  };
  
  // Validate CVC
  const validateCvc = (cvc, brand) => {
    if (!cvc) return 'CVC is required';
    if (!/^\d+$/.test(cvc)) return 'CVC can only contain digits';
    
    // Amex requires 4 digits, others require 3
    if (brand === 'amex' && cvc.length !== 4) return 'CVC must be 4 digits for American Express';
    if (brand !== 'amex' && cvc.length !== 3) return 'CVC must be 3 digits';
    
    return '';
  };
  
  // Handle card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits (except Amex)
    let formatted;
    const brand = detectCardBrand(value);
    setCardBrand(brand);
    
    if (brand === 'amex') {
      // Format as XXXX XXXXXX XXXXX for Amex
      formatted = value.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      // Format as XXXX XXXX XXXX XXXX for others
      formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    setCardNumber(formatted.trim());
    setCardNumberError('');
  };
  
  // Handle expiry input with auto-formatting
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    
    // Auto-format to MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setCardExpiry(value);
    setCardExpiryError('');
  };
  
  // Handle CVC input
  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    // Limit to 3 digits (4 for Amex)
    const maxLength = cardBrand === 'amex' ? 4 : 3;
    setCardCvc(value.slice(0, maxLength));
    setCardCvcError('');
  };
  
  // Handle form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const numberError = validateCardNumber(cardNumber);
    const expiryError = validateExpiry(cardExpiry);
    const cvcError = validateCvc(cardCvc, cardBrand);
    const nameError = !cardName ? 'Name is required' : '';
    
    setCardNumberError(numberError);
    setCardExpiryError(expiryError);
    setCardCvcError(cvcError);
    setCardNameError(nameError);
    
    // If any errors, don't submit
    if (numberError || expiryError || cvcError || nameError) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit membership data to API
    const submitMembershipData = async () => {
      try {
        const response = await fetch('/api/luxe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactDetail,
            name: cardName, // Use the card name as the member name
            selectedServices,
            additionalInfo
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          console.error('Error submitting membership data:', data.message);
        }
        
        // Continue with success flow regardless of API response
        // to ensure good user experience
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Redirect back to main page after success message
        setTimeout(() => {
          router.push('/');
        }, 7000);
        
      } catch (error) {
        console.error('Error submitting membership data:', error);
        // Still show success to user even if API fails
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Redirect back to main page after success message
        setTimeout(() => {
          router.push('/');
        }, 7000);
      }
    };
    
    // Simulate payment processing, then submit membership data
    setTimeout(() => {
      submitMembershipData();
    }, 1500);
  };
  
  // Get card brand icon
  const getCardBrandIcon = () => {
    switch (cardBrand) {
      case 'visa':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png";
      case 'mastercard':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png";
      case 'amex':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png";
      case 'discover':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Discover_Card_logo.svg/1280px-Discover_Card_logo.svg.png";
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 mr-2">LUXE</div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-500 ml-2">Checkout</div>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-500">Secure payment</div>
            <div className="ml-2 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4">
        {submitSuccess ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-4">
              We appreciate your interest in our LUXE services.
            </p>
            <p className="text-gray-600 mb-6">
              <strong>No charges have been made to your card.</strong> This was just to filter out spam.
            </p>
            <p className="text-gray-600 mb-8">
              We'll be in touch soon with exclusive offers for the services you selected.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting you back to the homepage...
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">LUXE Membership</span>
                    <span className="font-medium text-gray-800">$17.00</span>
                  </div>
                  
                  {selectedServices.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Services:</h3>
                      <ul className="space-y-1">
                        {selectedServices.map((service, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="h-px bg-gray-200 mb-4"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium text-gray-800">Total</span>
                  <span className="font-bold text-xl text-gray-800">$17.00</span>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="Amex" className="h-4" />
                </div>
              </div>
            </div>
            
            {/* Right Column - Payment Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      value={contactDetail}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {isEmail 
                        ? 'We will send your membership details to this email.' 
                        : isPhone 
                          ? 'We will contact you at this number.' 
                          : 'We have saved your contact information.'}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Any specific requirements or questions about your selected services?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Card information
                    </label>
                    <div className="mb-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          onBlur={() => setCardNumberError(validateCardNumber(cardNumber))}
                          placeholder="1234 1234 1234 1234"
                          maxLength={cardBrand === 'amex' ? 17 : 19}
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 pr-10 ${
                            cardNumberError ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {cardBrand && (
                            <img src={getCardBrandIcon()} alt={cardBrand} className="h-5" />
                          )}
                        </div>
                      </div>
                      {cardNumberError && (
                        <p className="mt-1 text-sm text-red-500">{cardNumberError}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-1/2">
                        <div className="relative">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            onBlur={() => setCardExpiryError(validateExpiry(cardExpiry))}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                              cardExpiryError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {cardExpiryError && (
                          <p className="mt-1 text-sm text-red-500">{cardExpiryError}</p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <div className="relative">
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={handleCvcChange}
                            onBlur={() => setCardCvcError(validateCvc(cardCvc, cardBrand))}
                            placeholder={cardBrand === 'amex' ? 'CVC (4 digits)' : 'CVC'}
                            maxLength={cardBrand === 'amex' ? 4 : 3}
                            required
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                              cardCvcError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-help group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                              The CVC is the 3-digit code on the back of your card. For American Express, it's the 4-digit code on the front.
                            </div>
                          </div>
                        </div>
                        {cardCvcError && (
                          <p className="mt-1 text-sm text-red-500">{cardCvcError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Name on card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        setCardNameError('');
                      }}
                      placeholder="Full name"
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                        cardNameError ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {cardNameError && (
                      <p className="mt-1 text-sm text-red-500">{cardNameError}</p>
                    )}
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="mr-3 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="text-sm text-blue-800">
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing payment...
                      </>
                    ) : (
                      'Pay $17.00'
                    )}
                  </button>
                  
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      ← Return to previous page
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-6" />
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LUXE Experience. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage; 