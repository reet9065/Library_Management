const { ipcMain } = require('electron');
const { Student } = require('../Database/Student');
const BorrowedList = require('../Database/Borrowed');

ipcMain.handle('student:add', async (_event, studentObj) => {
  try {
    return await Student.add(studentObj);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('student:getAll', async () => {
  try {
    return await Student.getAllStudents();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('student:getById', async (_event, id) => {
  try {
    return await Student.getStudentById(id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('student:update', async (_event, studentObj) => {
  try {
    return await Student.update(studentObj);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('student:delete', async (_event, id) => {
  try {
    var student_info = await Student.getStudentById(id);
    var checkFor_borrowed = await BorrowedList.getUnreturnedByStudent(student_info.registration_number);

    if(checkFor_borrowed.length > 0){
      return { error: "You can't delete this student, this student is currently borrowing some books" };
    }

    await BorrowedList.deleteByStudentRegNo(student_info.registration_number);
    
    return await Student.delete(id);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('student:totalCount', async () => {
  try {
    return await Student.getTotalCount();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('student:getByRegNo', async (_event, regNo) => {
  try {
    return await Student.getByRegistrationNo(regNo);
  } catch (error) {
    return { error: error.message };
  }
});
