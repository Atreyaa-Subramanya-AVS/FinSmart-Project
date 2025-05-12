const Details = require("../models/Details");

const storeStockAnalysis = async (req, res) => {
  const { ID, stockAnalysis } = req.body;

  try {
    if (!ID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!stockAnalysis || typeof stockAnalysis !== "object") {
      return res.status(400).json({ error: "Valid stockAnalysis data is required" });
    }

    const updatedDetails = await Details.findByIdAndUpdate(
      ID,
      { $set: { stockAnalysis } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Stock analysis updated successfully",
      data: updatedDetails.stockAnalysis,
    });
  } catch (error) {
    console.error("Error storing stock analysis:", error);
    res.status(500).json({ error: "Failed to store stock analysis" });
  }
};

const getStockAnalysis = async (req, res) => {
  const { ID } = req.params;

  try {
    if (!ID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userDetails = await Details.findById(ID).select("stockAnalysis");

    if (!userDetails || !userDetails.stockAnalysis) {
      return res.status(404).json({ error: "Stock analysis not found for this user" });
    }

    res.status(200).json({ stockAnalysis: userDetails.stockAnalysis });
  } catch (error) {
    console.error("Error fetching stock analysis:", error);
    res.status(500).json({ error: "Failed to fetch stock analysis" });
  }
};

module.exports = { storeStockAnalysis, getStockAnalysis };
