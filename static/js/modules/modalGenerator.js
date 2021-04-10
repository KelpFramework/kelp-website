const _basic_modal_body = `
<div class="modal fade" id="{{id}}">
    <div class="modal-dialog" id="config_{{id}}">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{heading}}</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body" id="body_{{id}}"></div>
            <div class="modal-footer" id="footer_{{id}}"></div>
        </div>
    </div>
</div>
`

const _error_modal_body = `
<div class="modal fade" id="{{id}}">
    <div class="modal-dialog" id="config_{{id}}">
        <div class="modal-content">
            <div class="modal-header bg-danger">
                <h4 class="modal-title">{{heading}}</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body bg-danger" id="body_{{id}}"></div>
            <div class="modal-footer bg-danger" id="footer_{{id}}"></div>
        </div>
    </div>
</div>
`

class Modal{
    constructor(wrapper, options, size="normal"){
        this.id = options.id || Math.random().toString(16).substr(2, 8)

        this.heading = options.heading || ""
        this.close_button = options.close_button || false

        document.getElementById(wrapper).innerHTML =
            _basic_modal_body
                .replaceAll("{{heading}}", this.heading)
                .replaceAll("{{id}}", this.id)

        this.wrapper = document.getElementById(this.id)
        this.wrapper_config = document.getElementById(`config_${this.id}`)
        this.wrapper_body = document.getElementById(`body_${this.id}`)
        this.wrapper_footer = document.getElementById(`footer_${this.id}`)

        if(this.close_button){
            this.wrapper_footer.innerHTML =
                `<button type="button" class="btn btn-danger" data-dismiss="modal" id="cbtn_{{id}}">Close</button>`
                    .replaceAll("{{id}}", this.id)
        }

        switch(size){
            case "small": this.wrapper_config.classList.add("modal-sm"); break
            case "normal": break
            case "large": this.wrapper_config.classList.add("modal-lg"); break
            case "extralarge": this.wrapper_config.classList.add("modal-xl"); break
            default: this.wrapper_config.classList.add(size); break
        }
    }
    Button(id, text, classes="", custom=""){
        this.wrapper_footer.innerHTML += `<button id="${id}" class="btn ${classes}" ${custom}>${text}</button>`;
        return document.getElementById(id);
    }
    FunctionButton_body(id, text, classes="", event, callback){
        let btn = document.createElement("button")
        btn.innerText = text
        btn.setAttribute("class", classes)
        btn.addEventListener(event, callback)
        this.wrapper_body.appendChild(btn)
    }
    FunctionButton(id, text, classes="", event, callback){
        let btn = document.createElement("button")
        btn.innerText = text
        btn.setAttribute("class", classes)
        btn.addEventListener(event, callback)
        this.wrapper_footer.appendChild(btn)
    }
    Input(id, type, text, classes="", value="", custom=""){
        this.wrapper_body.innerHTML += `<input id="${id}" class="form-control ${classes}" type="${type}" placeholder="${text}" value="${value}" ${custom}>`;
        return document.getElementById(id);
    }
    Input_footer(id, type, text, name, classes="", value="", custom=""){
        this.wrapper_footer.innerHTML += `<input name="${name}" id="${id}" class="form-control ${classes}" type="${type}" placeholder="${text}" value="${value}" ${custom}>`;
        return document.getElementById(id);
    }
    TextArea(id, text, classes="", value=""){
        this.wrapper_body.innerHTML += `<textarea id="${id}" class="form-control ${classes}" placeholder="${text}" value="${value}"></textarea>`;
        return document.getElementById(id);
    }
    FileInput(id, multiple, classes="", accept=null){
        let input = document.createElement("input")
        input.id = id
        input.type = "file"
        input.multiple = multiple
        input.accept = accept
        input.setAttribute("class", classes)

        this.wrapper_body.appendChild(input)

        return document.getElementById(id);
    }
    Text(text, tag="span", classes=""){
        let span = document.createElement(tag)
        let id = Math.random().toString()
        span.innerText = text
        span.setAttribute("class", classes)
        span.setAttribute("id", id)
        this.wrapper_body.appendChild(span)
        return document.getElementById(id)
    }
    CustomText(id, tag, text, classes=""){
        this.wrapper_body.innerHTML += `<${tag} id="${id}" class="${classes}">${text}</${tag}>`;
        return document.getElementById(id);
    }
    Custom(customhtml){
        this.wrapper_body.innerHTML += customhtml;
    }
    Linebreak(){
        this.wrapper_body.innerHTML += "<br><br>";
    }
    show(){
        $(`#${this.id}`).modal("show")
    }
    hide(){
        $(`#${this.id}`).modal("hide")
    }
    set_heading(heading){
        this.wrapper_config.querySelector(".modal-title").innerText = heading
    }
    clear(){
        this.wrapper_body.innerHTML = ""
        this.wrapper_footer.innerHTML = ""
    }
    destroy(override=null){
        if(override){
            $(`#${override}`).modal("hide")
            // document.querySelector(`#${override}`).innerHTML = ""
        }else{
            this.hide()
            // this.wrapper.innerHTML = ""
        }
    }
}

class ErrorModal{
    constructor(wrapper, heading, error, options={}){
        this.id = options.id || Math.random().toString(16).substr(2, 8)

        this.heading = heading
        this.close_button = options.close_button || true

        document.getElementById(wrapper).innerHTML =
            _error_modal_body
                .replaceAll("{{id}}", this.id)
                .replaceAll("{{heading}}", heading)

        this.wrapper = document.getElementById(this.id)
        this.wrapper_config = document.getElementById(`config_${this.id}`)
        this.wrapper_body = document.getElementById(`body_${this.id}`)
        this.wrapper_footer = document.getElementById(`footer_${this.id}`)

        if(this.close_button){
            this.wrapper_footer.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>`
        }

        this.wrapper_body.innerHTML = error
    }
    show(){
        $(`#${this.id}`).modal("show")
    }
    hide(){
        $(`#${this.id}`).modal("hide")
    }
    destroy(){
        this.hide()
        this.wrapper.innerHTML = ""
    }
}


function Request_Error_Generator(wrapper, request){
    new ErrorModal(wrapper, `Error: ${request.status}`, `${request.status} - ${request.statusText}`).show()
}
function Quick_Error_Generator(wrapper, head, error){
    new ErrorModal(wrapper, head, error).show()
}