const geminiClient = require("../utils/geminiClient");
const fs = require("fs");
const path = require("path");

const news = {
  "HDFCBANK.NS": "HDFC_Bank_Ltd.json",
  "ICICIBANK.NS": "ICICI_Bank_Ltd.json",
  "RELIANCE.NS": "Reliance_Industries_Ltd.json",
  "INFY.NS": "Infosys_Ltd.json",
  "TCS.NS": "Tata_Consultancy_Services_Ltd.json",
  "LT.NS": "Larsen_and_Toubro_Ltd.json",
  "AXISBANK.NS": "Axis_Bank_Ltd.json",
  "SBIN.NS": "State_Bank_of_India.json",
};

exports.getStockOpinion = async (req, res) => {
  const { symbol } = req.body;
  console.log(symbol);

  if (!symbol) {
    return res.status(400).json({ error: "No stock symbol provided." });
  }

  const fileName = news[symbol];

  if (!fileName) {
    return res.status(404).json({ error: `Symbol '${symbol}' not found.` });
  }

  const newsFolderPath = path.resolve("", "News");
  const filePath = path.join(newsFolderPath, fileName);
  

  let Data;
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    Data = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading or parsing the file:", error); // Log the actual error
    return res
      .status(500)
      .json({ error: "Failed to read or parse news file." });
  }

  // console.log(Data);

  const prompt = `You are a financial analyst. Based on the following news articles, provide:
1. A brief summary of each article's headline and content in a formal financial tone.
2. Highlight any key financial indicators, developments, or strategic moves.
3. Highlight any earnings or statistics available in the data.
4. Provide bullet points listing positive and negative takeaways (if applicable).
5. Give your overall opinion on the stock's outlook (e.g., bullish, neutral, bearish) and explain why in 5-6 sentences.

This is the Stock Data: 
${JSON.stringify(Data)}

The Output should consist of Two Headings:

News: 
&
AI Suggestion:
`;

  try {
    const response = await geminiClient.generateReply([
      { parts: [{ text: prompt }] },
    ]);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock opinion." });
  }
};
