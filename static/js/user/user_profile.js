let end_reached = false
let dynamic_counter = 1
let delay_time = 0

const loading_amount = 12


const plugins_btn = document.querySelector(".nav-link[href='#tab-plugins']")
const extensions_btn = document.querySelector(".nav-link[href='#tab-extensions']")
const plugins_tab = document.querySelector("#tab-plugins")
const extensions_tab = document.querySelector("#tab-extensions")
const loader = document.querySelector(".spinner-holder .spinner-border")

function starter(){
    $.ajax({
        url: `/user?get_extensions&page=${1}&amount=${1}&username=${username}`,
        success: response => {
            if(response.data.length > 0){
                document.querySelector(".type-selector").hidden = false
            }else{
                document.querySelector(".type-only").hidden = false
            }
        }
    })

    plugins_btn.click()
    load_plugins()

    plugins_btn.addEventListener("click", plugins)
    extensions_btn.addEventListener("click", extensions)

    function prepare(){
        plugins_tab.innerHTML = ""
        extensions_tab.innerHTML = ""

        loader.classList.add("spinner-border")
        loader.innerHTML = ""
        loader.hidden = true

        end_reached = false
        dynamic_counter = 1
        delay_time = 0
    }
    function plugins(){
        prepare()
        load_plugins()
    }
    function extensions(){
        prepare()
        load_extensions()
    }

    document.addEventListener("scroll", _ => {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 200){
            if(plugins_btn.classList.contains("active")){
                load_plugins()
            }else{
                load_extensions()
            }
        }
    })
}
if (plugins_tab){
    starter()
}


const plugin_card_template = `
    <div class="card">
        <div class="card-body">
            <img src="/plugins?icon=plugin_uuid" alt="plugin_name">
            <div class="spinner">
                <div class="spinner-border"></div>
            </div>
            <a href="/plugins/plugin_uuid" class="stretched-link"></a>
        </div>
        <div class="card-footer">
            <h4>plugin_name</h4>
            <span>plugin_short_description</span>
        </div>
    </div>
`

const extension_card_template = `
    <div class="card">
        <div class="card-body">
            <img src="/extensions?picture=extension_uuid" alt="extension_name">
            <div class="spinner">
                <div class="spinner-border"></div>
            </div>
            <a href="/extensions/extension_uuid" class="stretched-link"></a>
        </div>
        <div class="card-footer">
            <h4>extension_name</h4>
            <span>extension_short_description</span>
        </div>
    </div>
`


