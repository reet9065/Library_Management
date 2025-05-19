const params = new URLSearchParams(window.location.search);

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
  
    hours = String(hours).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}
  

  
  

  


class StudentInfoPage {
    constructor(studentID){
        this.studentID = studentID;
        this.studen_info_container = ".student-info-section";
        this.student = null;
        this.booklist_container = ".books-list"
        this.init();
    }

    async init(){
        await this.getStudentInfo();
        this.bindListners();
        await this.renderBorrowedList();
    }

    bindListners(){
        var container = document.querySelector(this.studen_info_container);

        container.querySelector(".delete-btn").addEventListener('click', async (e)=> {
            console.log("Delete button Cliked");
            var userConfromation = confirm("Are you sure want do delete this Student ??")
            if(!userConfromation){
            return;
            }
        
            try {
            var result = await window.studentAPI.delete(e.currentTarget.dataset.studentid);
            if(result.error){
                throw new Error(result.error);
            }
            await window.electronAPI.navigateTo('students');
            } catch (error) {
            alert(error.message);
            }
        });

        container.querySelector(".edit-btn").addEventListener('click', async (e)=> {
            await window.electronAPI.navigateTo(`editstudent/${this.studentID}`);           
        });

        container.querySelector(".Assign-btn").addEventListener('click', async (e)=> {
            await window.electronAPI.navigateTo(`issuebooks/${this.studentID}`);   
            console.log("Assign button Cliked");
        });
    }

    async getStudentInfo(){
        try {
            var result = await window.studentAPI.getById(this.studentID);
            console.log(result);
            if(result.error){
                throw new Error(result.error);
            }
            this.student = result;
            this.renderStudentInfoPage();
        } catch (error) {
            this.student = null;
            alert(error);
        }
    }

    renderStudentInfoPage(){
        
        var container = document.querySelector(this.studen_info_container);
        if(!this.student){
            container.innerHTML = `<h1> Student not found </h1>`;
            return;
        }

        container.innerHTML = `<div class="student-header">
                <h1 class="student-name">${this.student.name}</h1>
                <div class="action-buttons">
                    <button class="Assign-btn" data-nav="issuebooks/${this.student.id}/${this.student.registration_number}/${this.student.name}">Issue Books</button>
                    <button class="edit-btn" data-nav="editstudent/${this.student.id}" >Edit Student</button>
                    <button class="delete-btn" data-studentid ="${this.studentID}">Delete Student</button>
                </div>
            </div>
            
            <div class="student-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Father's Name:</span>
                    <span class="detail-value">${this.student.fname}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Mother's Name:</span>
                    <span class="detail-value">${this.student.mname}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${this.student.email}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Phone No:</span>
                    <span class="detail-value">${this.student.phone}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Registration No:</span>
                    <span class="detail-value">${this.student.registration_number}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Session:</span>
                    <span class="detail-value">${this.student.session}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Course:</span>
                    <span class="detail-value">${this.student.course}</span>
                </div>
            </div>`

        // container.querySelector(".student-header>.student-name").innerHTML = this.student.name;

    };

    bindBorrowedListners(){
        var return_btn = document.querySelectorAll('.return-btn');

        if(return_btn){

            return_btn.forEach((btn) => {
                btn.addEventListener('click', async(e) => {
                    var returnInfo = e.currentTarget.dataset.returninfo.split('/');
                    try {
                        var result = await window.borrowedAPI.markReturned(returnInfo[0],returnInfo[1],returnInfo[2]);
    
                        if(result.error){
                            throw new Error(result.error);
                        }
    
                        this.renderBorrowedList()
                    } catch (error) {
                        console.log(error);
                        alert(error);
                    }
                })
            });
        }
    }

    async renderBorrowedList(){
        try {
            var booklist = await window.borrowedAPI.getByStudentRegNo(this.student.registration_number);

            if(booklist.error){
                throw new Error(booklist.error);
            }

            if(booklist.length === 0){
                return
            }

            var borrowedBookListDivs = [`<div class="list-header">
                    <span>S.No.</span>
                    <span>Book Details</span>
                    <span>Status</span>
                </div>`
            ];

            var borrowedBookList = await Promise.all(
                booklist.map( async(book) => {
                    return {bookInfo : await window.bookAPI.getById(book.book_id), ...book};
                })
            );
            // console.log(borrowedBookList);

            borrowedBookList.forEach((book,i) => {

                var returnValue;

                if(book.returned_date === null){
                    returnValue = `<button class="return-btn" data-returninfo="${book.student_reg_no}/${book.bookInfo.id}/${book.id}">Return</button>`
                }else{
                    returnValue =  `<span class="returned-text">Returned on ${formatDateTime(book.returned_date)}</span>`
                }

                borrowedBookListDivs.push(`<div class="book-item">
                    <span>${i+1}</span>
                    <div class="book-details">
                        <div class="book-title">${book.bookInfo.name}</div>
                        <div class="book-meta">
                            <span>Author: ${book.bookInfo.author}</span>
                            <span>Publication Year: ${book.bookInfo.publication_year}</span>
                            <span>Borrowed Date: ${formatDateTime(book.borrowed_date)}</span>
                        </div>
                    </div>
                    <div class="book-status">
                        ${returnValue}
                    </div>
                </div>`)
            })


            

            document.querySelector(this.booklist_container).innerHTML = borrowedBookListDivs.join(" ");

            this.bindBorrowedListners();

        } catch (error) {
            console.log(error);
        }
    }
};

var Student_info_page = new StudentInfoPage(params.get("id")); 