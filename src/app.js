const express = require("express");
const path = require("path");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (req, res) => {
    res.json({ success: true });
});

app.use("/api/payments", paymentRoutes);

module.exports = app;
