var addBookForm = new FormControler(".addStudentForm");

document.querySelector(".addStudentForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    let formData = addBookForm.getFormData();
    console.log(formData);

    try {
      var result = await window.studentAPI.add(formData);

      if(result.error){
        throw new Error(result.error);
      }

      alert("A new Student added sucessfully !!");
      await window.electronAPI.navigateTo("students");
    } catch (error) {
      alert(error);
    }
})