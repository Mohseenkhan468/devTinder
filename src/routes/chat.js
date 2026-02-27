const { Router } = require("express");
const ChatModel = require("../models/chat");

const chatRouter = Router();

chatRouter.get("/:targetUserId", async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let chat = await ChatModel.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName createdAt");
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    return res.json({
      success: true,
      data: chat,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = chatRouter;
