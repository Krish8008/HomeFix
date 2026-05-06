process.removeAllListeners('warning');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://homefix-client.onrender.com'  // ← your actual frontend URL
  ],
  credentials: true
}));
app.use(express.json());


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/reviews', require('./routes/reviews'));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
