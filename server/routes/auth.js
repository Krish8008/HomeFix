const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Technician = require('../models/Technician');

const JWT_SECRET = process.env.JWT_SECRET || 'homefix_secret_2024';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, city, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone, city, role: role || 'user' });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role, city } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    let technicianProfile = null;
    if (user.role === 'technician') {
      technicianProfile = await Technician.findOne({ user: user._id });
    }

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, city: user.city, phone: user.phone },
      technicianProfile
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register Technician
router.post('/register-technician', async (req, res) => {
  try {
    const { name, email, password, phone, city, area, serviceCategory, experience, hourlyRate, bio, skills, availableDays } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone, city, role: 'technician' });
    await user.save();

    const technician = new Technician({
      user: user._id,
      serviceCategory,
      experience: experience || 0,
      hourlyRate,
      bio,
      skills: skills || [],
      availableDays: availableDays || ['Monday','Tuesday','Wednesday','Thursday','Friday'],
      city,
      area
    });
    await technician.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: 'technician', city },
      technicianProfile: technician
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
