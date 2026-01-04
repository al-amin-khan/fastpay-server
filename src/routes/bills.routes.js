const express = require("express");
const {
    getBills,
    getBillCategories,
    getLatestBills,
    getBillById,
    updateBillStatus,
} = require("../controllers/bills.controller");

const router = express.Router();

router.get("/bills", getBills);
router.get("/bills/category", getBillCategories);
router.get("/latest-bills", getLatestBills);
router.get("/bills/:id", getBillById);
router.patch("/bills/:id", updateBillStatus);

module.exports = router;
