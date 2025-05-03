const geminiClient = require("../utils/geminiClient");

exports.getFinancialRecommendation = async (req, res) => {
  const { Data } = req.body;
  if (!Data) {
    return res.status(400).json({ error: "No financial data provided" });
  }

  const prompt = `
  Analyze the following financial details and provide detailed recommendations...

  ${JSON.stringify(Data, null, 2)}
  `;

  try {
    const response = await geminiClient.generateReply([
      { parts: [{ text: prompt }] },
    ]);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch financial recommendation." });
  }
};