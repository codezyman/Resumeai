const Template = require('../models/Template');

const sampleTemplates = [
  {
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for tech and business professionals',
    category: 'modern',
    preview: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400',
    config: {
      layout: 'two-column',
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    },
    sections: [
      { name: 'Personal Info', required: true, order: 1 },
      { name: 'Summary', required: false, order: 2 },
      { name: 'Experience', required: true, order: 3 },
      { name: 'Skills', required: true, order: 4 },
      { name: 'Education', required: true, order: 5 }
    ],
    premium: false,
    rating: { average: 4.5, count: 127 },
    usage: 1520
  },
  {
    name: 'Classic Executive',
    description: 'Traditional, professional layout ideal for executive positions',
    category: 'classic',
    preview: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400',
    config: {
      layout: 'single-column',
      colors: {
        primary: '#1F2937',
        secondary: '#6B7280',
        accent: '#059669'
      }
    },
    sections: [
      { name: 'Personal Info', required: true, order: 1 },
      { name: 'Summary', required: true, order: 2 },
      { name: 'Experience', required: true, order: 3 },
      { name: 'Education', required: true, order: 4 },
      { name: 'Skills', required: true, order: 5 }
    ],
    premium: false,
    rating: { average: 4.3, count: 89 },
    usage: 892
  },
  {
    name: 'Creative Designer',
    description: 'Bold, creative design for designers and creative professionals',
    category: 'creative',
    preview: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400',
    config: {
      layout: 'two-column',
      colors: {
        primary: '#8B5CF6',
        secondary: '#6B7280',
        accent: '#F59E0B'
      }
    },
    sections: [
      { name: 'Personal Info', required: true, order: 1 },
      { name: 'Summary', required: false, order: 2 },
      { name: 'Experience', required: true, order: 3 },
      { name: 'Projects', required: true, order: 4 },
      { name: 'Skills', required: true, order: 5 }
    ],
    premium: true,
    rating: { average: 4.7, count: 156 },
    usage: 743
  },
  {
    name: 'Minimal Clean',
    description: 'Simple, clean design that focuses on content',
    category: 'minimal',
    preview: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400',
    config: {
      layout: 'single-column',
      colors: {
        primary: '#111827',
        secondary: '#6B7280',
        accent: '#3B82F6'
      }
    },
    sections: [
      { name: 'Personal Info', required: true, order: 1 },
      { name: 'Summary', required: false, order: 2 },
      { name: 'Experience', required: true, order: 3 },
      { name: 'Skills', required: true, order: 4 },
      { name: 'Education', required: true, order: 5 }
    ],
    premium: false,
    rating: { average: 4.2, count: 203 },
    usage: 1834
  },
  {
    name: 'Professional Elite',
    description: 'A polished, professional template for high-level positions.',
    category: 'professional',
    preview: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400',
    config: {
      layout: 'single-column',
      colors: {
        primary: '#0A0A23',
        secondary: '#6B7280',
        accent: '#FFD700'
      }
    },
    sections: [
      { name: 'Personal Info', required: true, order: 1 },
      { name: 'Summary', required: true, order: 2 },
      { name: 'Experience', required: true, order: 3 },
      { name: 'Education', required: true, order: 4 },
      { name: 'Skills', required: true, order: 5 }
    ],
    premium: true,
    rating: { average: 4.8, count: 50 },
    usage: 100
  }
];

const seedTemplates = async () => {
  try {
    const existingTemplates = await Template.countDocuments();
    
    if (existingTemplates === 0) {
      await Template.insertMany(sampleTemplates);
      console.log('Sample templates seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding templates:', error);
  }
};

module.exports = { seedTemplates };