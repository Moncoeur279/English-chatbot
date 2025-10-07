const axios = require("axios");

exports.checkGrammar = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Missing text" });

        const response = await axios.post(
            "https://api.languagetool.org/v2/check",
            new URLSearchParams({
                text,
                language: "en-US",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { matches } = response.data;

        const corrections = matches.map((m, i) => {
            const original = text.slice(m.offset, m.offset + m.length);
            return {
                id: i + 1,
                original,
                suggestion: m.replacements?.[0]?.value || "",
                reason: m.message,
                label: m.rule?.description || "Grammar",
            };
        });

        res.json({ corrections });
    } catch (err) {
        console.error("Grammar check failed:", err.message);
        res.status(500).json({ message: "Grammar API error" });
    }
};
