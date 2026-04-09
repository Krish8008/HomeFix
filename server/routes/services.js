const express = require('express');
const router = express.Router();

const services = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', description: 'Pipe repairs, leaks, drainage, faucets', color: '#3B82F6' },
  { id: 'electrician', name: 'Electrician', icon: '⚡', description: 'Wiring, switches, panel, appliances', color: '#F59E0B' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', description: 'Furniture, doors, windows, cabinets', color: '#92400E' },
  { id: 'painting', name: 'Painting', icon: '🎨', description: 'Interior, exterior, texture, waterproofing', color: '#EC4899' },
  { id: 'cleaning', name: 'Deep Cleaning', icon: '🧹', description: 'House, sofa, kitchen, bathroom cleaning', color: '#10B981' },
  { id: 'ac_repair', name: 'AC Repair', icon: '❄️', description: 'AC servicing, gas refill, installation', color: '#06B6D4' },
  { id: 'appliance_repair', name: 'Appliance Repair', icon: '🔌', description: 'Washing machine, fridge, microwave', color: '#8B5CF6' },
  { id: 'pest_control', name: 'Pest Control', icon: '🐛', description: 'Cockroach, termite, rodent control', color: '#EF4444' }
];

router.get('/', (req, res) => res.json(services));

module.exports = router;
