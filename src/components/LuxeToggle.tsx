'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';

const LuxeToggle: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if we're on the luxe page or payment page
  const isLuxePage = pathname?.includes('/luxe');
  const isPaymentPage = pathname?.includes('/luxe/payment');
  
  // Set isLuxeMode based on the current path
  const [isLuxeMode, setIsLuxeMode] = useState(isLuxePage);
  
  // Update isLuxeMode when pathname changes
  useEffect(() => {
    setIsLuxeMode(isLuxePage);
  }, [pathname, isLuxePage]);
  
  // Check if we're on a listing detail page
  const isListingDetailPage = pathname?.includes('/properties/');

  const toggleLuxeMode = () => {
    if (isLuxeMode) {
      // If currently in luxe mode
      if (isPaymentPage) {
        // If on payment page, go directly to home instead of using back button
        router.push('/');
      } else {
        // If on regular luxe page, go back to previous page
        window.history.back();
      }
    } else {
      // If in standard mode, navigate to luxe page
      router.push('/luxe');
    }
    // No need to manually set isLuxeMode as it will be updated by the useEffect when pathname changes
  };

  // Hide the toggle completely on payment page if desired
  // Uncomment the next line if you want to hide the toggle on payment page
  // if (isPaymentPage) return null;

  return (
    <div className={`fixed ${
      isListingDetailPage ? 'top-16 md:top-4 md:right-20' : 'top-4 right-4'
    } z-[1000] flex items-center ${
      isLuxeMode ? 'bg-neutral-800 text-neutral-200' : 'bg-white text-neutral-700'
    } rounded-full shadow-lg px-4 py-2 transition-all duration-300 transform hover:scale-105`}>
      <span className="mr-3 text-sm font-medium">
        {isLuxeMode ? 'Luxe' : 'Standard'}
      </span>
      <Switch
        checked={isLuxeMode}
        onChange={toggleLuxeMode}
        className={`${
          isLuxeMode ? 'bg-primary-500' : 'bg-neutral-300'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Enable Luxe mode</span>
        <span
          className={`${
            isLuxeMode ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      {isLuxeMode && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-black rounded-full px-2 py-1 transform rotate-12">
          +$17
        </div>
      )}
    </div>
  );
};

export default LuxeToggle;