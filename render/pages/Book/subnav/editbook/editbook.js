const params = new URLSearchParams(window.location.search);

console.log(params.get('id'));

var Editor_form = new FormControler(".book-form");

const selectElement = {
    edit_book_form:".book-form",
    back_btn:".back-btn"
}


class EditForm{

    constructor(bookID){
        this.bookID = bookID;
        this.form = null;
    }

    async init(){
        await this.#setForm();
        await this.#bindListners();
    }

    async #bindListners(){
        document.querySelector(selectElement.back_btn).addEventListener('click',async() => {
            await window.electronAPI.navigateTo(`bookinfo/${this.bookID}`);
        });

        document.querySelector(selectElement.edit_book_form).addEventListener('submit', async(e) => {
           
            e.preventDefault();
            const data = Editor_form.getFormData();
            data._id = this.bookID;

            try {
                var while_editing_form = await window.bookAPI.update(data);
                // console.log(data);

                if(while_editing_form.error){
                    throw new Error(while_editing_form.error);
                }

                alert("Book edited successfully !!");
                await window.electronAPI.navigateTo(`bookinfo/${this.bookID}`);
            } catch (error) {
                alert(error);
                await window.electronAPI.navigateTo(`bookinfo/${this.bookID}`);
            }
        });
    }

    async #setForm(){
        
        try {
            var data = await window.bookAPI.getById(this.bookID);
            if(data.error){
                throw new Error(data.error);
            }
            Editor_form.setFormData(data);

        } catch (error) {
            await window.electronAPI.navigateTo(`bookinfo/${this.bookID}`);
        }

        
    }
}

var edit_book_page = new EditForm(params.get("id"));
edit_book_page.init();