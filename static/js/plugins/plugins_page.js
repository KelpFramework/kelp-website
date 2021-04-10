{
    document.querySelector(".bg-apply").style.backgroundImage = `url(/plugins?banner=${plugin_uuid})`
    hljs.initHighlightingOnLoad()
}

let outdated = false

function ValidateURL(url){
    return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url)
}

function upload_file(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Upload File"}, "large")
    modal.Custom(`
        <div>
            <div class="progress">
                <div class="progress-bar" style="width:0"></div>
            </div><br>
            <form id="form_sda22a" method="post">
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
        `form="form_sda22a"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sda22a")
        let pr_bar = document.querySelector(".progress-bar")
        let file = wrapper.querySelector("input[name='file']")

        if(file.files.length===1){
            e.preventDefault()

            if(file.files[0].size > 250000000){
                alert("Max filesize is 250 MB")
                return
            }

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("file", file.files[0])
            data.append("upload_plugin_file", uuid)

            request.upload.addEventListener("progress", e => {
                let loaded = e.loaded;
                let total = e.total
                let percent_complete = (loaded / total) * 100;
                pr_bar.style.width = `${percent_complete}%`
                pr_bar.innerHTML = `${Math.round(percent_complete)}%`
            })

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}

function link_file(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Link File"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sda2a2" method="post">
                Link: <input class="form-control" type="url" name="link" placeholder="https://yourdomain.location" required>
                Name: <input class="form-control" type="text" name="name" placeholder="Download Link" required>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Link",
        "",
        "btn btn-outline-info",
        "Add Link",
        `form="form_sda2a2"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sda2a2")
        let link = wrapper.querySelector("input[name='link']")
        let name = wrapper.querySelector("input[name='name']")

        if(link.value!=="" && name.value !== "" && ValidateURL(link.value)){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("add_plugin_link", uuid)
            data.append("link", link.value)
            data.append("name", name.value)

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}

function outdate(){
    outdated = true
    let infobox = document.querySelector(".no-valid")
    infobox.classList.add("bg-danger", "rounded", "p-2", "mt-4")
    infobox.innerHTML = `
        <h5>The data in this section is no longer valid!</h5>
        <p>Please <a href="">refresh</a> the page to reload affected data.</p>
    `
}

function delete_file(uuid, filename, modal_del=null){
    if(modal_del) Modal.prototype.destroy(modal_del)
    let modal = new Modal("modal-wrapper", {heading: "Delete File"}, "large")
    modal.Custom(`
        Are you sure that you want to delete this file?
    `)
    modal.FunctionButton("form_submit", "Yes, delete", "btn btn-outline-danger", "click", _ => {
        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("manage_files", uuid)
        data.append("delete_file", filename)

        request.addEventListener("load", _ => {
            modal.destroy()
            manage_files(uuid)
            outdate()
        })

        request.open("POST", "/plugins/manage")
        request.send(data)
    })
    modal.FunctionButton("form_abort", "Cancel", "btn btn-outline-success", "click", _ => {
        modal.destroy()
        manage_files(uuid)
    })

    modal.show()
}

function change_icon(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Change Icon"}, "large")
    modal.Custom(`
        <div class="row">
            <div class="p-1 col-lg-6 col-md-12 text-center">
                <img id="image-change-preview" style="width: 300px;height: 300px;" src="/plugins?icon=${uuid}">
            </div>
            <form id="form_2sda21" method="post" class="p-1 col-lg-6 col-md-12 text-center">
                <h6>Icon File:</h6> <input id="pict-change" class="btn btn-outline-primary" type="file" name="pict" placeholder="picture" accept="image/png,image/jpeg,image/gif" required>
            </form>
        </div>
    `)
    document.querySelector("#pict-change").addEventListener("change", e => {
        let reader = new FileReader()

        let filename = e.target.value.split("\\").pop()
        let file = e.target.files[0]

        if(filename !== ""){
            if(file.size > 5000000){
                e.preventDefault()
                document.querySelector("#image-change-preview").src = `/plugins?icon=${uuid}`
                alert("Maximum filesize is 5 MB")
                e.target.value = ""
            }else{
                reader.readAsDataURL(file)
            }
        }else{
            document.querySelector("#image-change-preview").src = `/plugins?icon=${uuid}`
        }

        reader.onload = e => {
            document.querySelector("#image-change-preview").src = e.target.result
        }
    })
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

            if(pict.files[0].size > 5000000){
                alert("Max filesize is 5 MB")
                return
            }

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("picture", pict.files[0])
            data.append("change_plugin_icon", uuid)

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}

function change_banner(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Change Banner"}, "large")
    modal.Custom(`
        <div class="row">
            <div class="col-12 text-center">
                <img id="image-change-preview" style="width: 100%;height: auto;" src="/plugins?banner=${uuid}">
            </div>
            <form id="form_2sda21" method="post" class="pt-3 col-12 text-center">
                <h6>Banner File:</h6> <input id="pict-change" class="btn btn-outline-primary" type="file" name="pict" placeholder="picture" accept="image/png,image/jpeg,image/gif" required>
            </form>
        </div>
    `)
    document.querySelector("#pict-change").addEventListener("change", e => {
        let reader = new FileReader()

        let filename = e.target.value.split("\\").pop()
        let file = e.target.files[0]

        if(filename !== ""){
            if(file.size > 5000000){
                e.preventDefault()
                document.querySelector("#image-change-preview").src = `/plugins?banner=${uuid}`
                alert("Maximum filesize is 5 MB")
                e.target.value = ""
            }else{
                reader.readAsDataURL(file)
            }
        }else{
            document.querySelector("#image-change-preview").src = `/plugins?banner=${uuid}`
        }

        reader.onload = e => {
            document.querySelector("#image-change-preview").src = e.target.result
        }
    })
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

            if(pict.files[0].size > 5000000){
                alert("Max filesize is 5 MB")
                return
            }

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("picture", pict.files[0])
            data.append("change_plugin_banner", uuid)

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}

function manage_files(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Manage Files"}, "large")
    $.ajax({
        url: "/plugins/manage",
        method: "POST",
        data: {manage_files: uuid, randomizer: Math.random().toString()},
        success: (response) => {
            modal.Custom(`
                <div class="modal-hold">
<!--                    <button class="btn btn-primary">-->
<!--                        <i class="material-icons">add</i>Add File-->
<!--                    </button> <br><br>-->
                    <ul class="list-group" id="modal-files-list">
                        <li class="list-group-item bg-dark">no files</li>
                    </ul>
                </div>
            `)

            let modal_hold = document.querySelector(".modal-hold")
            let files_list = modal_hold.querySelector("ul#modal-files-list")

            if(response.data.length > 0){
                files_list.innerHTML = ""
            }
            for(let file of response.data){
                files_list.innerHTML += `
                <li class="list-group-item bg-dark">
                    <div class="float-left">
                        <b>${file.type === "file" ? file.name : `${file.name} (External Link)`}</b> <br>
                        <i>last modified on ${new Date(file.modified_r*1000).toLocaleString("de-DE")}</i> <br>
                        <i>created on ${new Date(file.created_r*1000).toLocaleString("de-DE")}</i>
                    </div>
                    <button class="float-right btn btn-outline-danger" onclick="delete_file('${uuid}', '${file.type === "file" ? file.name : `external_link_${uuid}_${file.name}`}', '${modal.id}')">
                        Delete
                    </button>
                    <a class="btn btn-outline-primary float-right mr-2" target="_blank" href="${file.type === "file" ? "/plugins/" + uuid + "/download/" + file.name  : file.target}">
                        ${file.type === "file" ? "Download" : "Open"}
                    </a>
                </li>
                `
            }

            modal.show()
        }
    })
}

function edit_name(uuid, current){
    let modal = new Modal("modal-wrapper", {heading: "Edit Plugin Name"}, "large")
    modal.Custom(`
        <div>
            <form id="form_ss_a61" method="post">
                <input type="text" value="${current}" class="form-control" name="plugin_name" placeholder="Plugin Name" required>
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
        `form="form_ss_a61"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_ss_a61")
        let plugin_name = wrapper.querySelector("input[name='plugin_name']")

        if(plugin_name.value!==""){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("edit_plugin_name", uuid)
            data.append("plugin_name", plugin_name.value)

            request.addEventListener("load", _ => {
                modal.destroy()
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}
function edit_short_description(uuid, current){
    let modal = new Modal("modal-wrapper", {heading: "Edit Plugin Short Description"}, "large")
    modal.Custom(`
        <div>
            <form id="form_ss_a66" method="post">
                <input type="text" value="${current}" class="form-control" name="plugin_short_description" placeholder="Plugin Short Description" required>
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
        `form="form_ss_a66"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_ss_a66")
        let plugin_short_description = wrapper.querySelector("input[name='plugin_short_description']")

        if(plugin_short_description.value!==""){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("edit_plugin_short_description", uuid)
            data.append("plugin_short_description", plugin_short_description.value)

            request.addEventListener("load", _ => {
                modal.destroy()
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}
function edit_tags(uuid, current){
    let modal = new Modal("modal-wrapper", {heading: "Edit Plugin Tags"}, "large")
    $.ajax({
        method: "GET",
        url: "/api/plugins/tags",
        success: (response) => {
            function populate(){
                let template = `<div class="custom-control custom-switch col-lg-3 col-md-4 col-sm-6">
    <input type="checkbox" class="custom-control-input plugin_tag" id="switch_tag_{tag}" name="{tag}" data-toggle-for="tg-toggle_{tag}" data-tag-input>
    <label class="custom-control-label" for="switch_tag_{tag}">{tag}</label>
</div>`
                let return_str = ""
                for(let tag of response.tags){
                    return_str += template.replaceAll("{tag}", tag)
                }
                return return_str
            }
            modal.Custom(`
                <div>
                    <div id="form_dd_a66" method="post">
                        <div class="row mx-2">${populate()}</div>
                    </div>
                </div>
            `)

            for(let curr_tag of current.split(",")){
                let tag_link = "tg-toggle_" + curr_tag
                document.querySelector(`input[data-toggle-for="${tag_link}"]`).checked = true
            }

            modal.show()
        }
    })
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-outline-warning",
        "Save",
        `form="form_dd_a66"`
    ).addEventListener("click", e => {
        e.preventDefault()

        let wrapper = document.querySelector("#form_dd_a66")
        let plugin_tag_inputs = wrapper.querySelectorAll("input[data-tag-input]")
        let plugin_tags = []

        for(let tag_input of plugin_tag_inputs){
            if(!tag_input.checked) continue
            plugin_tags.push(tag_input.getAttribute("name"))
        }

        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("edit_plugin_tags", uuid)
        data.append("plugin_tags", plugin_tags.join(","))

        request.addEventListener("load", _ => {
            modal.destroy()
            location.reload()
        })

        request.open("POST", "/plugins/manage")
        request.send(data)
    })
}
function edit_description(uuid, orig_obj){
    let current = document.querySelector(orig_obj).innerHTML
    let modal = new Modal("modal-wrapper", {heading: "Edit Description"}, "large")
    modal.Custom(`
        <div id="new-plugin-form">
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#description-edit">Edit</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#description-preview">Preview</a>
                </li>
            </ul>
            <div class="tab-content">
                <form id="description-edit" method="post" class="container tab-pane active">
                    <textarea name="plugin_description" placeholder="Markdown or HTML" class="form-control" required>${current}</textarea>
                </form>
                <div id="description-preview" class="container tab-pane">
                    <div class="description-preview-div"></div>
                    <small>(This preview may not be entirely accurate)</small>
                </div>
            </div>
        </div>
    `)
    function change_ev(e){
        console.log(e)
        let md = new remarkable.Remarkable({
            html:         true,
            xhtmlOut:     false,
            breaks:       true,
            langPrefix:   'language-',
            typographer:  false,
            quotes: '“”‘’',
            highlight: function (/*str, lang*/) { return ''; }
        })
        document.querySelector(".description-preview-div").innerHTML = md.render(e.target.value)
    }
    document.querySelector("textarea[name='plugin_description']").addEventListener("change", change_ev)
    change_ev({target:document.querySelector("textarea[name='plugin_description']")})
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-outline-warning",
        "Save",
        `form="description-edit"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#description-edit")
        let plugin_description = wrapper.querySelector("textarea[name='plugin_description']")

        if(plugin_description.value!==""){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("edit_plugin_description", uuid)
            data.append("plugin_description", plugin_description.value)

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/plugins/manage")
            request.send(data)
        }
    })
    modal.show()
}

function delete_plugin(uuid){
    let modal = new Modal("modal-wrapper", {heading: "Delete Plugin"}, "large")
    modal.Custom(`
        Are you sure that you want to delete this plugin?
    `)
    modal.Button(
        "form_submit",
        "Yes, delete",
        "btn-outline-danger",
    ).addEventListener("click", _ => {
        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("remove_plugin", uuid)

        request.addEventListener("load", _ => {
            modal.destroy()
            location.href = "/plugins"
        })

        request.open("POST", "/plugins/manage")
        request.send(data)
    })
    modal.show()
}
