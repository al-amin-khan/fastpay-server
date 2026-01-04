const express = require("express");
const cors = require("cors");

const billsRoutes = require("./routes/bills.routes");
const myBillsRoutes = require("./routes/myBills.routes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://fastpay-bd.web.app",
];

const corsOptions = {
    origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FastPay server is running");
});

app.use(billsRoutes);
app.use(myBillsRoutes);

module.exports = app;
