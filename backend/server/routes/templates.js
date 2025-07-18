const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all templates
router.get('/', async (req, res) => {
  try {
    const { category, premium } = req.query;
    
    const filter = { active: true };
    if (category) filter.category = category;
    if (premium !== undefined) filter.premium = premium === 'true';

    const templates = await Template.find(filter)
      .sort({ usage: -1, createdAt: -1 })
      .select('-__v');

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new template (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();

    res.status(201).json({ 
      message: 'Template created successfully',
      template 
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update template usage
router.patch('/:id/usage', async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { $inc: { usage: 1 } },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Usage updated successfully' });
  } catch (error) {
    console.error('Update usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;