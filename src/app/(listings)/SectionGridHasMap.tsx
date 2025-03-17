"use client";

import React, { FC, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AnyReactComponent from "@/components/AnyReactComponent/AnyReactComponent";
import GoogleMapReact from "google-map-react";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import Pagination from "@/shared/Pagination";
import TabFilters from "./TabFilters";
import StayCard2 from "@/components/StayCard2";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BiSearch } from 'react-icons/bi';

const ITEMS_PER_PAGE = 9;

// Utility function to preload images
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = url;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

interface FilterCategories {
  [category: string]: {
    [filterName: string]: boolean | number;
  };
}

const initialFilterState: FilterCategories = {
  typeOfPlace: {
    "Entire place": false,
    "Private room": false,
    "Hotel room": false,
    "Shared room": false,
  },
  roomAndBeds: {
    bedrooms: 0,
    bathrooms: 0,
  },
  priceRange: {
    min: 0,
    max: 5000,
  },
};

const locationsData = [
  {
    country: "Thailand",
    regions: [{ name: "Phuket" }, { name: "Koh Samui" }],
  },
  {
    country: "Indonesia",
    regions: [{ name: "Bali" }],
  },
  {
    country: "Japan",
    regions: [{ name: "Niseko" }],
  },
];

export interface SectionGridHasMapProps {}

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStays, setFilteredStays] = useState<any[]>([]);
  const [allStays, setAllStays] = useState<any[]>([]); // Store all stays before filtering
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(initialFilterState);
  const [loading, setLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const router = useRouter();

  const location = searchParams.get("location") || "Unknown Location";
  const adults = parseInt(searchParams.get("adults") || "0");
  const children = parseInt(searchParams.get("children") || "0");
  const infants = parseInt(searchParams.get("infants") || "0");
  const totalGuests = adults + children + infants;
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  // Function to preload all images from all listings
  const preloadAllListingImages = async (listings: any[]) => {
    if (isPreloading) return;
    setIsPreloading(true);

    try {
      let loadedCount = 0;
      let totalImages = 0;

      // Calculate total number of images
      listings.forEach(listing => {
        totalImages += listing.galleryImages?.length || 0;
      });

      // Get visible listings (those on the current page)
      const currentPageItems = getCurrentPageItems();
      const visibleListingIds = new Set(currentPageItems.map(item => item.id));
      
      // Separate listings into visible and non-visible
      const visibleListings = listings.filter(listing => visibleListingIds.has(listing.id));
      const nonVisibleListings = listings.filter(listing => !visibleListingIds.has(listing.id));
      
      // First, load images for visible listings with higher priority
      if (visibleListings.length > 0) {
        const visibleBatchSize = 2; // Smaller batch size for visible images for faster loading
        for (const listing of visibleListings) {
          if (!listing.galleryImages) continue;
          
          // For each visible listing, prioritize the first image (thumbnail)
          if (listing.galleryImages.length > 0) {
            await preloadImage(listing.galleryImages[0].url).then(() => {
              loadedCount++;
              setPreloadProgress((loadedCount / totalImages) * 100);
            });
          }
          
          // Then load the rest of the images for this visible listing
          if (listing.galleryImages.length > 1) {
            for (let i = 1; i < listing.galleryImages.length; i += visibleBatchSize) {
              const batch = listing.galleryImages.slice(i, i + visibleBatchSize);
              await Promise.all(
                batch.map(img => 
                  preloadImage(img.url).then(() => {
                    loadedCount++;
                    setPreloadProgress((loadedCount / totalImages) * 100);
                  })
                )
              );
            }
          }
        }
      }
      
      // Then load all non-visible listings' images in background
      if (nonVisibleListings.length > 0) {
        const backgroundBatchSize = 5; // Larger batch size for background loading
        
        // Process each non-visible listing
        for (const listing of nonVisibleListings) {
          if (!listing.galleryImages) continue;
          
          // Load all images for this non-visible listing in batches
          for (let i = 0; i < listing.galleryImages.length; i += backgroundBatchSize) {
            const batch = listing.galleryImages.slice(i, i + backgroundBatchSize);
            
            // Use non-blocking Promise.all for background loading
            Promise.all(
              batch.map(img => 
                preloadImage(img.url).then(() => {
                  loadedCount++;
                  setPreloadProgress((loadedCount / totalImages) * 100);
                }).catch(err => {
                  console.error('Failed to load background image:', err);
                })
              )
            ).catch(err => {
              console.error('Error in background batch loading:', err);
            });
            
            // Small delay between batches to prevent overwhelming the browser
            if (i + backgroundBatchSize < listing.galleryImages.length) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error preloading images:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    if (filteredStays.length > 0) {
      const firstListing = filteredStays[(currentPage - 1) * ITEMS_PER_PAGE];
      if (firstListing) {
        setMapCenter({
          lat: firstListing.mapLat,
          lng: firstListing.mapLng,
        });
      }
    }
  }, [currentPage, filteredStays]);

  useEffect(() => {
    if (!location) {
      console.warn("Location is mandatory.");
      return;
    }

    const matchedLocation = findMatchingLocation(location);

    const query = new URLSearchParams({
      location: matchedLocation || location,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
    }).toString();

    getData(query);
  }, [searchParams]);

  // Function to match the location with the data array
  const findMatchingLocation = (searchLocation: string): string | null => {
    for (const countryData of locationsData) {
      if (countryData.country.toLowerCase() === searchLocation.toLowerCase()) {
        return countryData.country;
      }

      for (const region of countryData.regions) {
        if (region.name.toLowerCase() === searchLocation.toLowerCase()) {
          return `${countryData.country}, ${region.name}`;
        }
      }
    }
    return null;
  };

  const getData = async (query: any) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/listings/searchListings?${query}`);
      const data = response.data.data;
      console.log(data.length);
      
      // Preprocess the image URLs
      const processedData = data.map((listing: any) => {
        if (!listing.featuredImage.startsWith('https://')) {
          listing.featuredImage = listing.featuredImage.startsWith('/')
            ? `https://villaz.b-cdn.net${listing.featuredImage}`
            : `https://villaz.b-cdn.net/${listing.featuredImage}`;
        }

        if (listing.galleryImages) {
          listing.galleryImages = listing.galleryImages.map((image: any) => {
            if (!image.url.startsWith('https://')) {
              return {
                ...image,
                url: image.url.startsWith('/')
                  ? `https://villaz.b-cdn.net${image.url}`
                  : `https://villaz.b-cdn.net/${image.url}`
              };
            }
            return image;
          });
        }

        return listing;
      });

      setAllStays(processedData);
      setFilteredStays(processedData);
      setMapCenter({
        lat: processedData[0].mapLat,
        lng: processedData[0].mapLng,
      });

      // Start preloading all images after initial data load
      preloadAllListingImages(processedData);
    } catch (err: any) {
      console.error("Error fetching listings:", err);
      toast.error("Failed to fetch data, try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (category: string, name: string): void => {
    const updatedFilters = {
      ...appliedFilters,
      [category]: {
        ...appliedFilters[category],
        [name]: !appliedFilters[category][name],
      },
    };
    setAppliedFilters(updatedFilters);
  };

  const handleFiltering = () => {
    let stays = [...allStays];

    if (appliedFilters) {
      if (appliedFilters.typeOfPlace) {
        const selectedTypes = Object.entries(appliedFilters.typeOfPlace)
          .filter(([_, isChecked]) => isChecked)
          .map(([type]) => type);

        if (selectedTypes.length > 0) {
          stays = stays.filter((stay) =>
            selectedTypes.includes(stay.typeOfPlace)
          );
        }
      }

      if (appliedFilters.priceRange) {
        const { min, max } = appliedFilters.priceRange;
        stays = stays.filter(
          (stay) => stay.pricePerNight >= min && stay.pricePerNight <= max
        );
      }

      if (appliedFilters.roomAndBeds) {
        const { bedrooms, bathrooms } = appliedFilters.roomAndBeds;
        stays = stays.filter(
          (stay) =>
            stay.bedrooms >= bedrooms && stay.bathrooms >= bathrooms
        );
      }
    }

    // Ensure all stays have valid gallery images
    stays = stays.map(stay => ({
      ...stay,
      galleryImages: Array.isArray(stay.galleryImages) ? stay.galleryImages : []
    }));

    setFilteredStays(stays);
    setCurrentPage(1);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStays.slice(startIndex, endIndex);
  };

  // Update map center when page changes
  useEffect(() => {
    const currentItems = getCurrentPageItems();
    if (currentItems.length > 0) {
      setMapCenter({
        lat: currentItems[0].mapLat,
        lng: currentItems[0].mapLng,
      });
    }
  }, [currentPage, filteredStays]);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      {isPreloading && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-br from-neutral-50/90 to-neutral-100/90 dark:from-neutral-800/90 dark:to-neutral-900/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg z-50 overflow-hidden border border-neutral-200/50 dark:border-neutral-700/50">
          <div className="relative">
            {/* Animated travel elements */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-amber-100/30 to-teal-100/30 dark:from-rose-900/20 dark:via-amber-900/20 dark:to-teal-900/20 rounded-full animate-pulse"></div>
                <div className="relative">
                  <svg className="w-6 h-6 text-neutral-500 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                
                {/* Animated travel path */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(249, 168, 212, 0.2)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Preparing your journey</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {Math.round(preloadProgress)}% discovered
                </div>
              </div>
            </div>
            
            {/* Progress bar with gradient */}
            <div className="mt-2 h-0.5 w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-300/70 via-amber-300/70 to-teal-300/70 dark:from-rose-500/50 dark:via-amber-500/50 dark:to-teal-500/50 transition-all duration-300 ease-out"
                style={{ width: `${Math.round(preloadProgress)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-20 px-2 relative flex min-h-screen">
        {/* Listings Section */}
        <div className="min-h-screen w-full xl:w-[60%] 2xl:w-[60%] max-w-[1184px] flex-shrink-0 xl:px-8 ">
          <div className={` lg:mb-16 !mb-8`}>
            <h2 className="text-4xl font-semibold">Stays in  {location === "all" ? "All Locations" : location}</h2>
            <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
              {filteredStays.length} stays
              <span className="mx-2">·</span>
              {totalGuests} Guests
            </span>
          </div>

          {/* Location search input - moved above filters and aligned left */}
          {location === "all" && (
            <div className="mb-8">
              <div className="relative max-w-lg">
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full h-10 sm:h-11 px-4 pr-10 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 text-sm sm:text-base transition-all duration-200"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase().replace(/[^\w\s]/gi, '');
                    if (searchTerm === '') {
                      setFilteredStays(allStays);
                    } else {
                      const filtered = allStays.filter(stay => 
                        stay.address.toLowerCase().replace(/[^\w\s]/gi, '').includes(searchTerm)
                      );
                      setFilteredStays(filtered);
                      setCurrentPage(1);
                    }
                  }}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                  <BiSearch className="w-5 h-5" />
                </span>
              </div>
            </div>
          )}

          <div className="mb-8 lg:mb-11">
            <TabFilters
              setFilters={setAppliedFilters}
              toggleFilter={toggleFilter}
              filter={appliedFilters}
              onFilter={handleFiltering}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                {/* Animated gradient background */}
                <div className="absolute inset-0 -m-8 bg-gradient-to-r from-rose-100/30 via-amber-100/30 to-teal-100/30 dark:from-rose-900/20 dark:via-amber-900/20 dark:to-teal-900/20 animate-gradient-x rounded-lg"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 -m-8 overflow-hidden">
                  <div className="particle particle-1"></div>
                  <div className="particle particle-2"></div>
                  <div className="particle particle-3"></div>
                  <div className="particle particle-4"></div>
                </div>
                
                {/* Loading text with subtle animation */}
                <div className="relative text-xl font-medium text-neutral-600 dark:text-neutral-300">
                  <span className="inline-block animate-float-1">D</span>
                  <span className="inline-block animate-float-2">i</span>
                  <span className="inline-block animate-float-3">s</span>
                  <span className="inline-block animate-float-4">c</span>
                  <span className="inline-block animate-float-5">o</span>
                  <span className="inline-block animate-float-6">v</span>
                  <span className="inline-block animate-float-7">e</span>
                  <span className="inline-block animate-float-8">r</span>
                  <span className="inline-block animate-float-9">i</span>
                  <span className="inline-block animate-float-10">n</span>
                  <span className="inline-block animate-float-11">g</span>
                  <span className="inline-block">&nbsp;</span>
                  <span className="inline-block animate-float-12">p</span>
                  <span className="inline-block animate-float-13">r</span>
                  <span className="inline-block animate-float-14">o</span>
                  <span className="inline-block animate-float-15">p</span>
                  <span className="inline-block animate-float-16">e</span>
                  <span className="inline-block animate-float-17">r</span>
                  <span className="inline-block animate-float-18">t</span>
                  <span className="inline-block animate-float-19">i</span>
                  <span className="inline-block animate-float-20">e</span>
                  <span className="inline-block animate-float-21">s</span>
                  <span className="inline-block animate-float-22">.</span>
                  <span className="inline-block animate-float-23">.</span>
                  <span className="inline-block animate-float-24">.</span>
                </div>
              </div>
            </div>
          ) : filteredStays.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <h2 className="text-2xl font-bold text-gray-500">
                No Listings Found!
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 2xl:gap-x-6 gap-y-8">
              {getCurrentPageItems().map((item: any) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setCurrentHoverID(item.id)}
                  onMouseLeave={() => setCurrentHoverID(-1)}
                >
                  <StayCard2 data={item} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredStays.length > 0 && (
            <div className="flex mt-16 justify-center items-center">
              <Pagination
                numPages={Math.ceil(filteredStays.length / ITEMS_PER_PAGE)}
                currentPage={currentPage}
                onPageChange={(page) => {
                  window.scrollTo(0, 0);
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </div>

        {/* Map Section */}
        {!showFullMapFixed && (
          <div
            className={`flex xl:hidden items-center justify-center fixed bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-neutral-900 text-white shadow-2xl rounded-full z-30 space-x-3 text-sm cursor-pointer`}
            onClick={() => setShowFullMapFixed(true)}
          >
            <i className="text-lg las la-map"></i>
            <span>Show map</span>
          </div>
        )}

        <div
          className={`xl:flex-1 xl:static xl:block ${
            showFullMapFixed ? "fixed inset-0 z-50" : "hidden"
          }`}
        >
          {showFullMapFixed && (
            <ButtonClose
              onClick={() => setShowFullMapFixed(false)}
              className="bg-white absolute z-50 left-3 top-3 shadow-lg rounded-xl w-10 h-10"
            />
          )}

          <div className="fixed xl:sticky top-0 xl:top-[88px] left-0 w-full h-full xl:h-[calc(100vh-88px)] rounded-md overflow-hidden">
            <div className="absolute bottom-5 left-3 lg:bottom-auto lg:top-2.5 lg:left-1/2 transform lg:-translate-x-1/2 py-2 px-4 bg-white dark:bg-neutral-800 shadow-xl z-10 rounded-2xl min-w-max">
              <Checkbox
                className="text-xs xl:text-sm"
                name="xx"
                label="Search as I move the map"
              />
            </div>
            {!loading && filteredStays.length > 0 ? (
              <GoogleMapReact
                defaultZoom={12}
                center={mapCenter}
                bootstrapURLKeys={{
                  key: "AIzaSyAFYFaZcGbcBFrcky_dvNQH-gs9BjGQhTI",
                }}
                yesIWantToUseGoogleMapApiInternals
              >
                {getCurrentPageItems().map((item: any) => (
                  <AnyReactComponent
                    isSelected={currentHoverID === item.id}
                    key={item.id}
                    lat={item.mapLat}
                    lng={item.mapLng}
                    listing={item}
                  />
                ))}
              </GoogleMapReact>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
