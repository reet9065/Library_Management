const params = new URLSearchParams(window.location.search);

async function sendOtp(email) {
    try {
      var response =  await window.otpAPI.generate(email);
      
      if(response.error){
        throw new Error(response.error);
      }
      alert(`${response.message} to ${response.email}`);
    } catch (error) {
      alert(error);
    }
}sendOtp(params.get("email"));