const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const toUser = await UserModel.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid to user id provided.",
      });
    }
    const { user } = req.user;
    const dataToSave = {
      fromUserId: user._id,
      toUserId: toUser._id,
      status,
    };
    await ConnectionRequestModel.save(dataToSave);
    return res.status(201).json({
      success: true,
      status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = requestRouter;
