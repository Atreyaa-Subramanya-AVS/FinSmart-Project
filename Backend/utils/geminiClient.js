const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`;

exports.generateReply = async (contents) => {
  try {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set.");
      return "Failed to fetch recommendation: API key missing.";
    }

    // Add markdown instructions inside the first user message
    const introPrompt = {
      role: "user",
      parts: [
        {
          text: `Always respond using well-formatted **Markdown**. Use:
            - Headings (e.g., ## Summary)
            - Bullet lists
            - Code blocks with triple backticks
            - Bold and *italic* text
            - Line breaks with \\n
            - Add line breaks for clarity

            Now, here is the user's query and data:`,
        },
      ],
    };

    // Validate and transform contents
    if (!Array.isArray(contents) || contents.length === 0) {
      console.error("Invalid contents format:", contents);
      return "Failed to fetch recommendation: Invalid contents format.";
    }

    const formattedContents = contents.map((item) => ({
      role: "user",
      parts: item.parts.map((part) => ({ text: part.text })),
    }));

    const fullRequest = [introPrompt, ...formattedContents];

    const response = await axios.post(
      GEMINI_ENDPOINT,
      {
        contents: fullRequest,
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 10000,
          stopSequences: [],
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return reply;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    } else {
      console.error("Error:", error.message);
    }

    return "Failed to fetch recommendation: An error occurred while processing the request.";
  }
};
