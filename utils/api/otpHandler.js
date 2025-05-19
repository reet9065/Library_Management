// main/ipc/otpHandlers.js
const { ipcMain } = require('electron');
const { Otp } = require('../Database/Otp.js'); // ✅ Ensure this path is correct

ipcMain.handle('otp:generate', async (_event, email, expireInSeconds) => {
  try {
    return await Otp.generate(email, expireInSeconds);
  } catch (error) {
    return { error: error.message };
  }
});

