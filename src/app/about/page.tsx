"use client";

import React from "react";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import Footer from "@/components/Footer";
import WhyBookWithUs from "@/components/WhyBookWithUs";
import SectionHowItWork from "@/components/SectionHowItWork";
import {
  FaCheck,
  FaUmbrellaBeach,
  FaSwimmingPool,
  FaConciergeBell,
  FaUtensils,
  FaPaintBrush,
  FaGlassMartiniAlt,
  FaWifi,
  FaWater,
  FaHeadset,
  FaUtensils as FaUtensilsAlt,
  FaPlane,
  FaHiking,
  FaSpa,
  FaShip,
  FaBaby,
  FaBirthdayCake,
} from "react-icons/fa";
import FloatingActionButton from "../FloatingButton";
import Image from "next/image";

// Import destination images
import allImg from "@/images/all.jpg";
import phuketImg from "@/images/pucket.jpg";
import koSamuiImg from "@/images/KohSamui.jpg";
import niesokoImg from "@/images/niesoko.jpg";
import bangkokImg from "@/images/bangkok.jpg";

const VILLA_FEATURES = [
  "Private infinity pools with ocean views",
  "Personal concierge and housekeeping",
  "Premium locations in sought-after destinations",
  "Fully equipped kitchens with chef services",
  "Modern design with local cultural influences",
  "Spacious outdoor entertainment areas",
  "High-speed Wi-Fi and entertainment systems",
  "Beach access or proximity to attractions",
];

const SERVICES = [
  "24/7 concierge support in multiple languages",
  "Private chef and catering options",
  "Airport transfers and car rental arrangements",
  "Guided excursions and activity bookings",
  "In-villa massage and wellness services",
  "Yacht charters and boat tours",
  "Childcare and family-friendly planning",
  "Special event and celebration arrangements",
];

// Feature icons mapping
const FEATURE_ICONS = [
  FaSwimmingPool,
  FaConciergeBell,
  FaUmbrellaBeach,
  FaUtensils,
  FaPaintBrush,
  FaGlassMartiniAlt,
  FaWifi,
  FaWater,
];

// Service icons mapping
const SERVICE_ICONS = [
  FaHeadset,
  FaUtensilsAlt,
  FaPlane,
  FaHiking,
  FaSpa,
  FaShip,
  FaBaby,
  FaBirthdayCake,
];

