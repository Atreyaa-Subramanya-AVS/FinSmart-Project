"use client";

import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "AI", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "User", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          text: "I'm processing your request...I'm processing your request...I'm processing your request...I'm processing your request...I'm processing your request...I'm processing your request...",
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-[#212121] h-[90vh] w-full rounded-md relative flex flex-col items-center justify-end p-4">
      <div className="h-full max-w-screen-lg w-[80%] my-2 bg-[#212121] relative shadow-2xl rounded-md p-4 overflow-y-auto flex flex-col space-y-4 scrollbar">
        {messages.map((msg, index) => (
          <div
            ref={messagesEndRef}
            key={index}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.role === "User"
                ? "bg-[#303030] text-white self-end"
                : "bg-gray-700 text-white self-start"
            }`}
          >
            {msg.text}
            <div ref={messagesEndRef}></div>
          </div>
        ))}
      </div>

      {/* Input Box */}
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
          <p>Powered by Gemini Pro.</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
