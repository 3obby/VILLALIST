"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationInput from "../(client-components)/(HeroSearchForm)/LocationInput";
import GuestsInput from "../(client-components)/(HeroSearchForm)/GuestsInput";
import StayDatesRangeInput from "../(client-components)/(HeroSearchForm)/(dsk-search-form)/StayDatesRangeInput";
import { ClockIcon, InboxIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Loader from "@/components/Loader";
import ButtonPrimary from "@/shared/ButtonPrimary";
import WhyBookWithUs from "@/components/WhyBookWithUs";
import "react-toastify/dist/ReactToastify.css";
import HIW1img from "@/images/HIW1.png";
import HIW2img from "@/images/HIW2.png";
import HIW3img from "@/images/HIW3.png";
import VectorImg from "@/images/VectorHIW.svg";
import Image from "next/image";

interface Search {
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  adults: number;
  children: number;
  infants: number;
}

export default function BookNowPage() {
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

  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
  });

  const updateSearch = (key: keyof Search, value: any) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate each field separately
    const errors = [];

    if (!search.location) {
      errors.push("Please select a location");
      toast.error(errors[0], {
        position: "top-center",
        theme: "colored",
        autoClose: 3000,
      });
      setLoading(false);  
      return;
    } 
    
    if (!search.startDate || !search.endDate) {
      toast.error("Please select check-in and check-out dates", {
        position: "top-center",
        theme: "colored",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    if (search.adults < 1) {
      toast.error("Please select at least 1 guest", {
        position: "top-center",
        theme: "colored",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    if (!personalDetails.email.trim()) {
      toast.error("Please enter your email address", {
        position: "top-center",
        theme: "colored",
        autoClose: 3000,
      }); 
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(personalDetails.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-center",
        theme: "colored",
        autoClose: 3000,
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
        router.push("/thank-you");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting vacation request:", error);
      toast.error("Failed to submit vacation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-page Video Background */}
      <div className="fixed inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          src="https://villaz.b-cdn.net/a.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/70 backdrop-blur-[6px]" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-8 lg:gap-16">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 space-y-8 flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center w-full">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Escape to Luxury
            </h1>
            <p className="text-lg text-gray-200 mx-auto max-w-xl [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Where every moment becomes an unforgettable memory
            </p>
          </div>

          {/* How It Works Section */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="mt-8 relative grid md:grid-cols-3 gap-8">
              <Image
                className="hidden md:block absolute inset-x-0 top-10"
                src={VectorImg}
                alt=""
              />
              {[
                {
                  id: 1,
                  img: HIW1img,
                  title: "Apply for the vacation",
                  desc: "Submit your application and let us know your preferred destination and dates.",
                },
                {
                  id: 2,
                  img: HIW2img,
                  title: "Wait for confirmation",
                  desc: "We will review your application and reach out to confirm your booking.",
                },
                {
                  id: 3,
                  img: HIW3img,
                  title: "Confirm your attendance",
                  desc: "Confirm your attendance to finalize your vacation plans.",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col items-center max-w-xs mx-auto"
                >
                  <Image
                    alt=""
                    className="mb-8 max-w-[120px] mx-auto"
                    src={item.img}
                  />
                  <div className="text-center mt-auto">
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <span className="block mt-5 text-gray-300">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Booking Form */}
        <div className="w-full lg:w-1/2 max-w-xl ">
          <div className="relative bg-white/75 rounded-3xl p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-black/10 overflow-hidden">
            {/* Animated gradient background */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5 animate-gradient-slow"></div> */}

            <div className="relative">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Begin Your Journey
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location and Guests Section */}
                <div className="space-y-4  ">
                  <LocationInput
                    searchData={search}
                    onChange={updateSearch}
                    className="w-full   !rounded-xl transition-all duration-300 !shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  />
                  <GuestsInput
                    searchData={search}
                    onChange={updateSearch}
                    className="w-full   !rounded-xl transition-all duration-300 !shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  />
                  <StayDatesRangeInput
                    searchData={search}
                    onChange={updateSearch}
                    className="w-full   !rounded-xl transition-all duration-300 !shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Personal Details */}
                <div className="space-y-4 pt-6 border-t border-/5">
                  <div className="group">
                    <div className="relative flex items-center  rounded-xl p-4 transition-all duration-300 hover:bg-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                      <UserIcon className="w-5 h-5 mr-3" />
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
                        className="w-full bg-transparent border-none focus:ring-0 placeholder-black/80 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <div className="relative flex items-center  rounded-xl p-4 transition-all duration-300 hover:bg-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                      <InboxIcon className="w-5 h-5 mr-3" />
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
                        className="w-full bg-transparent border-none focus:ring-0 placeholder-black/80 text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <ButtonPrimary
                    type="submit"
                    className="w-full py-4 text-base bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl border-none shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] hover:scale-[1.02]"
                  >
                    Start Your Experience
                  </ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-slow {
          animation: gradient 15s ease infinite;
          background-size: 400% 400%;
        }
      `}</style>

      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}
