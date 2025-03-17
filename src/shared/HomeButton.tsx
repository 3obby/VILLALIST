"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";

const HomeButton: React.FC = () => {
  const router = useRouter();

  const navigateHome = () => {
    router.push("/");
  };

  return (
    <div
      className="fixed top-4 left-4 md:top-6 md:left-6 z-50 cursor-pointer bg-white dark:bg-neutral-900 shadow-lg p-2 md:p-3 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
      onClick={navigateHome}
    >
      <HomeIcon className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
    </div>
  );
};

export default HomeButton;
