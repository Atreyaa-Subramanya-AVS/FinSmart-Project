"use client";

import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Illustration from "@/components/Illustration";
import Nav from "@/components/Nav";
import Feat from "@/components/QnA";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { waveform } from "ldrs";
import dynamic from "next/dynamic";
 
const Ldrs = dynamic(() => import("ldrs").then(mod => mod.waveform), {
  ssr: false,
});

const Landing = () => {
  useEffect(() => {
    // Register waveform only on the client
    if (Ldrs && typeof window !== "undefined") {
      waveform.register();
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [animateLoading, setAnimateLoading] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      // Skip loader if user has already visited
      setLoading(false);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    setTimeout(() => {
      setAnimateLoading(true);
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "auto";
        sessionStorage.setItem("hasVisited", "true");
        document.body.classList.remove("loader")
      }, 1200);
    }, 6500);

    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "auto";
    };
  }, []);
  

  return (
    <>
      {loading && (
        <div className="loader overflow-hidden z-[100] absolute">
          <motion.div
            initial={{ y: 0 }}
            animate={
              animateLoading
                ? { y: "-100vh", display: "none", visibility: "hidden" }
                : {}
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
            viewport={{once:true}}
            className="fixed inset-0 flex items-center justify-center bg-white z-50 w-full h-full overflow-hidden"
          >
            <div className="grid place-items-center relative">
              <div className=" scale-150 h-[25vh] w-[15vw] flex items-center justify-center">
                <svg
                  version="1.1"
                  id="layer"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="-153 -46 652 652"
                  style={{ enableBackground: "new -153 -46 652 652" }}
                  xmlSpace="preserve"
                >
                  <defs>
                    <mask id="fill-mask">
                      <motion.rect
                        x="0%"
                        initial={{ y: "100%" }} // Start from bottom
                        animate={{ y: "0%" }} // Move up
                        transition={{
                          duration: 6,
                          ease: [0, 0.58, 0.57, 0.3],
                        }}
                        width="100%"
                        height="100%"
                        fill="white"
                      />
                    </mask>
                  </defs>

                  <g>
                    <g transform="scale(1.2)">
                      <path
                        fill="#e2e8f0"
                        transform="translate(-30,10)"
                        strokeWidth="2"
                        d="M269,225.5v-77.8c0-1.2-1.5-1.7-2.3-0.8l-85,106.2c-0.7,0.8-0.1,2.1,1,2.1h61.4c1.7,0,3.2-0.8,4.2-2.1
                          l19.4-24.2C268.5,228,269,226.8,269,225.5L269,225.5z M70.2,229l63.8,79.8c1,1.3,2.6,2,4.3,2h61.4c1.1,0,1.7-1.2,1-2L71.2,147
                          c-0.8-0.9-2.3-0.4-2.3,0.8v77.8C69,226.8,69.4,228,70.2,229L70.2,229z M70.2,229"
                      />
                    </g>
                  </g>
                </svg>
              </div>

              <div className=" scale-150 h-[25vh] w-[15vw] flex items-center justify-center absolute inset-0">
                <svg
                  version="1.1"
                  id="layer"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="-153 -46 652 652"
                  style={{ enableBackground: "new -153 -46 652 652" }}
                  xmlSpace="preserve"
                >
                  <g>
                    <g transform="scale(1.2)">
                      <path
                        fill="black"
                        transform="translate(-30,10)"
                        strokeWidth="2"
                        mask="url(#fill-mask)"
                        d="M269,225.5v-77.8c0-1.2-1.5-1.7-2.3-0.8l-85,106.2c-0.7,0.8-0.1,2.1,1,2.1h61.4c1.7,0,3.2-0.8,4.2-2.1
                          l19.4-24.2C268.5,228,269,226.8,269,225.5L269,225.5z M70.2,229l63.8,79.8c1,1.3,2.6,2,4.3,2h61.4c1.1,0,1.7-1.2,1-2L71.2,147
                          c-0.8-0.9-2.3-0.4-2.3,0.8v77.8C69,226.8,69.4,228,70.2,229L70.2,229z M70.2,229"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              <l-waveform
                size="25"
                stroke="2"
                speed="1"
                color="black"
              ></l-waveform>
            </div>
          </motion.div>
        </div>
      )}
      <Nav />
      <Hero />
      <Features />
      <Illustration />
      <Feat />
      <Footer />
    </>
  );
};

export default Landing;
