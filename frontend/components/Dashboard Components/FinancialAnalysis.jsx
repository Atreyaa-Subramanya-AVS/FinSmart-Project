"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading_Dashboard from "./Loading_Dashboard";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import { Toaster, toast } from "react-hot-toast";

const FinancialAnalysis = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [responseData, setResponseData] = useState("");
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const textAreaRef = useRef(null);
  const [ID, setID] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        const ID = response.data.ID;
        if (ID) {
          axios
            .get(`http://localhost:5000/api/details/${ID}`)
            .then((response) => {
              if (response.data.data) {
                setData(response.data.data);
              }
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setIsLoading(false);
            });
        } else {
          console.error("User ID not found");
          setIsLoading(false);
        }
        if (ID == null) {
          toast.error("User ID not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      });
  }, []);

  const formatResponse = (raw) => {
    return (
      raw
        // Section titles -> Markdown headers
        .replace(
          /^(Goals:|Income Sources:|Investment Distribution:|Money Distribution:|Investment Recommendations|Saving Money Strategies|Reducing Unnecessary Expenses|Conclusion)$/gm,
          "\n\n### $1\n"
        )
        // Bold values like "Current Balance: ₹8000"
        .replace(
          /^([A-Z][\w\s]+):\s?₹(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/gm,
          "- **$1:** ₹$2"
        )
        // Subheadings like "Note:"
        .replace(/^([A-Z][\w\s]+):$/gm, "\n\n**$1**\n")
        // Normalize extra newlines
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = sessionStorage.getItem("financialAnalysisResponse");
      if (stored) {
        setResponseData(stored);
      }
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", {
        withCredentials: true,
      })
      .then((response) => {
        const ID = response.data.ID;
        setID(ID);
        if (ID) {
          axios
            .get(`http://localhost:5000/api/financial-analysis/${ID}`)
            .then((response) => {
              console.log(response.data);
              const financialAnalysis = response.data.financialAnalysis;

              console.log("lolll:",financialAnalysis)
              if (response.data.financialAnalysis) {
                textAreaRef.current.value =
                  financialAnalysis.prompt || "";
                setResponseData(formatResponse(financialAnalysis.aiFeedBack));
              } else {
                console.error("stockAnalysis field is missing in response.");
              }
            })
            .catch((error) => {
              console.error("Error fetching financial analysis: ", error);
            });
        } else {
          console.error("User ID not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
      });
  }, []);

  const handleClick = async () => {
    try {
      const userMessage = textAreaRef.current?.value || "";
      setGeneratingAnalysis(true);

      const fetchRecommendation = async () => {
        const response = await axios.post(
          "http://localhost:5000/api/recommend",
          {
            Data: data,
            message: userMessage,
          }
        );

        const rawResponse = response.data.response || "No response received.";
        const formatted = formatResponse(rawResponse);

        setResponseData(formatted);
        sessionStorage.setItem("financialAnalysisResponse", formatted);

        // Save to backend
        if (ID) {
          await axios.post("http://localhost:5000/api/financial-analysis", {
            ID: ID,
            financialAnalysis: {
              prompt: userMessage,
              aiFeedBack: formatted,
            },
          });
        }

        // console.log("Successfully sent to DB.");

        return formatted;
      };

      await toast.promise(
        fetchRecommendation(),
        {
          loading: "Analyzing your data...",
          success: "Financial insights ready!",
          error: "Failed to fetch recommendation",
        },
        {
          success: { duration: 5000 },
          error: { duration: 6000 },
        }
      );
    } catch (error) {
      console.error("Error during financial analysis process:", error);
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="flex min-h-[89svh] w-full bg-[#333] rounded-md flex-col">
      <Toaster />
      {isLoading ? (
        <Loading_Dashboard />
      ) : (
        <div className="flex flex-col w-full relative z-50 max-w-screen-lg xl:max-w-screen-xl bg-[#222] mx-auto min-h-[89vh] rounded-md shadow-2xl p-2 px-4">
          <div className="flex justify-between items-center text-4xl tracking-tight font-semibold border-b-2 overflow-x-hidden md:mx-2">
            <h1 className="pt-2 pb-5">Financial Analysis</h1>
          </div>

          <div className="mx-2">
            <h2 className="text-md mb-5 mt-2 font-semibold">
              Specify how you'd like to receive your financial data (optional):
            </h2>
          </div>

          <div className="bg-[#222] flex p-2 rounded-md max-h-32 mx-auto w-[90%]">
            <textarea
              ref={textAreaRef}
              className="bg-[#333] w-full p-3 resize-none leading-relaxed text-white rounded-md focus:outline-none"
              placeholder="Ask for insights..."
              onKeyDown={handleKeyDown}
              rows={2}
            />
          </div>

          <div className="text-white text-xl font-semibold p-2 flex justify-center items-center w-full h-full">
            <div>
              <Button onClick={handleClick} disabled={generatingAnalysis}>
                {generatingAnalysis
                  ? "Generating..."
                  : "Generate Financial Plan"}
              </Button>
            </div>
          </div>

          {responseData && (
            <div className="text-white p-4 text-md">
              <ReactMarkdown
                children={responseData}
                components={{
                  p: ({ node, ...props }) => (
                    <p className="text-lg my-2 text-neutral-300" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-3xl font-semibold my-10 underline"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-lg font-semibold my-3" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-5 list-disc" {...props} />
                  ),
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialAnalysis;
