const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bookAPI', {
  add: (book) => ipcRenderer.invoke('book:add', book),
  getAll: () => ipcRenderer.invoke('book:getAll'),
  getById: (id) => ipcRenderer.invoke('book:getById', id),
  update: (book) => ipcRenderer.invoke('book:update', book),
  delete: (id) => ipcRenderer.invoke('book:delete', id),
  getTotalCount: () => ipcRenderer.invoke('book:totalCount'),
  incrementBorrowed: async (id) => {
    return await ipcRenderer.invoke('book:incrementBorrowed', id);
  },
  decrementBorrowed: async (id) => {
    return await ipcRenderer.invoke('book:decrementBorrowed', id);
  },
});

contextBridge.exposeInMainWorld('studentAPI', {
  add: (student) => ipcRenderer.invoke('student:add', student),
  getAll: () => ipcRenderer.invoke('student:getAll'),
  getById: (id) => ipcRenderer.invoke('student:getById', id),
  getByRegistrationNo: (regno) => ipcRenderer.invoke('student:getByRegNo', regno),
  update: (student) => ipcRenderer.invoke('student:update', student),
  delete: (id) => ipcRenderer.invoke('student:delete', id),
  getTotalCount: () => ipcRenderer.invoke('student:totalCount'),
});

contextBridge.exposeInMainWorld('otpAPI', {
  generate: (email, expireInSeconds = 300) => ipcRenderer.invoke('otp:generate', email, expireInSeconds),
  validate: (otp) => ipcRenderer.invoke('otp:validate', otp)
});

contextBridge.exposeInMainWorld('adminAPI', {
  add: (adminObj) => ipcRenderer.invoke('admin:add', adminObj),
  singup: (singupObj) => ipcRenderer.invoke('admin:singup', singupObj),
  updatePassword: (email, newPassword) => ipcRenderer.invoke('admin:updatePassword', email, newPassword),
  sendPassword: (email) => ipcRenderer.invoke('admin:sendPassword', email),
  getByEmail: (email) => ipcRenderer.invoke('admin:getByEmail', email),
  getAll: () => ipcRenderer.invoke('admin:getAll'),
  delete: (id) => ipcRenderer.invoke('admin:delete', id),
  verify: (email, password) => ipcRenderer.invoke('admin:login', email, password),
});

contextBridge.exposeInMainWorld('borrowedAPI', {
  issueBooks : async(studentRegNo, bookIds) => ipcRenderer.invoke('borrow:issue', studentRegNo,bookIds),
  getByStudentRegNo : async(studentRegNo) => ipcRenderer.invoke('borrow:getByStudentRegNo', studentRegNo),
  markReturned : async(studentRegNo, bookId, borrowedId) => ipcRenderer.invoke('borrow:return', studentRegNo,bookId, borrowedId),
  getByBookId : async(bookId) => ipcRenderer.invoke('borrow:getByBookId', bookId),
})
contextBridge.exposeInMainWorld('electronAPI', {
  navigateTo : async(route) => ipcRenderer.invoke('navigate-to', route),
  logout : async(route) => ipcRenderer.invoke('logout', route),
  showPrompt: (title, label) => ipcRenderer.invoke('show-prompt', {title,label}),
})