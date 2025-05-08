const geminiClient = require("../utils/geminiClient");

exports.getFinancialRecommendation = async (req, res) => {
  const { Data, message: userMessage } = req.body; // Get user message from request
  // console.log(Data)
  if (!Data) {
    return res.status(400).json({ error: "No financial data provided" });
  }

  let prompt = `The user has the following financial data: ${JSON.stringify(Data, null, 2)}`;

  // Add the user message only if it's provided
  if (userMessage && userMessage.trim() !== "") {
    prompt += `
    The user also provided the following message: 
    "${userMessage}"
    `;
  }

  prompt += `
  Based on the financial data and the user's goals and message, please analyze and provide:

  - How can the user best allocate their resources to invest for the future? Suggest investment opportunities that align with their financial goals.
  - What are the best strategies for saving money, considering the user's current income, spending habits, and savings goals?
  - How can the user reduce unnecessary expenses without affecting essential living standards or goals? Provide actionable steps to minimize spending.

  Please provide detailed recommendations and practical actions based on the user's goals, financial situation, and message.
  Keep in mind that all the values are in rupees and you need to return the values in rupees only..`;

  try {
    const response = await geminiClient.generateReply([
      { parts: [{ text: prompt }] },
    ]);
    console.log(response);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch financial recommendation." });
  }
};