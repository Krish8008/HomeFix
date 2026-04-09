const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceCategory: {
    type: String,
    enum: ['plumbing', 'electrician', 'carpenter', 'painting', 'cleaning', 'ac_repair', 'appliance_repair', 'pest_control'],
    required: true
  },
  specialization: { type: String },
  experience: { type: Number, default: 0 }, // years
  hourlyRate: { type: Number, required: true },
  bio: { type: String },
  skills: [String],
  certifications: [String],
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  availableTimeSlots: [{
    start: String,
    end: String
  }],
  city: { type: String, required: true },
  area: { type: String },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Technician', technicianSchema);
