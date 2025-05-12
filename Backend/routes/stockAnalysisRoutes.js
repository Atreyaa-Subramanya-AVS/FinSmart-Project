const express = require("express");
const router = express.Router();

const {
  storeStockAnalysis,
  getStockAnalysis,
} = require("../controllers/stockAnalysisController");

router.post("/stock-analysis", storeStockAnalysis);
router.get("/stock-analysis/:ID", getStockAnalysis);

module.exports = router;