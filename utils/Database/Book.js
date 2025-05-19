const db = require('./db.js');

function validateBookData(book) {
  const errors = [];
  const copies = book.copies !== undefined ? parseInt(book.copies) : 0;
  const borrowed = book.borrowed !== undefined ? parseInt(book.borrowed) : 0;
  const publicationYear = book.publication_year
    ? parseInt(book.publication_year)
    : null;

  if (!book.name || book.name.trim() === '') errors.push('Book name is required.');
  if (!book.author || book.author.trim() === '') errors.push('Author name is required.');
  if (isNaN(copies) || copies < 0) errors.push('Copies must be a non-negative number.');
  if (isNaN(borrowed) || borrowed < 0) errors.push('Borrowed must be a non-negative number.');
  if (borrowed > copies) errors.push('Borrowed copies cannot exceed total copies.');
  if (publicationYear !== null && (isNaN(publicationYear) || publicationYear < 0))
    errors.push('Publication year must be a valid year.');

  return {
    isValid: errors.length === 0,
    errors,
    validatedData: {
      name: book.name?.trim(),
      author: book.author?.trim(),
      topic: book.topic || null,
      copies,
      borrowed,
      publication_year: publicationYear,
      language: book.language || null,
      id: book._id || null, // SQLite uses `id`, so map it
    },
  };
}

class Book {
  static add(bookObj) {
    return new Promise((resolve, reject) => {
      const { isValid, errors, validatedData } = validateBookData(bookObj);
      if (!isValid) return reject(new Error(errors.join(', ')));

      const { name, publication_year } = validatedData;

      db.get(
        `SELECT * FROM books WHERE name = ? AND publication_year = ?`,
        [name, publication_year],
        (err, existing) => {
          if (err) return reject(new Error(err.message));
          if (existing) return reject(new Error('A book with the same name and publication year already exists.'));

          db.run(
            `INSERT INTO books (name, author, topic, copies, borrowed, publication_year, language)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              validatedData.name,
              validatedData.author,
              validatedData.topic,
              validatedData.copies,
              validatedData.borrowed,
              validatedData.publication_year,
              validatedData.language
            ],
            function (err) {
              if (err) return reject(new Error(err.message));
              resolve({ id: this.lastID, ...validatedData });
            }
          );
        }
      );
    });
  }

  static getAllBooks() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM books`, [], (err, rows) => {
        if (err) return reject(new Error(err.message));
        resolve(rows);
      });
    });
  }

  static getBookById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM books WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(new Error(err.message));
        if (!row) return reject(new Error('Book not found'));
        resolve(row);
      });
    });
  }

  static update(bookObj) {
    return new Promise((resolve, reject) => {
      const { isValid, errors, validatedData } = validateBookData(bookObj);
      if (!isValid) return reject(new Error(errors.join(', ')));
      if (!validatedData.id) return reject(new Error('Book ID is required for update'));

      db.run(
        `UPDATE books SET name = ?, author = ?, topic = ?, copies = ?, borrowed = ?, publication_year = ?, language = ?
         WHERE id = ?`,
        [
          validatedData.name,
          validatedData.author,
          validatedData.topic,
          validatedData.copies,
          validatedData.borrowed,
          validatedData.publication_year,
          validatedData.language,
          validatedData.id
        ],
        function (err) {
          if (err) return reject(new Error(err.message));
          resolve({ updated: this.changes > 0 });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM books WHERE id = ?`, [id], function (err) {
        if (err) return reject(new Error(err.message));
        resolve({ deleted: this.changes > 0 });
      });
    });
  }

  static getTotalCount() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM books`, [], (err, row) => {
        if (err) return reject(new Error(err.message));
        resolve(row.count);
      });
    });
  }

  static incrementBorrowed(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM books WHERE id = ?`, [id], (err, book) => {
        if (err) return reject(new Error(err.message));
        if (!book) return reject(new Error("Book not found."));
        if (book.borrowed >= book.copies)
          return reject(new Error("No more copies available to borrow."));

        db.run(`UPDATE books SET borrowed = borrowed + 1 WHERE id = ?`, [id], function (err) {
          if (err) return reject(new Error(err.message));
          resolve({ updated: this.changes > 0 });
        });
      });
    });
  }

  static decrementBorrowed(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM books WHERE id = ?`, [id], (err, book) => {
        if (err) return reject(new Error(err.message));
        if (!book) return reject(new Error("Book not found."));
        if (book.borrowed <= 0)
          return reject(new Error("No borrowed copies to return."));

        db.run(`UPDATE books SET borrowed = borrowed - 1 WHERE id = ?`, [id], function (err) {
          if (err) return reject(new Error(err.message));
          resolve({ updated: this.changes > 0 });
        });
      });
    });
  }
}

module.exports = { Book };
