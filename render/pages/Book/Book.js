
class BookList extends ListManager {
  constructor(fetchFunction){
    super(fetchFunction);
    this.book_list_container = ".books-list";
    this.search_box = ".search-input";
    this.book_delete_btn = ".delete-btn";
    this.book_item = ".book-item"
  }

  bindBookListners(){
    document.querySelectorAll(this.book_item).forEach((book) => {

      book.querySelector('.book-info').addEventListener('click', async (e) => {
        await window.electronAPI.navigateTo(e.currentTarget.dataset.nav);
      });

      book.querySelector(this.book_delete_btn).addEventListener('click', async (e) => {
        console.log(e.currentTarget.dataset.bookid);
        var userConfromation = confirm("Are you sure want do delete this book ??")
        if(!userConfromation){
          return;
        }
      
        try {
          var result = await window.bookAPI.delete(e.currentTarget.dataset.bookid);
          if(result.error){
            throw new Error(result.error);
          }
        } catch (error) {
          alert(error.message);
        }
      
        location.reload();
      })
    });

    document.querySelectorAll(this.book_delete_btn).forEach
  }

  async renderBookList(given_searchString = ""){

    var book_list = await super.generateRenderList(given_searchString);
    
    console.log(book_list);

    if(book_list.length === 0){
      document.querySelector(this.book_list_container).innerHTML = "<h1> No Book found !! </h1>";
      return;
    }

    var book_elements = [];

    book_list.forEach((book) => {
      book_elements.push(`<div class="book-item">
                <div class="book-info" data-nav="bookinfo/${book.id}">
                    <h3 class="book-title">${book.name}</h3>
                    <div class="book-details">
                        <span class="detail-item">
                            <span class="detail-label">Author:</span>
                            ${book.author}
                        </span>
                        <span class="detail-item">
                            <span class="detail-label">Publication year</span>
                            ${book.publication_year}
                        </span>
                        <span class="detail-item">
                            <span class="detail-label">Available:</span>
                            ${book.copies - book.borrowed} copies
                        </span>
                    </div>
                </div>
                <button class="delete-btn" data-bookid="${book.id}">&times;</button>
            </div>`);
    });

    document.querySelector(this.book_list_container).innerHTML = book_elements.join(" ");
    this.bindBookListners();
  };

};

var BookPage = new BookList(window.bookAPI.getAll);
BookPage.renderBookList();

document.querySelector(BookPage.search_box).addEventListener('keyup', async (e) => {
  await BookPage.renderBookList(e.target.value);
});

document.querySelector(BookPage.search_box).addEventListener('search', async (e) => {
  await BookPage.renderBookList(e.target.value);
});
