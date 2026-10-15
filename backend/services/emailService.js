const nodemailer = require('nodemailer');

// Initialize Transporter with Environment variables or Auto-Generated Test Ethereal Account
let transporter;

const initTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate Zero-Config Ethereal Test Account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('[EmailService] Initialized Ethereal SMTP Transporter. Test account:', testAccount.user);
  }
};

initTransporter().catch(err => console.error('[EmailService] Transport Init Error:', err));

const sendCandidateEmail = async ({ toEmail, candidateName, subject, message, decision }) => {
  try {
    if (!transporter) {
      await initTransporter();
    }

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 16px; padding: 24px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 24px;">Interview<span style="color: #a855f7;">Pro</span> AI</h2>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Talent Acquisition & Assessment Portal</p>
        </div>

        <h3 style="color: #1e293b; font-size: 18px;">Assessment Update for ${candidateName}</h3>
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 16px 0; border-radius: 8px;">
          <p style="color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-line; margin: 0;">
            ${message}
          </p>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 11px;">
          <p>© 2026 InterviewPro AI Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"InterviewPro Talent Team" <noreply@interviewpro.ai>',
      to: toEmail,
      subject: subject || `InterviewPro Hiring Assessment Update - ${decision || 'Update'}`,
      text: message,
      html: htmlTemplate
    });

    console.log('[EmailService] Real Email Dispatched! MessageId:', info.messageId);
    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      console.log('[EmailService] Preview Dispatched Email at:', testUrl);
    }

    return { success: true, messageId: info.messageId, previewUrl: testUrl };
  } catch (error) {
    console.error('[EmailService] Failed to dispatch email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendCandidateEmail
};
