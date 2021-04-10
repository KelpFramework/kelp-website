let end_reached = false

let dynamic_counter = 1
let delay_time = 0

let filters = false
let filtered = false
let force_clear = false

const loading_amount = 12

const tag_form = document.querySelector("#tags-cll form")
const wrapper = document.querySelector("#plugins-main .list-group")
const loader = document.querySelector(".spinner-holder .spinner-border")
const query_info = document.querySelector("#query-result")

const list_template = `
    <li class="list-group-item media row m-0">
        <a href="/plugins/plugin_uuid">
            <img class="mr-3" src="/plugins?icon=plugin_uuid" alt="plugin_name_picture">
        </a>
        <div class="media-body pt-1">
            <h5><a href="/plugins/plugin_uuid">plugin_name</a><small> - by <span href="/user/plugin_creator" onclick="open_link(this)">plugin_creator</span></small></h5>
            <p>plugin_short_description</p>
        </div>
        <div class="col-lg-5 col-md-12 p-0">
            <div>plugin_tags</div>
        </div>
    </li>
`

function open_link(e){
    location.href = e.getAttribute("href")
}

{
    load_tags()
    load_plugins()
    document.addEventListener("scroll", _ => {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 200){
            load_plugins()
        }
    })

    if(screen.width > 481){
        let btn = document.querySelector("#tags-toggle")
        btn.click()
        btn.removeAttribute("data-toggle")
    }
}


tag_form.addEventListener("submit", e => {
    e.preventDefault()
    apply_filters()
})


function apply_filters(){
    let filter_data_chk = get_filters(true)
    if(filter_data_chk.search !== "" || filter_data_chk.tags !== []) {
        filters = true
        filtered = false
        load_plugins()
    }
}

function reset_filters(){
    tag_form.querySelectorAll("input[type=checkbox]").forEach(elem => {
        elem.checked = false
    })
    if (filters) {
        filters = false
        filtered = false
        dynamic_counter = 1
        end_reached = false
        force_clear = true
        tag_form.querySelector("input[type=text]").value = ""
        load_plugins()
    }
}


function get_filters(only=false){
    let search = tag_form.querySelector("input[type=text]").value
    let tags_li = tag_form.querySelectorAll("input[type=checkbox]")
    let tags = []
    for(let tag of tags_li){
        if(tag.checked){
            tags.push(tag.name)
        }
    }
    if(only){
        return {search, tags}
    }
    return `${search ? "&q="+search : ""}${tags !== [] ? "&tags="+tags.join(",") : ""}`
}
function load_plugins(){
    function makeTagList(tags){
        let tag_list = tags.split(",")
        let output = ""
        for (let tag of tag_list){
            output += `<span class="badge badge-info m-1">${tag}</span>`
        }
        return output
    }
    if((new Date().getTime() > delay_time + 1000 && !end_reached) || (filters && !filtered)) {
        loader.hidden = false
        delay_time = new Date().getTime()
        if(filters && !filtered) {
            dynamic_counter = 1
            end_reached = false
        }
        $.ajax({
            url: `?get_plugins&page=${dynamic_counter}&amount=${loading_amount}${filters ? get_filters() : ""}`,
            success: (response) => {
                if(filters && !filtered) {
                    wrapper.innerHTML = ""
                    filtered = true
                    window.scrollTo(0, 0)
                    query_info.innerText = `Your query returned a total of ${response.count} result${response.count !== 1 ? "s" : ""} \n\n`
                }else{
                    query_info.innerText = ""
                }
                if(force_clear){
                    wrapper.innerHTML = ""
                    force_clear = false
                }
                for (let plugin of response.data) {
                    wrapper.innerHTML += list_template
                        .replaceAll("plugin_name", plugin.plugin_name)
                        .replaceAll("plugin_creator", plugin.creator)
                        .replaceAll("plugin_short_description", plugin.short_description)
                        .replaceAll("plugin_uuid", plugin.uuid)
                        .replaceAll("plugin_tags", makeTagList(plugin.tags))
                }
                dynamic_counter += 1
                loader.hidden = true
            },
            error: (response) => {
                if(response.status === 404){
                    end_reached = true
                }
                loader.classList.remove("spinner-border")
                loader.innerHTML = "<span>End of content</span>"
            }
        })
    }
}
function load_tags(){
    const tag_wrapper = document.querySelector("#tags-cll ul")
    const tag_template = `
    <li>
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="switch_tag" name="tag">
            <label class="custom-control-label" for="switch_tag">tag</label>
        </div>
    </li>
    `

    $.ajax({
        url: `?get_tags`,
        success: (response) => {
            for (let tag of response.data) {
                tag_wrapper.innerHTML += tag_template.replaceAll("tag", tag)
            }
        }
    })
}