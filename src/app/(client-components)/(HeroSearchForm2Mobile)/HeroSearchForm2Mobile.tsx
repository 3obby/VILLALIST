"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonSubmit from "./ButtonSubmit";
import { useTimeoutFn } from "react-use";
import StaySearchForm from "./(mob-search-form)/StaySearchForm";
import { toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";

const HeroSearchForm2Mobile = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [reserveData, setReserveData] = useState({
    location: "",
    startDate: null,
    endDate: null,
    guests: {
      guestAdults: 0,
      guestChildren: 0,
      guestInfants: 0,
    },
  });

  const updateReserveData = (key: string, value: any) => {
    setReserveData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

 const handleSearch = () => {

    if (!reserveData.location) {
      console.log(reserveData)
      toast.error("Location is required.", {
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
    setShowModal(false);
      return;
    }

    const query = new URLSearchParams({
      location: reserveData.location,
      adults: reserveData.guests.guestAdults.toString(),
      children: reserveData.guests.guestChildren?.toString() || "0",
      infants: reserveData.guests.guestInfants?.toString() || "0",
    }).toString();

    router.push(`/listings?${query}`);
    setShowModal(false);
  };

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false);
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1);
  //
  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative  bg-white  flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg"
      >
        <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />

        <div className="ml-3 flex-1 text-left overflow-hidden">
          <span className="block font-medium text-sm">Where to?</span>
          <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400 ">
            <span className="line-clamp-1">
              Anywhere • Any week • Add guests
            </span>
          </span>
        </div>

        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block w-4 h-4"
            fill="currentColor"
          >
            <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
          </svg>
        </span>
      </button>
    );
  };

  return (
    <div className="HeroSearchForm2Mobile">
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
  <Dialog
    as="div"
    className="HeroSearchFormMobile__Dialog relative z-max"
    onClose={closeModal}
  >
    <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
      <div className="flex h-full flex-col justify-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out transition-transform"
          enterFrom="opacity-0 translate-y-52"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in transition-transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-52"
        >
          <Dialog.Panel className="relative h-full w-full bg-white dark:bg-neutral-900 flex flex-col">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4"
              onClick={closeModal}
            >
              <XMarkIcon className="w-6 h-6 text-black dark:text-white" />
            </button>
            {/* Modal Content */}
            <div className="flex-1 w-full overflow-y-auto p-6 flex flex-col  justify-center space-y-6">
              <StaySearchForm
                reserveData={reserveData}
                updateReserveData={updateReserveData}
              />
            </div>
            {/* Footer Buttons */}
            <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
              <button
                type="button"
                className="underline font-semibold text-sm"
                onClick={() => {
                  setShowDialog(false);
                  resetIsShowingDialog();
                }}
              >
                Clear all
              </button>
              <ButtonSubmit
                onClick={() => {
                  handleSearch();
                }}
              />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>


    </div>
  );
};

export default HeroSearchForm2Mobile;
