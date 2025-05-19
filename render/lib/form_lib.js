class FormControler {
    constructor(formselector){
        this.formselector = formselector;
    }

    getFormData(){
        const formData = new FormData(document.querySelector(this.formselector));
        const data = {};
    
        for (const [key, value] of formData.entries()) {
        data[key] = value;
        }
    
        return data;
    }

    setFormData(data){

        for (const name in data) {
            const field = document.querySelector(this.formselector).elements.namedItem(name);
            if (!field) continue;
        
            const value = data[name];
        
            // Handle multiple fields with the same name (like checkboxes or radios)
            if (field instanceof RadioNodeList) {
            for (const input of field) {
                if (input.type === "radio" || input.type === "checkbox") {
                input.checked = Array.isArray(value) ? value.includes(input.value) : input.value === value;
                }
            }
            } else if (field.type === "checkbox") {
            field.checked = Boolean(value);
            } else {
            field.value = value;
            }
        }
    }
}