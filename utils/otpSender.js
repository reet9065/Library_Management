const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 465,
  secure: true,
  auth: {
    user: '<your_email>',
    pass: '<your_app_password>'
  }
});

/**
 * Send an email with either OTP or custom message
 * @param {string} toEmail 
 * @param {string} subject 
 * @param {string} message 
 */
function sendEmail(toEmail, subject, message) {
  const mailOptions = {
    from: '"SMD library" smdlibrary6@gmail.com',
    to: toEmail,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);
      resolve(info);
    });
  });
}

// Wrapper for OTP specifically
function sendOtpEmail(toEmail, otp) {
  const subject = 'Your OTP Code';
  const message = `Your OTP code is: <b>${otp}</b><br>This will expire in 5 minutes.`;
  return sendEmail(toEmail, subject, message);
}

// Wrapper for password reset
function sendPasswordEmail(toEmail, password) {
  const subject = 'Your Admin Password';
  const message = `Your password is: <b>${password}</b><br>Please keep it safe.`;
  return sendEmail(toEmail, subject, message);
}

module.exports = { sendOtpEmail, sendPasswordEmail };
