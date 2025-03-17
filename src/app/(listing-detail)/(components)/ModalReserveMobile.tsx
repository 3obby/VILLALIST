"use client";

import React, { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useRouter } from "next/navigation";

interface ModalReserveMobileProps {
  listingId: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  guests: number;
  roomTypes: { id: string; name: string }[]; // Array of room types
  renderChildren?: (p: { openModal: () => void }) => React.ReactNode;
  setModal?: any;
  mobile?: boolean;
}

const ModalReserveMobile: FC<ModalReserveMobileProps> = ({
  listingId,
  checkInDate,
  checkOutDate,
  guests,
  roomTypes,
  renderChildren,
  setModal = () => {},
  mobile = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    roomType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    if (!listingId || !checkInDate || !checkOutDate || !guests) {
      const missingFields = [];

      if (!listingId) missingFields.push("a listing");
      if (!checkInDate || !checkOutDate)
        missingFields.push("both check-in and check-out dates");
      if (!guests) missingFields.push("the number of guests");

      const message = `Please select ${missingFields.join(
        "& "
      )} before reserving.`;

      setModal(true);
      if (!mobile) {
        toast.warn(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      return;
    }

    setShowModal(true);
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.roomType) {
      toast.error("Name, email, and room type are required.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      listingId,
      checkInDate,
      checkOutDate,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      roomType: formData.roomType,
      guests,
    };

    try {
      const response = await axios.post("/api/listings/bookListing", payload);

      if (response.data.success) {
        toast.success("Booking confirmed! Email sent.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        closeModal();
        router.push("/thank-you");
      } else {
        throw new Error(response.data.message || "Unknown error occurred.");
      }
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to confirm booking. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
      setIsSubmitting(false);
    }
  };

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ openModal })
    ) : (
      <button onClick={openModal}>Reserve</button>
    );
  };

  return (
    <>
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-50"
          onClose={closeModal}
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-neutral-800 bg-opacity-50" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out transition-transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in transition-transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden 
                  sm:h-auto h-full flex flex-col justify-between`}
              >
                {/* Close button */}
                <div className="absolute left-4 top-4">
                  <button
                    className="focus:outline-none focus:ring-0"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                  </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 pt-12 py-4 flex flex-col px-6">
                  <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
                    Confirm Reservation
                  </h2>
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="roomType"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Select Room Type
                      </label>
                      <select
                        id="roomType"
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-neutral-800 dark:text-white"
                      >
                        <option value="">-- Select Room Type --</option>
                        {roomTypes.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Additional Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                    <ButtonPrimary
                      sizeClass="px-6 py-3 !rounded-xl"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Confirm Reservation"}
                    </ButtonPrimary>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalReserveMobile;
