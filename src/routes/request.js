const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const requestRouter = express.Router();
const { requestSendData } = require("../utils/validation");
const { default: mongoose } = require("mongoose");

requestRouter.post("/send/:status/:toUserId", async (req, res) => {
  try {
    const { status, toUserId } = requestSendData(req.params);
    const toUser = await UserModel.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid to user id provided.",
      });
    }
    const user = req.user;
    const isRequestExists = await ConnectionRequestModel.findOne({
      $or: [
        {
          fromUserId: user._id,
          toUserId: toUser._id,
        },
        {
          fromUserId: toUser._id,
          toUserId: user._id,
        },
      ],
      status: { $in: ["interested", "ignored"] },
    });
    if (isRequestExists) {
      return res.status(400).json({
        success: false,
        message: "Connection request already exists",
      });
    }
    const connectionRequest = new ConnectionRequestModel({
      fromUserId: user._id,
      toUserId: toUser._id,
      status,
    });
    const data = await connectionRequest.save();
    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

requestRouter.post("/review/:status/:requestId", async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus=['accepted','rejected']
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        success:false,
        message:'Invalid status provided'
      })
    }
    const connectionRequest = await ConnectionRequestModel.findOne({
      toUserId: loggedInUser._id,
      _id: new mongoose.Types.ObjectId(requestId),
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found.",
      });
    }
    connectionRequest.status=status;
    connectionRequest.save()
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
