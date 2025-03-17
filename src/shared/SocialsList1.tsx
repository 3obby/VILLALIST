import React, { FC } from 'react';
import { FaFacebookSquare, FaTelegramPlane, FaYoutube } from "react-icons/fa"
import { FaSquareXTwitter } from 'react-icons/fa6';
import { AiFillInstagram } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";

export interface SocialType {
  name: string;
  icon: any;
  href: string;
}

interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: <FaFacebookSquare />, href: "https://www.facebook.com/" },
  { name: "Twitter", icon: <FaSquareXTwitter />, href: "https://twitter.com/" },
  { name: "Youtube", icon: <FaYoutube />, href: "https://www.youtube.com/" },
  { name: "Instagram", icon: <AiFillInstagram />, href: "https://www.instagram.com/" },
  { name: "Telegram", icon: <FaTelegramPlane />, href: "https://telegram.org/" },
  { name: "WhatsApp", icon:<RiWhatsappFill />, href: "https://www.whatsapp.com/" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-x-3 sm:space-y-0 ${className}`}>
      {socials.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex items-baseline space-x-2 group text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white text-lg"
        >
          {item.icon}
          <span>{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialsList1;