function load_plugins(){
    if(new Date().getTime() > delay_time + 1000 && !end_reached) {
        loader.hidden = false
        delay_time = new Date().getTime()
        $.ajax({
            url: `/user?get_plugins&page=${dynamic_counter}&amount=${loading_amount}&username=${username}`,
            success: (response) => {
                if (response.data.length === 0){
                    plugins_tab.innerHTML = "<div class='text-center w-100 mt-3'><h6>This user has not created any plugins</h6></div>"
                }
                for (let plugin of response.data) {
                    let elem = document.createElement("div")
                    elem.classList.add("col-2", "ext-card")
                    elem.innerHTML += plugin_card_template
                        .replaceAll("plugin_name", plugin.plugin_name)
                        .replaceAll("plugin_short_description", plugin.short_description)
                        .replaceAll("plugin_uuid", plugin.uuid)
                    plugins_tab.appendChild(elem)
                    document.querySelector(`img[alt='${plugin.plugin_name}']`).addEventListener("load", e => {
                        e.target.parentNode.removeChild(
                            e.target.parentNode.querySelector(".spinner")
                        )
                    })
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

function load_extensions(){
    if(new Date().getTime() > delay_time + 3000 && !end_reached) {
        loader.hidden = false
        delay_time = new Date().getTime()
        $.ajax({
            url: `/user?get_extensions&page=${dynamic_counter}&amount=${loading_amount}&username=${username}`,
            success: (response) => {
                if (response.data.length === 0){
                    extensions_tab.innerHTML = "<div class='text-center w-100 mt-3'><h6>This user has not created any extensions</h6></div>"
                }
                for (let extension of response.data) {
                    let elem = document.createElement("div")
                    elem.classList.add("col-2", "ext-card")
                    elem.innerHTML += extension_card_template
                        .replaceAll("extension_name", extension.module_name)
                        .replaceAll("extension_short_description", extension.short_description)
                        .replaceAll("extension_uuid", extension.uuid)
                    extensions_tab.appendChild(elem)
                    document.querySelector(`img[alt='${extension.module_name}']`).addEventListener("load", e => {
                        e.target.parentNode.removeChild(
                            e.target.parentNode.querySelector(".spinner")
                        )
                    })
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

function admin_options(user, user_is_admin, user_is_suspended){
    let modal = new Modal("modal-wrapper", {heading: "Admin Options"}, "large")
    modal.FunctionButton_body(
        "admin-switch",
        user_is_admin ? "Remove Admin" : "Make Admin",
        `btn ${user_is_admin ? "btn-warning" : "btn-outline-warning"} w-100`,
        "click",
        _ => {
            $.ajax({
                url: "/user",
                method: "POST",
                data: {
                    switch_admin: user
                },
                success: _ => {
                    location.reload()
                }
            })
        }
    )
    modal.FunctionButton_body(
        "suspend-switch",
        user_is_suspended ? "Remove Suspension" : "Suspend",
        `btn ${user_is_suspended ? "btn-danger" : "btn-outline-danger"} w-100 mt-2`,
        "click",
        _ => {
            if (user_is_suspended){
                $.ajax({
                    url: "/user",
                    method: "POST",
                    data: {
                        un_suspend_user: user
                    },
                    success: ()=>{
                        location.reload()
                    }
                })
            }else{
                modal.clear()
                modal.set_heading("Suspend Account")
                modal.Custom(`
                    <div>
                        <label class="w-100">
                            Suspend until:
                            <input id="banUser-inp" type="datetime-local" class="form-control bg-dark text-light">
                        </label>
                        <label>
                            Suspend permanently:
                            <input id="banUser-perm" type="checkbox" class="checkbox">
                        </label>
                        <hr>
                        <textarea id="banUser-message" placeholder="Reason (Text, Markdown or X-/HTML)" class="form-control bg-dark text-light"
                        spellcheck="false" autocomplete="off"></textarea>
                    </div>
                    <br><br>
                    <h5>Warning! Suspending the account will also delete all associated Reports.</h5>
                `)

                let ban_until = document.getElementById("banUser-inp")
                let ban_inf = document.getElementById("banUser-perm")
                let ban_message = document.getElementById("banUser-message")

                ban_inf.addEventListener("click", e => {
                    ban_until.disabled = e.target.checked
                })

                modal.FunctionButton("no", "Cancel", "btn btn-success", "click", _ => {
                    modal.destroy()
                    admin_options(user, user_is_admin, user_is_suspended)
                })

                modal.FunctionButton("yes", "Suspend", "btn btn-warning", "click", ()=>{
                    if((!ban_until.value && !ban_inf.checked) || !ban_message.value) return
                    $.ajax({
                        url: "/user",
                        method: "POST",
                        data: {
                            suspend_user: user,
                            suspend_until: ban_inf.checked ? -1 : new Date(ban_until.value).getTime(),
                            suspend_message: ban_message.value
                        },
                        success: ()=>{
                            modal.destroy()
                            location.reload()
                        }
                    })
                })
            }
        }
    )
    // modal.Custom("<hr>")
    modal.FunctionButton_body(
        "del-switch",
        "Delete user",
        `btn btn-danger w-100 mt-2`,
        "click",
        _ => {
            modal.clear()
            modal.set_heading("Are you sure")
            modal.Text("Are you sure you want to delete this user?")
            modal.FunctionButton("no", "No, cancel", "btn btn-success", "click", _ => {
                modal.destroy()
                admin_options(user, user_is_admin, user_is_suspended)
            })
            modal.FunctionButton("yes", "Yes, delete", "btn btn-danger", "click", _ => {
                $.ajax({
                    url: "/user",
                    method: "POST",
                    data: {
                        delete_user: user
                    },
                    success: _ => {
                        location.href = "/"
                    }
                })
            })
        }
    )

    modal.show()
}