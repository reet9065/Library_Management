const params = new URLSearchParams(window.location.search);

const seletElement = {
    book_info_container:".book-info-section",
    edit_btn:"button.edit-btn",
    delete_btn:"button.delete-btn"
}

class BookInfo {
    constructor(bookID){
        this.bookID = bookID;
        this.book = null;
    }

    async init(){
        await this.#getBookInfo();
        if(this.book !== null){
            this.renderBookinfo();
            this.#bindEventListner();
            await this.renderBorrowedByStudentList();
        }
    }

    async #getBookInfo(){
        try {
            var bookinfo = await window.bookAPI.getById(this.bookID);
            if(bookinfo.error){
                throw new Error(bookinfo.error);
            }
            console.log("I excuted !!");
            this.book = bookinfo;
        } catch (error) {
            console.log(error);
            document.querySelector(seletElement.book_info_container).innerHTML =`<p>${error}</p>`
            // alert(error);
        }
    }

    #bindEventListner(){
        console.log("Listner binded");
        document.querySelector(seletElement.edit_btn).addEventListener("click", async() => {
            console.log("Edit button Clicked !!");
            await window.electronAPI.navigateTo(`editbook/${this.bookID}`);
        });

        document.querySelector(seletElement.delete_btn).addEventListener("click", async() => {
            console.log("Delete button Clicked !!");
            try {
                if(confirm("Do you realy want to delete this book")){
                    var result = await window.bookAPI.delete(this.bookID);
                    if(result.error){
                        throw new Error(result.error);
                    }
                    await window.electronAPI.navigateTo('books');
                }
            } catch (error) {
                alert(error);
            }
        })
    }

    renderBookinfo(){
        document.querySelector(seletElement.book_info_container).innerHTML = ` <div class="book-header">
                <h1 class="book-title">${this.book.name}</h1>
                <div class="action-buttons">
                    <button class="edit-btn">Edit Book</button>
                    <button class="delete-btn">Delete Book</button>
                </div>
            </div>
            
            <div class="book-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Author:</span>
                    <span class="detail-value">${this.book.author}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Publication Year:</span>
                    <span class="detail-value">${this.book.publication_year}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Language:</span>
                    <span class="detail-value">${this.book.language}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Total Copies:</span>
                    <span class="detail-value">${this.book.copies}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Available Copies:</span>
                    <span class="detail-value">${this.book.copies - this.book.borrowed}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Topic/Category:</span>
                    <span class="detail-value">${this.book.topic}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="availability ${this.book.copies > this.book.borrowed ? 'available' : 'not-available'}">${this.book.copies > this.book.borrowed ? 'Available' : 'Not available'}</span>
                </div>
            </div>`;
    }

    async renderBorrowedByStudentList(){
        try {
            var student_list = await window.borrowedAPI.getByBookId(this.bookID);
            
            if(student_list.error){
                throw Error(student_list.error);
            }

            if(student_list.length == 0){
                return;
            }

            console.log(student_list);

            var borrowedbyStudentList = await Promise.all(
                student_list.map(async (student) => {
                    return { studentInfo: await window.studentAPI.getByRegistrationNo(student.student_reg_no), ...student};
                })
            );

            console.log(borrowedbyStudentList);

            var studentDivs = [`<div class="list-header">
                    <span>S.No.</span>
                    <span>Student Name</span>
                    <span>Registration No.</span>
                    <span>Course</span>
                </div>`
            ];

            borrowedbyStudentList.forEach((student, i) => {
                if(student.returned_date == null){
                    studentDivs.push(`<div class="borrower-item">
                    <span>${studentDivs.length}</span>
                    <span>${student.studentInfo.name}</span>
                    <span>${student.studentInfo.registration_number}</span>
                    <span>${student.studentInfo.course}</span>
                </div>`)
                }
            });

            document.querySelector(".borrowers-list").innerHTML = studentDivs.join(" ");

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
}

var bookPage = new BookInfo(params.get("id"));
bookPage.init();