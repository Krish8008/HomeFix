// MONGO_URI = mongodb+srv://krushnashewale8008_db_user:0YahSxYeDvGb9950@cluster0.h2ehbys.mongodb.net/homeFix

const mongoose = require('mongoose');
const Technician = require('./models/Technician');

mongoose.connect('mongodb+srv://krushnashewale8008_db_user:0YahSxYeDvGb9950@cluster0.h2ehbys.mongodb.net/homeFix');

const categories = [
  'plumbing',
  'electrician',
  'carpenter',
  'painting',
  'cleaning',
  'ac_repair',
  'appliance_repair',
  'pest_control'
];

const cities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'];
const areas = ['Andheri', 'Borivali', 'Hinjewadi', 'CIDCO', 'Dadar'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

async function seedData() {
  await Technician.deleteMany();

  const technicians = [];

  for (let i = 1; i <= 100; i++) {
    technicians.push({
      user: new mongoose.Types.ObjectId(),
      serviceCategory: categories[i % categories.length],
      specialization: `Specialist ${i}`,
      experience: Math.floor(Math.random() * 10) + 1,
      hourlyRate: Math.floor(Math.random() * 500) + 300,
      bio: `Professional technician number ${i}`,
      skills: ['Repair', 'Installation', 'Maintenance'],
      certifications: ['Certified Technician'],
      availableDays: days,
      availableTimeSlots: [{ start: '09:00', end: '18:00' }],
      city: cities[i % cities.length],
      area: areas[i % areas.length],
      rating: (Math.random() * 5).toFixed(1),
      totalReviews: Math.floor(Math.random() * 100),
      totalJobs: Math.floor(Math.random() * 200),
      isVerified: i % 2 === 0,
      isAvailable: true
    });
  }

  await Technician.insertMany(technicians);
  console.log('100 technicians inserted successfully');
  mongoose.connection.close();
}

seedData();