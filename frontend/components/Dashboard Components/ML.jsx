"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2, Info } from "lucide-react";
import robotIcon from "../../public/robot.png";
import aiIcon from "../../public/ai.png";
import Image from "next/image";
import ExtendedForecasting from "../../public/plots/extended_forecasting.png";
import FutureForecasting from "../../public/plots/future_forecasting.png";
import TrainTestPredictions from "../../public/plots/train_test_predictions.png";
import Loading_Dashboard from "./Loading_Dashboard";
import axios from "axios";
import ReactMarkdown from "react-markdown";
// import stockData from "./stockData";

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

  const socketRef = useRef(null);
  const wrapperRef = useRef(null);

  const stockData = [
    { id: 1, name: "HDFC Bank Ltd.", yfinName: "HDFCBANK.NS" },
    { id: 2, name: "ICICI Bank Ltd.", yfinName: "ICICIBANK.NS" },
    { id: 3, name: "Reliance Industries Ltd.", yfinName: "RELIANCE.NS" },
    { id: 4, name: "Infosys Ltd.", yfinName: "INFY.NS" },
    { id: 5, name: "Tata Consultancy Services Ltd.", yfinName: "TCS.NS" },
    { id: 6, name: "Larsen & Toubro Ltd.", yfinName: "LT.NS" },
    { id: 7, name: "Axis Bank Ltd.", yfinName: "AXISBANK.NS" },
    { id: 8, name: "State Bank of India", yfinName: "SBIN.NS" },
  ];

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

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
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  });

  const fetchAIInsights = async (stockName) => {
    setLoading(true);
    setLoadingDataFromAPI("Processing...");
    setLoadingDataFromAPI("Fetching News & Insights from Gemini...");
    sessionStorage.setItem("query", stockName);

    try {
      // First, fetch the AI insights using Axios
      const response = await axios.post(
        "http://localhost:5000/api/stockOpinion",
        { symbol: stockName }
      );
      console.log("AI Opinion Response:", response.data);

      // Save the response in sessionStorage
      const rawResponse = response.data.response || "No Response received.";
      const formatted = formatResponse(rawResponse);
      sessionStorage.setItem("aiInsights", formatted);

      setAiInsights(response.data.response);
      setLoadingDataFromAPI("Fetched Insights Successfully..!");

      // Once Axios request is done, initialize the WebSocket connection
      initiateWebSocket(stockName);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setLoading(false);
      setLoadingDataFromAPI("Failed to fetch insights.");
    }
  };

  useEffect(() => {
    const storedInsights = sessionStorage.getItem("aiInsights");
    if (storedInsights) {
      setAiInsights(storedInsights);
    }
    setIsLoading(false);
  }, []);

  // Function to handle WebSocket connection and communication
  const initiateWebSocket = (stockName) => {
    // const sessionId =
    // sessionStorage.getItem("session_id") || Date.now().toString();
    // sessionStorage.setItem("session_id", sessionId);

    const socket = new WebSocket("ws://127.0.0.1:8080/ws/progress");
    // const socket = new WebSocket(`ws://127.0.0.1:8080/ws/train/${sessionId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(stockName); // Send stock name to the WebSocket server
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setLoadingDataFromAPI(event.data); // Update loading message
      sessionStorage.setItem("loadingStatus", event.data);

      if (event.data === "Done") {
        setLoading(false);
        socket.close();
        sessionStorage.removeItem("loadingStatus");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
      socket.close();
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };
  };

  useEffect(() => {
    const storedQuery = sessionStorage.getItem("query");
    const storedStatus = sessionStorage.getItem("loadingStatus");
  
    if (storedQuery) {
      setQuery(storedQuery);
    }
  
    if (storedStatus && storedStatus !== "Done") {
      setLoading(true);
      setLoadingDataFromAPI(storedStatus);
      initiateWebSocket(storedQuery);
    }
  }, []);  

  // Handle stock input change
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

  const itemRefs = useRef([]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredStocks.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredStocks.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredStocks[highlightedIndex]) {
        const selectedStock = filteredStocks[highlightedIndex];
        setQuery(selectedStock.yfinName);
        setShowSuggestions(false);
        fetchAIInsights(selectedStock.yfinName);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSuggestionClick = (stock) => {
    setQuery(stock.yfinName);
  };

  const handleSubmit = () => {
    if (!query) return;
    fetchAIInsights(query);
  };

  return (
    <div className="flex flex-col min-h-[89vh] w-full bg-[#333] rounded-md">
      {isLoading ? (
        <div className="flex w-full justify-center items-center h-[89svh]">
          <Loading_Dashboard />
        </div>
      ) : (
        <>
          <div className="flex w-[80%] mx-auto">
            <div className="bg-[#333] relative flex p-2 rounded-md max-h-32 w-full justify-center items-center">
              <div ref={wrapperRef} className="relative w-3/4">
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
                    <div>
                      {filteredStocks.map((stock, index) => (
                        <li
                          key={stock.id}
                          ref={(el) => (itemRefs.current[index] = el)}
                          onMouseDown={() => handleSuggestionClick(stock)}
                          className={`px-4 py-2 cursor-pointer ${
                            index === highlightedIndex
                              ? "bg-gray-600"
                              : "hover:bg-gray-700"
                          } md:grid md:grid-cols-3 md:gap-3 flex flex-col`}
                        >
                          <div className="my-auto">{stock.name}</div>

                          <div className="flex justify-between items-center mt-1 md:mt-0 md:col-span-2">
                            <span className="text-sm text-gray-300">
                              {stock.yfinName}
                            </span>
                            <span className="text-xs rounded-lg font-semibold text-white bg-[#E66F24] py-2 px-4 w-fit">
                              NSE
                            </span>
                          </div>
                        </li>
                      ))}
                    </div>
                  </ul>
                )}
              </div>
            </div>
          </div>
          {loadingDataFromAPI !== "Done" ? (
            <div className="flex flex-col w-full justify-center items-center h-[80svh]">
              <Loading_Dashboard />
              <p className="mt-2">{loadingDataFromAPI}</p>
              {/* <p className="inline-flex items-center my-1 text-neutral-300">
                <span className="scale-75">
                  <Info />
                </span>
                Background Training is Supported.
              </p> */}
            </div>
          ) : (
            <div className="mt-4 max-w-screen-md mx-auto w-full max-lg:px-12 flex flex-col">
              <div className="min-h-40">
                <h1 className="text-2xl md:text-4xl font-bold mb-5 text-center">
                  {query}
                </h1>
                <div className="flex gap-3 items-center border-b-[1px] border-[#ccc] pb-2">
                  <Image
                    className="inline-flex self-center"
                    src={robotIcon}
                    height={32}
                    width={32}
                    alt="robot icon"
                  />
                  <h1 className="inline-flex self-center text-2xl md:text-3xl font-semibold">
                    AI Insights:
                  </h1>
                </div>
                <div>
                  <ReactMarkdown
                    children={TrainTestPredictions && aiInsights}
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-lg my-2 text-neutral-300"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h3
                          className="text-2xl font-semibold my-5 underline"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="text-md font-semibold my-3"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="ml-5 text-lg list-disc" {...props} />
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-5 gap-3 items-center">
                <div className="flex w-full gap-3 justify-start border-b-[1px] border-[#ccc] pb-2">
                  {aiIcon && (
                    <Image
                      className="inline-flex self-center pb-2"
                      src={aiIcon}
                      height={32}
                      width={32}
                      alt="robot icon"
                    />
                  )}
                  <h1 className="inline-flex self-center text-2xl md:text-3xl font-semibold">
                    LSTM Prediction:{" "}
                    <span className="text-sm pt-2 inline-flex items-center text-neutral-400 ml-2">
                      (For the next 30 Days.)
                    </span>
                  </h1>
                </div>
                <div className="visuals flex flex-col gap-3 w-fit pb-12">
                  {TrainTestPredictions && aiInsights !== "" && (
                    <Image
                      src={TrainTestPredictions}
                      alt="Train and Test Predictions"
                      className="max-w-full rounded-md"
                    />
                  )}
                  {FutureForecasting && aiInsights !== "" && (
                    <Image
                      src={FutureForecasting}
                      alt="Future Forecasting"
                      className="max-w-full rounded-md"
                    />
                  )}
                  {ExtendedForecasting && aiInsights !== "" && (
                    <Image
                      src={ExtendedForecasting}
                      alt="Extended Forecasting"
                      className="max-w-full rounded-md"
                    />
                  )}
                </div>
                {TrainTestPredictions && aiInsights !== "" && (
                  <div className="bg-[#111] flex justify-center py-3 rounded-md max-lg:px-12 px-8 text-pretty mb-12">
                    <p className="text-xs md:text-sm mx-auto text-neutral-200 text-center">
                      <span className="text-red-500">Disclaimer</span>: This
                      prediction is for informational purposes only and should
                      not be interpreted as a guarantee.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ML;
