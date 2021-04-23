let page = ""

const plugin_list = document.querySelector("#plugin-list")
const plugin_report_list = document.querySelector("#plugin-report-list")
const plugin_content = document.querySelector("#plugin-content")
const plugin_content_template = document.querySelector("#plugin_content_template")
const plugin_report_content_template = document.querySelector("#plugin_report_content_template")

const tag_list = document.querySelector(".tag-list")


const plugin_list_template = `
<li class="searchable" data-uuid="{{plugin_uuid}}">
    <button class="plugin-btn" data-toggle="tab" data-type="plugin" id="plugin-btn-{{plugin_id}}">
        {{plugin_name}}
    </button>
</li>
`
const plugin_report_list_template = `
<li class="searchable" data-uuid="{{plugin_uuid}}">
    <button class="plugin-btn bg-danger" data-toggle="tab" data-type="report" id="plugin-btn-{{report_id}}">
        {{plugin_name}}
    </button>
</li>
`


function setContent(plugin_parent, report=false, report_content=null){
    if (plugin_parent === null){
        plugin_content.innerHTML = ""
        return
    }
    function highlightMarkdown(){
        plugin_content.querySelectorAll(`#md-${plugin_parent.uuid} pre code`).forEach(elem => {
            hljs.highlightElement(elem)
        })
    }
    if(report){
        $.ajax({
            url: `?get_plugin=${plugin_parent.uuid}`,
            success: (response) => {
                let plugin = response.data
                plugin_content.innerHTML = plugin_report_content_template.innerHTML
                    .replaceAll("report_id", report_content.id)
                    .replaceAll("report_by", report_content.creator)
                    .replaceAll("report_created", new Date(report_content.created).toLocaleString("de-DE"))
                    .replaceAll("report_type", report_content.type)
                    .replaceAll("report_reason", report_content.description)

                    .replaceAll("plugin_id", plugin.id)
                    .replaceAll("plugin_uuid", plugin.uuid)
                    .replaceAll("plugin_name", plugin.plugin_name)
                    .replaceAll("plugin_created", new Date(plugin.created*1000).toLocaleString("de-DE"))
                    .replaceAll("plugin_creator", plugin.creator)
                    .replaceAll("plugin_downloads", plugin.downloads)
                    .replaceAll("plugin_short_description", plugin.short_description)
                    .replaceAll("plugin_description_md", plugin.description_md)
                    .replaceAll("plugin_description", plugin.description.replaceAll("\n", "<br>"))
                    .replaceAll("plugin_tags", plugin.tags)
                    .replaceAll("plugin_updated", new Date(plugin.updated*1000).toLocaleString("de-DE"))
                highlightMarkdown()
            }
        })
    }else{
        $.ajax({
            url: `?get_plugin=${plugin_parent.uuid}`,
            success: (response) => {
                let plugin = response.data
                plugin_content.innerHTML = plugin_content_template.innerHTML
                    .replaceAll("plugin_id", plugin.id)
                    .replaceAll("plugin_uuid", plugin.uuid)
                    .replaceAll("plugin_name", plugin.plugin_name)
                    .replaceAll("plugin_created", new Date(plugin.created*1000).toLocaleString("de-DE"))
                    .replaceAll("plugin_creator", plugin.creator)
                    .replaceAll("plugin_downloads", plugin.downloads)
                    .replaceAll("plugin_short_description", plugin.short_description)
                    .replaceAll("plugin_description_md", plugin.description_md)
                    .replaceAll("plugin_description", plugin.description.replaceAll("\n", "<br>"))
                    .replaceAll("plugin_tags", plugin.tags)
                    .replaceAll("plugin_updated", new Date(plugin.updated*1000).toLocaleString("de-DE"))
                highlightMarkdown()
            }
        })
    }
}

function load_plugins(callback){
    $.ajax({
        url: "?get_plugins",
        success: (response) => {
            plugin_list.innerHTML = ``
            for(let plugin of response.data){
                plugin_list.innerHTML += plugin_list_template
                    .replaceAll("{{plugin_id}}", plugin.id)
                    .replaceAll("{{plugin_uuid}}", plugin.uuid)
                    .replaceAll("{{plugin_name}}", plugin.plugin_name)
                setTimeout(()=>{
                        plugin_list.querySelector(`#plugin-btn-${plugin.id}[data-type='plugin']`).addEventListener("click", ()=>{
                            if(plugin.id !== page) {
                                document.querySelectorAll(`.plugin-btn`).forEach(elem => {
                                    elem.classList.remove("active")
                                })
                                plugin_content.innerHTML = "<div class='spinner-border'></div>"
                                setContent(plugin)
                                page = plugin.id
                            }
                    })
                }, 400)
            }
            callback?.()
        }
    })
}
function load_plugins_reports(callback){
    $.ajax({
        url: "?get_plugins_reports",
        success: (response) => {
            plugin_report_list.innerHTML = ``
            for(let plugin_report of response.data){
                plugin_report_list.innerHTML += plugin_report_list_template
                    .replaceAll("{{report_id}}", plugin_report.id)
                    .replaceAll("{{plugin_uuid}}", plugin_report.plugin_uuid)
                    .replaceAll("{{plugin_name}}", plugin_report.plugin.plugin_name)
                setTimeout(()=>{
                        plugin_report_list.querySelector(`#plugin-btn-${plugin_report.id}[data-type='report']`).addEventListener("click", ()=>{
                            if(`${plugin_report.plugin_uuid}___${plugin_report.id}` !== page) {
                                document.querySelectorAll(`.plugin-btn`).forEach(elem => {
                                    elem.classList.remove("active")
                                })
                                plugin_content.innerHTML = "<div class='spinner-border'></div>"
                                setContent({uuid: plugin_report.plugin_uuid}, true, plugin_report)
                                page = `${plugin_report.plugin_uuid}___${plugin_report.id}`
                            }
                    })
                }, 200)
            }
            callback?.()
        }
    })
}


function load_all() {
    // load_plugins(
    //     load_plugins_reports
    // )
    load_plugins_reports(
        load_plugins
    )
    load_tags()
}
{
    load_all()
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
            load_all()
            setContent(null)
        })

        request.open("POST", "/acp/plugins")
        request.send(data)
    })
    modal.show()
}
function delete_report(id){
    let data = new FormData()
    let request = new XMLHttpRequest()

    data.append("remove_report", id)

    request.addEventListener("load", _ => {
        load_all()
        setContent(null)
    })

    request.open("POST", "/acp/plugins")
    request.send(data)
}
function delete_reports(uuid){
    let data = new FormData()
    let request = new XMLHttpRequest()

    data.append("remove_reports", uuid)

    request.addEventListener("load", _ => {
        load_all()
        setContent(null)
    })

    request.open("POST", "/acp/plugins")
    request.send(data)
}


function load_tags(){
    let tag_template =
        `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            tag_name
            <span class="badge btn btn-danger" onclick="delete_tag('tag_name')">Delete</span>
        </li>
        `
    $.ajax({
        url: "?get_tags",
        success: (response) => {
            tag_list.innerHTML = ``
            for(let tag of response.data){
                tag_list.innerHTML += tag_template.replaceAll("tag_name", tag)
            }
        }
    })
}
function add_tag(){
    let tag = prompt("Enter a tag name:")
    $.ajax({
        method: "POST",
        data: {
            add_tag: tag
        },
        success: _ => {
            load_tags()
        }
    })
}
function delete_tag(tag){
    $.ajax({
        method: "POST",
        data: {
            remove_tag: tag
        },
        success: _ => {
            load_tags()
        }
    })
}