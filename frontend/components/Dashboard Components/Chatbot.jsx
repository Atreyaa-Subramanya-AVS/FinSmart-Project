"use client";

import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { leapfrog } from "ldrs";
import ReactMarkdown from "react-markdown";


const Ldrs = dynamic(() => import("ldrs").then((mod) => mod.leapfrog), {
  ssr: false,
});

const Chatbot = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Ldrs && typeof window !== "undefined") {
      leapfrog.register();
    }
  }, []);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const stored = sessionStorage.getItem("chatMessages");
    return stored ? JSON.parse(stored) : [];
  });

  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: "User", text: input };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const formattedHistory = updatedMessages
      .filter((msg) => msg.text && msg.role)
      .map((msg) => ({
        role: msg.role === "User" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        history: formattedHistory,
      });

      const botReply = {
        role: "AI",
        text: response.data.reply,
      };

      setMessages((prev) => {
        const finalMessages = [...prev, botReply];
        sessionStorage.setItem("chatMessages", JSON.stringify(finalMessages));
        return finalMessages;
      });
    } catch (error) {
      console.error("Error:", error);
      const errMsg = {
        role: "AI",
        text: "Oops! Something went wrong. Please try again later.",
      };
      setMessages((prev) => {
        const finalMessages = [...prev, errMsg];
        sessionStorage.setItem("chatMessages", JSON.stringify(finalMessages));
        return finalMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-[#212121] h-[90vh] w-full rounded-md relative flex flex-col items-center justify-end p-4">
      <div className="h-full max-w-screen-lg w-[80%] my-2 bg-[#212121] relative shadow-2xl rounded-md p-4 overflow-y-auto flex flex-col space-y-4 scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.role === "User"
                ? "bg-[#303030] text-white self-end"
                : "bg-gray-700 text-white self-start"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center my-2 self-start bg-gray-700 text-white p-3 rounded-md">
            <l-leapfrog size="30" speed="2.5" color="#12c2e9"></l-leapfrog>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex flex-col w-[80%]">
        <div className="bg-[#333] flex p-2 rounded-md max-h-32 mx-auto w-full">
          <textarea
            className="bg-[#333] w-full p-3 resize-none leading-relaxed text-white rounded-md focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className="bg-[#555] h-fit p-2 ml-2 rounded-md hover:bg-[#666]"
            onClick={handleSendMessage}
          >
            <SendHorizontal />
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between w-full text-sm text-neutral-400 mt-2">
          <p>Ask your financial questions to our integrated AI chatbot.</p>
          <p>Powered by Gemini Flash.</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
