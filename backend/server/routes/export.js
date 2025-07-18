const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();

// Export resume as PDF
router.post('/pdf/:resumeId', auth, async (req, res) => {
  let browser;
  
  try {
    // Get resume data
    const resume = await Resume.findOne({ 
      _id: req.params.resumeId, 
      userId: req.user._id 
    }).populate('templateId');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Generate HTML from resume data
    const htmlContent = generateResumeHTML(resume);
    
    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
        right: '0.5in'
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Failed to export PDF' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Generate HTML for resume
function generateResumeHTML(resume) {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;
  const template = resume.templateId;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #333;
          font-size: 12px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid ${template.config.colors.primary};
        }
        
        .name {
          font-size: 28px;
          font-weight: bold;
          color: ${template.config.colors.primary};
          margin-bottom: 10px;
        }
        
        .contact-info {
          font-size: 11px;
          color: #666;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: ${template.config.colors.primary};
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        
        .experience-item, .education-item, .project-item {
          margin-bottom: 15px;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        
        .item-title {
          font-weight: bold;
          color: #333;
        }
        
        .item-company {
          color: ${template.config.colors.secondary};
          font-style: italic;
        }
        
        .item-date {
          color: #666;
          font-size: 11px;
        }
        
        .item-description {
          margin-top: 5px;
          color: #555;
        }
        
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .skill-category {
          flex: 1;
          min-width: 200px;
        }
        
        .skill-category-title {
          font-weight: bold;
          color: ${template.config.colors.primary};
          margin-bottom: 5px;
        }
        
        .skill-items {
          color: #555;
        }
        
        .summary {
          text-align: justify;
          color: #555;
          margin-bottom: 20px;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
          <div class="contact-info">
            ${personalInfo.email} | ${personalInfo.phone || ''} | ${personalInfo.location || ''}
            ${personalInfo.linkedin ? `| LinkedIn: ${personalInfo.linkedin}` : ''}
            ${personalInfo.github ? `| GitHub: ${personalInfo.github}` : ''}
          </div>
        </div>
        
        <!-- Summary -->
        ${personalInfo.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${personalInfo.summary}</div>
          </div>
        ` : ''}
        
        <!-- Experience -->
        ${experience.length > 0 ? `
          <div class="section">
            <div class="section-title">Professional Experience</div>
            ${experience.map(exp => `
              <div class="experience-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${exp.position}</div>
                    <div class="item-company">${exp.company}, ${exp.location || ''}</div>
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <ul style="margin-top: 5px; padding-left: 20px;">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Education -->
        ${education.length > 0 ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
              <div class="education-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                    <div class="item-company">${edu.institution}, ${edu.location || ''}</div>
                  </div>
                  <div class="item-date">
                    ${edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>
                </div>
                ${edu.gpa ? `<div class="item-description">GPA: ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Skills -->
        ${skills.length > 0 ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-grid">
              ${skills.map(skill => `
                <div class="skill-category">
                  <div class="skill-category-title">${skill.category}</div>
                  <div class="skill-items">${skill.items.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Projects -->
        ${projects.length > 0 ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(project => `
              <div class="project-item">
                <div class="item-header">
                  <div class="item-title">${project.name}</div>
                  <div class="item-date">
                    ${project.startDate ? formatDate(project.startDate) : ''} - ${project.endDate ? formatDate(project.endDate) : 'Present'}
                  </div>
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.technologies && project.technologies.length > 0 ? `
                  <div style="margin-top: 5px; color: #666;">
                    <strong>Technologies:</strong> ${project.technologies.join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Certifications -->
        ${certifications.length > 0 ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${certifications.map(cert => `
              <div class="certification-item">
                <div class="item-header">
                  <div class="item-title">${cert.name}</div>
                  <div class="item-date">${cert.date ? formatDate(cert.date) : ''}</div>
                </div>
                ${cert.issuer ? `<div class="item-company">${cert.issuer}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });
}

module.exports = router;