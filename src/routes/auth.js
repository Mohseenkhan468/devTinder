const express = require("express");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const { userAuth } = require("../middleware/auth");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const validatedData = validateSignUpData(req.body);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ ...validatedData, password: hashedPassword });
    await user.save();
    res.json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const validateData = validateLoginData(req.body);
    const { email, password } = validateData;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials.");
    }
    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 60 * 60 * 1000) });
    res.json({
      success: true,
      message: "Login successfull",
      data:user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date() }).json({
      success: true,
      message: "Logout successfull",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = authRouter;
