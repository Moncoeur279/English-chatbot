const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { text, userId } = req.body;
        console.log("Chat request:", { text, userId });

        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, userId }),
        });

        console.log("Flask status:", response.status);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ reply: "Demo phản hồi của AI" });
    }
});

module.exports = router;
