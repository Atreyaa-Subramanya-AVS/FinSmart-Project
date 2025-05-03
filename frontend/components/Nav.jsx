"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "../public/valorant-seeklogo.svg";
import Logo2 from "../public/valorant-2.svg"
import Link from "next/link";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center ">
      <div
        className={`w-full z-10 text-white ${
          isScrolled
            ? "bg-[#ddd] text-black z-50 max-w-screen-lg inline-flex justify-center items-center mt-4 py-2 rounded-xl"
            : "bg-transparent pb-5 pt-2"
        } transition-all`}
      >
        <div
          className={`nav flex z-10 justify-between ${
            isScrolled ? "max-w-screen-lg" : "max-w-screen-2xl"
          } mx-auto items-center gap-20 whitespace-nowrap text-sm max-sm:mx-auto md:text-base`}
        >
          <div className="flex gap-12 items-center justify-between px-2">
            <div className="inline-flex justify-center items-center gap-2">
              {!isScrolled ?
              <Image
              src={Logo}
              className="bg-transparent"
              alt="logo"
              width={50}
              height={50} 
            />:
            <Image
                src={Logo2}
                className="bg-transparent"
                alt="logo"
                width={50}
                height={50} 
              />}
              <Link href={"/"}>
                <h1
                  className={`font-bold text-lg ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                >
                  FinSmart
                </h1>
              </Link>
            </div>
            <div className="hidden lg:flex gap-8">
              {["Pricing", "Community", "Contact Us"].map((elem, index) => (
                <button
                  key={index}
                  className={`relative ${
                    isScrolled ? "text-black px-1" : "text-white px-4"
                  } py-2 group`}
                >
                  <h1
                    className={`relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 ${
                      isScrolled ? "after:bg-black" : "after:bg-white"
                    } after:transition-all after:duration-300 group-hover:after:w-full`}
                  >
                    {elem}
                  </h1>
                </button>
              ))}
            </div>
          </div>
          <div className="flex lg:pl-16 md:gap-6 pr-8 justify-center items-center max-sm:-mx-10 max-sm:gap-1 max-md:gap-7 max-sm:pr-12 max-md:pr-6">
            <button className="inline-flex justify-center items-center gap-2 max-md:hidden max-md:text-base">
              <svg
                width="14"
                height="14"
                viewBox="0 0 36 36"
                fill="none"
                className={`fill-current ${isScrolled ? "text-black" : "text-white"}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M18 .45c-9.9 0-18 8.1-18 18 0 7.988 5.175 14.738 12.263 17.1.9.113 1.237-.337 1.237-.9v-3.037c-5.062 1.125-6.075-2.363-6.075-2.363-.787-2.025-2.025-2.587-2.025-2.587-1.688-1.125.112-1.125.112-1.125 1.8.112 2.813 1.8 2.813 1.8 1.575 2.7 4.163 1.912 5.288 1.462a3.9 3.9 0 0 1 1.125-2.362c-4.05-.45-8.213-2.025-8.213-8.888 0-1.912.675-3.6 1.8-4.837-.225-.45-.787-2.25.225-4.725 0 0 1.462-.45 4.95 1.8 1.463-.45 2.925-.563 4.5-.563s3.038.225 4.5.563c3.488-2.363 4.95-1.913 4.95-1.913 1.012 2.475.338 4.275.225 4.725 1.125 1.238 1.8 2.813 1.8 4.838 0 6.862-4.163 8.437-8.213 8.887.675.563 1.238 1.688 1.238 3.375v4.95c0 .45.337 1.013 1.238.9C30.825 33.188 36 26.438 36 18.45c0-9.9-8.1-18-18-18"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Link
                href={"https://github.com/Atreyaa-Subramanya-AVS/FinSmart-Project"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h1 className={`${isScrolled ? "text-black" : "text-white"}`}>
                  Star Us
                </h1>
              </Link>
            </button>
            <Link href={"/signin"}>
              <button className="py-1 px-4 border rounded-lg transition-all max-sm:scale-75 bg-black text-white max-md:px-4 max-sm:py-2 max-sm:text-base">
                Sign In
              </button>
            </Link>
            <Link href={"/dashboard?refresh=true"}>
              <button className="py-1 px-4 border rounded-lg transition-all max-md:-ml-4 max-sm:scale-75 bg-white text-black max-md:px-3 max-sm:py-1 flex items-center max-sm:text-base">
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 9"
                  className="h-[9px] w-[17px] text-[#5A250A] flex ml-2"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
