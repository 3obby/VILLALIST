'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="h-screen relative overflow-hidden">
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
      <div className="relative h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          <div className="relative bg-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5 animate-gradient-slow"></div>
            
            <div className="relative text-center">
              <div className="mb-6 sm:mb-8">
                <div className="mx-auto h-24 w-24 sm:h-32 sm:w-32 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="h-12 w-12 sm:h-16 sm:w-16 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                Thank You for Your Inquiry!
              </h1>
              
              <p className="text-base sm:text-lg text-gray-200 mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                We have received your booking request and will get back to you within 24 hours.
              </p>
              
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-6 border border-white/10">
                <p className="text-gray-200 text-sm sm:text-base mb-3">In the meantime, if you have any urgent questions, please contact us at:</p>
                <p className="text-white font-medium text-base sm:text-lg mb-1">contact@thevillalist.com</p>
                <p className="text-white font-medium text-base sm:text-lg">+1 (555) 123-4567</p>
              </div>
              
              <Link
                href="/"
                className="inline-block py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl border-none shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] hover:scale-[1.02]"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          animation: gradient 15s ease infinite;
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  );
} 