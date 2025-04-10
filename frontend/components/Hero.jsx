"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import HeroImage from "../public/images/finbgfinal.png"

const Hero = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#090B0D] via-[#090B0D] via-50% to-[#010103]">
      <div className="hero-content relative md:max-w-screen-2xl w-full mx-auto h-fit max-md:-mt-24">
        <div className="absolute z-10 top-40 max-md:mt-4 ml-8 max-md:ml-4">
          <h1 className="relative scale-y-100 text-[#F6F7FD] text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl pr-1 z-30 max-w-2xl bg-gradient-to-br from-white from-30% via-[#d5d8f6] via-80% to-[#fdf7fe] bg-clip-text text-transparent tracking-tighter leading-[0.9] font-bold pb-2">
            Everything App <br /> for your investments
          </h1>
          <p className="relative z-30 max-md:max-w-[15rem] text-gray-100 mt-5 text-xs md:text-sm lg:text-base 2xl:text-lg max-w-lg max-md:text-sm max-md:mt-2">
          FinSmart, leveraging Yahoo Finance with AI for smarter stock insights.
          </p>
          <Link href={"/dashboard"}>
            <button className="relative py-3 px-8 mt-10 overflow-hidden rounded-full border border-white/60 bg-[#d1d1d1] space-x-1 lg:px-12 lg:mt-18 max-sm:text-xs max-sm:px-6 max-sm:scale-75 max-sm:mt-5 max-sm:-ml-6">
              <div className="absolute top-1/2 h-[103px] w-[204px] translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(43.3%_44.23%_at_50%_49.51%,_#FFFFF7_29%,_#FFFACD_48.5%,_#F4D2BF_60.71%,rgba(214,211,210,0.00)_100%)] blur-[5px]"></div>
              <h1 className="z-10 relative text-sm font-bold flex text-black uppercase tracking-wide">
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
        <div className="relative overflow-hidden">
          <div className="relative pb-20">
            {/* <video
              autoPlay
              muted
              loop
              className="z-0 pt-52 max-lg:pt-44 max-sm:pt-52 scale-150 max-md:ml-10 relative md:-mt-6 max-md:scale-[1.7]"
              src="/videos/hero.mp4"
            ></video> */}
            <Image src={HeroImage} className="z-0 max-lg:pt-0 max-lg:left-24 max-sm:pt-24 max-sm:scale-125 scale-125 max-md:ml-10 relative md:-mt-6 max-md:scale-[1.4] max-md:pt-20 left-48 top-[7rem] pb-32" alt="Hero"/>
            <div className="rounded-md">
              {/* <Image src={Illustration} className="absolute -bottom-5 ml-8 mb-5  md:-bottom-20 md:left-[1.5%]" alt="hero-illustration" height={1000} width={1000} /> */}
            </div>
          </div>
        </div>
        <div className="text-white py-12 px-3 xl:ml-5">
          <h1 className="text-slate-400 ">
            Everything you need for productive team work:
          </h1>
          <div className=" flex gap-3">
            {[
              "Team Planner",
              "Project Management",
              "Virtual Office",
              "Chat",
              "Documents",
              "Inbox",
            ].map((elem, indx) => (
              <div key={indx} className="flex justify-center items-center font-semibold">
                {elem}
                {indx !== 5 && <div className="bg-slate-300 ml-2 p-[2px] my-3 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
