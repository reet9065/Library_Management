
var BookList = new ListManager(window.bookAPI.getAll);

class Home {
    constructor(){
        this.book_card = document.querySelector('.book-card>p');
        this.student_card = document.querySelector(".student-card>p");
        this.recent_added_bookList_container = document.querySelector(".logs-table");
        this.init();
    }

    async init(){
        await this.renderHome();
    }

    async renderHome(){
        try {
            var booklist = await BookList.generateRenderList();
            var studentCount = await window.studentAPI.getTotalCount();

            if(booklist.error){
                throw new Error(booklist.error);
            }

            if(studentCount.error){
                throw new Error(studentCount.error);
            }

            this.book_card.innerHTML = `${booklist.length}`;
            this.student_card.innerHTML = `${studentCount}`;

            var recentBooksDiv = [`<div class="log-header">
                <span>Book name</span>
                <span>Author</span>
                <span>Publication Year</span>
                <span>Language</span>
                </div>`
            ];

            var count = 0;
            booklist.forEach((book) => {

                if(count < 10){
                    recentBooksDiv.push(`<div class="log-item">
                    <span>${book.name}</span>
                    <span>${book.author}</span>
                    <span>${book.publication_year}</span>
                    <span>${book.language}</span>
                    </div>`);
                    count ++;
                }
            });

            this.recent_added_bookList_container.innerHTML = recentBooksDiv.join(" ");

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
}

var homepage = new Home();