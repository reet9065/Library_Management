document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const currentType = passwordField.type;

    // Toggle between password and text
    if (currentType === "password") {
      passwordField.type = "text";
      this.textContent = "Hide"; // Change button text to "Hide"
    } else {
      passwordField.type = "password";
      this.textContent = "Show"; // Change button text to "Show"
    }
  });

document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      errorMessage.style.display = "block"; // Show error for invalid email
      return;
    }

    // // Simulate password validation
    // if (password.length < 6) {
    //   errorMessage.style.display = "block"; // Show error for invalid password
    //   return;
    // }

    errorMessage.style.display = "none"; // Hide error if validation passes

    try {
      var result = await window.adminAPI.verify(email, password);

      if(result.error){
        throw new Error(result.error);
      }

      await window.electronAPI.navigateTo("home");
    } catch (error) {
      console.log(error);
      alert(error);
    }
    
  });

  document.getElementById("forgetpass").addEventListener('click', async(e) => {
    try {

      if(!navigator.onLine){
        throw new Error("Error :: Computer need an active internet connection for sending Login password to your email adress")
      }

      var email = await window.electronAPI.showPrompt("SMD_Library","Enter your email");

      if(email.trim() === ""){
        throw new Error("Email shouldn't be Empty !!");
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        throw new Error("Invalid Email !!");
      }

      var result = await window.adminAPI.sendPassword(email.trim());

      if(result.error){
        throw new Error(result.error);
      }

      alert(`Password sent to your email : ${email}`);

    } catch (error) {
      alert(error);
    }
  })
