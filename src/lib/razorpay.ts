import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const RAZORPAY_PLANS = {
  monthly: {
    name: "Premium Monthly",
    price: 50000, // ₹500.00 in paisa (500 INR)
    currency: "INR",
    interval: "monthly",
  },
};
