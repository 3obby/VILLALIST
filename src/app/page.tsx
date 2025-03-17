import React from "react";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionHowItWork from "@/components/SectionHowItWork";
import SectionVideos from "@/components/SectionVideos";
import Footer from "@/components/Footer";
import FloatingActionButton from "./FloatingButton";
import SectionHero from "./(additional-components)/SectionHero";
import WhyBookWithUs from "@/components/WhyBookWithUs";
import Ipuket from "@/images/pucket.jpg";
import Isamui from "@/images/KohSamui.jpg";
import Ibang from "@/images/bangkok.jpg";
import Ibali from "@/images/bali.jpg";
import Iall from "@/images/all.jpg";
import Iniseko from "@/images/niesoko.jpg";

const DEMO_CATS: any[] = [
  {
    id: "0",
    href: `/listings?location=${encodeURIComponent("all")}`,
    name: "All Locations",
    taxonomy: "category",
    count: 91,
    thumbnail: Iall,
  },
  {
    id: "1",
    href: `/listings?location=${encodeURIComponent("Phuket, Thailand")}`,
    name: "Phuket, Thailand",
    taxonomy: "category",
    count: 18,
    thumbnail: Ipuket,
  },
  {
    id: "2",
    href: `/listings?location=${encodeURIComponent("Koh Samui, Thailand")}`,
    name: "Koh Samui, Thailand",
    taxonomy: "category",
    count: 11,
    thumbnail: Isamui,
  },
  {
    id: "5",
    href: `/listings?location=${encodeURIComponent("Niseko, Japan")}`,
    name: "Niseko, Japan",
    taxonomy: "category",
    count: 14,
    thumbnail: Iniseko,
  },
];

function PageHome() {
  return (
    <>
      <main className="nc-PageHome relative overflow-hidden">
        {/* GLASSMOPHIN */}
        <BgGlassmorphism />

       
        <SectionHero />
        <div className="container relative mt-10 space-y-24 mb-24 lg:space-y-28 lg:mb-28">
          <SectionSliderNewCategories categories={DEMO_CATS} />

          <SectionHowItWork />
          <FloatingActionButton />

          {/* <SectionVideos /> */}

          <WhyBookWithUs />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PageHome;
