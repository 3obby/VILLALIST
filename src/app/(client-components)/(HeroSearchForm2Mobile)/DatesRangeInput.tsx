"use client";

import DatePicker from "react-datepicker";
import React, { FC } from "react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";

interface DatesRangeInputProps {
  reserveData: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onChange: (key: string, value: Date | null) => void;
}

const DatesRangeInput: FC<DatesRangeInputProps> = ({ reserveData, onChange }) => {
  const { startDate, endDate } = reserveData;

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChange("startDate", start);
    onChange("endDate", end);
  };

  return (
    <div className="relative flex-shrink-0 flex justify-center py-5">
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
          <DatePickerCustomDay dayOfMonth={day} date={date} />
        )}
      />
    </div>
  );
};

export default DatesRangeInput;
