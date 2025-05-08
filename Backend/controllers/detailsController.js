const Details = require("../models/Details");

const storeDetails = async (req, res) => {
  const { ID, ...detailsData } = req.body;

  try {
    if (!ID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedDetails = await Details.findByIdAndUpdate(
      ID, // match by _id (user ID)
      { _id: ID, ...detailsData }, // data to insert/update
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Details stored successfully",
      data: updatedDetails,
    });
  } catch (error) {
    console.error("Error storing details:", error);
    res.status(500).json({ error: "Failed to store details" });
  }
};

const getDetails = async (req, res) => {
  const { ID } = req.params;

  try {
    if (!ID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userDetails = await Details.findById(ID);

    if (!userDetails) {
      return res.status(404).json({ error: "Details not found for this user" });
    }

    res.status(200).json({ data: userDetails });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

module.exports = { storeDetails, getDetails };
