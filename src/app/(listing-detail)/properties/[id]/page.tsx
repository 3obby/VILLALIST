"use client";

import React, { FC, Fragment, useState, useEffect } from "react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import StayDatesRangeInput from "./StayDatesRangeInput";
import GuestsInput from "./GuestsInput";
import { Route } from "next";
import GoogleMapReact from "google-map-react";
import MobileFooterSticky from "../../(components)/MobileFooterSticky";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import Page404 from "@/app/not-found";
import Footer from "@/components/Footer";
import ModalReserveMobile from "../../(components)/ModalReserveMobile";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import LocationMarker from "@/components/AnyReactComponent/LocationMarker";
import AddRoomType from "../../(components)/AddRoomType";
import EditRoomType from "../../(components)/EditRoomType";
import DeleteRoomType from "../../(components)/DeleteRoomType";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ReusableModal from "../../(components)/ReusableModal";
import { UserIcon } from "@heroicons/react/24/solid";
import { FaBath, FaChevronLeft, FaChevronRight, FaDoorOpen, FaUser, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaDesktop, FaBed, FaUtensils, FaSnowflake, FaStar, FaBuilding, FaClipboardList, FaInfoCircle, FaBox, FaHandHolding, FaTree, FaShieldAlt, FaCheckCircle, FaDotCircle, FaConciergeBell } from "react-icons/fa";
import { MdTv, MdLocalHotel, MdMeetingRoom, MdRoomService, MdSecurity } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi";

