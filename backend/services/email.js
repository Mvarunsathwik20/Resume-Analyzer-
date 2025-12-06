const nodemailer = require('nodemailer');

async function sendReport(toEmail, report) {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured, skipping email send');
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const html = `<h2>Resume Analysis Report</h2>
  <p><strong>Domain:</strong> ${report.domain}</p>
  <p><strong>Skills:</strong> ${Array.isArray(report.skills) ? report.skills.join(', ') : report.skills}</p>
  <h3>Feedback</h3>
  <p><strong>Strengths:</strong> ${(report.feedback.strengths || []).join(', ')}</p>
  <p><strong>Weaknesses:</strong> ${(report.feedback.weaknesses || []).join(', ')}</p>
  <p><strong>Improvements:</strong> ${(report.feedback.improvements || []).join('; ')}</p>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Your Resume Analysis Report',
    html
  });
}

module.exports = { sendReport };


