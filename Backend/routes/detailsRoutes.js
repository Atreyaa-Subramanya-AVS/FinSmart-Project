const express = require("express");
const router = express.Router();

const {
  storeDetails,
  getDetails,
} = require("../controllers/detailsController");

router.post("/store", storeDetails);
router.get("/:ID", getDetails);

module.exports = router;