const { sendOtpEmail } = require('../otpSender');
const db = require('./db.js');

function generateRandomOtp(length = 6) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

class Otp {
  static generate(email, expireInSeconds = 300) {
    return new Promise((resolve, reject) => {
      if (!email || email.trim() === '') return reject(new Error("Email is required."));
      email = email.trim();

      // Delete existing OTPs for the same email
      db.run(`DELETE FROM otps WHERE associated_email = ?`, [email], function (err) {
        if (err) return reject(new Error(err.message));

        const otp = generateRandomOtp();
        const generatedTime = Date.now();

        db.run(
          `INSERT INTO otps (otp, generated_time, expire_in_seconds, associated_email) VALUES (?, ?, ?, ?)`,
          [otp, generatedTime, expireInSeconds, email],
          function (err) {
            if (err) return reject(new Error(err.message));

            sendOtpEmail(email, otp)
              .then(() => {
                resolve({ message: "OTP sent successfully", email});
              })
              .catch(mailError => {
                reject(new Error("OTP saved but email failed: " + mailError.message));
              });
          }
        );
      });
    });
  }

  static validate(inputOtp, email) {
    return new Promise((resolve, reject) => {
      if (!inputOtp || inputOtp.trim() === '') {
        return reject({
          errorCode: "EMPTY_OTP",
          message: "OTP cannot be empty."
        });
      }
  
      if (!email || email.trim() === '') {
        return reject({
          errorCode: "EMPTY_EMAIL",
          message: "Email is required."
        });
      }
  
      db.get(
        `SELECT * FROM otps WHERE otp = ? AND associated_email = ?`,
        [inputOtp.trim(), email.trim()],
        (err, row) => {
          if (err) return reject({
            errorCode: "DB_ERROR",
            message: err.message
          });
  
          if (!row) return reject({
            errorCode: "INVALID_OTP",
            message: "Invalid OTP or email. Try agin !!"
          });
  
          const now = Date.now();
          const expiryTime = row.generated_time + (row.expire_in_seconds * 1000);
  
          if (now > expiryTime) {
            db.run(`DELETE FROM otps WHERE id = ?`, [row.id]);
            return reject({
              errorCode: "EXPIRED_OTP",
              message: "OTP has expired. Please resend it"
            });
          }
  
          db.run(`DELETE FROM otps WHERE id = ?`, [row.id]);
          resolve({
            valid: true,
            email: row.associated_email
          });
        }
      );
    });
  }
  
}

module.exports = { Otp };