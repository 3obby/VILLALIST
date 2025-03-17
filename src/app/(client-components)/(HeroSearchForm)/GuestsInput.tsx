import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { Search } from "./(dsk-search-form)/StaySearchForm";

export interface GuestsInputProps {
  fieldClassName?: string;
  className?: string;
  searchData: Search;
  onChange: (key: keyof Search, value: any) => void;
}

const GuestsInput: FC<GuestsInputProps> = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  searchData,
  onChange,
}) => {
  const handleChangeData = (value: number, type: keyof Search) => {
    if (type === "adults") {
      onChange("adults", value);
    }
    if (type === "children") {
      onChange("children", value);
    }
    if (type === "infants") {
      onChange("infants", value);
    }
  };

  const totalGuests =
    searchData.adults + searchData.children + searchData.infants;

  return (
    <Popover className={`flex relative ${className}`}>
      {({ open, close }) => (
        <>
          <div
            className={`flex-1 flex items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            <Popover.Button
              className={`relative  flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
            >
              <div className="">
                <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <span className="block xl:text-lg font-semibold">
                  {totalGuests || ""} Guests
                </span>
                <span className="block mt-1 text-sm ">
                  {totalGuests ? "Guests" : "Add guests"}
                </span>
              </div>

              {!!totalGuests && open && (
                <ClearDataButton
                  onClick={() => {
                    onChange("adults", 0);
                    onChange("children", 0);
                    onChange("infants", 0);
                  }}
                />
              )}
            </Popover.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <Popover.Panel
                className="w-full max-w-md bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Select Guests</h3>
                  <button
                    onClick={() => close()}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    ✕
                  </button>
                </div>
                <NcInputNumber
                  className="w-full"
                  value={searchData.adults}
                  onChange={(value) => handleChangeData(value, "adults")}
                  max={10}
                  min={1}
                  label="Adults"
                  desc="Ages 13 or above"
                />
                <NcInputNumber
                  className="w-full mt-6"
                  value={searchData.children}
                  onChange={(value) => handleChangeData(value, "children")}
                  max={4}
                  label="Children"
                  desc="Ages 2–12"
                />
                <NcInputNumber
                  className="w-full mt-6"
                  value={searchData.infants}
                  onChange={(value) => handleChangeData(value, "infants")}
                  max={4}
                  label="Infants"
                  desc="Ages 0–2"
                />
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => close()}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                  >
                    Save
                  </button>
                </div>
              </Popover.Panel>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;
