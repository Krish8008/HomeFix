const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Technician = require('../models/Technician');
const { auth } = require('../middleware/auth');

// Submit review
router.post('/', auth, async (req, res) => {
  try {
    const review = new Review({ ...req.body, user: req.user._id });
    await review.save();

    // Update technician rating
    const allReviews = await Review.find({ technician: req.body.technician });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Technician.findByIdAndUpdate(req.body.technician, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a technician
router.get('/technician/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ technician: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
