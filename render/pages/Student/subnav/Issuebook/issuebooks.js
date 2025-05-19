const params = new URLSearchParams(window.location.search);

console.log(params.get('studentreg'));

var Booklist = new ListManager(window.bookAPI.getAll);

class IssueBooks {
    constructor(){
        this.searchSection = ".search-section";
        this.searchBox = ".book-search";
        this.sugesstionListContainer = ".suggestions-list";
        this.sugesstionItem = ".suggestion-item";
        this.selectedBookListContainer = ".selected-books";
        this.selectedBookItem=".book-item";
        this.removeBook_btn=".remove-btn";
        this.addBook_btn=".add-btn";
        this.issue_btn=".issue-btn";
        this.Loaded_books=[];
        this.init();
    }

    async init(){
        await this.loadBooks();
        await this.bindListners();
    }

    async loadBooks(){
        var main_book_list = await Booklist.generateRenderList();

        if(main_book_list.length === 0){
            return;
        }

        main_book_list.forEach((book, i) => {
            if(book.copies - book.borrowed !== 0){
                book.isadded = false;
                book.inSuggestion = false;
                book.index = i;
                this.Loaded_books.push(book);
            }
        });

        console.log(this.Loaded_books.length);
        console.log(this.Loaded_books);
    }

    bindListners_action_btn(addedBookDivs){

        document.querySelectorAll(this.addBook_btn).forEach((btn) => {
            btn.addEventListener('click', (e) => {
                var index = e.currentTarget.dataset.index;
                this.Loaded_books[index].inSuggestion = false;
                this.Loaded_books[index].isadded = true;
                this.render();
            })
        })

        if(addedBookDivs !== 1){
            document.querySelectorAll(this.removeBook_btn).forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    var index = e.currentTarget.dataset.index;
                    this.Loaded_books[index].inSuggestion = true;
                    this.Loaded_books[index].isadded = false;
                    this.render();
                })
            });

        }

    }

    async bindListners(){

        var searchSection = document.querySelector(this.searchSection);

        searchSection.querySelector(this.searchBox).addEventListener('keyup', (e) => {
            
            var searchValue = e.target.value.trim().toLowerCase()

            if(this.Loaded_books.length === 0){
                searchSection.querySelector(this.sugesstionListContainer).innerHTML = "<p> No book found </p>";
                return;
            }

            var count = 0;
            this.Loaded_books.forEach((book) => {
                book.inSuggestion = false;
                if(count < 5 && searchValue !== "" && book.searchString.toLowerCase().includes(searchValue) && !book.isadded){
                    book.inSuggestion = true;
                    count++;
                }
            });

            this.render();
        });

        document.querySelector(this.issue_btn).addEventListener('click', async(e) => {
            var studentreg = params.get('studentreg');
            var bookids = [];
            this.Loaded_books.forEach((book)=> {
                if(book.isadded){
                    bookids.push(book.id);
                }
            });

            console.log(studentreg, bookids);

            try {
                var response = await window.borrowedAPI.issueBooks(studentreg,bookids);

                if(response.error){
                    throw new Error(response.error);
                }

                alert(`Selected Books issued to ${params.get('studentname')} successfully !!`);
                await window.electronAPI.navigateTo(`studentinfo/${params.get("id")}`);
            } catch (error) {
                alert(error);
            }
        })

        document.querySelector('.back-btn').addEventListener('click', async (e)=> {
            await window.electronAPI.navigateTo(`studentinfo/${params.get("id")}`);
        })
        
        
    };

    render(){

        var suggestionBookDivs = [];
        var addedBookDivs = [`<h2>Books to Issue</h2>`];

        
        this.Loaded_books.forEach((book) => {

            if(book.inSuggestion){
                suggestionBookDivs.push(`<div class="suggestion-item">
                    <div class="book-info">
                        <div class="book-meta">
                            <span class="book-title">${book.name}</span>
                            <span class="book-author">${book.author} (${book.publication_year})</span>
                            <span class="book-language">${book.language}</span>
                        </div>
                    </div>
                    <button class="add-btn" data-index="${book.index}">Add</button>
                </div>`);
            };

            if(book.isadded){
                addedBookDivs.push(`<div class="book-item">
                    <div class="book-details">
                        <span class="book-title">${book.name}</span>
                        <div class="meta-group">
                            <span class="author">${book.author}</span>
                            <span class="year">${book.publication_year}</span>
                            <span class="language">${book.language}</span>
                            <span class="topic">${book.topic}</span>
                        </div>
                    </div>
                    <button class="remove-btn" data-index="${book.index}">&times;</button>
                </div>`)
            };
        });

        document.querySelector(this.sugesstionListContainer).innerHTML = suggestionBookDivs.join(" ");
        document.querySelector(this.selectedBookListContainer).innerHTML = addedBookDivs.join(" ");

        var btn = document.querySelector(this.issue_btn)
        if(addedBookDivs.length > 1){
            btn.disabled = false;
            btn.innerHTML = `Issue Selected Books (${addedBookDivs.length - 1})`;
        }else{
            btn.innerHTML = "Issue Selected Books (0)";
            btn.disabled = true;
        }
        // console.log(suggestionBookDivs);
        // console.log(addedBookDivs);
        
        this.bindListners_action_btn(addedBookDivs.length);
    }
}

var Issued_books = new IssueBooks();