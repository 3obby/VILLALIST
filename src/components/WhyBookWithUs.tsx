import React from "react";
import {
  FaUmbrellaBeach,
  FaGlobe,
  FaStar,
  FaConciergeBell,
} from "react-icons/fa";

const WhyBookWithUs: React.FC = () => {
  return (
    <section className="relative rounded-lg bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 py-24 px-6 text-white text-center overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 uppercase tracking-widest drop-shadow-xl animate-pulse">
          Why Book with <span className="text-yellow-300">The Villa List</span>
        </h1>
        <p className="text-xl mb-10 max-w-4xl mx-auto font-light leading-relaxed">
          We have a superb selection of luxurious, unique properties that are
          hard to categorize but which are undoubtedly distinct.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="bg-white/20 p-8 rounded-xl backdrop-blur-lg transform hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
            <FaUmbrellaBeach className="text-5xl text-yellow-300 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-2xl font-bold">Exclusive Selection</h2>
            <p className="text-md mt-2">
              Looking for a luxurious vacation rental and need some guidance?
              Our experts provide carefully handpicked properties for the
              perfect getaway.
            </p>
          </div>

          <div className="bg-white/20 p-8 rounded-xl backdrop-blur-lg transform hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
            <FaConciergeBell className="text-5xl text-yellow-300 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-2xl font-bold">Personalized Service</h2>
            <p className="text-md mt-2">
              From the moment you inquire, our team ensures you have a seamless
              experience with personalized concierge services tailored to your
              needs.
            </p>
          </div>

          <div className="bg-white/20 p-8 rounded-xl backdrop-blur-lg transform hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
            <FaGlobe className="text-5xl text-yellow-300 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-2xl font-bold">Multilingual Support</h2>
            <p className="text-md mt-2">
              Our team is fluent in seven languages, including English, French,
              Indonesian, Chinese, Thai, and Spanish, ensuring smooth
              communication.
            </p>
          </div>

          <div className="bg-white/20 p-8 rounded-xl backdrop-blur-lg transform hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
            <FaStar className="text-5xl text-yellow-300 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-2xl font-bold">Unmatched Luxury</h2>
            <p className="text-md mt-2">
              We inspect and hand-select each villa to meet high standards of
              luxury, ensuring only the best for your dream holiday.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;
