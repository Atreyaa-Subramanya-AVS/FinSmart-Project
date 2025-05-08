const express = require("express");
const router = express.Router();
const {
  getFinancialRecommendation,
} = require("../controllers/recommendController");
const { getStockOpinion, } = require("../controllers/stockOpinionController");

router.post("/recommend", getFinancialRecommendation);
router.post("/stockOpinion", getStockOpinion);

module.exports = router;