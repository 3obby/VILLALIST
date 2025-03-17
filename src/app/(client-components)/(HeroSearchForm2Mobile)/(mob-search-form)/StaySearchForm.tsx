"use client";

import converSelectedDateToString from "@/utils/converSelectedDateToString";
import React, { useState } from "react";
import { GuestsObject } from "../../type";
import GuestsInput from "../GuestsInput";
// import LocationInput from "../LocationInput";
import LocationInput from "../../(HeroSearchForm)/LocationInput";
import DatesRangeInput from "../DatesRangeInput";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface StaySearchFormProps {
  reserveData: {
    location: string;
    startDate: Date | null;
    endDate: Date | null;
    guests: GuestsObject;
  };
  updateReserveData: (key: string, value: any) => void;
}

const StaySearchForm: React.FC<StaySearchFormProps> = ({
  reserveData,
  updateReserveData,
}) => {
  const [fieldNameShow, setFieldNameShow] = useState<
    "location" | "dates" | "guests"
  >("location");
  const [isDatesPopupOpen, setIsDatesPopupOpen] = useState(false);
  const [isGuestsPopupOpen, setIsGuestsPopupOpen] = useState(false);

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">Where</span>
            <span>{reserveData.location || "Location"}</span>
          </button>
        ) : (
          <LocationInput
            searchData={reserveData}
            onChange={updateReserveData}
          />
        )}
      </div>
    );
  };

  const renderInputDates = () => {
    return (
      <>
        <button
          className={`w-full flex justify-between text-sm font-medium p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]`}
          onClick={() => setIsDatesPopupOpen(true)}
        >
          <span className="text-neutral-400">When</span>
          <span>
            {reserveData.startDate
              ? converSelectedDateToString([
                  reserveData.startDate,
                  reserveData.endDate,
                ])
              : "Add date"}
          </span>
        </button>

        {isDatesPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Dates</h3>
                <button
                  onClick={() => setIsDatesPopupOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  ✕
                </button>
              </div>
              <DatesRangeInput
                reserveData={reserveData}
                onChange={(key: string, value: any) =>
                  updateReserveData(key, value)
                }
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsDatesPopupOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderInputGuests = () => {
    return (
      <>
        <button
          className={`w-full flex justify-between text-sm font-medium p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]`}
          onClick={() => setIsGuestsPopupOpen(true)}
        >
          <span className="text-neutral-400">Who</span>
          <span>
            {reserveData.guests.guestAdults ||
            reserveData.guests.guestChildren ||
            reserveData.guests.guestInfants
              ? `${
                  reserveData.guests.guestAdults +
                  reserveData.guests.guestChildren +
                  reserveData.guests.guestInfants
                } guests`
              : "Add guests"}
          </span>
        </button>

        {isGuestsPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Guests</h3>
                <button
                  onClick={() => setIsGuestsPopupOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  ✕
                </button>
              </div>
              <GuestsInput
                defaultValue={reserveData.guests}
                onChange={(data: GuestsObject) =>
                  updateReserveData("guests", data)
                }
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsGuestsPopupOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
     <div className="w-full space-y-8 flex flex-col items-center">
        {renderInputLocation()}
        {renderInputDates()}
        {renderInputGuests()}
      </div>
    </div>
  );
};

export default StaySearchForm;
