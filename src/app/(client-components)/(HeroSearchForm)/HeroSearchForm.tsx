"use client";

import React, { FC, useState } from "react";
import StaySearchForm from "./(dsk-search-form)/StaySearchForm";

export type SearchTab = "Stays" | "Experiences" | "Cars" | "Flights";

export interface HeroSearchFormProps {
  className?: string;
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
}) => {


  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}
    >
       <StaySearchForm />
    </div>
  );
};

export default HeroSearchForm;
