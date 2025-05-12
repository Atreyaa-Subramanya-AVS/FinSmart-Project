const Details = require("../models/Details");

const storeFinancialAnalysis = async (req, res) => {
  const { ID, financialAnalysis } = req.body;

  try {
    if (!ID) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (!financialAnalysis || typeof financialAnalysis !== "object") {
      return res
        .status(400)
        .json({ error: "Valid financialAnalysis data is required." });
    }

    const updatedDetails = await Details.findByIdAndUpdate(
      ID,
      { $set: { financialAnalysis } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Financial analysis updated successfully",
      data: updatedDetails.financialAnalysis,
    });
  } catch (error) {
    console.error("Error storing financial analysis:", error);
    res.status(500).json({ error: "Failed to store financial analysis" });
  }
};

const getFinancialAnalysis = async (req, res) => {
  const { ID } = req.params;

  try {
    if (!ID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userDetails = await Details.findById(ID).select("financialAnalysis");

    if (!userDetails || !userDetails.financialAnalysis) {
      return res
        .status(404)
        .json({ error: "Financial analysis not found for this user" });
    }

    res.status(200).json({ financialAnalysis: userDetails.financialAnalysis });
  } catch (error) {
    console.error("Error fetching financial analysis:", error);
    res.status(500).json({ error: "Failed to fetch financial analysis" });
  }
};

module.exports = { storeFinancialAnalysis, getFinancialAnalysis };
