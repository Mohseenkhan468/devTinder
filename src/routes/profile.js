const { Router } = require("express");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const profileRouter = Router();
const {
  validateEditProfileData,
  validateEditPasswordData,
} = require("../utils/validation");
profileRouter.get("/view", async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

profileRouter.patch("/edit", async (req, res) => {
  try {
    validateEditProfileData(req.body);
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update.",
      });
    }
    const user = req.user;
    await UserModel.updateOne({ _id: user._id }, { $set: req.body });
    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

profileRouter.patch("/password", async (req, res) => {
  try {
    const { password } = validateEditPasswordData(req.body);
    const hashPassword = await bcrypt.hash(password, 10);
    const { user } = req;
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { password: hashPassword } },
    );
    return res.json({
      success: true,
      message: "Password updated succesfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = profileRouter;
