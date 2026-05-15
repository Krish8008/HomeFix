const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  serviceCategory: { type: String, required: true },
  problemDescription: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedCost: { type: Number },
  finalCost: { type: Number },
  paymentStatus: {
  type: String,
  enum: ['pending', 'paid', 'failed'],
  default: 'pending',
  },
  paymentId: {
  type: String,
  default: null,
},
orderId: {
  type: String,
  default: null,
},
  notes: { type: String },
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
