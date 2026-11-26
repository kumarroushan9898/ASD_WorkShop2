const paymentService = require("../services/payment.service");

exports.createOrder = async (req, res) => {
    try {
        const order = await paymentService.createOrder();

        res.status(201).json({
            success: true,
            order,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Order creation failed"
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const result = await paymentService.verifyPayment(req.body);

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Verification failed"
        });
    }
};
