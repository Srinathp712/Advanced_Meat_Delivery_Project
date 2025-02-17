const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// 🚀 Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// 🚀 Serve images properly
app.use("/images", express.static(path.join(__dirname, "../frontend/images")));

// 🚀 Serve login page when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// 🚀 Serve dashboard page
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// 🚀 Use Authentication Routes
app.use("/", authRoutes);

// 🚀 Handle Orders (Store in MySQL with `order_details` column)
app.post("/order", (req, res) => {
    const { name, phone, address, order_details } = req.body;

    if (!name || !phone || !address || !order_details) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = "INSERT INTO orders (name, phone, address, order_details) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, phone, address, order_details], (err, result) => {
        if (err) {
            console.error("⚠️ Error saving order:", err);
            return res.status(500).json({ success: false, message: "Order could not be placed." });
        }
        res.json({ success: true, message: "Order placed successfully!" });
    });
});

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
