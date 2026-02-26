const { Router } = require("express");
const razorpayInstance = require("../utils/razorPay");
const PaymentModel = require("../models/payment");
const { userAuth } = require("../middleware/auth");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const UserModel = require("../models/user");
const paymentRouter = Router();

paymentRouter.post("/create", userAuth, async (req, res) => {
  try {
    var options = {
      amount: 50000,
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName: "Mohsin",
        lastName: "Khan",
        membershipType: "silver",
      },
    };
    const order = await razorpayInstance.orders.create(options);
    const payment = new PaymentModel({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    return res.status(201).json({
      success: true,
      data: { ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

paymentRouter.post("/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    if (!isWebhookValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook",
      });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await PaymentModel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await UserModel.findById(payment.userId);
    user.isPremium = true;
    user.memberShipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }
    res.status(200).json({
      success: true,
      message: "Webhook received successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = paymentRouter;
