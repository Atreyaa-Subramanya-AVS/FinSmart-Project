"use client";

import React, { useEffect, useState } from "react";
import Loading_Dashboard from "./Loading_Dashboard";
import { Button } from "../ui/button";
import Data from "./dummy.json";

const Details = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    console.log(Data)
  }

  return (
    <div className="flex justify-center items-center h-[89svh] w-full bg-[#333] rounded-md">
      {isLoading ? (
        <Loading_Dashboard />
      ) : (
        <div className="text-white text-xl font-semibold">
          {/* Replace this with your actual content */}
          <div onClick={handleClick}>
            <Button>Add Dummy Data</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
