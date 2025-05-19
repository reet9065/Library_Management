const { ipcMain } = require('electron');
const BorrowedList = require('../Database/Borrowed.js');

ipcMain.handle('borrow:issue', async (_event, studentRegNo, bookIds) => {
  try {
    return await BorrowedList.issueBooks(studentRegNo, bookIds);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('borrow:return', async (_event, studentRegNo, bookId, borrowed_id) => {
  try {
    return await BorrowedList.markReturned(studentRegNo, bookId , borrowed_id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('borrow:getByBookId', async (_event, bookId) => {
  try {
    return await BorrowedList.getByBookId(bookId);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('borrow:getByStudentRegNo', async (_event, studentRegNo) => {
  try {
    return await BorrowedList.getByStudentRegNo(studentRegNo);
  } catch (error) {
    return { error: error.message };
  }
});
