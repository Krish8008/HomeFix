const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Technician = require('../models/Technician');
const { auth } = require('../middleware/auth');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, user: req.user._id });
    await booking.save();
    const populated = await booking.populate([
      { path: 'technician', populate: { path: 'user', select: 'name email phone' } },
      { path: 'user', select: 'name email phone' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'technician', populate: { path: 'user', select: 'name email phone' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get technician's bookings
router.get('/technician-bookings', auth, async (req, res) => {
  try {
    const technician = await Technician.findOne({ user: req.user._id });
    if (!technician) return res.status(404).json({ message: 'Technician profile not found' });

    const bookings = await Booking.find({ technician: technician._id })
      .populate('user', 'name email phone address city')
      .sort({ appointmentDate: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, finalCost, notes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, finalCost, notes, updatedAt: Date.now() },
      { new: true }
    ).populate([
      { path: 'technician', populate: { path: 'user', select: 'name email phone' } },
      { path: 'user', select: 'name email phone' }
    ]);

    if (status === 'completed') {
      await Technician.findByIdAndUpdate(booking.technician._id, { $inc: { totalJobs: 1 } });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate([
        { path: 'technician', populate: { path: 'user', select: 'name email phone' } },
        { path: 'user', select: 'name email phone address' }
      ]);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
