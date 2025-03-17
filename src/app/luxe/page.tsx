'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChampagneGlasses, FaHelicopter, FaCarSide } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { GiDiamonds, GiSailboat } from 'react-icons/gi';
import { MdOutlineVilla, MdSpa } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const LuxePage = () => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [name, setName] = useState('');
  const [contactDetail, setContactDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate a secret token (timestamp + random string)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const secretToken = `${timestamp}.${randomString}`;
    
    // Store the token in sessionStorage (will be cleared when browser is closed)
    sessionStorage.setItem('luxePaymentToken', secretToken);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowEmailModal(false);
      
      // Navigate to payment page with selected services, contact detail, name and secret token
      const servicesParam = encodeURIComponent(JSON.stringify(selectedServices));
      const contactDetailParam = encodeURIComponent(contactDetail);
      const nameParam = encodeURIComponent(name);
      router.push(`/luxe/payment?services=${servicesParam}&contactDetail=${contactDetailParam}&name=${nameParam}&token=${secretToken}`);
    }, 1000);
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const handleServiceToggle = (serviceTitle) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceTitle)) {
        return prev.filter(title => title !== serviceTitle);
      } else {
        return [...prev, serviceTitle];
      }
    });
  };

  const handleContinueToEmail = () => {
    setShowServiceSelector(false);
    setShowEmailModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.6, 0.05, 0.01, 0.9] 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3, 
        ease: [0.6, 0.05, 0.01, 0.9] 
      }
    }
  };

  const luxeServices = [
    {
      title: 'Private Jets',
      icon: <FaHelicopter className="text-4xl text-gold-500" />,
      description: 'Travel in ultimate comfort with our private jet services, available 24/7.',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Yacht Charters',
      icon: <GiSailboat className="text-4xl text-gold-500" />,
      description: 'Explore the waters in style with our luxury yacht charter options.',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Chauffeur Service',
      icon: <FaCarSide className="text-4xl text-gold-500" />,
      description: 'Premium transportation with professional chauffeurs at your disposal.',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Exclusive Villas',
      icon: <MdOutlineVilla className="text-4xl text-gold-500" />,
      description: 'Stay in our handpicked collection of the most exclusive properties.',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Personal Concierge',
      icon: <GiDiamonds className="text-4xl text-gold-500" />,
      description: 'Your dedicated concierge is available around the clock for any request.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Spa & Wellness',
      icon: <MdSpa className="text-4xl text-gold-500" />,
      description: 'Indulge in premium spa treatments in the comfort of your accommodation.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
  ];

  const featuredProperties = [
    {
      title: "Beachfront Villa",
      location: "Malibu, California",
      price: "$5,000/night",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Mountain Retreat",
      location: "Aspen, Colorado",
      price: "$3,800/night",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Private Island",
      location: "Bora Bora, French Polynesia",
      price: "$12,000/night",
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Add a function to select all services
  const selectAllServices = () => {
    const allServiceTitles = luxeServices.map(service => service.title);
    setSelectedServices(allServiceTitles);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Experience"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-neutral-900 z-10"></div>
        
        <div className="relative z-20 h-full flex flex-col justify-center items-center px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              <span className="text-gold-400">LUXE</span> EXPERIENCE
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              Elevate your stay with our premium services and exclusive amenities.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-x-4"
          >
            <div></div>
            <button 
              className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 w-full shadow-lg shadow-yellow-500/50 border-2 border-yellow-300"
              onClick={() => {
                selectAllServices();
                setShowServiceSelector(true);
              }}
            >
              Get Access
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
        >
          <div className="flex items-center space-x-2 text-gold-400">
            <FaChampagneGlasses className="text-2xl" />
            <span className="text-sm uppercase tracking-widest">Premium Experience</span>
          </div>
        </motion.div>
      </motion.div>
      
      
      {/* Services Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-black rounded-3xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gold-400">Exclusive</span> Services
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our LUXE membership unlocks a world of premium services designed to make your stay extraordinary.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {luxeServices.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-neutral-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300 transform hover:scale-105 border border-gold-500/20 cursor-pointer"
              onClick={() => {
                setSelectedServices([service.title]);
                setShowServiceSelector(true);
              }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-8">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gold-400">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Membership Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-neutral-900"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-gold-400">LUXE</span> Membership
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Join our exclusive membership for just $17 and unlock a world of premium benefits.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 md:p-12 rounded-2xl border border-gold-500/30 max-w-4xl mx-auto shadow-xl shadow-gold-500/5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gold-400">Premium Access</h3>
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-center">
                    <span className="mr-2 text-gold-400">✓</span> 
                    Priority booking for all properties
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-gold-400">✓</span> 
                    Exclusive access to limited availability properties
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-gold-400">✓</span> 
                    Complimentary upgrades when available
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-gold-400">✓</span> 
                    24/7 dedicated concierge service
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-gold-400">✓</span> 
                    Special rates on premium services
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">$17</div>
                <div className="text-sm text-gray-400 mb-6">One-time fee</div>
                <button 
                  className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 w-full shadow-lg shadow-yellow-500/50 border-2 border-yellow-300"
                  onClick={() => {
                    selectAllServices();
                    setShowServiceSelector(true);
                  }}
                >
                  Get Access
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Back to Home */}
      <div className="py-10 text-center">
        <button 
          onClick={handleGoBack}
          className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer bg-transparent border-none font-medium"
        >
          ← Back to Standard Experience
        </button>
      </div>
      
      {/* Service Selector Modal */}
      <AnimatePresence>
        {showServiceSelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowServiceSelector(false)}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl border border-yellow-500/30 shadow-xl shadow-yellow-500/10 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - No background */}
              <div className="flex justify-between items-center mb-3 sm:mb-4 sticky top-0 z-10 pt-1">
                <div className="flex items-center">
                  <button 
                    onClick={() => setShowServiceSelector(false)}
                    className="text-gray-400 hover:text-white transition-colors bg-neutral-700 hover:bg-neutral-600 rounded-full p-2 mr-2 sm:mr-3 md:hidden"
                    aria-label="Close"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">Curate Your Luxe Experience</h3>
                </div>
                
                {/* Desktop close button - hidden on mobile */}
                <button 
                  onClick={() => setShowServiceSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors bg-neutral-700 hover:bg-neutral-600 rounded-full p-2 hidden md:block"
                  aria-label="Close"
                >
                  <FaTimes className="text-base" />
                </button>
              </div>
              
              {/* Content - Scrollable */}
              <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg">
                    Your LUXE membership includes access to our premium services. Customize your experience by selecting the services you're most interested in:
                  </p>
                  
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xs sm:text-sm mr-2">
                        {selectedServices.length} of {luxeServices.length} services selected
                      </span>
                      <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${(selectedServices.length / luxeServices.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={selectAllServices}
                        className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-yellow-500/20 text-yellow-400 rounded-full hover:bg-yellow-500/30 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => setSelectedServices([])}
                        className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-neutral-700 text-gray-300 rounded-full hover:bg-neutral-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {luxeServices.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 transform ${
                        selectedServices.includes(service.title) 
                          ? 'ring-2 ring-yellow-400 scale-[1.02]' 
                          : 'ring-1 ring-neutral-700 hover:ring-neutral-500'
                      }`}
                      onClick={() => handleServiceToggle(service.title)}
                    >
                      <div className="relative h-28 sm:h-36 md:h-40 w-full">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className={`transition-all duration-500 ${
                            selectedServices.includes(service.title) 
                              ? 'brightness-100' 
                              : 'brightness-50 group-hover:brightness-75'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 flex items-center justify-between">
                        <div>
                          <h4 className={`font-bold text-sm sm:text-base transition-colors ${
                            selectedServices.includes(service.title) 
                              ? 'text-yellow-400' 
                              : 'text-white'
                          }`}>
                            {service.title}
                          </h4>
                        </div>
                        
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all ${
                          selectedServices.includes(service.title) 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-neutral-700 text-neutral-400 group-hover:bg-neutral-600'
                        }`}>
                          {selectedServices.includes(service.title) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover overlay with description - Hidden on mobile touch */}
                      <div className={`absolute inset-0 bg-black/80 items-center justify-center p-3 transition-opacity duration-300 hidden sm:flex ${
                        selectedServices.includes(service.title) 
                          ? 'opacity-0 group-hover:opacity-100' 
                          : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <p className="text-xs sm:text-sm text-center text-gray-200">{service.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Footer - No background */}
              <div className="flex justify-between items-center pt-3 sm:pt-4 mt-auto">
                <button
                  onClick={() => setShowServiceSelector(false)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-700 text-white text-xs sm:text-sm rounded-lg hover:bg-neutral-600 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </button>
                
                <button
                  onClick={handleContinueToEmail}
                  disabled={selectedServices.length === 0}
                  className={`px-4 py-1.5 sm:px-6 sm:py-3 rounded-lg font-bold text-xs sm:text-sm flex items-center ${
                    selectedServices.length > 0
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400 border-2 border-yellow-300 shadow-lg shadow-yellow-500/20'
                      : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                  } transition-all`}
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-neutral-800 rounded-2xl p-8 max-w-md w-full border border-gold-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-400">Get Exclusive Access</h3>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              {selectedServices.length > 0 && (
                <div className="mb-6 p-3 bg-neutral-700 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Selected services:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-neutral-600 rounded-full text-xs text-yellow-400">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-white mb-3"
                  />
                  <div className="mb-3">
                    <input
                      type="text"
                      value={contactDetail}
                      onChange={(e) => setContactDetail(e.target.value)}
                      placeholder="Your email or phone number"
                      required
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      We'll use this to contact you about your LUXE membership.
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-70 shadow-md shadow-yellow-500/30 border-2 border-yellow-300"
                >
                  {isSubmitting ? 'Processing...' : 'Get Access'}
                </button>
              </form>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                By joining, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxePage; 

<style jsx global>{`
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 640px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 3px;
    }
  }
`}</style> 