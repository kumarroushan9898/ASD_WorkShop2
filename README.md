# Razorpay Payment Integration

A simple Razorpay payment gateway integration using
Node.js, Express.js and MVC architecture.

## Features

- Razorpay order creation
- Razorpay Checkout integration
- HMAC-SHA256 signature verification
- Payment status verification
- Amount and currency verification
- In-memory order storage
- Basic error handling

## Technologies Used

- Node.js
- Express.js
- Razorpay SDK
- Crypto
- Dotenv
- HTML and JavaScript

## Project Structure

razorpay-project/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── public/
│   ├── index.html
│   └── checkout.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

## Installation

1. Clone the repository.
2. Install dependencies:

   npm install

3. Create the environment file:

   cp .env.example .env

4. Configure environment variables:

   PORT=3000
   RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_secret

5. Start the server:

   npm start

6. Open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/payments/verify-payment | Verify payment |

## Payment Flow

1. Customer clicks Pay Now.
2. Backend creates a Razorpay order.
3. Frontend opens Razorpay Checkout.
4. Customer completes payment.
5. Frontend sends payment ID, order ID and signature.
6. Backend verifies the HMAC-SHA256 signature.
7. Backend checks amount, currency and captured status.
8. Payment is marked as verified.

## Signature Verification

The backend generates a signature using:

HMAC-SHA256(order_id + "|" + payment_id, secret_key)

The generated signature is securely compared with
the signature received from Razorpay.

## Security

- API credentials are stored in environment variables.
- Secret keys are never exposed to the frontend.
- Signature verification is performed on the backend.
- The .env file is excluded from Git.