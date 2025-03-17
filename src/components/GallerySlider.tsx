"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/utils/animationVariants";
import Link from "next/link";
import { GalleryImage } from "@prisma/client";
import { Route } from "@/routers/types";

export interface GallerySliderProps {
  className?: string;
  galleryImgs: GalleryImage[];
  ratioClass?: string;
  uniqueID: string;
  href?: Route<string>;
  imageClass?: string;
  galleryClass?: string;
  navigation?: boolean;
  onImageLoaded?: () => void;
}

const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = url;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

export default function GallerySlider({
  className = "",
  galleryImgs,
  ratioClass = "aspect-w-4 aspect-h-3",
  imageClass = "",
  uniqueID = "uniqueID",
  galleryClass = "rounded-xl",
  href,
  navigation = true,
  onImageLoaded,
}: GallerySliderProps) {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<number[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const images = galleryImgs;
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialImageRef = useRef<HTMLImageElement | null>(null);

  // Preload the first image immediately on component mount
  useEffect(() => {
    if (images && images.length > 0 && isFirstLoad) {
      // Always show loader first
      setLoaded(false);
      setIsChangingImage(true);
      
      // Create an image element to preload the first image
      const img = document.createElement('img');
      img.src = images[0].url;
      initialImageRef.current = img;
      
      // When the first image is loaded, show it after a delay
      img.onload = () => {
        setPreloadedImages([0]);
        
        // Use a timeout to ensure the loader is shown for a minimum time
        setTimeout(() => {
          setLoaded(true);
          setIsChangingImage(false);
          setIsInitializing(false);
          setIsFirstLoad(false);
          if (onImageLoaded) onImageLoaded();
        }, 600); // Consistent minimum loader time
      };
      
      // If image loading fails, still update states to avoid hanging
      img.onerror = () => {
        setTimeout(() => {
          setIsInitializing(false);
          setIsFirstLoad(false);
          setLoaded(true);
          setIsChangingImage(false);
        }, 600); // Consistent minimum loader time
      };
    }
  }, [images, isFirstLoad, onImageLoaded]);

  // Clear any existing timeout when component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (imageChangeTimeoutRef.current) {
        clearTimeout(imageChangeTimeoutRef.current);
      }
      if (initialImageRef.current) {
        initialImageRef.current.onload = null;
        initialImageRef.current.onerror = null;
        initialImageRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Skip the first load since we handle it separately
    if (isFirstLoad && index === 0) return;
    
    let isMounted = true;

    const loadCurrentAndPreloadRest = async () => {
      if (!images || images.length === 0) return;
      
      try {
        // CRITICAL: Always force loader to be shown first
        setLoaded(false);
        setIsChangingImage(true);
        
        // First, ensure current image is loaded
        if (!preloadedImages.includes(index)) {
          // For non-preloaded images, we need to wait for the image to load
          try {
            await preloadImage(images[index].url);
            if (isMounted) {
              // Add the current image to preloaded images immediately
              setPreloadedImages(prev => [...prev, index]);
              setLoadingProgress((preloadedImages.length + 1) / images.length * 100);
              
              // After image is loaded, wait a minimum time before showing it
              // This ensures the loader is visible for a consistent time
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
              }
              
              // Use a longer timeout to ensure the loader is visible
              loadingTimeoutRef.current = setTimeout(() => {
                if (isMounted) {
                  // Only hide the loader when we're 100% sure the image is ready
                  // Use another requestAnimationFrame to ensure the image is fully rendered
                  requestAnimationFrame(() => {
                    // Only update if we're still mounted
                    if (isMounted) {
                      setLoaded(true);
                      setIsChangingImage(false);
                    }
                  });
                }
              }, 800); // Longer minimum loader time
            }
          } catch (error) {
            console.error('Error loading image:', error);
            // If there's an error, still update states after a delay to avoid hanging
            if (isMounted) {
              setTimeout(() => {
                setLoaded(true);
                setIsChangingImage(false);
              }, 800);
            }
          }
        } else {
          // For preloaded images, still show loader for a minimum time
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
          
          // Use a longer timeout to ensure the loader is visible
          loadingTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              // Only hide the loader when we're 100% sure the image is ready
              // Use another requestAnimationFrame to ensure the image is fully rendered
              requestAnimationFrame(() => {
                setLoaded(true);
                setIsChangingImage(false);
              });
            }
          }, 800); // Longer minimum loader time
        }

        // Then preload the rest in background
        let loadedCount = preloadedImages.length;
        
        // Separate visible and non-visible images
        // Visible images: current, next, and previous
        const visibleIndices = new Set([
          index,
          index + 1 < images.length ? index + 1 : null,
          index - 1 >= 0 ? index - 1 : null
        ].filter(idx => idx !== null));
        
        // First, load adjacent (visible) images with high priority
        const adjacentImages = Array.from(visibleIndices)
          .filter(idx => idx !== index && !preloadedImages.includes(idx as number)) as number[];
        
        if (adjacentImages.length > 0) {
          await Promise.all(
            adjacentImages.map(imgIndex => 
              preloadImage(images[imgIndex].url).then(() => {
                loadedCount++;
                if (isMounted) {
                  setPreloadedImages(prev => [...prev, imgIndex]);
                  setLoadingProgress((loadedCount / images.length) * 100);
                }
              })
            )
          );
        }
        
        // Then load all remaining (non-visible) images in background batches
        const nonVisibleImages = [];
        for (let i = 0; i < images.length; i++) {
          if (!visibleIndices.has(i) && !preloadedImages.includes(i)) {
            nonVisibleImages.push(i);
          }
        }
        
        // Load non-visible images in background batches
        const batchSize = 3; // Increased batch size for background loading
        for (let i = 0; i < nonVisibleImages.length; i += batchSize) {
          const batch = nonVisibleImages.slice(i, i + batchSize);
          // Use non-blocking Promise.all for background loading
          Promise.all(
            batch.map(imgIndex => 
              preloadImage(images[imgIndex].url).then(() => {
                loadedCount++;
                if (isMounted) {
                  setPreloadedImages(prev => [...prev, imgIndex]);
                  setLoadingProgress((loadedCount / images.length) * 100);
                }
              }).catch(err => {
                console.error(`Failed to load background image at index ${imgIndex}:`, err);
              })
            )
          ).catch(err => {
            console.error('Error in background batch loading:', err);
          });
          
          // Small delay between batches to prevent overwhelming the browser
          if (i + batchSize < nonVisibleImages.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('Error loading images:', error);
        // If there's an error, still update states to avoid hanging
        if (isMounted) {
          setLoaded(true);
          setIsChangingImage(false);
        }
      }
    };

    loadCurrentAndPreloadRest();

    return () => {
      isMounted = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (imageChangeTimeoutRef.current) {
        clearTimeout(imageChangeTimeoutRef.current);
      }
    };
  }, [index, galleryImgs, isFirstLoad, preloadedImages]);

  function changePhotoId(newVal: number) {
    // Prevent rapid clicking
    if (isChangingImage) return;
    
    // Direction is no longer needed for sliding animation
    // but we'll keep it for compatibility with other code
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    
    // CRITICAL: Always force loader to be shown first
    // This must happen before any other state changes
    setLoaded(false);
    setIsChangingImage(true);
    
    // Clear any existing timeout to prevent race conditions
    if (imageChangeTimeoutRef.current) {
      clearTimeout(imageChangeTimeoutRef.current);
      imageChangeTimeoutRef.current = null;
    }
    
    // Use requestAnimationFrame to ensure the loading state is applied
    // before changing the index, preventing white flash
    requestAnimationFrame(() => {
      // Only change index after loader is shown
      setIndex(newVal);
      
      // For preloaded images, we still want to show the loader for a minimum time
      // to ensure consistent experience
      const isPreloaded = preloadedImages.includes(newVal);
      
      if (isPreloaded) {
        // For preloaded images, show loader for a minimum time
        imageChangeTimeoutRef.current = setTimeout(() => {
          // Use requestAnimationFrame to ensure the image is fully rendered
          // before hiding the loader
          requestAnimationFrame(() => {
            // Only update if we're still on this image
            if (newVal === index) {
              setLoaded(true);
              setIsChangingImage(false);
            }
          });
        }, 800); // Longer minimum time to ensure loader is visible
      }
      // For non-preloaded images, the loader will remain until the image is fully loaded
      // and the timeout in loadCurrentAndPreloadRest completes
    });
  }

  const handlers = useSwipeable({
    onSwipedLeft: (e) => {
      e.event.stopPropagation();
      e.event.preventDefault();
      if (index < images?.length - 1 && !isChangingImage) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: (e) => {
      e.event.stopPropagation();
      e.event.preventDefault();
      if (index > 0 && !isChangingImage) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  let currentImage = images[index];
  const allImagesLoaded = preloadedImages.length === images.length;
  // CRITICAL: Always show loader unless image is 100% ready
  // This is the most aggressive loader showing logic possible
  const showLoader = !loaded || isChangingImage || (isInitializing && isFirstLoad) || true;

  // Function to actually hide the loader only when image is 100% ready
  const hideLoader = () => {
    if (loaded && !isChangingImage && !isInitializing && !isFirstLoad) {
      return true;
    }
    return false;
  };

  return (
    <MotionConfig
      transition={{
        opacity: { duration: 0.1 },
      }}
    >
      {/* Add a style tag to prevent progressive image loading */}
      <style jsx global>{`
        /* Prevent progressive image loading */
        img {
          image-rendering: auto !important;
        }
        /* Hide images until fully loaded */
        .gallery-slider-container img {
          opacity: 0 !important;
          transition: none !important;
          visibility: hidden !important;
          display: none !important;
        }
        /* Only show images when explicitly set to visible */
        .gallery-slider-container img.opacity-100 {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        /* Disable Next.js image optimization features that cause progressive loading */
        .gallery-slider-container span[style*="box-sizing: border-box"] {
          background: none !important;
          opacity: 0 !important;
        }
      `}</style>
      
      <div
        className={`relative group group/cardGallerySlider ${className} bg-gradient-to-br from-neutral-50/80 to-neutral-100/80 dark:from-neutral-800/80 dark:to-neutral-900/80 gallery-slider-container`}
        {...handlers}
      >
        {/* Main image */}
        <div className={`w-full overflow-hidden ${galleryClass}`}>
          <div className={`relative flex items-center justify-center ${ratioClass}`}>
            {/* Background color to prevent white flash - always visible */}
            <div className="absolute inset-0 bg-neutral-100/90 dark:bg-neutral-800/90"></div>
            
            {/* Loading animation - always render but conditionally show */}
            <div 
              className="absolute inset-0 z-20"
              style={{ 
                opacity: hideLoader() ? 0 : 1,
                // Critical: No transition when showing loader (immediate), only when hiding
                transition: hideLoader() ? 'opacity 0.2s ease-out' : 'none',
                // No delay for loader visibility changes
                transitionDelay: '0s',
                pointerEvents: hideLoader() ? 'none' : 'auto',
                // Add a stronger background to prevent white flash
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 via-amber-100/30 to-teal-100/30 dark:from-rose-900/20 dark:via-amber-900/20 dark:to-teal-900/20 animate-gradient-x"></div>
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
              </div>
              
              {/* Subtle villa silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 120" className="w-1/2 h-1/2 text-neutral-200/50 dark:text-neutral-700/50 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M40,80 L40,120 L160,120 L160,80 L180,80 L100,20 L20,80 L40,80 Z" />
                  <rect fill="currentColor" x="60" y="90" width="20" height="30" />
                  <rect fill="currentColor" x="120" y="90" width="20" height="20" />
                  <path fill="currentColor" d="M100,50 L120,70 L80,70 Z" />
                </svg>
              </div>
              
              {/* Loading progress indicator - subtle and elegant */}
              {!allImagesLoaded && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="h-0.5 w-2/3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-300/70 via-amber-300/70 to-teal-300/70 dark:from-rose-500/50 dark:via-amber-500/50 dark:to-teal-500/50 animate-loading-progress"
                      style={{ width: `${Math.round(loadingProgress)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                // Use immediate transitions with no animation
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0 }}
                className="absolute inset-0 z-10"
                // Remove animation handlers that could bypass our loader logic
              >
                {/* Wrap just the image in Link, not the entire container */}
                <Link href={href} className="block w-full h-full">
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Additional container to prevent partial image loading */}
                    <div 
                      className="absolute inset-0 z-10 bg-neutral-100/90 dark:bg-neutral-800/90"
                      style={{
                        opacity: loaded && !isChangingImage ? 0 : 1,
                        transition: "none",
                        pointerEvents: "none"
                      }}
                    ></div>
                    <Image
                      src={(currentImage?.url || galleryImgs[0]?.url || "")}
                      fill
                      alt="listing card gallery"
                      className={`object-cover ${
                        loaded && !isChangingImage ? "opacity-100" : "opacity-0"
                      } ${imageClass}`}
                      style={{
                        // No transition for image visibility - immediate changes
                        transition: "none",
                        // Hide the image completely until it's fully loaded
                        visibility: loaded && !isChangingImage ? "visible" : "hidden",
                        // Prevent any partial loading display
                        display: loaded && !isChangingImage ? "block" : "none",
                        // Force hardware acceleration to prevent partial rendering
                        transform: "translateZ(0)",
                        // Prevent progressive loading
                        imageRendering: "auto",
                        // Ensure image is only shown when fully loaded
                        opacity: loaded && !isChangingImage ? 1 : 0,
                        // Completely disable any animation
                        animation: "none",
                        // Prevent any background color
                        backgroundColor: "transparent"
                      }}
                      // Use loading="eager" to load the image immediately but keep it hidden
                      loading="eager"
                      // Disable unoptimized to ensure proper loading behavior
                      unoptimized={true}
                      // Disable progressive loading
                      quality={100}
                      // Disable lazy loading to prevent partial rendering
                      lazyBoundary="0px"
                      // Disable placeholder to prevent partial rendering
                      placeholder="empty"
                      onLoadingComplete={() => {
                        // When the image is loaded, we don't immediately hide the loader
                        // Instead, we let the timeout in loadCurrentAndPreloadRest handle it
                        // This ensures the loader is shown for a consistent time
                        
                        // Just mark the image as preloaded if it's not already
                        if (currentImage?.url === images[index]?.url && 
                            !preloadedImages.includes(index)) {
                          setPreloadedImages(prev => 
                            prev.includes(index) ? prev : [...prev, index]
                          );
                          
                          // Notify parent component if needed
                          if (onImageLoaded) onImageLoaded();
                        }
                        
                        // We don't set loaded=true here - that's handled by the timeouts
                        // This ensures the loader is always shown for a minimum time
                      }}
                      sizes="(max-width: 1025px) 100vw, 300px"
                      priority={index === 0}
                    />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons + bottom nav bar */}
        <>
          {/* Buttons */}
          {navigation && (
            <div className="opacity-0 group-hover/cardGallerySlider:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  className={`absolute w-8 h-8 left-3 top-[calc(50%-16px)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-6000 dark:hover:border-neutral-500 rounded-full flex items-center justify-center hover:border-neutral-300 focus:outline-none z-30 ${isChangingImage ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  onClick={(e) => {
                    e.preventDefault();  // Prevent default link behavior
                    e.stopPropagation(); // Stop event from bubbling up
                    if (!isChangingImage) {
                      changePhotoId(index - 1);
                    }
                  }}
                  disabled={isChangingImage}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  className={`absolute w-8 h-8 right-3 top-[calc(50%-16px)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-6000 dark:hover:border-neutral-500 rounded-full flex items-center justify-center hover:border-neutral-300 focus:outline-none z-30 ${isChangingImage ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  onClick={(e) => {
                    e.preventDefault();  // Prevent default link behavior
                    e.stopPropagation(); // Stop event from bubbling up
                    if (!isChangingImage) {
                      changePhotoId(index + 1);
                    }
                  }}
                  disabled={isChangingImage}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Bottom Nav bar */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900 opacity-50 rounded-b-lg z-20"></div>
          <div className="flex items-center justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-1.5 z-30">
            {images.map((_, i) => (
              <button
                className={`w-1.5 h-1.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/60"
                } ${isChangingImage ? 'cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  e.preventDefault();  // Prevent default link behavior
                  e.stopPropagation(); // Stop event from bubbling up
                  if (!isChangingImage) {
                    changePhotoId(i);
                  }
                }}
                key={i}
                disabled={isChangingImage}
              />
            ))}
          </div>
        </>
      </div>
    </MotionConfig>
  );
}