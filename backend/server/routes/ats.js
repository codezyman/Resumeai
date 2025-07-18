const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper: Score resume text (very basic example)
function scoreResume(text) {
  let score = 0;
  const suggestions = [];
  if (/email|@/.test(text)) score += 20; else suggestions.push('Add your email/contact info.');
  if (/experience|work|employment/i.test(text)) score += 20; else suggestions.push('Add a work experience section.');
  if (/education/i.test(text)) score += 20; else suggestions.push('Add an education section.');
  if (/skills?/i.test(text)) score += 20; else suggestions.push('Add a skills section.');
  if (text.length > 1000) score += 20; else suggestions.push('Expand your resume with more details.');
  return { score, suggestions };
}

// Helper: Get AI suggestions
async function getAISuggestions(text) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return 'AI suggestions unavailable (no API key).';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an ATS resume expert. Analyze the following resume text and provide 3 actionable suggestions to improve its chances of passing an ATS scan.\n\nResume:\n${text}\n\nSuggestions:`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return 'AI suggestions unavailable.';
  }
}

// POST /ats/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    let text = '';
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(fs.readFileSync(file.path));
      text = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await mammoth.extractRawText({ path: file.path });
      text = data.value;
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file type.' });
    }
    // Clean up uploaded file
    fs.unlinkSync(file.path);
    // Score resume
    const { score, suggestions } = scoreResume(text);
    // AI suggestions
    const aiSuggestions = await getAISuggestions(text);
    res.json({ success: true, score, suggestions, aiSuggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process resume.' });
  }
});

module.exports = router; 