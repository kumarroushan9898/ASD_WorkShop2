const crypto = require("crypto");
const getRazorpay = require("../config/razorpay");
const orders = require("../models/order.model");

async function createOrder() {
    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt_" + Date.now()
    });

    orders.set(order.id, {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        paid: false
    });

    return order;
}

async function verifyPayment(data) {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = data || {};

    const order = orders.get(razorpay_order_id);

    if (!order) {
        throw new Error("Order not found");
    }

    if (
        typeof razorpay_payment_id !== "string" ||
        typeof razorpay_signature !== "string" ||
        !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
        throw new Error("Invalid payment details");
    }

    const razorpay = getRazorpay();

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(order.id + "|" + razorpay_payment_id)
        .digest("hex");

    const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
    );

    if (!isValid) {
        throw new Error("Invalid signature");
    }

    const payment = await razorpay.payments.fetch(
        razorpay_payment_id
    );

    if (
        payment.status !== "captured" ||
        payment.order_id !== order.id ||
        payment.amount !== order.amount ||
        payment.currency !== order.currency
    ) {
        throw new Error("Payment verification failed");
    }

    order.paid = true;

    return {
        success: true,
        message: "Payment verified successfully"
    };
}

module.exports = { createOrder, verifyPayment };
