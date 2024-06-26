import React from "react";
import { Link as LinkScroll } from "react-scroll"; // Import the Link component from react-scroll
import LogoVPN from "@/public/assets/Logo.svg";
import Facebook from "@/public/assets/Icon/facebook.svg";
import Twitter from "@/public/assets/Icon/twitter.svg";
import Instagram from "@/public/assets/Icon/instagram.svg";

const Footer = () => {
  return (
    <div className="bg-white-300 pt-44 pb-24">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <div className="flex flex-row">
            <LogoVPN className="h-8 w-auto mb-6" />
            <p className="text-lg font-bold">
              ሁሉ <span className="text-[#7983FB]">Code</span>
            </p>
          </div>
          <p className="mb-4">
            <strong className="font-medium">
              ሁሉ <span className="text-[#7983FB]">Code</span>
            </strong>{" "}
            is a learning platform that has unique features and has high security.
          </p>
          <p className="text-gray-400">©{new Date().getFullYear()} - ሁሉ Code</p>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Product</p>
          <ul className="text-black-500 ">
          <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
            Download{" "}
           </li>
            <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
              <LinkScroll to="about" spy={true} smooth={true} duration={1000}>
                Home
              </LinkScroll>
            </li>
            <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
              <LinkScroll to="feature" spy={true} smooth={true} duration={1000}>
                Function
              </LinkScroll>
            </li>
            <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
              <LinkScroll to="pricing" spy={true} smooth={true} duration={1000}>
                Description
              </LinkScroll>
            </li>
            <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
              <LinkScroll to="testimoni" spy={true} smooth={true} duration={1000}>
                Features
              </LinkScroll>
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Engage</p>
          <ul className="text-black-500">
            <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
              <LinkScroll to="about" spy={true} smooth={true} duration={1000}>
                ሁሉ Code?
              </LinkScroll>
            </li>
            <li className="my-2 hover:text-[#7983FB] cursor-pointer transition-all">
              <LinkScroll to="about" spy={true} smooth={true} duration={1000}>
                About Us
              </LinkScroll>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
