"use client";

import React, { useEffect } from "react";
import { ring } from "ldrs";
import dynamic from "next/dynamic";

const Ldrs = dynamic(() => import("ldrs").then((mod) => mod.waveform), {
  ssr: false,
});

const Loading_Dashboard = () => {
  useEffect(() => {
    if (Ldrs && typeof window !== "undefined") {
      ring.register();
    }
  }, []);

  return (
    <div className="relative h-fit">
      {/* l-ring as animated background */}
      <l-ring
        size="200"
        stroke="5"
        bg-opacity="0"
        speed="2"
        color="white"
      ></l-ring>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2.5]">
        <svg
          version="1.1"
          id="layer"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="-153 -46 652 652"
          xmlSpace="preserve"
          className="w-16 h-16"
        >
          <g transform="scale(1.2)">
            <path
              fill="#ccc"
              transform="translate(-30,10)"
              strokeWidth="2"
              d="M269,225.5v-77.8c0-1.2-1.5-1.7-2.3-0.8l-85,106.2c-0.7,0.8-0.1,2.1,1,2.1h61.4c1.7,0,3.2-0.8,4.2-2.1
                  l19.4-24.2C268.5,228,269,226.8,269,225.5L269,225.5z M70.2,229l63.8,79.8c1,1.3,2.6,2,4.3,2h61.4c1.1,0,1.7-1.2,1-2L71.2,147
                  c-0.8-0.9-2.3-0.4-2.3,0.8v77.8C69,226.8,69.4,228,70.2,229L70.2,229z M70.2,229"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loading_Dashboard;
