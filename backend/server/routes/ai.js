const express = require('express');
const auth = require('../middleware/auth');
// const axios = require('axios'); // No longer needed for Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// AI Service abstraction layer
class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai'; // or 'gemini'
  }

  async generateSummary(personalInfo, experience, skills) {
    // This will be implemented based on the chosen AI provider
    try {
      const prompt = this.buildSummaryPrompt(personalInfo, experience, skills);
      
      if (this.provider === 'openai') {
        return await this.callOpenAI(prompt);
      } else if (this.provider === 'gemini') {
        return await this.callGemini(prompt);
      }
      
      throw new Error('No AI provider configured');
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  async enhanceAchievements(achievements, jobTitle) {
    try {
      const prompt = this.buildAchievementsPrompt(achievements, jobTitle);
      
      if (this.provider === 'openai') {
        return await this.callOpenAI(prompt);
      } else if (this.provider === 'gemini') {
        return await this.callGemini(prompt);
      }
      
      throw new Error('No AI provider configured');
    } catch (error) {
      console.error('AI enhancement error:', error);
      throw error;
    }
  }

  buildSummaryPrompt(personalInfo, experience, skills) {
    // Custom prompt for Gemini
    return `You are a professional resume writer. Write a concise, impactful professional summary for the following candidate. Focus on their strengths, experience, and what makes them stand out. Use a confident, positive tone.

Candidate Info:
Name: ${personalInfo.firstName || ''} ${personalInfo.lastName || ''}
Experience: ${experience.map(exp => `${exp.position || ''} at ${exp.company || ''}`).join(', ')}
Skills: ${skills.map(skill => skill.items.join(', ')).join(', ')}

Summary:`;
  }

  buildAchievementsPrompt(achievements, jobTitle) {
    return `Enhance these professional achievements for a ${jobTitle} position:
    
    ${achievements.join('\n')}
    
    Make them more impactful by adding specific metrics, action verbs, and quantifiable results where appropriate.`;
  }

  async callOpenAI(prompt) {
    // Placeholder for OpenAI API call
    // Implementation will be added when API key is configured
    return {
      success: false,
      message: 'OpenAI API not configured. Please add your API key to environment variables.'
    };
  }

  async callGemini(prompt) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          message: 'Gemini API key not configured. Please add your API key to environment variables.'
        };
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use the model name you have access to, e.g., "gemini-1.5-flash" or "gemini-1.5-pro-latest"
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const summary = result.response.text();
      return {
        success: true,
        summary
      };
    } catch (error) {
      console.error('Gemini API error:', error.message || error);
      return {
        success: false,
        message: 'Gemini API error: ' + (error.message || error)
      };
    }
  }
}

const aiService = new AIService();

// Generate professional summary
router.post('/summary', auth, async (req, res) => {
  try {
    const { personalInfo, experience, skills } = req.body;
    
    const result = await aiService.generateSummary(personalInfo, experience, skills);
    
    res.json({
      success: true,
      summary: result.summary || 'AI service not configured',
      message: result.message
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate summary' 
    });
  }
});

// Enhance achievements
router.post('/achievements', auth, async (req, res) => {
  try {
    const { achievements, jobTitle } = req.body;
    
    const result = await aiService.enhanceAchievements(achievements, jobTitle);
    
    res.json({
      success: true,
      achievements: result.achievements || achievements,
      message: result.message
    });
  } catch (error) {
    console.error('Achievement enhancement error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to enhance achievements' 
    });
  }
});

// Get AI configuration status
router.get('/status', auth, async (req, res) => {
  try {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasGemini = !!process.env.GEMINI_API_KEY;
    
    res.json({
      configured: hasOpenAI || hasGemini,
      providers: {
        openai: hasOpenAI,
        gemini: hasGemini
      },
      current: process.env.AI_PROVIDER || 'none'
    });
  } catch (error) {
    console.error('AI status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;