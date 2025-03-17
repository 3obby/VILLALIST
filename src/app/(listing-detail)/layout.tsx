"use client";

import HomeButton from "@/shared/HomeButton";
import Head from "next/head";
import React, { ReactNode } from "react";

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="luxury villas, vacation rentals, luxury stays, villas for rent, luxury vacation homes, The Villa List"
        />
        <meta
          property="og:site_name"
          content='thevillalist.com - Introducing TheVillaList.com - Your Premier Destination for Luxury Villa Rentals and Management  Welcome to TheVillaList.com, your ultimate gateway to exquisite luxury villa experiences in the Asia-Pacific region. As the foremost luxury villa booking portal and management company, we are dedicated to curating an unparalleled collection of opulent villas that redefine the art of travel.  Discover a World of Luxury: With an impressive portfolio of 85+ exclusively managed villas located across Bali, Koh Samui, and Phuket, as well as a meticulously curated selection of properties throughout the region, we invite discerning travelers like you to embark on a journey of unparalleled style and sophistication.  Our Mission: At TheVillaList.com, our mission is to inspire, champion, and empower you to travel in true luxury. We take immense pride in our unwavering commitment to attention to detail, our relentless pursuit of excellence in service, and our genuine desire to forge personal connections with every guest. By eliminating the guesswork from your vacation planning, we wholeheartedly encourage you to "Dream a little. Travel a lot."  Experience a New Standard of Luxury: Whether you&apos;re seeking a romantic getaway, a family retreat, or a lavish celebration, TheVillaList.com is your trusted partner in crafting unforgettable memories. Allow us to redefine your travel experience with a level of service and sophistication that goes beyond your expectations.  Join us at TheVillaList.com and open the door to a world of luxury, where each villa tells a unique story and every moment is an invitation to explore the heights of opulence. Your journey begins here – where luxury meets authenticity, and travel becomes an art form.'
        ></meta>

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Your Gateway to Luxury and Unforgettable Experiences - thevillalist.com Your Gateway to Unforgettable Experiences - thevillalist.com"
        ></meta>
        <meta
          property="og:description"
          content="Our Popular Destinations At The Villa List, we don't just offer accommodations, we offer experiences. Whether seeking a winter adventure in Niseko's winter wonderland or a tranquil escape in Thailand's tropical paradise of Phuket and Samui, we are here to guide you to your perfect vacation. PhuketVillas for rent in Phuket NisekoVillas for rent in Explore top villas in Bali, Phuket, Koh Samui, and Niseko with TheVillaList.com. Enjoy luxury stays, personalized services, and unforgettable experiences."
        />

        <meta property="og:url" content="https://thevillalist.com"></meta>
        <meta
          property="og:image"
          content="http://thevillalist.com/wp-content/uploads/2023/11/FAVICON_8x.png"
        ></meta>

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Your Gateway to Luxury and Unforgettable Experiences - thevillalist.com Your Gateway to Unforgettable Experiences - thevillalist.com"
        ></meta>
        <meta
          name="twitter:description"
          content="Our Popular Destinations At The Villa List, we don't just offer accommodations, we offer experiences. Whether seeking a winter adventure in Niseko's winter wonderland or a tranquil escape in Thailand's tropical paradise of Phuket and Samui, we are here to guide you to your perfect vacation. PhuketVillas for rent in Phuket NisekoVillas for rent in Explore top villas in Bali, Phuket, Koh Samui, and Niseko with TheVillaList.com. Enjoy luxury stays, personalized services, and unforgettable experiences."
        ></meta>
      </Head>
      <div className="ListingDetailPage">
        <HomeButton />
        <div className="">{children}</div>
      </div>
    </>
  );
};
export default DetailtLayout;
