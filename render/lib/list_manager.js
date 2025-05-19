class ListManager {
    constructor(fetchFunction){
        this.fetchFunction = fetchFunction;
        this.list = [];
        this.list_for_render = [];
        this.list_loaded = false;
        this.#init();
    }

    async #init(){
        await this.#loadList();
    }

    async #loadList(){
        try {
            var result = await this.fetchFunction();
            if(result.error){
                throw new Error(result.error);
            }

            if(result.length !== 0){
                for(let i = result.length - 1; i >= 0 ; i--){
                    let string = "";
                    for(let key in result[i]){
                        string = string + `${result[i][key]} `;
                    }

                    result[i].searchString = string.trim();
                    this.list.push(result[i]);
                }
            }

            console.log(this.list);

            this.list_loaded = true;
        } catch (error) {
            this.list_loaded = true;
            console.log(error);
            alert(error);
        }
    }

    generateRenderList(given_searchString = ""){

        return new Promise((resolve, reject) => {
                var check_list_loaded = setInterval(() => {
                    if(this.list_loaded){
                        clearInterval(check_list_loaded);
                        if(this.list.length !== 0){
                
                            console.log("List has somthing")
                
                            if(given_searchString.trim === ""){
                                resolve(this.list);
                            }
                            this.list_for_render = [];
                            for(let i = 0; i < this.list.length; i++){
                                if(this.list[i].searchString.toLowerCase().includes(given_searchString.toLowerCase().trim())){
                                    this.list_for_render.push(this.list[i]);
                                }
                            }
                        }
                
                        resolve(this.list_for_render)
                    }
                }, 100);
        });
    }
}