import React, { FC, useState, useEffect } from "react";
import GallerySlider from "@/components/GallerySlider";
import Link from "next/link";
import { Listing, GalleryImage, RoomType } from "@prisma/client";
import { Route } from "@/routers/types";

export interface StayCard2Props {
  className?: string;
  data?: Listing & {
    galleryImages: GalleryImage[];
    roomTypes: RoomType[]
  };
  size?: "default" | "small";
}

const StayCard2: FC<StayCard2Props> = ({
  size = "default",
  className = "",
  data,
}) => {
  const {
    galleryImages,
    typeOfPlace,
    address,
    title,
    bedrooms,
    pricePerNight,
    id,
    uriId,
    roomTypes
  } = data;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Set initializing to false after a short delay to ensure smooth initial loading
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to create URL-friendly version of address
  const createUrlFriendlyAddress = (address: string) => {
    // Split the address by commas and get the last two parts (usually city and country)
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      // Get the last two parts (city and country)
      const city = parts[parts.length - 2];
      const country = parts[parts.length - 1];
      // Create URL-friendly versions
      const urlFriendlyCity = city.toLowerCase().replace(/\s+/g, '-');
      const urlFriendlyCountry = country.toLowerCase().replace(/\s+/g, '-');
      return `${urlFriendlyCity}-${urlFriendlyCountry}`;
    }
    return 'property'; // Fallback if address format is unexpected
  };

  const propertyUrl = `/properties/${uriId}` as const;


  const renderSliderGallery = () => {
    return (
      <div className="relative w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-neutral-50/80 to-neutral-100/80 dark:from-neutral-800/80 dark:to-neutral-900/80">
        {/* Card-level loading overlay - shown only during initial load */}
        <div className={`absolute inset-0 z-30 transition-opacity duration-300 ${(!imageLoaded && isInitializing) ? 'opacity-100' : 'opacity-0 pointer-events-none'} rounded-t-lg overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-amber-100/30 to-teal-100/30 dark:from-rose-900/20 dark:via-amber-900/20 dark:to-teal-900/20 animate-gradient-x"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-1/3 h-1/3 text-neutral-200/50 dark:text-neutral-700/50 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M40,80 L40,120 L160,120 L160,80 L180,80 L100,20 L20,80 L40,80 Z" />
              <rect fill="currentColor" x="60" y="90" width="20" height="30" />
              <rect fill="currentColor" x="120" y="90" width="20" height="20" />
            </svg>
          </div>
        </div>
        
        <GallerySlider
          uniqueID={`StayCard_${id}`}
          ratioClass="aspect-w-4 aspect-h-3"
          galleryImgs={galleryImages}
          href={propertyUrl}
          galleryClass="rounded-t-lg overflow-hidden"
          onImageLoaded={() => setImageLoaded(true)}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={`p-4 lg:p-6 bg-white rounded-b-lg shadow-md space-y-3 ${
          size === "default" ? "space-y-3" : "space-y-2"
        }`}
      >
        <div className="space-y-2">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {typeOfPlace} · {roomTypes.length} {roomTypes.length == 1 ? "room" : "rooms"}
          </span>
          <div className="flex items-center space-x-2">
            <h2
              className={`font-semibold capitalize text-neutral-900 dark:text-white ${
                size === "default" ? "text-base" : "text-base"
              } truncate`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5 truncate">
            {size === "default" && (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            <span className="truncate">{address}</span>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">
            ${pricePerNight}
            {` `}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                /night
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCard2 group relative ${className} border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      {renderSliderGallery()}
      <Link href={propertyUrl}>{renderContent()}</Link>
    </div>
  );
};

export default StayCard2;
