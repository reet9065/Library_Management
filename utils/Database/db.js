const path = require('path');
const { app } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Get user-specific data path (like NeDB)
const dbPath = path.join(app.getPath('userData'), 'smd_library.db');

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

// Create table if not exists (mimicking NeDB document schema)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      author TEXT NOT NULL,
      topic TEXT,
      copies INTEGER DEFAULT 0,
      borrowed INTEGER DEFAULT 0,
      publication_year INTEGER,
      language TEXT
    )
  `);
});

db.serialize(() => {
    db.run(`
  CREATE TABLE IF NOT EXISTS otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    otp TEXT NOT NULL,
    generated_time INTEGER NOT NULL,
    expire_in_seconds INTEGER NOT NULL,
    associated_email TEXT NOT NULL
  )
`);
});

db.serialize(() => {
    db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    fname TEXT NOT NULL,
    mname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    session TEXT NOT NULL,
    course TEXT NOT NULL
  )
`);
});

db.serialize(() => {
    db.run(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    type TEXT DEFAULT 'admin'
  )
`);
});
db.serialize(() => {
    db.run(`
  CREATE TABLE IF NOT EXISTS borrowed_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  student_reg_no TEXT NOT NULL,
  borrowed_date INTEGER NOT NULL,
  returned_date INTEGER
)
`);
});

module.exports = db;
