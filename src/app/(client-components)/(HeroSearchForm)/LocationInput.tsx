"use client";

import React, { useState, useEffect, FC } from "react";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  searchData: any;
  inwhite?: boolean;
  onChange: (key: string, value: any) => void;
}

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
 
const LocationInput: FC<LocationInputProps> = ({
  placeHolder = "Location",
  desc = "Where are you going?",
  className = "[ nc-flex-1 ]",
  searchData,
  inwhite = true,
  onChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);

  // Detect platform and update `isMobile`
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpandCountry = (country: string) => {
    setExpandedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleCitySelection = (city: string) => {
    setSelectedCity(city);
    onChange("location", city);
  };

  const filteredData = locationsData
    .map((country) => {
      const filteredRegions = country.regions.filter((region) =>
        region.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return {
        ...country,
        regions: filteredRegions,
      };
    })
    .filter(
      (country) =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.regions.length > 0
    );

  const renderLocations = () => (
    <div className="max-h-[60vh] overflow-y-auto">
      {filteredData.map((country) => (
        <div key={country.country} className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">{country.country}</span>
            <button
              onClick={() => toggleExpandCountry(country.country)}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedCountries.includes(country.country) ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {expandedCountries.includes(country.country) &&
            country.regions.map((region) => (
              <div key={region.name} className="ml-6 mt-2">
                <label
                  className={`flex items-center space-x-2 cursor-pointer ${
                    selectedCity === region.name ? "text-indigo-600 font-bold" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCity === region.name}
                    onChange={() => handleCitySelection(region.name)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-800">{region.name}</span>
                </label>
              </div>
            ))}
        </div>
      ))}
    </div>
  );

  const renderModalContent = () => (
    <div
      className="relative bg-white rounded-lg w-11/12 max-w-3xl p-6 shadow-lg"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from propagating
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-3">
        <h2 className="text-lg font-semibold">Select Location</h2>
        <button
          onClick={() => setShowModal(false)} // Explicit close logic
          className="text-gray-500 hover:text-gray-800"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center border-b pb-2 mb-4">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 flex-grow border-none focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Location List */}
      {renderLocations()}

      {/* Footer */}
      <div className="mt-4 flex justify-end space-x-4">
        <button
          onClick={() => setShowModal(false)} // Close explicitly
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Close
        </button>
        <button
          onClick={() => setShowModal(false)} // Save explicitly
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        className="pl-6 pt-5 pb-3 flex items-center space-x-3 cursor-pointer " 
        onClick={() => setShowModal(true)}
      >
        <div className="">
        <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div>
          <span className="block font-semibold ">{searchData.location || placeHolder}</span>
          <span className="text-sm text-neutral leading-none font-light">{desc}</span>
        </div>
      </div>

      {/* Modal */}
      {showModal &&
        (isMobile ? (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowModal(false)} // Backdrop click allowed for mobile
          >
            {renderModalContent()}
          </div>
        ) : (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          >
            {renderModalContent()}
          </div>
        ))}
    </div>
  );
};

export default LocationInput;
