const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`;

exports.generateReply = async (contents) => {
  const systemMessage = {
    role: "user",
    parts: [
      {
        text: `Always respond using well-formatted **Markdown**. Use:
- Headings (e.g., ## Summary)
- Bullet lists
- Code blocks with triple backticks for code
- Bold and *italic* text
- Line breaks with \\n
- Add more line breaks after each point to improve readability

Make all responses visually clean, clear, and easy to read. Use appropriate formatting to make the text appear professional and easy to digest.`,
      },
    ],
  };

  const response = await axios.post(
    GEMINI_ENDPOINT,
    {
      contents: [systemMessage, ...contents],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        stopSequences: [],
      },
    },
    { headers: { "Content-Type": "application/json" } }
  );

  // Ensure that the response includes the content part properly formatted in markdown
  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
};