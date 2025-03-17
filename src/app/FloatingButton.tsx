"use client"

import { useState } from "react"
import { FaPhone, FaWhatsapp, FaTelegramPlane, FaWeixin } from "react-icons/fa"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { MdClose } from "react-icons/md"

const FloatingActionButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <IoChatbubbleEllipsesOutline className="w-7 h-7" />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <MdClose className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Contact Us
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <a
                  href="/about"
                  className="text-gray-800 font-medium hover:text-blue-600 hover:underline flex items-center"
                >
                  <svg
                    className="w-6 h-6 text-blue-600 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About Us
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="w-6 h-6 text-blue-600 mr-2" />
                <a
                  href="tel:+123456789"
                  className="text-gray-800 font-medium hover:text-blue-600 hover:underline"
                >
                  +123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <FaWhatsapp className="w-6 h-6 text-green-500 mr-2" />
                <a
                  href="https://wa.me/123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium hover:text-blue-600 hover:underline"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center">
                <FaTelegramPlane className="w-6 h-6 text-blue-400 mr-2" />
                <a
                  href="https://t.me/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium hover:text-blue-600 hover:underline"
                >
                  Telegram
                </a>
              </li>
              <li className="flex items-center">
                <FaWeixin className="w-6 h-6 text-green-400 mr-2" />
                <a
                  href="https://www.wechat.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium hover:text-blue-600 hover:underline"
                >
                  WeChat
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingActionButton
