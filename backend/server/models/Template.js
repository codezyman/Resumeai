const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional']
  },
  preview: {
    type: String,
    required: true // URL to preview image
  },
  config: {
    layout: {
      type: String,
      enum: ['single-column', 'two-column', 'three-column'],
      default: 'single-column'
    },
    colors: {
      primary: { type: String, default: '#3B82F6' },
      secondary: { type: String, default: '#6B7280' },
      accent: { type: String, default: '#10B981' }
    },
    fonts: {
      heading: { type: String, default: 'Inter' },
      body: { type: String, default: 'Inter' }
    },
    spacing: {
      section: { type: Number, default: 20 },
      item: { type: Number, default: 10 }
    }
  },
  sections: [{
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    order: { type: Number, required: true },
    style: {
      heading: String,
      content: String
    }
  }],
  premium: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  usage: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better performance
templateSchema.index({ category: 1, active: 1 });
templateSchema.index({ premium: 1, active: 1 });

module.exports = mongoose.model('Template', templateSchema);