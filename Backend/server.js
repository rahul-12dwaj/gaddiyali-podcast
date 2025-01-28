import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


const app = express();
const port = 5000;

// Razorpay setup
const razorpay = new Razorpay({
  key_id: 'rzp_test_v5vyoGfVzHPkmz',
  key_secret: 'Mf7oM0EZy9TvFlOwY4tgg8lD',
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Make sure this is declared before route handlers

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/emailSubscription', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  // Simple email validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    // Check if the email is already subscribed
    const existingSubscription = await EmailSubscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ error: "This email is already subscribed" });
    }

    // Save the new email to the database
    const newSubscription = new EmailSubscription({ email });
    await newSubscription.save();

    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});


// Define a schema for email subscriptions
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for email subscriptions
const EmailSubscription = mongoose.model('EmailSubscription', emailSchema);

// Create order route
app.post('/create-order', (req, res) => {
  const { amount } = req.body; // Amount in paise (100 = 1 INR)

  // Validate input: Check if 'amount' is provided and is a positive number
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. Please provide a positive number.' });
  }

  // Convert amount to paise (100 = 1 INR)
  const amountInPaise = amount * 100;

  // Create a unique receipt ID for each order
  const receiptId = `order_${Date.now()}`;

  const options = {
    amount: amountInPaise, // Convert to paise (100 = 1 INR)
    currency: 'INR',
    receipt: receiptId, // Unique receipt ID
  };

  // Create order with Razorpay API
  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.error('Error while creating Razorpay order:', err); // Log error for debugging

      // Handle specific Razorpay error codes and return a helpful message
      if (err.code === 'E_API_ERROR') {
        return res.status(500).json({ error: 'Razorpay API error. Please try again later.' });
      }
      if (err.code === 'E_ORDER_CREATE_FAILED') {
        return res.status(500).json({ error: 'Failed to create order with Razorpay.' });
      }
      // Generic error message for other errors
      return res.status(500).json({ error: 'An error occurred while creating the payment order.' });
    }

    // If order creation is successful
    res.json({ orderId: order.id, receiptId: order.receipt });
  });
});

// Global error handling middleware for uncaught errors
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
