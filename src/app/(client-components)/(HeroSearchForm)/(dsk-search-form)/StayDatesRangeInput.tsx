"use client";

import React, { Fragment, FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePicker from "react-datepicker";
import ClearDataButton from "../ClearDataButton";
import { Search } from "./StaySearchForm";

export interface StayDatesRangeInputProps {
  className?: string;
  fieldClassName?: string;
  searchData: Search;
  onChange: (key: keyof Search, value: any) => void;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding ]",
  searchData,
  onChange,
}) => {
  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChange("startDate", start);
    onChange("endDate", end);
  };

  const renderInput = () => {
    return (
      <>
        <div className="">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block xl:text-lg font-semibold">
            {searchData.startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }) || "Add dates"}
            {searchData.endDate
              ? " - " +
                searchData.endDate?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>
          <span className="block mt-1 text-sm text-neutral leading-none font-light">
            {"Check in - Check out"}
          </span>
        </div>
      </>
    );
  };

  const renderDatePicker = () => {
    const isMobile = window.innerWidth <= 768; // Detect mobile based on screen width

    return (
      <DatePicker
        className="bg-white backdrop-blur-lg text-sm"
        selected={searchData.startDate}
        onChange={onChangeDate}
        startDate={searchData.startDate}
        endDate={searchData.endDate}
        selectsRange
        monthsShown={isMobile ? 1 : 2} // Show 1 month for mobile, 2 for desktop
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
            <span className="text-sm font-medium">
              {date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
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
          <DatePickerCustomDay dayOfMonth={day} date={date} />
        )}
      />
    );
  };

  return (
    <Popover id="dateSelect" className={`StayDatesRangeInput z-10 relative flex ${className}`}>
      {({ open, close }) => (
        <div>
          <Popover.Button
            className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            {renderInput()}
            {searchData.startDate && open && (
              <ClearDataButton onClick={() => onChangeDate([null, null])} />
            )}
          </Popover.Button>

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
              {open && (
                <Popover.Panel
                  className="w-full max-w-lg md:max-w-2xl bg-white dark:bg-neutral-800 rounded-3xl shadow-xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {window.innerWidth <= 768
                        ? "Select Dates"
                        : "Choose Check-in and Check-out Dates"}
                    </h3>
                    <button
                      onClick={() => close()}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      ✕
                    </button>
                  </div>
                  {renderDatePicker()}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => close()}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                    >
                      Save
                    </button>
                  </div>
                </Popover.Panel>
              )}
            </div>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

export default StayDatesRangeInput;
