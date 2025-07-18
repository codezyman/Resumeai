const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedTemplates } = require('./data/templates');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-generator');
    console.log('Connected to MongoDB');

    await seedTemplates();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();