import BgGlassmorphism from "@/components/BgGlassmorphism";
import React, { ReactNode } from "react";
import Footer from "@/components/Footer";
import HomeButton from "@/shared/HomeButton";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className={`nc-ListingStayPage relative`}>
        <BgGlassmorphism />
        <div className="fixed top-4 left-4 z-50">
          <HomeButton />
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
