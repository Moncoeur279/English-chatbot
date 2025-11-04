// routes/message.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const messageController = require("../controllers/message.controller");

router.get("/:conversationId", auth, messageController.getMessages);
router.post("/", auth, messageController.sendMessage);

module.exports = router;
