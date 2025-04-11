"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading_Dashboard from "./Loading_Dashboard";
import { Button } from "../ui/button";
import Data from "./dummy.json";
import ReactMarkdown from "react-markdown";


const Details = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [responseData, setResponseData] = useState(""); // <-- Store Gemini's response here

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/recommend", { Data });
      console.log("Response from backend:", response.data);
      setResponseData(response.data.response); // <-- Store Gemini's response
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setResponseData("Failed to get recommendation from the backend.");
    }
  };

  return (
    <div className="flex h-[89svh] w-full bg-[#333] rounded-md flex-col">
      {isLoading ? (
        <Loading_Dashboard />
      ) : (
        <>
          <div className="text-white text-xl font-semibold p-2 flex justify-center items-center w-full h-fit">
            <div onClick={handleClick}>
              <Button>Generate Financial Plan</Button>
            </div>
          </div>

          {/* Display AI-generated financial recommendation */}
          {responseData && (
            <div className="text-white p-4 overflow-auto text-md whitespace-pre-wrap leading-relaxed">
              <ReactMarkdown>{responseData}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Details;