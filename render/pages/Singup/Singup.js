
class SingupForm extends FormControler{
  constructor(formSelector){
    super(formSelector);
    this.togglePass = ".toggle-password";
    this.password = document.querySelectorAll(".password");
    this.init();
  }

  async init(){
    await this.bindListner();
  }

  async bindListner(){

    document.querySelectorAll(this.togglePass).forEach((tbtn , i) => {
      tbtn.addEventListener('click', (e) => {
        if (this.password[i].type === "password") {
          this.password[i].type = "text";
          e.target.textContent = "Hide";
        } else {
          this.password[i].type = "password";
          e.target.textContent = "Show";
        }
      })
    })

    document.querySelector(this.formselector).addEventListener('submit', async(e) => {
      e.preventDefault();

      var singupObj = super.getFormData();

      if(singupObj.password !== singupObj.cpassword){
        alert("Password and Confirm Password should be same !!!");
        return;
      }

      console.log(singupObj);

      if(!navigator.onLine){
        alert("Error :: Computer need an active internet connection for validate email via Otp");
        return;
      }

      var result = await window.adminAPI.singup({
        email : singupObj.email.trim(),
        password: singupObj.password.trim(),
      });

      if(result.error){
        alert(result.error);
      }
      
    });


  }

}

var singup = new SingupForm('.login-form');