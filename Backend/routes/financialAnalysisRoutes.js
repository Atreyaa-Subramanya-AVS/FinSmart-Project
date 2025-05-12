const express = require("express");
const router = express.Router();

const {
  storeFinancialAnalysis,
  getFinancialAnalysis,
} = require("../controllers/financialAnalysisController");

router.post("/", storeFinancialAnalysis);
router.get("/:ID", getFinancialAnalysis);

module.exports = router;