const { Router } = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = Router();
const UserModel = require("../models/user");
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

userRouter.get("/connections", async (req, res) => {
  try {
    const user = req.user;
    const data = await ConnectionRequestModel.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      status: "accepted",
    }).populate(["fromUserId", "toUserId"]);
    const result = data.map((item) => {
      const isSender = item.fromUserId._id.equals(user._id);
      return {
        _id: item._id,
        connection: isSender ? item.toUserId : item.fromUserId,
      };
    });
    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/feed", async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const users = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: loggedInUser._id },
        },
      },
      {
        $lookup: {
          from: "connectionrequests",
          let: { otherUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$fromUserId", loggedInUser._id] },
                        { $eq: ["$toUserId", "$$otherUserId"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$fromUserId", "$$otherUserId"] },
                        { $eq: ["$toUserId", loggedInUser._id] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "connection",
        },
      },
      {
        $match: {
          connection: { $size: 0 }, // only users with NO connection
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          password: 0,
          __v: 0,
          connection: 0,
        },
      },
    ]);

    return res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/premium/verify", async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      success: true,
      isPremium: user.isPremium,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;
