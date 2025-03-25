import type { Metadata } from "next";
import "@/app/globals.css";
import "@/styles/index.scss";
import Script from 'next/script';
import LuxeToggle from "@/components/LuxeToggle";

export const metadata: Metadata = {
  title: "The Villa List | Luxury Villas & Vacation Rentals",
  description:
    "Discover luxurious villas and vacation rentals worldwide with The Villa List. Expertly curated properties for unforgettable escapes. Book your dream stay today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager Script */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M94D2FLF');`,
          }}
        />

        {/* Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Primary Meta Tags */}
        <meta name="title" content="Luxury Villas & Vacation Rentals | The Villa List" />
        <meta name="description" content="Discover luxurious villas and vacation rentals worldwide with The Villa List. Expertly curated properties for unforgettable escapes. Book your dream stay today!" />
        <meta name="keywords" content="luxury villas, vacation rentals, luxury stays, villas for rent, luxury vacation homes, The Villa List" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thevillalist.com" />
        <meta property="og:title" content="Your Gateway to Luxury and Unforgettable Experiences - thevillalist.com" />
        <meta property="og:description" content="Explore top villas in Bali, Phuket, Koh Samui, and Niseko with TheVillaList.com. Enjoy luxury stays, personalized services, and unforgettable experiences." />
        <meta property="og:image" content="http://thevillalist.com/wp-content/uploads/2023/11/FAVICON_8x.png" />
        <meta property="og:site_name" content="TheVillaList.com" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Gateway to Luxury and Unforgettable Experiences - thevillalist.com" />
        <meta name="twitter:description" content="Explore top villas in Bali, Phuket, Koh Samui, and Niseko with TheVillaList.com. Enjoy luxury stays, personalized services, and unforgettable experiences." />
        <meta name="twitter:image" content="http://thevillalist.com/wp-content/uploads/2023/11/FAVICON_8x.png" />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M94D2FLF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LuxeToggle />
        {children}
      </body>
    </html>
  );
}
