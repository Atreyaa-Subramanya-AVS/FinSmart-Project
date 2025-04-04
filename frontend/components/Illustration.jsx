"use client";

import Image from "next/image";
import React from "react";
import illImg from "../public/images/hero-illustration.jpg";
import ill1 from "../public/images/ill-1.svg";
import ill2 from "../public/images/ill-2.svg";
import ill3 from "../public/images/ill-3.svg";
import ill4 from "../public/images/ill-4.svg";
import ill5 from "../public/images/ill-5.svg";
import ill6 from "../public/images/ill-6.svg";

const Illustration = () => {
  const Ills = [
    {
      id: 1,
      Image: ill1,
      Heading: "Two-way synchronization",
      Para: "Integrate your task tracker with GitHub to sync changes instantly.",
    },
    {
      id: 2,
      Image: ill2,
      Heading: "Private tasks",
      Para: "Integrate your task tracker with GitHub to sync changes instantly.",
    },
    {
      id: 3,
      Image: ill3,
      Heading: "Multiple repositories",
      Para: "Integrate your task tracker with GitHub to sync changes instantly.",
    },
    {
      id: 4,
      Image: ill4,
      Heading: "Milestone migration",
      Para: "Integrate your task tracker with GitHub to sync changes instantly.",
    },
    {
      id: 5,
      Image: ill5,
      Heading: "Track progress",
      Para: "Integrate your task tracker with GitHub to sync changes instantly.",
    },
    {
      id: 6,
      Image: ill6,
      Heading: "Advanced filtering",
      Para: "Integrate your task tracker with GitHub to sync changes instantly.",
    },
  ];

  return (
    <div className="w-full bg-[#111111]">
      <div className="h-fit pb-32 2xl:pb-56 max-w-screen-lg 2xl:max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl h-full mx-auto px-12">
          <div className="text-white pt-32">
            <h1 className="text-[#F6F7FD] text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl pr-1 z-30 max-w-3xl bg-gradient-to-br from-white from-30% via-[#d5d8f6] via-80% to-[#fdf7fe] bg-clip-text text-transparent tracking-tighter pb-2 font-bold">
              Sync with GitHub. <br /> Both Ways.
            </h1>
            <p className="max-w-screen-md text-slate-300 text-balance pt-2 pb-12">
              Manage your tasks efficiently with Meco's bidirectional GitHub
              synchronization. Use Meco as an advanced front-end for GitHub
              Issues and GitHub Projects.
            </p>
          </div>
          <div className="h-fit p-1 2xl:p-[0.375rem] overflow-hidden relative rounded-md">
            <div
              className="absolute inset-0 before:content-[''] before:absolute 
                before:w-[250%] before:h-[250%] before:-left-3/4 before:-top-3/4 
                before:bg-[repeating-conic-gradient(transparent,#ffb25e,transparent,#fff,#fff,transparent,green,green,transparent)] 
                before:animate-spin-slow"
            ></div>

            <div className="relative z-10">
              <Image
                src={illImg}
                alt="Bg-Image"
                className="object-contain rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 grid-rows-2 text-white pt-28 gap-3">
            {Ills.map((elem) => (
              <div
                key={elem.id}
                className="flex flex-col  gap-6 px-4 py-12  transition-all bg-[] relative"
              >
                <div
                  className="absolute top-0 opacity-100 bg-white right-0 w-40 h-40 rounded-full overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.4), transparent 60%)",
                    clipPath: "circle(35% at 100% 0%)",
                    filter: "blur(15px)"
                  }}
                ></div>
                <Image
                  src={elem.Image}
                  alt="Illustration Images"
                  width={42}
                  height={42}
                />
                <div className="2xl:text-4xl text-3xl font-medium tracking-tight text-balance w-min">
                  {elem.Heading}
                </div>
                <p className="text-slate-400">{elem.Para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Illustration;
