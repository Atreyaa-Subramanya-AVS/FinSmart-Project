const geminiClient = require("../utils/geminiClient");

exports.chatWithGemini = async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "History is required" });
  }

  try {
    const reply = await geminiClient.generateReply(history);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate reply" });
  }
};