export default function AboutPage() {
  return (
    <>
      <main className="nc-PageAbout relative overflow-hidden">
        {/* GLASSMORPHISM BACKGROUND */}
        <BgGlassmorphism />

        {/* HERO SECTION WITH ENHANCED PARALLAX EFFECT */}
        <div className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background image with proper visibility */}
          <div className="absolute inset-0">
            <div className="w-full h-full relative">
              {" "}
              {/* Full opacity for image */}
              <Image
                src={allImg}
                alt="Luxury Villas Collection"
                fill
                style={{ objectFit: "cover" }}
                priority
                className="animate-ken-burns-faster"
              />
            </div>
            {/* Semi-transparent black overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>
            {/* Additional subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"></div>

            {/* Creative floating image elements */}
            <div className="absolute top-1/4 -left-10 md:left-10 w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform rotate-6 animate-float-slow opacity-60">
              <Image
                src={phuketImg}
                alt="Phuket Villa"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="absolute bottom-1/4 -right-10 md:right-10 w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform -rotate-6 animate-float-slow-reverse opacity-60">
              <Image
                src={koSamuiImg}
                alt="Koh Samui Villa"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="absolute top-2/3 left-1/3 w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl transform rotate-12 animate-float-medium opacity-40">
              <Image
                src={niesokoImg}
                alt="Niesoko Villa"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Content with white text */}
          <div className="container relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-fade-in-up">
              About <span className="text-yellow-400">The Villa List</span>
            </h1>
            <p className="text-xl md:text-2xl text-white leading-relaxed max-w-4xl mx-auto drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-300">
              Connecting travelers with extraordinary luxury villa experiences
              across Asia's most beautiful destinations
            </p>
            <div className="mt-10 animate-fade-in-up animation-delay-500">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
                <a href={`/listings?location=${encodeURIComponent("all")}`}>
                  Explore Our Villas
                </a>
              </button>
            </div>
          </div>

          {/* Simple transparent gradient at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-transparent to-transparent opacity-100 pointer-events-none"></div>
        </div>

        <div className="container relative pt-8 pb-16 lg:pt-16 lg:pb-28 -mt-12">
          {/* OUR STORY SECTION WITH ANIMATED CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20 lg:mb-32">
            <div className="lg:col-span-5 flex flex-col space-y-6 order-2 lg:order-1">
              <div className="inline-block">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  OUR JOURNEY
                </span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
                Our Story
              </h2>
              <div className="w-20 h-1 bg-yellow-400 rounded-full"></div>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                The Villa List was founded with a simple mission: to provide
                discerning travelers with access to the most exceptional private
                villas in Asia's premier destinations.
              </p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                What began as a curated collection of luxury properties in
                Thailand has expanded to include stunning villas throughout
                Southeast Asia and beyond, each selected for its unique
                character, prime location, and uncompromising quality.
              </p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Today, we pride ourselves on offering a personalized booking
                experience paired with on-the-ground expertise, ensuring every
                stay exceeds expectations.
              </p>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="relative h-64 rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500 shadow-xl">
                  <Image
                    src={phuketImg}
                    alt="Luxury Villa in Phuket"
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <h3 className="text-white font-semibold text-lg">Phuket</h3>
                  </div>
                </div>
                <div className="relative h-64 mt-8 rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500 shadow-xl">
                  <Image
                    src={koSamuiImg}
                    alt="Luxury Villa in Koh Samui"
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <h3 className="text-white font-semibold text-lg">
                      Koh Samui
                    </h3>
                  </div>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500 shadow-xl">
                  <Image
                    src={niesokoImg}
                    alt="Luxury Villa in Niesoko"
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <h3 className="text-white font-semibold text-lg">
                      Niesoko
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OUR VILLA FEATURES WITH ANIMATED ICONS */}
          <div className="mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
                LUXURY AMENITIES
              </span>
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-4">
                Our Villa Features
              </h2>
              <div className="w-20 h-1 bg-yellow-400 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VILLA_FEATURES.map((feature, index) => {
                const IconComponent = FEATURE_ICONS[index];
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-neutral-700"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="text-3xl text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                        {feature}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HOW IT WORKS SECTION */}
          <SectionHowItWork className="mb-20 lg:mb-32" />

          {/* OUR SERVICES WITH ANIMATED ICONS */}
          <div className="mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">
                PREMIUM SERVICES
              </span>
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-4">
                Our Services
              </h2>
              <div className="w-20 h-1 bg-yellow-400 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((service, index) => {
                const IconComponent = SERVICE_ICONS[index];
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-neutral-700"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="text-3xl text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                        {service}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WHY BOOK WITH US SECTION */}
          <WhyBookWithUs />

          {/* CTA SECTION */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              Ready for Your Dream Vacation?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
              Browse our collection of luxury villas and start planning your
              perfect getaway today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
                <a href={`/listings?location=${encodeURIComponent("all")}`}>
                  Explore Villas
                </a>
              </button>
              <button className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-blue-600 dark:text-blue-400 font-bold py-3 px-8 rounded-full border-2 border-blue-600 dark:border-blue-400 transition-all transform hover:scale-105">
                <a href="mailto:contact@thevillalist.com">Contact Us</a>
              </button>
            </div>
          </div>
        </div>
        <FloatingActionButton />
      </main>
      <Footer />

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes ken-burns-faster {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-ken-burns-faster {
          animation: ken-burns-faster 15s infinite alternate;
        }

        @keyframes float-slow {
          0% {
            transform: translateY(0px) rotate(6deg);
          }
          50% {
            transform: translateY(-15px) rotate(8deg);
          }
          100% {
            transform: translateY(0px) rotate(6deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        @keyframes float-slow-reverse {
          0% {
            transform: translateY(0px) rotate(-6deg);
          }
          50% {
            transform: translateY(-20px) rotate(-9deg);
          }
          100% {
            transform: translateY(0px) rotate(-6deg);
          }
        }

        .animate-float-slow-reverse {
          animation: float-slow-reverse 9s ease-in-out infinite;
        }

        @keyframes float-medium {
          0% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(15deg);
          }
          100% {
            transform: translateY(0px) rotate(12deg);
          }
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </>
  );
}
