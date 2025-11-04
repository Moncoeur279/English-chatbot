// controllers/message.controller.js
const { Message, Conversation } = require("../models");

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conv = await Conversation.findOne({
      where: { id: conversationId, userId },
    });
    if (!conv)
      return res.status(404).json({ message: "Conversation not found" });

    const messages = await Message.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, content } = req.body;

    // Xác minh quyền
    const conv = await Conversation.findOne({
      where: { id: conversationId, userId },
    });
    if (!conv)
      return res.status(404).json({ message: "Conversation not found" });

    // Tạo tin nhắn người dùng
    const userMsg = await Message.create({
      conversationId,
      role: "user",
      content,
    });

    // Giả lập phản hồi chatbot
    const botReply = await Message.create({
      conversationId,
      role: "assistant",
      content: `You said: ${content}`,
    });

    // Cập nhật thời gian cuối cùng
    conv.lastMessageAt = new Date();
    await conv.save();

    res.json({ userMsg, botReply });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
