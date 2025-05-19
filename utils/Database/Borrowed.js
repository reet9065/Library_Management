const db = require('./db.js');
const { Book } = require('./Book');

class BorrowedList {
  static issueBooks(studentRegNo, bookIds) {
    return new Promise(async (resolve, reject) => {
      const borrowedDate = Date.now();

      try {
        for (const bookId of bookIds) {
          await new Promise((res, rej) => {
            db.run(
              `INSERT INTO borrowed_list (book_id, student_reg_no, borrowed_date)
               VALUES (?, ?, ?)`,
              [bookId, studentRegNo, borrowedDate],
              (err) => {
                if (err) return rej(err);
                res();
              }
            );
          });

          await Book.incrementBorrowed(bookId);
        }

        resolve({ success: true });
      } catch (err) {
        reject(new Error('Failed to issue books: ' + err.message));
      }
    });
  }

  static markReturned(studentRegNo, bookId, id) {
    return new Promise((resolve, reject) => {
      const returnedDate = Date.now();

      db.run(
        `UPDATE borrowed_list
         SET returned_date = ?
         WHERE student_reg_no = ? AND book_id = ? AND id = ? AND returned_date IS NULL`,
        [returnedDate, studentRegNo, bookId, id],
        function (err) {
          if (err) return reject(new Error(err.message));
          if (this.changes === 0)
            return reject(new Error('No matching record to update.'));

          Book.decrementBorrowed(bookId)
            .then(() => resolve({ success: true }))
            .catch((err) => reject(new Error('Book update failed: ' + err.message)));
        }
      );
    });
  }
  
  static getByBookId(bookId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM borrowed_list WHERE book_id = ?`,
        [bookId],
        (err, rows) => {
          if (err) return reject(new Error(err.message));
          resolve(rows);
        }
      );
    });
  }

  // Simple: Get all borrowed entries by student registration number
  static getByStudentRegNo(studentRegNo) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM borrowed_list WHERE student_reg_no = ?`,
        [studentRegNo],
        (err, rows) => {
          if (err) return reject(new Error(err.message));
          resolve(rows);
        }
      );
    });
  }

  static getUnreturnedByStudent(studentRegNo) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM borrowed_list WHERE student_reg_no = ? AND returned_date IS NULL`,
        [studentRegNo],
        (err, rows) => {
          if (err) return reject(new Error(err.message));
          resolve(rows);
        }
      );
    });
  }
  
  static getUnreturnedByBookId(bookId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM borrowed_list WHERE book_id = ? AND returned_date IS NULL`,
        [bookId],
        (err, rows) => {
          if (err) return reject(new Error(err.message));
          resolve(rows);
        }
      );
    });
  }
  
  static deleteByStudentRegNo(studentRegNo) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM borrowed_list WHERE student_reg_no = ?`,
        [studentRegNo],
        function (err) {
          if (err) return reject(new Error(err.message));
          resolve({ deleted: this.changes });
        }
      );
    });
  }
  
  static deleteByBookId(bookId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM borrowed_list WHERE book_id = ?`,
        [bookId],
        function (err) {
          if (err) return reject(new Error(err.message));
          resolve({ deleted: this.changes });
        }
      );
    });
  }
  
}

module.exports = BorrowedList;
