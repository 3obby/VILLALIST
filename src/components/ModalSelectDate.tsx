"use client";

import DatePicker from "react-datepicker";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { FC, Fragment } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import DatePickerCustomDay from "./DatePickerCustomDay";

interface ModalSelectDateProps {
  startDate: Date | null;
  endDate: Date | null;
  onChangeDate: (dates: [Date | null, Date | null]) => void;
  renderChildren?: (p: { openModal: () => void }) => React.ReactNode;
  showModal: any;
  setShowModal: any;
}

const ModalSelectDate: FC<ModalSelectDateProps> = ({
  startDate,
  endDate,
  onChangeDate,
  renderChildren,
  showModal=false,
  setShowModal
}) => {
 

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ openModal })
    ) : (
      <button onClick={openModal}>Select Date</button>
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

                  <div className="flex-1 pt-12 p-1 flex flex-col overflow-auto">
                    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800">
                      <div className="p-5">
                        <span className="block font-semibold text-xl sm:text-2xl">
                          {`When's your trip?`}
                        </span>
                      </div>

                      {/* Date Picker Centered */}
                      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                        <DatePicker
                          selected={startDate}
                          onChange={onChangeDate}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          monthsShown={1}
                          showPopperArrow={false}
                          inline
                          renderCustomHeader={({
                            date,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                          }) => (
                            <div className="flex justify-between items-center px-2 py-1">
                              {/* Previous Month Button */}
                              <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                                className={`px-2 py-1 rounded-md ${
                                  prevMonthButtonDisabled
                                    ? "text-gray-400"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {"<"}
                              </button>
                              {/* Current Month Display */}
                              <span className="text-sm font-medium">
                                {date.toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              {/* Next Month Button */}
                              <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                className={`px-2 py-1 rounded-md ${
                                  nextMonthButtonDisabled
                                    ? "text-gray-400"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {">"}
                              </button>
                            </div>
                          )}
                          renderDayContents={(day, date) => (
                            <DatePickerCustomDay
                              dayOfMonth={day}
                              date={date}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                    <button
                      type="button"
                      className="underline font-semibold flex-shrink-0"
                      onClick={() => onChangeDate([null, null])}
                    >
                      Clear dates
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

export default ModalSelectDate;
