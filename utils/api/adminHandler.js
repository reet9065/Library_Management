// main/ipc/adminHandlers.js
const { ipcMain } = require('electron');
const { Admin } = require('../Database/Admin.js');


ipcMain.handle('admin:add', async (_event, adminObj) => {
  try {
    return await Admin.addAdmin(adminObj);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('admin:updatePassword', async (_event, email, newPassword) => {
  try {
    return await Admin.editPasswordByEmail(email, newPassword);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('admin:sendPassword', async (_event, email) => {
  try {
    return await Admin.sendPasswordToEmail(email);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('admin:getByEmail', async (_event, email) => {
  try {
    return await Admin.getAdminByEmail(email);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('admin:getAll', async () => {
  try {
    return await Admin.getAllAdmins();
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('admin:delete', async (_event, id) => {
  try {
    return await Admin.deleteAdminById(id);
  } catch (err) {
    return { error: err.message };
  }
});

