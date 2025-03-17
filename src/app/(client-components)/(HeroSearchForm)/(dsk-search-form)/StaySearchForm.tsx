"use client";

import React, { FC, useState } from "react";
import GuestsInput from "../GuestsInput";
import StayDatesRangeInput from "./StayDatesRangeInput";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import LocationInput from "../LocationInput";

export interface Search {
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  adults: number | 1;
  children: number | null;
  infants: number | null;
}

const StaySearchForm: FC<{}> = ({}) => {
  const [search, setSearch] = useState<Search>({
    location: "",
    startDate: new Date(),
    endDate: new Date(),
    adults: 1,
    children: 1,
    infants: 0,
  });

  const router = useRouter();

  const updateSearch = (key: keyof Search, value: any) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    if (!search.location) {
      toast.error('Location is required.', {
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
      return;
    }
    const query = new URLSearchParams({
      location: search.location,
      adults: search.adults.toString(),
      children: search.children?.toString() || "0",
      infants: search.infants?.toString() || "0",
    }).toString();
    router.push(`/listings?${query}`);
  };

  return (
    <div className="w-full relative mt-8 flex rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 ">
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
      <LocationInput
        searchData={search}
        onChange={updateSearch}
        className="pl-2 mt-6npm  flex-[1.5]"
      />
      <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
      <StayDatesRangeInput
        searchData={search}
        onChange={updateSearch}
        className="flex-1"
      />
      <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
      <GuestsInput
        searchData={search}
        onChange={updateSearch}
        className="flex-1"
      />
      <div className="pr-2 xl:pr-4 pt-4">
        <button
          type="button"
          onClick={handleSearch}
          className="h-14 md:h-16 w-full md:w-16 rounded-full bg-primary-6000 hover:bg-primary-700 flex items-center justify-center text-neutral-50 focus:outline-none"
        >
          <span className="mr-3 md:hidden">Search</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StaySearchForm;
