import React, { FC } from "react";
import Link from "next/link";
import GallerySlider from "./GallerySlider";
import { Listing, GalleryImage, RoomType } from "@prisma/client";
type CustomRoute = `/specific/${string}` | string;

export interface StayCardProps {
  className?: string;
  data?: Listing & {
    galleryImages: GalleryImage[];
    roomTypes: RoomType[]
  };
  size?: "default" | "small";
}

const StayCard: FC<StayCardProps> = ({
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
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`StayCard_${id}`}
          ratioClass="aspect-w-4 aspect-h-3 "
          galleryImgs={galleryImages}
          href={`/properties/${uriId}`}
          galleryClass={size === "default" ? undefined : ""}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "p-4 space-y-4" : "p-3 space-y-1"}>
        <div className={size === "default" ? "space-y-2" : "space-y-1"}>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {typeOfPlace} · {roomTypes.length} {roomTypes.length == 1 ? "room" : "rooms"}
          </span>
          <div className="flex items-center space-x-2">
            <h2
              className={`font-semibold capitalize text-neutral-900 dark:text-white ${
                size === "default" ? "text-base" : "text-base"
              }`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5">
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
            <span className="">{address}</span>
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
      className={`nc-StayCard group relative bg-white dark:bg-neutral-900 ${
        size === "default"
          ? "border border-neutral-100 dark:border-neutral-800 "
          : ""
      } rounded-2xl overflow-hidden hover:shadow-xl transition-shadow ${className}`}
      data-nc-id="StayCard"
    >
      {renderSliderGallery()}
      <Link href={propertyUrl}>{renderContent()}</Link>
    </div>
  );
};

export default StayCard;
