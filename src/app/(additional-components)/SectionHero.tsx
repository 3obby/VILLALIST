"use client";
import React, { useState } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import styles from "./style.module.css";
import HeroSearchForm2Mobile from "../(client-components)/(HeroSearchForm2Mobile)/HeroSearchForm2Mobile";
import I404Png from "@/images/under.jpg";
import LocationInput from "../(client-components)/(HeroSearchForm)/LocationInput";
import GuestsInput from "../(client-components)/(HeroSearchForm)/GuestsInput";
import StayDatesRangeInput from "../(client-components)/(HeroSearchForm)/(dsk-search-form)/StayDatesRangeInput";
import { ClockIcon, InboxIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Loader from "@/components/Loader";
import SvgLoader from "./SvgLoader";
import { useRouter } from "next/navigation";

const SectionHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`h-[100vh]`} style={{ position: "relative" }}>
      <div
        className={`container nc-SectionHero flex flex-col relative pt-10 lg:pt-16 lg:pb-16`}
        style={{ position: "relative" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center overflow-hidden">
          <div className="flex-shrink-0 lg:w-1/2 flex flex-col backdrop-blur-md bg-blue-500/30 p-6 rounded-lg shadow-lg items-start sm:space-y-10 xl:pr-14 lg:mr-10 xl:mr-0">
            <div className="p-6">
              <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] text-white">
                Relaxation, Luxury, Adventure
              </h2>
              <span className="text-base md:text-lg text-white">
                Embark on a journey filled with unforgettable experiences. From
                luxury stays to unique activities, let us take care of every
                detail.
              </span>
            </div>
            <ButtonPrimary
              onClick={openModal}
              sizeClass="px-5 py-4 sm:px-7 bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Apply for your vacation
            </ButtonPrimary>
          </div>
        </div>

        <div className="hidden lg:block z-10 w-full">
          <HeroSearchForm />
        </div>
      </div>
      <SingleVideoBackground />
      <div className="self-center lg:hidden flex-[3] max-w-lg !mx-auto md:px-3">
        <div className="m-14"></div>
        <HeroSearchForm2Mobile />
      </div>
      {isModalOpen && <PopUpForm closeModal={closeModal} />}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default SectionHero;

export interface Search {
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  adults: number | 1;
  children: number | null;
  infants: number | null;
}
function PopUpForm({ closeModal }: { closeModal: (state: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<Search>({
    location: "",
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [page, setPage] = useState(1);
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const updateSearch = (key: keyof Search, value: any) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [key]: value,
    }));
  };

  const handleNext = () => setPage((prev) => Math.min(prev + 1, 2));
  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleConfirm = async () => {
    setLoading(true);

    if (!personalDetails.name || !personalDetails.email) {
      toast.error("Please fill out all required fields", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    const payload = {
      location: search.location,
      checkInDate: search.startDate,
      checkOutDate: search.endDate,
      guests: search.adults + (search.children || 0) + (search.infants || 0),
      name: personalDetails.name,
      email: personalDetails.email,
    };

    try {
      const response = await axios.post(
        "/api/listings/requestVacation",
        payload
      );
      if (response.data.success) {
        setIsConfirmed(true);
        router.push("/thank-you");
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error submitting vacation request:", error);
      toast.error("Failed to submit vacation request. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      );
    }

    if (isConfirmed) {
      return (
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-4">✔</div>
          <h2 className="text-2xl font-bold text-neutral-800">
            Your request has been recorded!
          </h2>
          <p className="text-gray-600">
            Thank you for your request. We'll get back to you shortly.
          </p>
        </div>
      );
    }

    if (page === 1) {
      return (
        <>
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            Step 1: Choose Location and Guests
          </h2>
          <LocationInput
            searchData={search}
            onChange={updateSearch}
            className="w-full"
          />
          <hr className="my-4 flex justify-self-center w-[50%] border-gray-300" />
          <GuestsInput
            searchData={search}
            onChange={updateSearch}
            className="w-full mt-4"
          />
        </>
      );
    }

    if (page === 2) {
      return (
        <>
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            Step 2: Check Availability and Provide Details
          </h2>
          <StayDatesRangeInput
            searchData={search}
            onChange={updateSearch}
            className="w-full"
          />
          <hr className="my-4 flex justify-self-center w-[50%] border-gray-300" />
          <div className="mt-6">
            <div className="relative flex nc-hero-field-padding items-center space-x-3">
              <div className="text-neutral-300 dark:text-neutral-400">
                <UserIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  value={personalDetails.name}
                  onChange={(e) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Full Name"
                  className="block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate"
                  required
                />
                <span className="block mt-0.5 text-sm text-neutral-400 font-light">
                  Enter your full name
                </span>
              </div>
            </div>
          </div>
          <hr className="my-4 flex justify-self-center w-[50%] border-gray-300" />
          <div className="mt-6">
            <div className="relative flex nc-hero-field-padding items-center space-x-3">
              <div className="text-neutral-300 dark:text-neutral-400">
                <InboxIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <input
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Email Address"
                  className="block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate"
                  required
                />
                <span className="block mt-0.5 text-sm text-neutral-400 font-light">
                  Enter your email address
                </span>
              </div>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      style={{ overflowY: "auto" }}
    >
      <div className="bg-white w-[90%] max-w-3xl rounded-xl shadow-xl p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => closeModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
        >
          &#x2715;
        </button>

        <div>{renderContent()}</div>

        {!isConfirmed && !loading && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">Page {page} of 2</div>
            <div className="flex space-x-2">
              {page > 1 && (
                <ButtonPrimary
                  onClick={handlePrevious}
                  sizeClass="px-6 py-2"
                  className="bg-gray-300 hover:bg-gray-400"
                >
                  Previous
                </ButtonPrimary>
              )}
              {page < 2 && (
                <ButtonPrimary
                  onClick={handleNext}
                  sizeClass="px-6 py-2"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </ButtonPrimary>
              )}
              {page === 2 && (
                <ButtonPrimary
                  onClick={handleConfirm}
                  sizeClass="px-6 py-2"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirm
                </ButtonPrimary>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SingleVideoBackground() {
  return (
    <div className={`${styles.videoBackgroundContainer}`}>
      <div className="absolute inset-0 bg-[#8FFAFB] z-10" />

      <video
        className={styles.backgroundVideo}
        src="https://villaz.b-cdn.net/a.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
