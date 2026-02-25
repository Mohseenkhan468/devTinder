const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const secretKey = process.env.JWT_SECRET;
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Authentication failed");
    }
    const isValid = await jwt.verify(token, secretKey);
    if (!isValid) {
      throw new Error("Authentication failed");
    }
    const user = await UserModel.findById(isValid._id);
    if (!user) {
      throw new Error("Authentication failed");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { userAuth };
