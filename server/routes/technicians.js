const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get all technicians with filters
router.get('/', async (req, res) => {
  try {
    const { category, city, minRating } = req.query;
    let filter = {};
    if (category) filter.serviceCategory = category;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    const technicians = await Technician.find(filter)
      .populate('user', 'name email phone profileImage')
      .sort({ rating: -1 });
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get technician by ID
router.get('/:id', async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate('user', 'name email phone profileImage city');
    if (!technician) return res.status(404).json({ message: 'Technician not found' });
    res.json(technician);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update technician profile
router.put('/profile', auth, async (req, res) => {
  try {
    const technician = await Technician.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('user', 'name email phone');
    res.json(technician);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle availability
router.patch('/availability', auth, async (req, res) => {
  try {
    const technician = await Technician.findOne({ user: req.user._id });
    technician.isAvailable = !technician.isAvailable;
    await technician.save();
    res.json({ isAvailable: technician.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
