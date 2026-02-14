const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const secretKey = "thisissecretkey";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 4,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email provided");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

UserSchema.methods.getJWT =async function () {
  const payload = {
    _id: this._id,
    role: "user",
  };
  const token = await jwt.sign(payload, secretKey, { expiresIn: "1h" });
  return token;
};

UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
