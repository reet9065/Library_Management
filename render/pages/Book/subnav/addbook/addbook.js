const form = document.querySelector("form");

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
  
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
  
    return data;
}
  

form.addEventListener("submit", async(e) => {
    e.preventDefault();
    let formData = getFormData(form);
    console.log(formData);

    try {
      var result = await window.bookAPI.add(formData);

      if(result.error){
        throw new Error(result.error);
      }

      alert("Book added sucessfully !!");
      await window.electronAPI.navigateTo("books");
    } catch (error) {
      alert(error);
    }
    
})