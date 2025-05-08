"use client";

import React from "react";
import { LineChart, Brain, Wallet, PieChart, Star, Shield } from "lucide-react";
import { HoverEffect } from "./ui/card-hover-effect";
import LoadingBg from "@/public/LoadBG.webp";
import Image from "next/image";

const Feat = () => {
  const finSmartFeatures = [
    {
      title: "Real-Time Stock Trends",
      description: "Stay ahead with live market movements and recent news.",
      icon: <LineChart className="h-8 w-8 text-primary" />,
    },
    {
      title: "AI-Powered Predictions",
      description:
        "Harness ML models to forecast market trends and price shifts.",
      icon: <Brain className="h-8 w-8 text-primary" />,
    },
    {
      title: "Smart Budget Planner",
      description:
        "Track income, expenses, and set monthly financial goals easily.",
      icon: <Wallet className="h-8 w-8 text-primary" />,
    },
    {
      title: "Investment Distribution",
      description:
        "Visualize and optimize your asset allocation across sectors.",
      icon: <PieChart className="h-8 w-8 text-primary" />,
    },
    {
      title: "Personalized Financial Plans",
      description:
        "Get AI-curated finance plans based on your goals and how to acheive it!",
      icon: <Star className="h-8 w-8 text-primary" />,
    },
    {
      title: "Secure Portfolio Tracking",
      description:
        "Manage and monitor your holdings with end-to-end encryption.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="relative h-fit">
      <Image
        src={LoadingBg}
        alt="Loading Image"
        className="z-0 absolute h-full w-screen object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] brightness-90"></div>
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-[#000] text-5xl md:text-6xl lg:text-6xl xl:text-8xl tracking-tighter leading-[0.9] font-bold pb-2 text-center">
            Future of <span className="underline pointer-events-none">Investing</span> is Here!
          </h1>
          <p className="text-lg lg:text-xl 2xl:text-2xl text-neutral-600 mt-5 text-center">
            AI Insights, Stock Market Trends & Smart Insights to Supercharge Your
            Portfolio!
          </p>
        </div>

        <div className="max-w-screen-lg mx-auto">
          <HoverEffect items={finSmartFeatures} />
        </div>
      </div>
    </div>
  );
};

export default Feat;
