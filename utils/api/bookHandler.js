const { ipcMain } = require('electron');
const { Book } = require('../Database/Book');
const BorrowedList = require('../Database/Borrowed');

ipcMain.handle('book:add', async (_event, bookObj) => {
  try {
    return await Book.add(bookObj);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:getAll', async () => {
  try {
    return await Book.getAllBooks();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:getById', async (_event, id) => {
  try {
    return await Book.getBookById(id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:update', async (_event, bookObj) => {
  try {
    return await Book.update(bookObj);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:delete', async (_event, id) => {
  try {
    var checkFor_borrowed = await BorrowedList.getUnreturnedByBookId(id);

    if(checkFor_borrowed.length > 0){
      return { error: "You can't delete this book, this book is borrowed by someone" };
    }

    await BorrowedList.deleteByBookId(id);
    
    return await Book.delete(id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:totalCount', async () => {
  try {
    return await Book.getTotalCount();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:incrementBorrowed', async (_event, id) => {
  try {
    return await Book.incrementBorrowed(id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('book:decrementBorrowed', async (_event, id) => {
  try {
    return await Book.decrementBorrowed(id);
  } catch (error) {
    return { error: error.message };
  }
});
