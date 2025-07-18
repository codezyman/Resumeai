const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  // Define your schema fields here, for example:
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  title: { type: String, required: true },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
    summary: String,
  },
  experience: [
    {
      position: String,
      company: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      location: String,
      description: String,
      achievements: [String],
    }
  ],
  skills: [
    {
      category: String,
      items: [String],
    }
  ],
  education: [
    {
      degree: String,
      fieldOfStudy: String,
      school: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    }
  ],
  projects: [
    {
      name: String,
      role: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      link: String,
      description: String,
    }
  ],
  certifications: [
    {
      name: String,
      issuer: String,
      date: String,
      expiration: String,
      description: String,
    }
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', ResumeSchema);
