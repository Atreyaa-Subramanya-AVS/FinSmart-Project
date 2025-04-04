"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const Cursor = () => {
  const cursorSize = 15;
  const [isVisible, setIsVisible] = useState(true);

  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };

  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const manageMouseMove = (e) => {
    setIsVisible(true); // Show cursor when moving
    mouse.x.set(e.pageX - cursorSize / 2);
    mouse.y.set(e.pageY - cursorSize / 2);
  };

  const manageMouseLeave = () => {
    setIsVisible(false); // Hide cursor when leaving the window
  };

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    window.addEventListener("mouseleave", manageMouseLeave);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      window.removeEventListener("mouseleave", manageMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="absolute z-50 h-[15px] w-[15px] rounded-full bg-white pointer-events-none mix-blend-difference"
      style={{
        left: smoothMouse.x,
        top: smoothMouse.y,
        opacity: 0
      }}
    />
  );
};

export default Cursor;
