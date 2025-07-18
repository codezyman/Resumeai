const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .populate('templateId', 'name preview category')
      .sort({ updatedAt: -1 });

    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('templateId');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new resume
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id // Attach the user ID from the auth middleware
    };

    const resume = new Resume(resumeData);
    await resume.save();

    const populatedResume = await Resume.findById(resume._id)
      .populate('templateId', 'name preview category');

    res.status(201).json({ 
      message: 'Resume created successfully',
      resume: populatedResume 
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('templateId');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ 
      message: 'Resume updated successfully',
      resume 
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;