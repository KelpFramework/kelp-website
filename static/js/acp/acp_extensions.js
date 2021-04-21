let page = ""

const module_list = document.querySelector("#module-list")
const module_content = document.querySelector("#module-content")


const module_list_template = `
<li class="searchable" data-uuid="{{module_uuid}}" data-creation_name="{{module_name}}">
    <button class="module-btn" data-toggle="tab" id="module-btn-{{module_id}}">
        {{module_name}}
        <small class="float-right mr-2 material-icons" hidden>push_pin</small>
    </button>
</li>
`


function setContent(module_parent, refresh=false){
    if (module_parent === null){
        module_content.innerHTML = ""
        return
    }
    $.ajax({
        url: `?get_module=${module_parent.uuid}`,
        success: (response) => {
            let module = response.data.gen
            let files = response.data.files
            module_content.innerHTML = module_content_template
                .replaceAll("module_id", module.id)
                .replaceAll("module_uuid", module.uuid)
                .replaceAll("module_name", module.module_name)
                .replaceAll("module_created", new Date(module.created).toLocaleString("de-DE"))
                .replaceAll("module_creator", module.creator)
                .replaceAll("module_downloads", module.downloads)
                .replaceAll("module_short_description", module.short_description)
                .replaceAll("module_description_md", module.description_md)
                .replaceAll("module_description", module.description)
                .replaceAll("plugin_refresh", refresh ? `refresh=${Math.random().toString()}` : "")
            module_content.querySelector(`#files_list_${module.id}`).innerHTML = ""
            for(let file of files){
                module_content.querySelector(`#files_list_${module.id}`).innerHTML += `
                <li class="list-group-item bg-dark">
                    <div class="float-left">
                        <b>${file.name}</b> <br>
                        <i>last modified on ${new Date(file.modified_r*1000).toLocaleString("de-DE")}</i> <br>
                        <i>created on ${new Date(file.created_r*1000).toLocaleString("de-DE")}</i>
                    </div>
                    <button class="btn btn-outline-danger float-right" onclick="delete_file('${module.uuid}', '${file.name}')">
                        Delete
                    </button>
                    <a class="btn btn-outline-primary float-right mr-2" href="/extensions/${module.uuid}/download/${file.name}">
                        Download
                    </a>
                </li>
                `
            }
            document.querySelectorAll(".link-expander-card .link-expander").forEach(elem => {
                elem.innerHTML += '<span class="material-icons">expand_more</span>'
            })
            function toggle(e){
                e.target.parentElement.querySelector(".link-expander-card .link-expander span.material-icons").classList.toggle("expanded")
            }
            $(".link-expander-card .collapse").on("show.bs.collapse", toggle).on("hide.bs.collapse", toggle)
        }
    })
}
function load_modules(){
    $.ajax({
        url: "?get_modules",
        success: (response) => {
            module_list.innerHTML = ``
            for(let module of response.data){
                module_list.innerHTML += module_list_template
                    .replaceAll("{{module_id}}", module.id)
                    .replaceAll("{{module_uuid}}", module.uuid)
                    .replaceAll("{{module_name}}", module.module_name)
                    .replaceAll("hidden", module.pinned ? "" : "hidden")
                setTimeout(()=>{
                        module_list.querySelector(`#module-btn-${module.id}`).addEventListener("click", ()=>{
                            if(module.id !== page) {
                                module_content.innerHTML = "<div class='spinner-border'></div>"
                                setContent(module)
                                page = module.id
                            }
                    })
                }, 200)
                $("#user-search").on("keyup", function() {
                    let value = $(this).val().toLowerCase()
                    $("#module-list li.searchable").filter(function() {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                    })
                })
            }
        }
    })
}


{
    load_modules()
}


function new_extension(){
    let modal = new Modal("modal-wrapper", {heading: "New Extension"}, "extralarge")
    modal.Custom(`
        <div>
            <form id="form_22231" method="post" enctype="multipart/form-data" action="/acp/extensions">
                <input type="text" class="form-control" name="id" placeholder="id" pattern="[A-Za-z0-9-_]" title="Allowed: A-Z a-z 0-9 - _" required> <br>
                <input type="text" class="form-control" name="name" placeholder="name" required> <br>
                <input type="text" class="form-control" name="short_desc" placeholder="short description" required> <br>
                <textarea class="form-control" type="text" name="desc" placeholder="description" required></textarea> <br>
                Image: <input class="btn btn-outline-primary" type="file" name="pict" placeholder="picture" accept="image/png,image/jpeg,image/gif" required> <br><br>
                Pinned: <input class="form-check" type="checkbox" name="pin" placeholder="pinned">
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Create",
        "",
        "btn btn-outline-warning",
        "Create",
        `form="form_22231"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_22231")
        let id = wrapper.querySelector("input[name='id']").value
        let name = wrapper.querySelector("input[name='name']").value
        let short_desc = wrapper.querySelector("input[name='short_desc']").value
        let desc = wrapper.querySelector("textarea").value
        let pict = wrapper.querySelector("input[name='pict']")
        let pin = wrapper.querySelector("input[name='pin']")

        if(id.match("[A-Za-z0-9-_]")&&name!==""&&short_desc!==""&&desc!==""&&pict.files.length===1){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("id", id)
            data.append("name", name)
            data.append("short_desc", short_desc)
            data.append("desc", desc)
            data.append("pict", pict.files[0])
            data.append("pin", pin.checked)
            data.append("create_module", null)

            request.addEventListener("load", _ => {
                modal.destroy()
                setTimeout(()=>{
                    load_modules()
                }, 200)
            })

            request.open("POST", "/acp/extensions")
            request.send(data)
        }
    })
    modal.show()
}

