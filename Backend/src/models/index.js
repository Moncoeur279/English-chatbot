// models/index.js
const { sequelize } = require("../config/dbConfig");

const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");
const Correction = require("./Correction");
const VerificationCode = require("../authModels/VerificationCode");

// ====== Associations gốc ======

// 1 user có nhiều conversation
User.hasMany(Conversation, {
  foreignKey: "userId",
  as: "conversations",
  onDelete: "CASCADE",
});
Conversation.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// 1 conversation có nhiều message
Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

// 1 message có 1 correction
Message.hasOne(Correction, {
  foreignKey: "messageId",
  as: "correction",
  onDelete: "CASCADE",
});
Correction.belongsTo(Message, {
  foreignKey: "messageId",
  as: "message",
});

// VerificationCode không cần association với User
// (vì nó dùng email + payload tạm thời, không liên kết userId trực tiếp)

// ====== Export ======
module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  Correction,
  VerificationCode,
};
