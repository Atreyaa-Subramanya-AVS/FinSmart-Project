"use client";

import { useRef } from "react";
import React from "react";
import MainImage from "../public/oo.png";

const Features = () => {
  const handleMouseMove = (e, cardRef) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -15;
    const rotateY = x * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (cardRef) => {
    const card = cardRef.current;
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  // Keep grid structure but only one background image used
  const imageCards = [
    { colSpan: "col-span-2", rowSpan: "row-span-1" },
    { colSpan: "col-span-2", rowSpan: "row-span-1" },
    { colSpan: "col-span-1", rowSpan: "row-span-1" },
    { colSpan: "col-span-2", rowSpan: "row-span-2" },
    { colSpan: "col-span-1", rowSpan: "row-span-2" },
    { colSpan: "col-span-1", rowSpan: "row-span-1" },
    { colSpan: "col-span-2", rowSpan: "row-span-1" },
    { colSpan: "col-span-1", rowSpan: "row-span-1" },
    { colSpan: "col-span-1", rowSpan: "row-span-1" },
  ];

  return (
    <div className="relative h-full">
      <div className="absolute h-full w-screen bg-white -z-10">
        <div className="absolute h-full w-full bg-[radial-gradient(blue_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      <div className="px-12 pb-36 max-w-screen-lg 2xl:max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-[#0b0d10] text-5xl 2xl:text-7xl text-left pt-36 font-bold tracking-tighter text-balance">
            Smart Solution for your Investments
          </h1>
          <p className="text-balance py-4 text-sm md:text-base 2xl:text-lg font-medium text-slate-600">
            FinSmart leverages the power of AI and real-time data from Yahoo
            Finance to deliver deeper insights, smarter predictions, and better
            investment decisions.
          </p>

          <div className="h-dvh flex items-center justify-center">
            <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-3">
              {imageCards.map((card, index) => {
                const cardRef = useRef(null);
                return (
                  <div
                    key={index}
                    ref={cardRef}
                    className={`rounded-xl overflow-hidden relative transition-transform duration-300 ease-out ${card.colSpan} ${card.rowSpan}`}
                    onMouseMove={(e) => handleMouseMove(e, cardRef)}
                    onMouseLeave={() => handleMouseLeave(cardRef)}
                    style={{
                      transformStyle: "preserve-3d",
                      backgroundImage: `url(${MainImage.src})`,
                      backgroundAttachment: "fixed",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
