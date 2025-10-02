const { lookupWord } = require("../services/dictionaryService");

const lookup = async (req, res) => {
  const word = (req.query.word || "").trim();
  if (!word)
    return res.status(400).json({ error: "Missing 'word' query param" });

  const data = await lookupWord(word);
  if (!data) return res.status(404).json({ error: "Not found" });

  if (req.db?.DictionaryLookup) {
    try {
      await req.db.DictionaryLookup.create({
        word: data.word,
        phonetic: data.phonetic || null,
        resultJson: data,
      });
    } catch (e) {
      console.warn("[dict] save history failed:", e.message);
    }
  }

  res.json(data);
};

const recent = async (req, res) => {
  const days = Number(req.query.days || 7);
  if (!req.db?.DictionaryLookup) return res.json([]);

  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const rows = await req.db.DictionaryLookup.findAll({
    where: { createdAt: { [req.db.Sequelize.Op.gte]: since } },
    order: [["createdAt", "DESC"]],
    limit: 50,
  });

  res.json(
    rows.map((r) => ({
      id: r.id,
      word: r.word,
      phonetic: r.phonetic,
      at: r.createdAt,
    }))
  );
};

module.exports = { lookup, recent };
