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

  const numberOfDivs = 16; // Since it's a 4x4 grid

  return (
    <div className="relative h-full">
      <div className="absolute h-full w-screen bg-white -z-10">
        <div className="absolute h-full w-full bg-[radial-gradient(blue_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="px-12 pb-10 max-md:pb-2 max-w-screen-lg 2xl:max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-[#0b0d10] text-5xl 2xl:text-7xl text-left pt-16 font-bold tracking-tighter text-balance">
            Smart Solution for your Investments
          </h1>
          <p className="text-balance py-4 text-sm md:text-base 2xl:text-lg font-medium text-slate-600">
            FinSmart leverages the power of AI and real-time data from Yahoo
            Finance to deliver deeper insights, smarter predictions, and better
            investment decisions.
          </p>

          <div className="h-svh max-lg:h-[60vh] max-md:h-[50vh] flex items-center justify-center">
            <div className="grid h-[90%] w-full grid-cols-4 grid-rows-4 gap-1 relative bg-transparent">
              {Array.from({ length: numberOfDivs }).map((_, index) => {
                const cardRef = useRef(null);
                const row = Math.floor(index / 4);
                const col = index % 4;

                const backgroundX = (col / 3) * 100;
                const backgroundY = (row / 3) * 100;

                return (
                  <div
                    key={index}
                    ref={cardRef}
                    className={`rounded-xl overflow-hidden relative`}
                    onMouseMove={(e) => handleMouseMove(e, cardRef)}
                    onMouseLeave={() => handleMouseLeave(cardRef)}
                    style={{
                      backgroundImage: `url(${MainImage.src})`,
                      backgroundPosition: `${backgroundX}% ${backgroundY}%`,
                      backgroundSize: "400% 400%",
                      backgroundRepeat: "no-repeat",
                      transformStyle: "preserve-3d",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                  >
                  </div>
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
