// const nlu = require("../services/nluService");
// const gec = require("../services/gecService");
// const dialog = require("../services/dialogueService");
// const level = require("../services/levelService");
// const { Message, Correction, User } = require("../models");

// exports.handleChat = async (req, res) => {
//     try {
//         const { text, userId: bodyUserId } = req.body || {};
//         if (!text || typeof text !== "string") {
//             return res.status(400).json({ error: "Missing 'text'." });
//         }

//         // Ưu tiên userId client gửi; nếu không có, lôi 1 user bất kỳ từ DB (để demo không vỡ)
//         let userId = bodyUserId;
//         if (!userId) {
//             try {
//                 const u = await User.findOne({ attributes: ["id"] });
//                 userId = u?.id || null;
//             } catch { }
//         }

//         const intent = nlu.detectIntent(text);

//         // 1) Lưu user message (nếu có userId); lỗi DB => cảnh báo, vẫn chạy tiếp
//         let userMsgId = null;
//         try {
//             if (userId) {
//                 const userMsg = await Message.create({ user_id: userId, role: "user", text });
//                 userMsgId = userMsg.id;
//             }
//         } catch (e) {
//             console.warn("[chat] save user message failed:", e.message);
//         }

//         // 2) Sửa ngữ pháp
//         let corrections = null, corrected = text;
//         if (intent === "correct" || nlu.hasMistakesHeuristic(text)) {
//             const r = await gec.correct(text);
//             corrections = r;
//             corrected = r.corrected;
//             try {
//                 if (userId && userMsgId) {
//                     await Correction.create({
//                         user_id: userId, message_id: userMsgId,
//                         original: text, corrected: r.corrected, errors_json: JSON.stringify(r.errors)
//                     });
//                 }
//             } catch (e) {
//                 console.warn("[chat] save correction failed:", e.message);
//             }
//         }

//         // 3) Level mục tiêu (an toàn)
//         let targetLevel = "A2";
//         try { targetLevel = await level.pickTargetLevel(userId); } catch { }

//         // 4) Sinh trả lời
//         const reply = await dialog.reply({ userId, userText: corrected, targetLevel });

//         // 5) Lưu assistant message (best-effort)
//         try {
//             if (userId) {
//                 await Message.create({ user_id: userId, role: "assistant", text: reply, reply_level: targetLevel });
//             }
//         } catch (e) {
//             console.warn("[chat] save assistant message failed:", e.message);
//         }

//         return res.json({ reply, corrections, level: targetLevel });
//     } catch (err) {
//         console.error("[/api/chat] fatal:", err);
//         return res.status(500).json({ error: "Chat handler crashed." });
//     }
// };
