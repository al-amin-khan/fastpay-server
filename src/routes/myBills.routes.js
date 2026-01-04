const express = require("express");
const {
    getMyBills,
    createMyBill,
    updateMyBill,
    deleteMyBill,
} = require("../controllers/myBills.controller");

const router = express.Router();

router.get("/my-bills", getMyBills);
router.post("/my-bills", createMyBill);
router.patch("/my-bills/:id", updateMyBill);
router.delete("/my-bills/:id", deleteMyBill);

module.exports = router;
