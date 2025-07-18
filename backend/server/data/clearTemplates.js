const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('../models/Template');
const detect = require('detect-port');

dotenv.config();

const PORT = process.env.PORT || 5002;

const clearTemplates = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-generator');
    console.log('Connected to MongoDB');

    console.log('Counting templates...');
    const count = await Template.countDocuments();
    console.log(`Templates before delete: ${count}`);

    console.log('Deleting templates...');
    const result = await Template.deleteMany({});
    console.log(`Deleted ${result.deletedCount} templates.`);

    const countAfter = await Template.countDocuments();
    console.log(`Templates after delete: ${countAfter}`);
    process.exit(0);
  } catch (error) {
    console.error('Error clearing templates:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit();
});

detect(PORT).then(_port => {
  if (PORT == _port) {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log(`Port ${PORT} in use, server running on port ${_port}`);
  }
}); 