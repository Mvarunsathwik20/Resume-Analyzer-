const fs = require('fs');
const util = require('util');
const pdfExtract = require('../services/pdfExtract');
const openaiClient = require('../services/openaiClient');
const emailService = require('../services/email');

const unlink = util.promisify(fs.unlink);

module.exports = async function (req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const text = await pdfExtract.extractText(filePath);
    // Call AI functions
    const classification = await openaiClient.classifyDomain(text);
    const skills = await openaiClient.extractSkills(text);
    const feedback = await openaiClient.generateFeedback(text, skills, classification);

    const report = {
      domain: classification,
      skills,
      feedback
    };

    // Optionally send email if email provided
    if (req.body.email) {
      await emailService.sendReport(req.body.email, report);
    }

    // clean up uploaded file
    await unlink(filePath).catch(() => {});

    return res.json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Analysis failed', details: err.message });
  }
};