function switch_pin(uuid){
    $.ajax({
        method: "POST",
        data: {
            switch_pin: uuid
        },
        success: _ => {
            load_modules()
            setTimeout(_=>{
                document
                    .querySelector(`li.searchable[data-uuid='${uuid}']`)
                    .querySelector("button").classList.add("active")
            }, 450)
        }
    })
}
function change_picture(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Change Picture"}, "large")
    modal.Custom(`
        <div>
            <form id="form_2sda21" method="post" enctype="multipart/form-data" action="/acp/extensions">
                Image: <input class="btn btn-outline-primary" type="file" name="pict" placeholder="picture" accept="image/png,image/jpeg,image/gif" required>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Change",
        "",
        "btn btn-outline-warning",
        "Change",
        `form="form_2sda21"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_2sda21")
        let pict = wrapper.querySelector("input[name='pict']")

        if(pict.files.length===1){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("pict", pict.files[0])
            data.append("change_module_picture", uuid)

            request.addEventListener("load", _ => {
                modal.destroy()
                setTimeout(_ => {
                    setContent({uuid}, true)
                }, 200)
            })

            request.open("POST", "/acp/extensions")
            request.send(data)
        }
    })
    modal.show()
}
function delete_module(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Delete Extension"}, "large")
    modal.Custom(`
        Are you sure that you want to delete this extension?
    `)
    modal.Button(
        "form_submit",
        "Yes, delete",
        "btn-outline-danger",
    ).addEventListener("click", _ => {
        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("delete_module", uuid)

        request.addEventListener("load", _ => {
            modal.destroy()
            load_modules()
            setContent(null)
        })

        request.open("POST", "/acp/extensions")
        request.send(data)
    })
    modal.show()
}
function edit_name(uuid, current){
    let modal = new Modal("modal-wrapper", {heading: "Edit Extension Name"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sg_a61" method="post">
                <input type="text" value="${current}" class="form-control" name="extension_name" placeholder="Extension Name" required>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-outline-warning",
        "Save",
        `form="form_sg_a61"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sg_a61")
        let extension_name = wrapper.querySelector("input[name='extension_name']")

        if(extension_name.value!==""){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("edit_module_name", uuid)
            data.append("module_name", extension_name.value)

            request.addEventListener("load", _ => {
                modal.destroy()
                load_modules()
                setContent({uuid})
                setTimeout(_=>{
                    document
                        .querySelector(`li.searchable[data-uuid='${uuid}']`)
                        .querySelector("button").classList.add("active")
                }, 450)
            })

            request.open("POST", "/acp/extensions")
            request.send(data)
        }
    })
    modal.show()
}

function file_complete(uuid, modal, custom=1){
    modal.destroy()
    setTimeout(_ => {
        load_modules()
        setContent({uuid})
        setTimeout(_ => {
            document
                .querySelector(`li.searchable[data-uuid='${uuid}']`)
                .querySelector("button").classList.add("active")
            document.querySelector(`.card-header[data-target='#collapse_one_${custom}']`).click()
        }, 450)
    }, 200)
}
function upload_file(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Upload File"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sda221" method="post" enctype="multipart/form-data" action="/acp/extensions">
                File: <input class="btn btn-outline-primary" type="file" name="file" placeholder="picture" required>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Upload",
        "",
        "btn btn-outline-info",
        "Upload",
        `form="form_sda221"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sda221")
        let file = wrapper.querySelector("input[name='file']")

        if(file.files.length===1){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("filename", file.value.split("\\").pop())
            data.append("file", file.files[0])
            data.append("upload_module_file", uuid)

            request.addEventListener("load", _ => {
                file_complete(uuid, modal)
            })

            request.open("POST", "/acp/extensions")
            request.send(data)
        }
    })
    modal.show()
}
function delete_file(uuid, filename){
    let modal = new Modal("modal-wrapper", {heading: "Delete File"}, "large")
    modal.Custom(`
        Are you sure that you want to delete this file?
    `)
    modal.Button(
        "form_submit",
        "Yes, delete",
        "btn-outline-danger",
    ).addEventListener("click", _ => {
        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("filename", filename)
        data.append("delete_module_file", uuid)

        request.addEventListener("load", _ => {
            file_complete(uuid, modal)
        })

        request.open("POST", "/acp/extensions")
        request.send(data)
    })
    modal.show()
}
function edit_short_desc(uuid, current){
    let modal = new Modal("modal-wrapper", {heading: "Change Short Description"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sg_a51" method="post">
                <input type="text" value="${current}" class="form-control" name="short_description" placeholder="Short Description" required>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-outline-warning",
        "Save",
        `form="form_sg_a51"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sg_a51")
        let short_description = wrapper.querySelector("input[name='short_description']")

        if(short_description.value!==""){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("edit_short_description", uuid)
            data.append("short_description", short_description.value)

            request.addEventListener("load", _ => {
                file_complete(uuid, modal, 2)
            })

            request.open("POST", "/acp/extensions")
            request.send(data)
        }
    })
    modal.show()
}
function edit_desc(uuid){
    let current = document.querySelector(`.non-md-${uuid}`).innerHTML
    let modal = new Modal("modal-wrapper", {heading: "Change Description"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sg_a21" method="post">
                <textarea type="text" class="form-control" name="description" placeholder="Description" required>${current}</textarea>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-outline-warning",
        "Save",
        `form="form_sg_a21"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sg_a21")
        let description = wrapper.querySelector("textarea[name='description']")

        if(description.value!==""){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("edit_description", uuid)
            data.append("description", description.value)

            request.addEventListener("load", _ => {
                file_complete(uuid, modal, 3)
            })

            request.open("POST", "/acp/extensions")
            request.send(data)
        }
    })
    modal.show()
}