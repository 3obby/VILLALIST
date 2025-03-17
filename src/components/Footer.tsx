import React from "react"
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa"
import { FaTelegram } from "react-icons/fa"
import {
  FaUmbrellaBeach,
  FaGlobe,
  FaStar,
  FaConciergeBell,
  FaEnvelope,
  FaHandshake,
} from "react-icons/fa"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-gray-300 py-16">
      <div className="container mx-auto px-8 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 xl:gap-24">
          {/* About us column */}
          <div className="space-y-8">
            <h3 className="text-white text-2xl font-semibold">About us</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              We have a superb selection of luxurious, unique properties that
              are hard to categorize but which are undoubtedly distinct. Our
              experts provide carefully handpicked properties for the perfect
              getaway, combining personalized service with unmatched luxury
              standards.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3 text-base text-gray-400">
                <FaUmbrellaBeach className="text-yellow-500 text-xl" />
                <span>Exclusive Selection</span>
              </div>
              <div className="flex items-center gap-3 text-base text-gray-400">
                <FaConciergeBell className="text-yellow-500 text-xl" />
                <span>Personalized Service</span>
              </div>
              <div className="flex items-center gap-3 text-base text-gray-400">
                <FaGlobe className="text-yellow-500 text-xl" />
                <span>Multilingual Support</span>
              </div>
              <div className="flex items-center gap-3 text-base text-gray-400">
                <FaStar className="text-yellow-500 text-xl" />
                <span>Unmatched Luxury</span>
              </div>
            </div>
          </div>

          {/* Get in touch column */}
          <div className="space-y-8">
            <h3 className="text-white text-2xl font-semibold">Get in touch</h3>
            <p className="text-gray-400 mb-6 text-lg">
              We're always here to help
            </p>
            <ul className="space-y-5">
              <li className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Australia</span>
                <a
                  href="tel:+61279122347"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  +61 2 7912 2347
                </a>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Indonesia</span>
                <a
                  href="tel:+62361737498"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  +62 361 737 498
                </a>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Thailand</span>
                <a
                  href="tel:+66818932442"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  +66 81 893 2442
                </a>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Singapore</span>
                <a
                  href="tel:+6531634477"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  +65 3163 4477
                </a>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Other Countries</span>
                <a
                  href="tel:+61279122347"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  +61 2 7912 2347
                </a>
              </li>
            </ul>
          </div>

          {/* Connect with us column */}
          <div className="space-y-8">
            <h3 className="text-white text-2xl font-semibold">
              Connect with us
            </h3>
            <div className="flex gap-6 mb-10">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaPinterestP />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaYoutube />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaTiktok />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                <FaTelegram />
              </a>
            </div>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@thevillalist.com"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:partner@thevillalist.com"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-lg"
                >
                  Partner with Us
                </a>
              </li>
            </ul>

            <div className="border-t border-gray-800 pt-8 mt-8">
              <p className="text-sm text-gray-400 mb-3">
                Unit 03, 8/F., Greenfield Tower, Concordia Plaza, No.1 Science
                Museum Road, KL, Hong Kong, Hong Kong
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Copyright ©{currentYear} The VillaList. All rights reserved.
              </p>
              <div className="flex gap-6 text-base">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Terms and conditions
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Privacy policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
