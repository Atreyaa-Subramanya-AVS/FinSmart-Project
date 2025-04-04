"use client";

import Image from "next/image";
import React from "react";
import qnaBg from "../public/images/qna-bg.jpg";
import { HoverEffect } from "./ui/card-hover-effect";

const Feat = () => {
  const dummyItems = [
    {
      title: "Feature One",
      description: "This is the first feature description.",
      link: "/feature-1",
    },
    {
      title: "Feature Two",
      description: "This is the second feature description.",
      link: "/feature-2",
    },
    {
      title: "Feature Three",
      description: "This is the third feature description.",
      link: "/feature-3",
    },
    {
      title: "Feature Four",
      description: "This is the fourth feature description.",
      link: "/feature-4",
    },
    {
      title: "Feature Five",
      description: "This is the fifth feature description.",
      link: "/feature-5",
    },
    {
      title: "Feature Six",
      description: "This is the sixth feature description.",
      link: "/feature-6",
    },
  ];

  return (
    <div className="relative h-fit">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-center items-center flex-col">
          <h1 className="relative scale-y-100 text-[#4d535e] text-4xl md:text-5xl lg:text-6xl xl:text-7xl pr-1 z-30 bg-gradient-to-br from-gray-300 from-30% via-[#6b7280] via-80% to-[#d9dcec] bg-clip-text text-transparent tracking-tighter leading-[0.9] font-bold pb-2">
            Future of Investing is Here!
          </h1>

          <p className="text-xl text-neutral-400">
            AI Insights, Real-Time Trends & Smart Picks to Supercharge Your
            Portfolio!
          </p>
        </div>
        <div className="grid  mt-16 max-w-screen-lg mx-auto">
          <HoverEffect items={dummyItems} className={""} />
        </div>
      </div>
      <div className="relative"></div>
    </div>
  );
};

export default Feat;
