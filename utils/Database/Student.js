const db = require('./db.js');

function validateStudentData(student) {
  const errors = [];

  const requiredFields = ['name', 'fname', 'mname', 'email', 'phone', 'registration_number', 'session', 'course'];
  requiredFields.forEach(field => {
    if (!student[field] || student[field].toString().trim() === '') {
      errors.push(`${field} is required.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validatedData: {
      id: student._id || null,
      name: student.name?.trim(),
      fname: student.fname?.trim(),
      mname: student.mname?.trim(),
      email: student.email?.trim(),
      phone: student.phone?.trim(),
      registration_number: student.registration_number?.trim(),
      session: student.session?.trim(),
      course: student.course?.trim(),
    }
  };
}

class Student {
  static add(studentObj) {
    return new Promise((resolve, reject) => {
      const validation = validateStudentData(studentObj);
      if (!validation.isValid) return reject(new Error(validation.errors.join(', ')));

      const s = validation.validatedData;

      db.get(
        `SELECT 1 FROM students WHERE email = ? OR phone = ? OR registration_number = ?`,
        [s.email, s.phone, s.registration_number],
        (err, row) => {
          if (err) return reject(err);
          if (row) return reject(new Error('Student with same email, phone, or registration number already exists.'));

          db.run(
            `INSERT INTO students (name, fname, mname, email, phone, registration_number, session, course) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [s.name, s.fname, s.mname, s.email, s.phone, s.registration_number, s.session, s.course],
            function (err) {
              if (err) return reject(err);
              resolve({id: this.lastID,...s});
            }
          );
        }
      );
    });
  }

  static update(studentObj) {
    return new Promise((resolve, reject) => {
      const validation = validateStudentData(studentObj);
      if (!validation.isValid) return reject(new Error(validation.errors.join(', ')));
      if (!validation.validatedData.id) return reject(new Error('Student ID is required for update'));

      const s = validation.validatedData;

      db.get(
        `SELECT 1 FROM students WHERE (email = ? OR phone = ? OR registration_number = ?) AND id != ?`,
        [s.email, s.phone, s.registration_number, s.id],
        (err, row) => {
          if (err) return reject(err);
          if (row) return reject(new Error('Another student with same email, phone, or registration number already exists.'));

          db.run(
            `UPDATE students SET name = ?, fname = ?, mname = ?, email = ?, phone = ?, registration_number = ?, session = ?, course = ? WHERE id = ?`,
            [s.name, s.fname, s.mname, s.email, s.phone, s.registration_number, s.session, s.course, s.id],
            function (err) {
              if (err) return reject(err);
              resolve({ updated: this.changes > 0 });
            }
          );
        }
      );
    });
  }

  static getByRegistrationNo(regNo) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM students WHERE registration_number = ?`,
        [regNo],
        (err, row) => {
          if (err) return reject(new Error('Database error: ' + err.message));
          if (!row) return reject(new Error('Student not found.'));
          resolve(row);
        }
      );
    });
  }
  

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM students WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes > 0 });
      });
    });
  }

  static getStudentById(id) {
    console.log(id)
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM students WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Student not found'));
        resolve(row);
      });
    });
  }

  static getAllStudents() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM students`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getTotalCount() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM students`, [], (err, row) => {
        if (err) return reject(err);
        resolve(row.count);
      });
    });
  }
}

module.exports = { Student };

