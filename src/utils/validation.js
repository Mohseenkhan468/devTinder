const validator = require("validator");
const validateSignUpData = (data) => {
  const { firstName, lastName, email, password } = data;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("FirstName should be 4-50 characters long");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
  return { firstName, lastName, email };
};

const validateLoginData = (data) => {
  const { email, password } = data;
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
  return { email, password };
};

const validateEditProfileData = (data) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "profileUrl",
    "about",
    "skills",
  ];

  const keys = Object.keys(data);

  if (keys.length === 0) return false;

  const isValid = keys.every((key) => allowedEditFields.includes(key));
  if (!isValid) {
    throw new Error("Input not valid");
  }
};

const validateEditPasswordData = (data) => {
  const { password } = data;
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Invalid password.");
  }
  return { password };
};

const requestSendData = (data) => {
  const { status, toUserId } = data;

  if (
    !status ||
    !validator.isIn(status, ["ignored", "interested"])
  ) {
    throw new Error("Invalid status provided");
  }

  if (!toUserId || !validator.isMongoId(toUserId)) {
    throw new Error("Invalid to user id provided.");
  }

  return { status, toUserId };
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateEditProfileData,
  validateEditPasswordData,
  requestSendData,
};
