const button = document.getElementById("payBtn");
const statusText = document.getElementById("status");

button.onclick = async () => {
    button.disabled = true;

    try {
        statusText.innerText = "Creating order...";

        const response = await fetch(
            "/api/payments/create-order",
            { method: "POST" }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message);
        }

        const options = {
            key: data.keyId,
            amount: data.order.amount,
            currency: data.order.currency,
            order_id: data.order.id,
            name: "Razorpay Demo",

            handler: async function (payment) {
                try {
                    statusText.innerText = "Verifying payment...";

                    const response = await fetch(
                        "/api/payments/verify-payment",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payment)
                        }
                    );

                    const result = await response.json();

                    statusText.innerText = result.message;

                } catch (error) {
                    statusText.innerText = error.message;
                } finally {
                    button.disabled = false;
                }
            },

            modal: {
                ondismiss: function () {
                    button.disabled = false;
                    statusText.innerText = "Checkout closed";
                }
            }
        };

        const razorpay = new Razorpay(options);

        razorpay.on("payment.failed", function () {
            statusText.innerText = "Payment failed";
        });

        razorpay.open();

    } catch (error) {
        statusText.innerText = error.message;
        button.disabled = false;
    }
};
