import React, { useState } from "react";
import ModalSelectDate from "@/components/ModalSelectDate";
import ModalSelectGuests from "@/components/ModalSelectGuests";
import ButtonPrimary from "@/shared/ButtonPrimary";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import ModalReserveMobile from "./ModalReserveMobile";

const MobileFooterSticky = ({
  price,
  listingId,
  roomTypes,
}: {
  price: string;
  listingId: string;
  roomTypes: any;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showModal, setShowModal] = React.useState(false);

  const handleGuestsChange = (key: string, value: number) => {
    if (key === "adults") setAdults(value);
    if (key === "children") setChildren(value);
    if (key === "infants") setInfants(value);
  };

  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-40">
      <div className="container flex items-center justify-between">
        <div>
          <span className="block text-xl font-semibold">
            ${price}
            <span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
              /night
            </span>
          </span>
          <ModalSelectDate
            showModal={showModal}
            setShowModal={setShowModal}
            startDate={startDate}
            endDate={endDate}
            onChangeDate={(dates: [Date | null, Date | null]) => {
              setStartDate(dates[0]);
              setEndDate(dates[1]);
            }}
            renderChildren={({ openModal }) => (
              <span
                onClick={openModal}
                className="block text-sm underline font-medium"
              >
                {converSelectedDateToString([startDate, endDate]) ||
                  "Select dates"}
              </span>
            )}
          />
        </div>
        <ModalSelectGuests
          adults={adults}
          children={children}
          infants={infants}
          onChangeGuests={handleGuestsChange}
          renderChildren={({ openModal }) => (
            <span
              onClick={openModal}
              className="block text-sm underline font-medium"
            >
              {`${adults + children} Guests`}
            </span>
          )}
        />
        <ModalReserveMobile
          listingId={listingId}
          mobile={true}
          setModal={setShowModal}
          roomTypes={roomTypes}
          checkInDate={startDate ? startDate.toISOString() : null}
          checkOutDate={endDate ? endDate.toISOString() : null}
          guests={adults + children + infants}
          renderChildren={({ openModal }) => (
            <ButtonPrimary
              sizeClass="px-5 sm:px-7 py-3 !rounded-2xl"
              onClick={openModal}
            >
              Reserve
            </ButtonPrimary>
          )}
        />
      </div>
    </div>
  );
};

export default MobileFooterSticky;
