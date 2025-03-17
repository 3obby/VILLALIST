"use client";

import React, { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/ButtonPrimary";
import GuestsInput from "@/app/(client-components)/(HeroSearchForm2Mobile)/GuestsInput";

interface ModalSelectGuestsProps {
  adults: number;
  children: number;
  infants: number;
  onChangeGuests: (key: string, value: number) => void;
  renderChildren?: (p: { openModal: () => void }) => React.ReactNode;
}

const ModalSelectGuests: FC<ModalSelectGuestsProps> = ({
  adults,
  children,
  infants,
  onChangeGuests,
  renderChildren,
}) => {
  const [showModal, setShowModal] = React.useState(false);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ openModal })
    ) : (
      <button onClick={openModal}>Select Guests</button>
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
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between">
                  <div className="absolute left-4 top-4">
                    <button
                      className="focus:outline-none focus:ring-0"
                      onClick={closeModal}
                    >
                      <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                    </button>
                  </div>

                  <div className="flex-1 pt-12 p-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800">
                      <GuestsInput
                        defaultValue={{
                          guestAdults: adults,
                          guestChildren: children,
                          guestInfants: infants,
                        }}
                        onChange={(data: any) => {
                          onChangeGuests("adults", data.guestAdults);
                          onChangeGuests("children", data.guestChildren);
                          onChangeGuests("infants", data.guestInfants);
                        }}
                      />
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                    <button
                      type="button"
                      className="underline font-semibold flex-shrink-0"
                      onClick={() => {
                        onChangeGuests("adults", 0);
                        onChangeGuests("children", 0);
                        onChangeGuests("infants", 0);
                      }}
                    >
                      Clear data
                    </button>
                    <ButtonPrimary
                      sizeClass="px-6 py-3 !rounded-xl"
                      onClick={closeModal}
                    >
                      Save
                    </ButtonPrimary>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalSelectGuests;
