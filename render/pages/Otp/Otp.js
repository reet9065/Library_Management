
const form = document.getElementById("otp-form");
const otpInput = document.getElementById("otp-input");
const errorMessage = document.getElementById("error-message");
const resendBtn = document.getElementById("resend-btn");

// Form submission
form.addEventListener("submit", async(e) => {
  e.preventDefault();
  
  console.log(otpInput.value.trim());

  try {
    
    var respons = await window.otpAPI.validate({
      email : params.get("email").trim(),
      otp: otpInput.value.trim()
    });

    if(respons.error){
      throw new Error(respons.error);
    }

    await window.electronAPI.navigateTo('login');

  } catch (error) {

    if(error.errorCode !== 'DB_ERROR'){
      alert(error.message);
    }

    alert("Server Error :: Please try after some time");
  }
});

// Resend OTP click
resendBtn.addEventListener("click", async() => {
  console.log("Resend request");
  await sendOtp(params.get("email"));
});
