"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 ${className}`}>
      {items.map((item, idx) => {
        const Wrapper = item.link ? Link : "div";

        return (
          <Wrapper
            href={item.link || "#"}
            key={item.title}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-black dark:bg-slate-400/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3, transition: { duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                />
              )}
            </AnimatePresence>
            <Card>
              {item.icon && <div className="mb-4">{item.icon}</div>}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </Wrapper>
        );
      })}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-4 overflow-hidden bg-white 
        border border-transparent dark:border-white/[0.2] 
        group-hover:border-black dark:group-hover:border-white 
        transition-all duration-300 relative z-20 ${className}`}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return <h4 className={`text-zinc-900 font-bold tracking-wide mt-4 text-lg ${className}`}>{children}</h4>;
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={`mt-4 text-zinc-700 tracking-wide leading-relaxed text-sm ${className}`}>
      {children}
    </p>
  );
};