export interface ListingStayDetailPageProps {}

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({}) => {
  const [reserveData, setReserve] = useState({
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedFeatures, setExpandedFeatures] = useState(false);
  const [expandedRoomFeatures, setExpandedRoomFeatures] = useState({});
  const [expandedRoomDetails, setExpandedRoomDetails] = useState({});
  const [expandedRoomLayouts, setExpandedRoomLayouts] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [expandedRoomFeaturesList, setExpandedRoomFeaturesList] = useState(false);
  const INITIAL_ITEMS_TO_SHOW = 3;
  const INITIAL_SECTIONS_TO_SHOW = 4;

  // Helper functions for icons
  const getIconForTitle = (title: string) => {
    // For listing details, use star
    if (title.toLowerCase() === 'beds and bedding' || title.toLowerCase().includes('configuration') || title.toLowerCase().includes('occupancy')) {
      return <FaInfoCircle className="w-8 h-8 text-blue-500" />;
    }
    return <FaStar className="w-8 h-8 text-blue-500" />;
  };

  const getIconForDetail = (title: string, detail: string) => {
    // For room details (beds and bedding, configuration, occupancy), use dot circle
    if (title.toLowerCase() === 'beds and bedding' || 
        title.toLowerCase().includes('configuration') || 
        title.toLowerCase().includes('occupancy') || 
        title.toLowerCase().includes('charge')) {
      return <FaDotCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
    // For listing details, use check circle
    return <FaCheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />;
  };

  const updateReserve = (key: any, value: any) => {
    setReserve((reserveData) => ({
      ...reserveData,
      [key]: value,
    }));
  };
  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");
  const [listingData, setListingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const imageSectionRef = React.useRef(null);

  // Move useEffect to component level
  useEffect(() => {
    if (listingData) {
      const hasRoomTypes = listingData.roomTypes && listingData.roomTypes.length > 0;
      const defaultRoomId = hasRoomTypes ? listingData.roomTypes[0].id : 'default-room';
      if (!selectedRoomId) {
        setSelectedRoomId(defaultRoomId);
      }
    }
    console.log(listingData)
  }, [listingData, selectedRoomId]);

  const handlePasswordSubmit = () => {
    if (password === "password") {
      setIsAdmin(true);
      toast.success("Password verified!", { position: "top-center" });
      setShowModal(false);
    } else {
      toast.error("Incorrect password.", { position: "top-center" });
    }
  };

  const getData = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/listings/getListingById?id=${id}`);
      setListingData(response.data.data);
      setSelectedRoomId(response.data.data.roomTypes[0]?.id);
    } catch (err: any) {
      console.log("Error fetching listings:", err);
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
      router.push(`/`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = thisPathname?.split("/properties/")[1] || null;
    if (id) {
      // let data = DEMO_ID(id);
      // setListingData(data);
      getData(id);
    } else {
      setListingData([]);
    }
  }, []);

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const renderSection1 = () => {
    const handleTitleUpdate = (updatedData) => {
      // Update the state with the new title after successful API response
      setListingData((prevData) => ({
        ...prevData,
        title: updatedData.title,
      }));
    };

    return (
      <div className="listingSection__wrap !space-y-6">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {listingData.title}
          </h2>

          {/* Edit Title Button */}
          {isAdmin && (
            <ReusableModal
              title="Edit Title"
              previousData={{ id: listingData.id, title: listingData.title }}
              apiUrl="/api/listings/updateListing"
              onSuccess={handleTitleUpdate}
            />
          )}
        </div>

        {/* Address Section */}
        <div className="flex items-center space-x-4">
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1">{listingData.address}</span>
          </span>
        </div>

        {/* Divider */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
      </div>
    );
  };

  const renderSection2 = () => {
    const handleDescriptionUpdate = (updatedData) => {
      // Update the state with the new description after successful API response
      setListingData((prevData) => ({
        ...prevData,
        description: updatedData.description,
      }));
    };

    return (
      <div className="listingSection__wrap">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Stay Information</h2>

          {/* Edit Description Button */}
          {isAdmin && (
            <ReusableModal
              title="Edit Description"
              previousData={{
                id: listingData.id,
                description: listingData.description,
              }}
              apiUrl="/api/listings/updateListing"
              onSuccess={handleDescriptionUpdate}
              isArea={true}
            />
          )}
        </div>

        {/* Divider */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Description Section */}
        <div className="text-neutral-600 dark:text-neutral-300 mt-4">
          <span>{listingData.description}</span>
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    // Return null if there are no additional details
    if (!listingData?.additionalDetails || Object.keys(listingData.additionalDetails).length === 0) {
      return null;
    }

    const toggleSection = (title) => {
      setExpandedSections(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    };

    const allFeatures = Object.entries(listingData.additionalDetails || {});
    const displayFeatures = expandedFeatures ? allFeatures : allFeatures.slice(0, INITIAL_SECTIONS_TO_SHOW);
    const hasMoreSections = allFeatures.length > INITIAL_SECTIONS_TO_SHOW;

    return (
      <div className="listingSection__wrap">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Property Features</h2>
        </div>

        {/* Divider */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Features Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayFeatures.map(([title, content]) => {
            const items = Array.isArray(content) ? content :
              typeof content === 'object' && content !== null ?
                Object.entries(content).map(([key, value]) => `${key}: ${value}`) :
                [content.toString()];

            const isExpanded = expandedSections[title];
            const displayItems = isExpanded ? items : items.slice(0, INITIAL_ITEMS_TO_SHOW);
            const hasMore = items.length > INITIAL_ITEMS_TO_SHOW;

            return (
              <div key={title} className="space-y-2">
                <div className="flex items-center space-x-3 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <div className="flex-shrink-0">
                    {getIconForTitle(title)}
                  </div>
                  <h3 className="text-lg font-semibold capitalize">{title}</h3>
                </div>
                <div className="ml-4 space-y-1">
                  {displayItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors">
                      {getIconForDetail(title, item)}
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                  
                  {hasMore && (
                    <button
                      onClick={() => toggleSection(title)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors p-2 w-full"
                    >
                      <span className="text-sm font-medium">
                        {isExpanded ? 'Show Less' : `Show ${items.length - INITIAL_ITEMS_TO_SHOW} More`}
                      </span>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More Features Button */}
        {hasMoreSections && (
          <div className="mt-6">
            <button
              onClick={() => setExpandedFeatures(!expandedFeatures)}
              className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors p-2 w-full border border-blue-600 rounded-lg"
            >
              <span className="text-sm font-medium">
                {expandedFeatures ? 'Show Less Features' : `Show ${allFeatures.length - INITIAL_SECTIONS_TO_SHOW} More Features`}
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform ${expandedFeatures ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderRoomLayouts = (roomType:any) => {
    if (!roomType || !roomType.layout?.images?.length) return null;
  
    return (
      <div className="mt-6">
        <h4 className="text-xl font-semibold">Room Layout</h4>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
  
        <div className="mt-6">
          {roomType.layout.images.length === 1 ? (
            <div className="relative aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl">
              {imageLoading[`${roomType.id}-0`] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
              <Image
                src={roomType.layout.images[0]}
                alt="Room Layout"
                fill
                className="object-contain cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                onClick={() => window.open(roomType.layout.images[0], '_blank')}
                onLoadingComplete={() => {
                  setImageLoading(prev => ({
                    ...prev,
                    [`${roomType.id}-0`]: false
                  }));
                }}
                onLoad={() => {
                  setImageLoading(prev => ({
                    ...prev,
                    [`${roomType.id}-0`]: false
                  }));
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomType.layout.images.map((layout, index) => (
                <div
                  key={index}
                  className="relative aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl"
                >
                  {imageLoading[`${roomType.id}-${index}`] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <Image
                    src={layout}
                    alt={`Room Layout ${index + 1}`}
                    fill
                    className="object-contain cursor-pointer"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onClick={() => window.open(layout, '_blank')}
                    onLoadingComplete={() => {
                      setImageLoading(prev => ({
                        ...prev,
                        [`${roomType.id}-${index}`]: false
                      }));
                    }}
                    onLoad={() => {
                      setImageLoading(prev => ({
                        ...prev,
                        [`${roomType.id}-${index}`]: false
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  
  const renderSection4 = () => {
    const handleRoomSelection = (roomId) => {
      if (!roomId) return;
      
      setSelectedRoomId(roomId);
      setImageIndex(0);
      if (imageSectionRef.current) {
        const topOffset =
          imageSectionRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: topOffset - 100,
          behavior: "smooth",
        });
      }
    };

    const toggleSection = (sectionId) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
    };

    const handleImageNavigation = (direction) => {
      if (!selectedRoom?.imageLinks?.length) return;
      
      const totalImages = selectedRoom.imageLinks.length;
      setImageIndex((prevIndex) => {
        const newIndex = (prevIndex + direction + totalImages) % totalImages;
        return newIndex >= 0 ? newIndex : totalImages - 1;
      });
    };

    // Get the selected room type or create default room from listing data
    const getDefaultRoom = () => {
      console.log(listingData)
      return {
        id: 'default-room',
        name: 'Default Room',
        pricePerNight: listingData.pricePerNight,
        maxGuests: listingData.maxGuests || 2,
        bathrooms: listingData.bathrooms || 1,
        bedrooms: listingData.bedrooms || 1,
        imageLinks: listingData.galleryImages?.map(img => img.url) || [],
      };
    };

    const hasRoomTypes = listingData.roomTypes && listingData.roomTypes.length > 0;
    const roomTypes = hasRoomTypes ? listingData.roomTypes : [getDefaultRoom()];
    const selectedRoom = roomTypes.find((room) => room.id === selectedRoomId) || roomTypes[0];

    return (
      <div className="listingSection__wrap relative px-4 space-y-8">
        <div className="p-4 rounded-md shadow-md border bg-white dark:bg-neutral-900 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Room Types</h2>
              <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                {hasRoomTypes 
                  ? "Below are the available room types with their details and pricing."
                  : "Default room information based on property details."}
              </span>
            </div>
            {isAdmin && (
              <AddRoomType
                id={listingData.id}
                onAddSuccess={(newRoomType: any) => {
                  setListingData((prevData: any) => ({
                    ...prevData,
                    roomTypes: [...prevData.roomTypes, newRoomType],
                  }));
                }}
              />
            )}
          </div>

          {roomTypes.map((roomType) => {
            const isExpanded = expandedRoomFeatures[roomType.id];
            const hasFeatures = hasRoomTypes && roomType.additionalDetails && Object.keys(roomType.additionalDetails).length > 0;
            const hasLayout = hasRoomTypes && roomType.layout?.images?.length > 0

            return (
              <div
                key={roomType.id}
                className={`p-4 rounded-md border ${
                  selectedRoomId === roomType.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleRoomSelection(roomType.id)}
                  >
                    <input
                      type="radio"
                      name="roomType"
                      checked={selectedRoomId === roomType.id}
                      onChange={() => handleRoomSelection(roomType.id)}
                      className="form-radio h-5 w-5 text-blue-500"
                    />
                    <span className="font-medium text-lg">{roomType.name}</span>
                  </div>
                  <span className="font-semibold text-xl text-blue-600">
                    ${roomType.pricePerNight}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-neutral-700 dark:text-neutral-300 mt-2">
                  <div className="flex items-center space-x-2">
                    <FaUser />
                    <span>{roomType.maxGuests}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBath />
                    <span>{roomType.bathrooms}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDoorOpen />
                    <span>{roomType.bedrooms}</span>
                  </div>
                </div>

                {hasLayout && (
                  <div className="mt-4">
                    <div className="flex space-x-4">
                      {roomType.layout?.images?.length > 0 && (
                        <button
                          onClick={() => {
                            // Set loading state for all images when expanding
                            const loadingStates = {};
                            roomType.layout.images.forEach((_, index) => {
                              loadingStates[`${roomType.id}-${index}`] = true;
                            });
                            setImageLoading(prev => ({
                              ...prev,
                              ...loadingStates
                            }));
                            
                            setExpandedRoomLayouts(prev => ({
                              ...prev,
                              [roomType.id]: !prev[roomType.id]
                            }));
                          }}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {expandedRoomLayouts[roomType.id] ? 'Hide Layout' : 'Show Layout'}
                          </span>
                          <svg
                            className={`w-5 h-5 transform transition-transform ${expandedRoomLayouts[roomType.id] ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {expandedRoomLayouts[roomType.id] && roomType.layout?.images?.length > 0 && (
                      <div className="mt-4">
                        <div className="w-full">
                          {roomType.layout.images.length === 1 ? (
                            <div className="relative aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl">
                              {imageLoading[`${roomType.id}-0`] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                              )}
                              <Image
                                src={roomType.layout.images[0]}
                                alt="Room Layout"
                                fill
                                className="object-contain cursor-pointer"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                onClick={() => window.open(roomType.layout.images[0], '_blank')}
                                onLoadingComplete={() => {
                                  setImageLoading(prev => ({
                                    ...prev,
                                    [`${roomType.id}-0`]: false
                                  }));
                                }}
                                onLoad={() => {
                                  setImageLoading(prev => ({
                                    ...prev,
                                    [`${roomType.id}-0`]: false
                                  }));
                                }}
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {roomType.layout.images.map((layout, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl"
                                >
                                  {imageLoading[`${roomType.id}-${index}`] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                  )}
                                  <Image
                                    src={layout}
                                    alt={`Room Layout ${index + 1}`}
                                    fill
                                    className="object-contain cursor-pointer"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onClick={() => window.open(layout, '_blank')}
                                    onLoadingComplete={() => {
                                      setImageLoading(prev => ({
                                        ...prev,
                                        [`${roomType.id}-${index}`]: false
                                      }));
                                    }}
                                    onLoad={() => {
                                      setImageLoading(prev => ({
                                        ...prev,
                                        [`${roomType.id}-${index}`]: false
                                      }));
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Buttons */}
                {isAdmin && (
                  <div className="flex space-x-4 mt-4">
                    <EditRoomType
                      onEditSuccess={(updatedRoomType) => {
                        setListingData((prevData) => ({
                          ...prevData,
                          roomTypes: prevData.roomTypes.map((type) =>
                            type.id === updatedRoomType.id
                              ? updatedRoomType
                              : type
                          ),
                        }));
                      }}
                      roomType={roomType}
                    />
                    <DeleteRoomType
                      onDeleteSuccess={(deletedRoomTypeId) => {
                        setListingData((prevData) => ({
                          ...prevData,
                          roomTypes: prevData.roomTypes.filter(
                            (type) => type.id !== deletedRoomTypeId
                          ),
                        }));
                      }}
                      roomTypeId={roomType.id}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Image Section */}
        <div ref={imageSectionRef} className="relative mt-4">
          <h3 className="text-xl font-semibold mb-4">
            {selectedRoom?.name} Images
          </h3>
          <div className="relative w-full h-64 rounded-md overflow-hidden">
            {selectedRoom?.imageLinks?.length > 0 ? (
              <img
                src={selectedRoom.imageLinks[imageIndex]}
                alt="Room Image"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <span className="text-neutral-500 dark:text-neutral-400">
                  No images available
                </span>
              </div>
            )}

            {/* Navigation Buttons */}
            {selectedRoom?.imageLinks?.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleImageNavigation(-1)}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleImageNavigation(1)}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Room Features Section - Only show for actual room types, not default room */}
          {hasRoomTypes && selectedRoom?.additionalDetails && Object.keys(selectedRoom.additionalDetails).length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold">Room Features</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedRoom.additionalDetails)
                  .slice(0, expandedRoomFeaturesList ? undefined : INITIAL_SECTIONS_TO_SHOW)
                  .map(([title, content]) => {
                    const items = Array.isArray(content) ? content :
                      typeof content === 'object' && content !== null ?
                        Object.entries(content).map(([key, value]) => `${key}: ${value}`) :
                        [content.toString()];

                    const isExpanded = expandedSections[`${selectedRoom.id}-${title}`];
                    const displayItems = isExpanded ? items : items.slice(0, INITIAL_ITEMS_TO_SHOW);
                    const hasMore = items.length > INITIAL_ITEMS_TO_SHOW;

                    return (
                      <div key={title} className="space-y-2">
                        <div className="flex items-center space-x-3 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                          <div className="flex-shrink-0">
                            <FaInfoCircle className="w-8 h-8 text-blue-500" />
                          </div>
                          <h3 className="text-lg font-semibold capitalize">{title}</h3>
                        </div>
                        <div className="ml-4 space-y-1">
                          {displayItems.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors">
                              <FaDotCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                          
                          {hasMore && (
                            <button
                              onClick={() => toggleSection(`${selectedRoom.id}-${title}`)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors p-2 w-full"
                            >
                              <span className="text-sm font-medium">
                                {isExpanded ? 'Show Less' : `Show ${items.length - INITIAL_ITEMS_TO_SHOW} More`}
                              </span>
                              <svg
                                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Show More Features Button */}
              {Object.keys(selectedRoom.additionalDetails).length > INITIAL_SECTIONS_TO_SHOW && (
                <div className="mt-6">
                  <button
                    onClick={() => setExpandedRoomFeaturesList(!expandedRoomFeaturesList)}
                    className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors p-2 w-full border border-blue-600 rounded-lg"
                  >
                    <span className="text-sm font-medium">
                      {expandedRoomFeaturesList ? 'Show Less Features' : `Show ${Object.keys(selectedRoom.additionalDetails).length - INITIAL_SECTIONS_TO_SHOW} More Features`}
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedRoomFeaturesList ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {renderRoomLayouts(selectedRoom)}
      </div>
    );
  };

  const renderSection5 = () => {
    // Check if layouts exist and has images
    if (!listingData || !listingData.layout?.images?.length) return null;
  
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Property Layout</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
  
        {/* LAYOUT IMAGES */}
        <div className="mt-6">
          {listingData.layout.images.length === 1 ? (
            // Single layout image
            <div className="relative aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl">
              <Image
                src={listingData.layout.images[0]}
                alt="Property Layout"
                fill
                className="object-contain cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                onClick={() => window.open(listingData.layout.images[0], '_blank')}
              />
            </div>
          ) : (
            // Multiple layout images - Gallery style
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listingData.layout.images.map((layout, index) => (
                <div 
                  key={index}
                  className="relative aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={layout}
                    alt={`Property Layout ${index + 1}`}
                    fill
                    className="object-contain cursor-pointer"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onClick={() => window.open(layout, '_blank')}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    if (!listingData?.mapLat || !listingData?.mapLng) return null;

    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {listingData.address}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyAFYFaZcGbcBFrcky_dvNQH-gs9BjGQhTI",
              }}
              defaultCenter={{
                lat: listingData.mapLat,
                lng: listingData.mapLng,
              }}
              defaultZoom={15}
            >
              <LocationMarker
                lat={listingData.mapLat}
                lng={listingData.mapLng}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            ${listingData.pricePerNight}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /night
            </span>
          </span>
        </div>

        {/* FORM */}
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <StayDatesRangeInput
            reserveData={reserveData}
            onChange={updateReserve}
            className="flex-1 z-[11]"
          />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput
            resserveData={reserveData}
            onChange={updateReserve}
            className="flex-1"
          />
        </form>
        {/* SUBMIT */}
        <ModalReserveMobile
          roomTypes={listingData.roomTypes}
          listingId={listingData.id}
          checkInDate={
            reserveData.startDate ? reserveData.startDate.toISOString() : null
          }
          checkOutDate={
            reserveData.endDate ? reserveData.endDate.toISOString() : null
          }
          guests={
            reserveData.adults + reserveData.children + reserveData.infants
          }
          renderChildren={({ openModal }) => (
            <ButtonPrimary
              sizeClass="px-5 sm:px-7 py-3 !rounded-2xl"
              onClick={openModal}
            >
              Reserve
            </ButtonPrimary>
          )}
        />
      </div>
    );
  };

  const renderLogin = () => {
    const toggleModal = () => {
      setShowModal(!showModal);
    };
    return (
      <>
        {!isAdmin && (
          <div
            className="fixed top-4 right-4 md:top-6 md:right-6 z-50 cursor-pointer bg-white dark:bg-neutral-900 shadow-lg p-2 md:p-3 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            onClick={toggleModal}
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Enter Password</h2>
                <button
                  onClick={toggleModal}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                >
                  ✖
                </button>
              </div>
              <div className="space-y-4 mt-4">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
                  onClick={handlePasswordSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return loading || listingData === null ? (
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
      <Loader />
    </div>
  ) : Array.isArray(listingData) && listingData.length === 0 ? (
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
      <Page404 />
      <Footer />
    </div>
  ) : (
    <>
      <div className="container ListingDetailPage__content">
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
        <ListingImageGallery
          isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
          onClose={handleCloseModalImageGallery}
          images={listingData?.galleryImages}
        />

        <div className="nc-ListingStayDetailPage">
          {/*  HEADER */}
          <header className="rounded-md sm:rounded-xl">
            <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
              <div
                className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
                onClick={handleOpenModalImageGallery}
              >
                <Image
                  fill
                  className="object-cover rounded-md sm:rounded-xl"
                  src={listingData?.featuredImage}
                  alt=""
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
              {listingData?.galleryImages
                .filter((_: any, i: any) => i >= 1 && i < 5)
                .map((item: any, index: any) => (
                  <div
                    key={index}
                    className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                      index >= 3 ? "hidden sm:block" : ""
                    }`}
                  >
                    <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                      <Image
                        fill
                        className="object-cover rounded-md sm:rounded-xl "
                        src={item.url || ""}
                        alt=""
                        sizes="400px"
                      />
                    </div>

                    {/* OVERLAY */}
                    <div
                      className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleOpenModalImageGallery}
                    />
                  </div>
                ))}

              <button
                className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 z-10"
                onClick={handleOpenModalImageGallery}
              >
                <Squares2X2Icon className="w-5 h-5" />
                <span className="ml-2 text-neutral-800 text-sm font-medium">
                  Show all photos
                </span>
              </button>
            </div>
          </header>

          {/* MAIN */}
          {isAdmin && (
            <div
              className="fixed top-4 right-4 md:top-6 md:right-6 z-50 cursor-pointer bg-white dark:bg-neutral-900 shadow-lg p-2 md:p-3 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              onClick={() => setIsAdmin(false)}
            >
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
            </div>
          )}
          {renderLogin()}
          <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
            {/* CONTENT */}
            <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
              {renderSection1()}
              {renderSection2()}
              {renderSection5()}
              {renderSection3()}
              {renderSection4()}
              {renderSection7()}
            </div>

            {/* SIDEBAR */}
            <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
              <div className="sticky top-28">{renderSidebar()}</div>
            </div>
          </main>
        </div>
        <MobileFooterSticky
          listingId={listingData.id}
          price={listingData.pricePerNight}
          roomTypes={listingData.roomTypes}
        />
      </div>

      <div className="w-full">
        <Footer />
      </div>
    </>
  );
};

export default ListingStayDetailPage;
