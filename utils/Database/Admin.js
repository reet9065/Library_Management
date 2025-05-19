const { sendPasswordEmail } = require('../otpSender.js');
const db = require("./db.js"); // assumed to be sqlite3 with .get/.run/.all callbacks

class Admin {
  static addAdmin({ email, password, status = 'active' }) {
    return new Promise((resolve, reject) => {
      if (!email || !password) return reject(new Error("Email and Password are required."));
      email = email.trim().toLowerCase();

      db.get('SELECT * FROM admins WHERE email = ?', [email], (err, existing) => {
        if (err) return reject(err);
        if (existing) return reject(new Error("Email is already registered."));

        db.get('SELECT COUNT(*) AS total FROM admins', [], (err2, countRow) => {
          if (err2) return reject(err2);
          const type = countRow.total === 0 ? 'superadmin' : 'admin';

          db.run(
            'INSERT INTO admins (email, password, status, type) VALUES (?, ?, ?, ?)',
            [email, password, status, type],
            function (err3) {
              if (err3) return reject(err3);

              db.get('SELECT * FROM admins WHERE id = ?', [this.lastID], (err4, newAdmin) => {
                if (err4) return reject(err4);
                resolve({ message: "Admin created successfully", admin: newAdmin });
              });
            }
          );
        });
      });
    });
  }

  static editPasswordByEmail(email, newPassword) {
    return new Promise((resolve, reject) => {
      if (!email || !newPassword) return reject(new Error("Email and password are required."));
      db.run(
        'UPDATE admins SET password = ? WHERE email = ?',
        [newPassword, email.trim().toLowerCase()],
        function (err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error("Admin not found."));
          resolve({ message: "Password updated successfully." });
        }
      );
    });
  }

  static sendPasswordToEmail(email) {
    return new Promise((resolve, reject) => {
      if (!email) return reject(new Error("Email is required."));
      db.get('SELECT * FROM admins WHERE email = ?', [email.trim().toLowerCase()], async (err, admin) => {
        if (err) return reject(err);
        if (!admin) return reject(new Error("Admin not found."));

        const message = `Your password is: ${admin.password}`;
        try {
          await sendPasswordEmail(email, message);
          resolve({ message: "Password sent to email." });
        } catch (emailErr) {
          reject(new Error("Failed to send email: " + emailErr.message));
        }
      });
    });
  }

  static getAdminByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM admins WHERE email = ?', [email.trim().toLowerCase()], (err, admin) => {
        if (err) return reject(err);
        if (!admin) return reject(new Error("Admin not found."));
        resolve(admin);
      });
    });
  }

  static getAllAdmins() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM admins', [], (err, admins) => {
        if (err) return reject(err);
        resolve(admins);
      });
    });
  }

  static deleteAdminById(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM admins WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return reject(new Error("Admin not found."));
        resolve({ message: "Admin deleted successfully." });
      });
    });
  }

  static verifyCredentials(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || !password) return reject(new Error("Email and password are required."));
      db.get(
        'SELECT * FROM admins WHERE email = ? AND password = ?',
        [email.trim().toLowerCase(), password],
        (err, admin) => {
          if (err) return reject(err);
          if (!admin) return reject(new Error("Invalid email or password."));
          if (admin.status !== "active") return reject(new Error("Admin is inactive."));
          resolve({ message: "Login successful", admin });
        }
      );
    });
  }
}

module.exports = { Admin };
