import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { query } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(query);
  const response = await result.response;
  const text = await response.text();

  return new Response(JSON.stringify({ answer: text }));
}
