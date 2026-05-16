const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');


// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, bookingId } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${bookingId || Date.now()}`,
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// Verify payment and update booking
router.post('/verify', auth, async (req, res) => {
  try {
    console.log('Verify called:', req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .toString('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update booking payment status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
});

module.exports = router;