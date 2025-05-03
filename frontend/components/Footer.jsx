"use client";

import Image from "next/image";
import React from "react";
import bgImage from "../public/images/footer-bg.jpg";
import bgImageSmall from "../public/images/footersmall-bg.jpg";
// import bgVideo from '../public/videos/footerVid.mp4';
import passionImg from "../public/images/passion.svg";
import Link from "next/link";

const Footer = () => {
  const svgIcons = {};

  return (
    <div className="bg-[#090B0C] text-white">
      <div className="relative">
        <Image
          src={bgImage}
          alt="Footer-Bg"
          className="w-full h-full object-cover z-0 hidden md:block"
        />
        <Image src={bgImageSmall} alt="FooterSmall-Bg" className="w-full h-full object-cover z-0 block md:hidden"/>
        <div className="absolute top-[40%] left-1/3 sm:top-1/2 sm:left-[35%] md:top-[7%] xl:top-[15%] xl:left-1/2 2xl:-mt-4 2xl:-ml-20 z-0">
          <h1 className="text-[#F6F7FD] text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl pr-1 z-30 max-w-xl bg-gradient-to-br from-white from-30% via-[#d5d8f6] via-80% to-[#fdf7fe] bg-clip-text text-transparent tracking-tight font-semibold leading-[0.9]">
            Join the <br /> Movement
          </h1>
          <p className="max-w-md text-balance mt-3 lg:text-sm 2xl:text-base">
            Unlock the future of finance with FinSmart. Remember, this journey
            is just getting started.
          </p>
          <Link href={"/dashboard?refresh=true"}>
            <button className="relative py-2 px-8 mt-5 2xl:mt-10 overflow-hidden rounded-full border border-white/60 bg-[#d1d1d1] space-x-1 lg:px-10 lg:mt-18 max-sm:text-xs max-sm:px-6">
              <div className="absolute top-1/2 h-[103px] w-[204px] translate-x-1/4 -translate-y-1/2 bg-[radial-gradient(43.3%_44.23%_at_50%_49.51%,_#FFFFF7_29%,_#FFFACD_48.5%,_#F4D2BF_60.71%,rgba(214,211,210,0.00)_100%)] blur-[5px]"></div>
              <h1 className="z-10 relative text-sm flex text-black font-bold">
                Go to Dashboard
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 9"
                  className="h-[9px] w-[17px] text-[#5A250A] flex mt-[0.3rem] ml-2"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </h1>
            </button>
          </Link>
        </div>
        <div className="flex justify-center items-center lg:mx-auto whitespace-nowrap gap-6 2xl:gap-12 max-w-screen-lg px-12 mt-24 md:-mt-10 pt-5 py-2">
          <div>
            <p className="text-slate-500 text-sm 2xl:text-base">
              Copyright &copy; 2025 FinSmart. All rights reserved.
            </p>
          </div>
          <div className="flex gap-5 text-gray-300 text-sm 2xl:text-base max-md:hidden">
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
          </div>
          <div className="flex gap-5 max-md:hidden">
            <svg
              width="14"
              height="14"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="text-gray-400 flex justify-center items-center text-sm 2xl:text-base max-sm:hidden sm:flex">
            <Image
              src="/images/passion.svg"
              alt="Passion"
              width={34}
              height={34}
              className="scale-150"
            />
            <p>Made with Passion and FinSmart</p>
          </div>
        </div>
        {/* <video src={"../public/videos/footerVid.mp4"} autoPlay loop muted className='absolute inset-0'></video> */}
      </div>
    </div>
  );
};

export default Footer;
