import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import { FC } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import ClearDataButton from "@/app/(client-components)/(HeroSearchForm)/ClearDataButton";

export interface GuestsInputProps {
  fieldClassName?: string;
  className?: string;
  resserveData: any;
  onChange: any
}

const GuestsInput: FC<GuestsInputProps> = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  resserveData,
  onChange,
}) => {
  const handleChangeData = (value: number, type:any) => {
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
    resserveData.adults + resserveData.children + resserveData.infants;

  return (
    <Popover className={`flex relative ${className}`}>
      {({ open }) => (
        <>
          <div
            className={`flex-1 z-10 flex items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            <Popover.Button
              className={`relative z-10 flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
            >
              <div className="text-neutral-300 dark:text-neutral-400">
                <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <span className="block xl:text-lg font-semibold">
                  {totalGuests || ""} Guests
                </span>
                <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
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

          {/* Add higher z-index and prevent interaction with underlying elements */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className="absolute right-0 z-50 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl"
              onClick={(e) => e.stopPropagation()} 
            >
              <NcInputNumber
                className="w-full"
                value={resserveData.adults}
                onChange={(value) => handleChangeData(value, "adults")}
                max={10}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
              />
              <NcInputNumber
                className="w-full mt-6"
                value={resserveData.children}
                onChange={(value) => handleChangeData(value, "children")}
                max={4}
                label="Children"
                desc="Ages 2–12"
              />
              <NcInputNumber
                className="w-full mt-6"
                value={resserveData.infants}
                onChange={(value) => handleChangeData(value, "infants")}
                max={4}
                label="Infants"
                desc="Ages 0–2"
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;
