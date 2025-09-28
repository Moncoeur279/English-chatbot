const { sequelize } = require("../config/dbConfig");

const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");
const Correction = require("./Correction");

// Associations
User.hasMany(Conversation, {
  foreignKey: "userId",
  as: "conversations",
  onDelete: "CASCADE",
});
Conversation.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

// 1-1: Message <-> Correction
Message.hasOne(Correction, {
  foreignKey: "messageId",
  as: "correction",
  onDelete: "CASCADE",
});
Correction.belongsTo(Message, {
  foreignKey: "messageId",
  as: "message",
});

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  Correction,
};
