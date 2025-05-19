require('./utils/api/adminHandler');
require('./utils/api/bookHandler');
require('./utils/api/otpHandler');
require('./utils/api/studentHandler');
require('./utils/api/borrowedHandler.js');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {Admin} = require("./utils/Database/Admin.js");
const { Otp } = require('./utils/Database/Otp.js');
const prompt = require('electron-prompt');


let win;
var AdminSingupData = null;
var LogedIn = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences:{
      preload: path.join(__dirname,'render/IPC/preload.js'),
      contextIsolation:true
    },

  })
  win.setMenu(null);
  win.loadFile(path.join(__dirname,"./render/pages/Login/Login.html"));
//   win.webContents.openDevTools();

}

app.whenReady().then(() => {
  createWindow();

  function gotoOtpPage(email) {
   if(!email || !AdminSingupData || email.trim() !== AdminSingupData.email){
      win.loadFile(path.join(__dirname,"./render/pages/Singup/Singup.html"));
      return;
   }

   win.loadFile(path.join(__dirname,"./render/pages/Otp/Otp.html"),{
      query:{
         email:email
      }
   });

  }

  ipcMain.handle('show-prompt', async (event, { title, label }) => {
   try {
     const result = await prompt({
       title,
       label,
       inputAttrs: {
         type: 'text'
       },
       type: 'input'
     });
     return result; // this is the input from the user
   } catch (error) {
     return null; // user canceled or error occurred
   }
 });

  ipcMain.handle('admin:singup' , async (_event,singupCredantial) => {
  
    try {
       var admin = await Admin.getAdminByEmail(singupCredantial.email);
       console.log("Call aaya " , admin)
      return {error: "Email already exists !!!"};
    } catch (error) {
      AdminSingupData = singupCredantial;
      console.log(AdminSingupData);
      gotoOtpPage(AdminSingupData.email);
    }
  
  })

  ipcMain.handle('otp:validate', async (_event, otpObj) => {
      try {
         var {email , otp} = otpObj;
         var validate = await Otp.validate(otp, email);
         var admin = await Admin.addAdmin({
            email : AdminSingupData.email,
            password : AdminSingupData.password,
         })

         AdminSingupData = null;
         return validate;

      } catch (error) {
      return {error : error};
      }
   });

   function checkForLogedIn(){
      if(LogedIn !== null){
         return true;
      }
      win.loadFile(path.join(__dirname,"./render/pages/Login/Login.html"));
      return false;
   }

   ipcMain.handle('admin:login', async (_event, email, password) => {
      try {
         var validateUser = await Admin.verifyCredentials(email, password);
         LogedIn = validateUser;
         console.log(validateUser);
         return {};
      } catch (err) {
        return { error: err.message };
      }
   });

   ipcMain.handle('logout', async (_event) => {
      LogedIn = null;
      win.loadFile(path.join(__dirname,"./render/pages/Login/Login.html"));
   });


  

  ipcMain.handle("navigate-to", async(event, route) => {

    var navigateto = route.split('/');
    console.log(navigateto[0]);
    if(navigateto[0] !=='login' && navigateto[0] !== 'singup' && navigateto[0] !== 'otp'){
      console.log("checking for loging")
      if(!checkForLogedIn()){
         return;
      }
    }else{
      if(checkForLogedIn()){
         return;
      }
    }

    switch (navigateto[0]) {
      case "login":
         win.loadFile(path.join(__dirname,"./render/pages/Login/Login.html"));
         return;
      case "singup":
         win.loadFile(path.join(__dirname,"./render/pages/Singup/Singup.html"));
         return;
      case "otp":
         gotoOtpPage(navigateto[1]);
         return;
      case "home":
         win.loadFile(path.join(__dirname,"./render/pages/Home/Home.html"));
         return;
      case "students":
         win.loadFile(path.join(__dirname,"./render/pages/Student/Students.html"));
         return;
      case "issuebooks":
         win.loadFile(path.join(__dirname,"./render/pages/Student/subnav/Issuebook/issuebooks.html"),{
            query:{
               id:navigateto[1],
               studentreg:navigateto[2],
               studentname:navigateto[2]
            }
         });
         return;
      case "books":
         win.loadFile(path.join(__dirname,"./render/pages/Book/Books.html"));
         return;
      case "addbook":
         win.loadFile(path.join(__dirname,"./render/pages/Book/subnav/addbook/addbook.html"));
         return;
      case "editbook":
         win.loadFile(path.join(__dirname,"./render/pages/Book/subnav/editbook/editbook.html"),{
            query:{
               id:navigateto[1]
            }
         });
         return;
      case "addstudent":
         win.loadFile(path.join(__dirname,"./render/pages/Student/subnav/addstudent/addstudent.html"));
         return;
      case "editstudent":
         win.loadFile(path.join(__dirname,"./render/pages/Student/subnav/editstudent/editstudent.html"),{
            query:{
               id:navigateto[1]
            }
         });
         return;
      case "bookinfo":
         console.log("Navigated to book id : ",navigateto[1])
         win.loadFile(path.join(__dirname,"./render/pages/Book/subnav/bookinfo/bookinfo.html"),{
            query:{
               id: navigateto[1]
            }
         });
         return;
      case "studentinfo":
         console.log("Navigated to student id : ",navigateto[1])
         win.loadFile(path.join(__dirname,"./render/pages/Student/subnav/studentinfo/studentinfo.html"),{
            query:{
               id: navigateto[1]
            }
         });
         return;
      default:
        break;
    }
  });

 

})

app.on('before-quit', (event) => {

   console.log('App is about to quit');
   LogedIn = null;
});
