"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import robotIcon from "../../public/robot.png";
import aiIcon from "../../public/ai.png";
import Image from "next/image";
import ExtendedForecasting from "../../public/plots/extended_forecasting.png";
import FutureForecasting from "../../public/plots/future_forecasting.png";
import TrainTestPredictions from "../../public/plots/train_test_predictions.png";
import Loading_Dashboard from "./Loading_Dashboard";

const ML = () => {
  const [query, setQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState("");
  const [loadingDataFromAPI, setLoadingDataFromAPI] = useState("Done");

  const fetchAIInsights = (stockName) => {
    const socket = new WebSocket("ws://127.0.0.1:8080/ws/progress");

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(stockName);
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setLoadingDataFromAPI(event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setAiInsights("Error connecting to WebSocket.");
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };
  };

  const itemRefs = useRef([]);

  const stockData = [
    { id: 1, name: "HDFC Bank Ltd.", yfinName: "HDFCBANK.NS" },
    { id: 2, name: "ICICI Bank Ltd.", yfinName: "ICICIBANK.NS" },
    { id: 3, name: "Reliance Industries Ltd.", yfinName: "RELIANCE.NS" },
    { id: 4, name: "Infosys Ltd.", yfinName: "INFY.NS" },
    { id: 5, name: "Bharti Airtel Ltd.", yfinName: "BHARTIARTL.NS" },
    { id: 6, name: "ITC Ltd.", yfinName: "ITC.NS" },
    { id: 7, name: "Tata Consultancy Services Ltd.", yfinName: "TCS.NS" },
    { id: 8, name: "Larsen & Toubro Ltd.", yfinName: "LT.NS" },
    { id: 9, name: "Axis Bank Ltd.", yfinName: "AXISBANK.NS" },
    { id: 10, name: "Kotak Mahindra Bank Ltd.", yfinName: "KOTAKBANK.NS" },
    { id: 11, name: "Hindustan Unilever Ltd.", yfinName: "HINDUNILVR.NS" },
    { id: 12, name: "State Bank of India", yfinName: "SBIN.NS" },
    { id: 13, name: "Bajaj Finance Ltd.", yfinName: "BAJFINANCE.NS" },
    { id: 14, name: "Maruti Suzuki India Ltd.", yfinName: "MARUTI.NS" },
    { id: 15, name: "Asian Paints Ltd.", yfinName: "ASIANPAINT.NS" },
    { id: 16, name: "HCL Technologies Ltd.", yfinName: "HCLTECH.NS" },
    {
      id: 17,
      name: "Sun Pharmaceutical Industries Ltd.",
      yfinName: "SUNPHARMA.NS",
    },
    { id: 18, name: "Wipro Ltd.", yfinName: "WIPRO.NS" },
    { id: 19, name: "Mahindra & Mahindra Ltd.", yfinName: "M&M.NS" },
    { id: 20, name: "Nestle India Ltd.", yfinName: "NESTLEIND.NS" },
  ];

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredStocks([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else {
      const filtered = stockData.filter((stock) =>
        stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
      setShowSuggestions(true);
      setHighlightedIndex(0);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredStocks.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredStocks.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredStocks.length - 1
      );
    }
  };

  const handleSuggestionClick = (stock) => {
    setQuery(stock.yfinName);
  };

  const handleSubmit = () => {
    if (!query) return;
    setLoading(true);

    try {
      fetchAIInsights(query);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-fit w-full bg-[#333] rounded-md">
      {isLoading ? (
        <div className="flex w-full justify-center items-center h-[89svh]">
          <Loading_Dashboard />
        </div>
      ) : (
        <>
          <div className="flex w-[80%] mx-auto">
            <div className="bg-[#333] relative flex p-2 rounded-md max-h-32 w-full justify-center items-center">
              <div className="relative w-3/4">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                  className="w-full p-3 pr-10 rounded-md text-white bg-gray-700 focus:outline-none"
                  placeholder="Type a stock name..."
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#555] h-fit p-1 ml-2 rounded-md hover:bg-[#666] disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <SendHorizontal />
                  )}
                </button>

                {showSuggestions && filteredStocks.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-gray-800 text-white rounded-md shadow-lg max-h-40 overflow-y-auto scrollbar">
                    {filteredStocks.map((stock, index) => (
                      <li
                        key={stock.id}
                        ref={(el) => (itemRefs.current[index] = el)}
                        onMouseDown={() => handleSuggestionClick(stock)}
                        className={`px-4 py-2 cursor-pointer flex justify-between ${
                          index === highlightedIndex
                            ? "bg-gray-600"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <span>{stock.name}</span>
                        <span className="text-sm text-gray-400">
                          {stock.yfinName}
                        </span>
                        <span className="text-xs rounded-lg text-gray-400 bg-neutral-500 p-[0.5rem]">
                          NSE
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="absolute right-0 -bottom-5 text-xs text-neutral-300 whitespace-nowrap max-lg:hidden">
                  <h1>Uses LSTM Model & Insights powered by Gemini AI</h1>
                </div>
              </div>
            </div>
          </div>
          {loadingDataFromAPI !== "Done" ? (
            <div className="flex flex-col w-full justify-center items-center h-[80svh]">
              <Loading_Dashboard />
              <p>{loadingDataFromAPI}</p>
            </div>
          ) : (
            <div className="mt-4 max-w-screen-md mx-auto max-lg:px-12 flex flex-col">
              <div className="flex gap-3 items-center border-b-[1px] border-[#ccc]">
                <Image
                  className="inline-flex self-center pb-1"
                  src={robotIcon}
                  height={24}
                  width={24}
                  alt="robot icon"
                />
                <h1 className="inline-flex self-center text-xl">
                  AI Insights:
                </h1>
              </div>
              <p className="min-h-32 my-5 whitespace-pre-wrap">{aiInsights}</p>
              <div className="flex flex-col gap-3 items-center">
                <div className="flex w-full gap-3 justify-start border-b-[1px] border-[#ccc]">
                  <Image
                    className="inline-flex self-center pb-2"
                    src={aiIcon}
                    height={24}
                    width={24}
                    alt="robot icon"
                  />
                  <h1 className="inline-flex self-center text-xl">
                    LSTM Prediction:{" "}
                    <span className="text-xs inline-flex items-center text-neutral-400 ml-2">
                      (For the next 30 Days.)
                    </span>
                  </h1>
                </div>
                <div className="visuals flex flex-col gap-3 w-fit pb-12">
                  <Image
                    src={TrainTestPredictions}
                    alt="Exted"
                    className="scale-95 rounded-lg"
                  />
                  <Image
                    src={FutureForecasting}
                    alt="Exted"
                    className="scale-95 rounded-lg"
                  />
                  <Image
                    src={ExtendedForecasting}
                    alt="Exted"
                    className="scale-95 rounded-lg"
                  />
                  <div className="bg-[#111] flex justify-center py-3 rounded-md max-lg:px-12 text-pretty">
                    <p className="text-sm mx-auto text-neutral-200 text-center">
                      <span className="text-red-500">Disclaimer</span>: This
                      prediction is for informational purposes only and should
                      not be interpreted as a guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ML;
