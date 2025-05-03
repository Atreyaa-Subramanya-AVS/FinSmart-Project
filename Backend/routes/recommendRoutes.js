const express = require("express");
const router = express.Router();
const { getFinancialRecommendation } = require("../controllers/recommendController");

router.post("/recommend", getFinancialRecommendation);

module.exports = router;