// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('❌ Razorpay credentials missing');
      return res.status(500).json({ 
        success: false,
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    console.log('🔵 Creating Razorpay order with key:', keyId.substring(0, 10) + '...');

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { amount, bookingId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid amount specified' 
      });
    }

    console.log('💰 Creating order for amount:', amount, 'INR');

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${bookingId || Date.now()}`,
    });

    console.log('✅ Order created:', order.id);
    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Order creation error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Order creation failed. Please try again.',
      error: err.message 
    });
  }
});

// Verify payment and update booking
router.post('/verify', auth, async (req, res) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      console.error('❌ RAZORPAY_KEY_SECRET not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Payment verification not available' 
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment details' 
      });
    }

    console.log('🔵 Verifying payment:', razorpay_payment_id);

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', keySecret)
      .update(sign)
      .toString('hex');

    console.log('📊 Signature verification:', {
      received: razorpay_signature.substring(0, 10) + '...',
      expected: expectedSign.substring(0, 10) + '...',
      match: razorpay_signature === expectedSign,
    });

    if (razorpay_signature !== expectedSign) {
      console.error('❌ SIGNATURE MISMATCH - Payment verification failed');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature. Payment verification failed.' 
      });
    }

    console.log('✅ Signature verified successfully');

    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'confirmed',
      }, { new: true });

      if (!booking) {
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found' 
        });
      }

      console.log('✅ Booking status updated to paid and confirmed');
    }

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error('❌ Verify error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Verification failed. Please contact support.',
      error: err.message 
    });
  }
});

module.exports = router;