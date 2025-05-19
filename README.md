# 📚 SMD Library Management System

A desktop-based Library Management System developed using **Electron.js**, **Node.js**, and **SQLite**, built as part of a BCA final year project. The system offers core features such as admin login, book management, user authentication, and OTP-based verification. This README provides instructions to run the project from the source code.

---

## 🛠️ How to Run the Project

### Requirements

- Node.js must be installed  
  👉 Download from: https://nodejs.org/

### Steps to Run

1. **Open Command Prompt or Terminal**

2. **Navigate to the project directory**  
   Example:
   ```bash
   cd Library_Management\
   ```

3. **Install project dependencies**
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm start
   ```

This will launch the desktop application using Electron and Node.js.

---

## 📨 Email OTP Setup (Optional)

The application includes an OTP system that sends verification emails.

1. Open this file in a code editor:  
   `Library_Management/utils/otpSender.js`

2. Edit the following lines:
   ```js
   user: "<your_email>",
   pass: "<your_app_password>",
   ```
   Replace `<your_email>` with your Gmail address, and `<your_app_password>` with your [app-specific password](https://myaccount.google.com/apppasswords).

3. Save the file. Email OTP functionality will now be active.

---

## 🧪 Test Admin Credentials

You can use the following credentials to log in as admin:
```
Email:    rit906570@gmail.com
Password: 1234
```

---

## 🗃️ Using the Pre-Filled Database

To use the provided SQLite database with test data:

1. Locate the installed database at:
   ```
   C:\Users\<your_username>\AppData\Roaming\SMD_Library_Managment\smd_library.db
   ```

2. Replace it with the provided database file (`smd_library.db`) from the source code folder.

---

## 🔗 Notes

- Ensure you are connected to the internet for OTP functionality.
- Built using Electron.js, Node.js, and SQLite.
- Works as a desktop application on Windows.
