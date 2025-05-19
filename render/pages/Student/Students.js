class StudentList extends ListManager{
    constructor(fetchFunction){
        super(fetchFunction);
        this.student_list_container = ".students-list";
        this.student_delete_btn = ".delete-btn";
        this.student_item = ".student-item";
        this.search_box = ".search-input";
    }

    bindStudentListners(){
        document.querySelectorAll(this.student_item).forEach((student) => {
            student.querySelector(".student-info").addEventListener('click', async(e) => {
                await window.electronAPI.navigateTo(e.currentTarget.dataset.nav);
            });

            student.querySelector(this.student_delete_btn).addEventListener('click', async(e) => {
                console.log(e.currentTarget.dataset.studentid);
                var userConfromation = confirm("Are you sure want do delete this Student ??")
                if(!userConfromation){
                return;
                }
            
                try {
                var result = await window.studentAPI.delete(e.currentTarget.dataset.studentid);

                if(result.error){
                    throw new Error(result.error);
                }
                } catch (error) {
                alert(error.message);
                }
            
                location.reload();
            })
        });
    }

    async renderStudentList(given_searchString = " "){

        var student_list = await super.generateRenderList(given_searchString);

        console.log(student_list);

        if(student_list.length === 0){
            document.querySelector(this.student_list_container).innerHTML = "<h1> No student found</h1>";
            return
        }

        var student_element = [];

        student_list.forEach(student => {
            student_element.push(` <div class="student-item">
                <div class="student-info"  data-nav="studentinfo/${student.id}" >
                    <div class="student-main">
                        <h3 class="student-name">${student.name}</h3>
                        <span class="reg-no">${student.registration_number}</span>
                    </div>
                    <div class="student-details">
                        <span class="detail-item">
                            <span class="detail-label">Session:</span>
                            ${student.session}
                        </span>
                        <span class="detail-item">
                            <span class="detail-label">Course:</span>
                            ${student.course}
                        </span>
                    </div>
                </div>
                <button class="delete-btn" data-studentId="${student.id}">&times;</button>
            </div>`);
        });

        document.querySelector(this.student_list_container).innerHTML = student_element.join(" ");
        this.bindStudentListners();
    };
};


var StudentPage = new StudentList(window.studentAPI.getAll);
StudentPage.renderStudentList();

document.querySelector(StudentPage.search_box).addEventListener('keyup', async (e) => {
  await StudentPage.renderStudentList(e.target.value);
});

document.querySelector(StudentPage.search_box).addEventListener('search', async (e) => {
  await StudentPage.renderStudentList(e.target.value);
});