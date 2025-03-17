import React, { FC } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export interface NcInputNumberProps {
  className?: string;
  value: number; // Now this is required and not defaultValue
  min?: number;
  max?: number;
  onChange: (value: number) => void; // Now this is required
  label?: string;
  desc?: string;
}

const NcInputNumber: FC<NcInputNumberProps> = ({
  className = "w-full",
  value,
  min = 0,
  max,
  onChange,
  label,
  desc,
}) => {
  const handleClickDecrement = (e:any) => {
    e.stopPropagation(); 
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleClickIncrement = (e:any) => {
    e.stopPropagation(); 
    if (max === undefined || value < max) {
      onChange(value + 1);
    }
  };

  const renderLabel = () => (
    <div className="flex flex-col">
      <span className="font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
      {desc && <span className="text-xs text-neutral-500 dark:text-neutral-400">{desc}</span>}
    </div>
  );

  return (
    <div className={`nc-NcInputNumber flex items-center justify-between space-x-5 ${className}`} data-nc-id="NcInputNumber">
      {label && renderLabel()}
      <div className="flex items-center justify-between w-28">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickDecrement}
          disabled={value <= min}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span>{value}</span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickIncrement}
          disabled={max !== undefined && value >= max}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NcInputNumber;
