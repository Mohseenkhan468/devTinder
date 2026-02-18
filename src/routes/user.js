const { Router } = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = Router();

userRouter.get("/requests", async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);
    return res.json({
      success: true,
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;
