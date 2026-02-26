const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      membershipType: { type: String },
    },
  },
  { timestamps: true },
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);

module.exports = PaymentModel;
