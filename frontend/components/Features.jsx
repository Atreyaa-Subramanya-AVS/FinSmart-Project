"use client";

import { useRef } from "react";
import React from "react";
import Image from "next/image";
import feat4 from "../public/images/Feat-Img/img1.jpg";
import feat3 from "../public/images/Feat-Img/img2.jpg";
import feat1 from "../public/images/Feat-Img/Img3.jpg";
import feat2 from "../public/images/Feat-Img/Img4.jpg";
import feat5 from "../public/images/Feat-Img/Img5.jpg";
import feat6 from "../public/images/Feat-Img/Img6.jpg";
import feat7 from "../public/images/Feat-Img/Img7.jpg";
import feat8 from "../public/images/Feat-Img/Img8.jpg";

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

  const imageCards = [
    { img: feat1, colSpan: "col-span-2", rowSpan: "row-span-1" },
    { img: feat5, colSpan: "col-span-2", rowSpan: "row-span-1" },
    { img: feat2, colSpan: "col-span-1", rowSpan: "row-span-1" },
    { img: feat3, colSpan: "col-span-2", rowSpan: "row-span-2" },
    { img: feat4, colSpan: "col-span-1", rowSpan: "row-span-2" },
    { img: feat6, colSpan: "col-span-1", rowSpan: "row-span-1" },
    { img: feat7, colSpan: "col-span-2", rowSpan: "row-span-1" },
    { img: feat8, colSpan: "col-span-1", rowSpan: "row-span-1" },
    { img: feat5, colSpan: "col-span-1", rowSpan: "row-span-1" },
  ];

  return (
    <div className="relative h-full">
      <div className="absolute h-full w-screen bg-white -z-10">
        <div className="absolute h-full w-full bg-[radial-gradient(blue_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      <div className="px-12 pb-36 max-w-screen-lg 2xl:max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-[#0b0d10] text-6xl 2xl:text-7xl text-left pt-36 font-semibold tracking-tighter text-balance">
            Smart Solution for your Investments
          </h1>
          <p className="text-balance py-4 text-sm md:text-base 2xl:text-lg font-medium text-slate-600">
            Meco is a process, project, time, and knowledge management platform
            that provides amazing collaboration opportunities for developers and
            product teams alike.
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
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src={card.img}
                      alt={`feat${index + 1}`}
                      className="w-full h-full bg-center rounded-xl z-0"
                    />
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
