const params = new URLSearchParams(window.location.search);

// var Editor_form = new FormControler(".addStudentForm");

class EditFormStudent extends FormControler{

    constructor(studentID, form_selector){
        super(form_selector);
        this.studentID = studentID;
        this.back_btn = ".back-btn";
        this.init();
    }

    async init(){
        await this.setStudentFormData();
        await this.#bindListners();
        console.log(this.formselector);
    }

    async #bindListners(){
        document.querySelector(this.formselector).addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                var editedData = super.getFormData();
                editedData._id = this.studentID;
                var result = await window.studentAPI.update(editedData);

                if(result.error){
                    throw new Error(`${result.error} :: unabel to edit form data`);
                }
                
                alert("Student updated succesfully !!");
                await window.electronAPI.navigateTo(`studentinfo/${this.studentID}`);           
                
            } catch (error) {
                alert(error);
            }
        })
    }

    async setStudentFormData(){

        try {
            var student = await window.studentAPI.getById(this.studentID);
            console.log(student);
            if(student.error){
                throw Error(`${student.error} :: Error while editing this Student Info`);
            }

            super.setFormData(student);
        } catch (error) {
            alert(error);
            await window.electronAPI.navigateTo(`studentinfo/${this.studentID}`);           
        }
    }
}

var StudentEditForm = new EditFormStudent(params.get('id'),".addStudentForm");