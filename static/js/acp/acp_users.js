let page = ""

const user_report_list = document.querySelector("#user-report-list")
const user_report_content = document.querySelector("#user-report-content")


const user_report_list_template = `
<li class="searchable" data-uuid="user_report_id">
    <button class="user-report-btn bg-danger" data-toggle="tab" id="user-report-btn-user_report_id">
        user_report_username
    </button>
</li>
`


function setContent(user_report_parent){
    if (user_report_parent === null){
        user_report_content.innerHTML = ""
        return
    }
    $.ajax({
        url: `?get_user_report=${user_report_parent.id}`,
        success: (response) => {
            let user_report = response.data ;console.log(user_report)
            user_report_content.innerHTML = user_report_content_template
                .replaceAll("user_report_id", user_report.id)
                .replaceAll("user_username", user_report.username)
                .replaceAll("user_created", new Date(user_report.user.created).toLocaleString("de-DE"))
                .replaceAll("user_email", user_report.user.email)
                .replaceAll("user_admin", user_report.user.admin)
                .replaceAll("user_report_creator", user_report.creator)
                .replaceAll("user_report_created", new Date(user_report.created).toLocaleString("de-DE"))
                .replaceAll("user_report_type", user_report.type)
                .replaceAll("user_description", user_report.user.description)
                .replaceAll("user_report_reason", user_report.description)
        }
    })
}
function load_user_reports(){
    $.ajax({
        url: "?get_user_reports",
        success: (response) => {
            user_report_list.innerHTML = ``
            for(let user_report of response.data){
                user_report_list.innerHTML += user_report_list_template
                    .replaceAll("user_report_id", user_report.id)
                    .replaceAll("user_report_username", user_report.username)
                setTimeout(()=>{
                    user_report_list.querySelector(`#user-report-btn-${user_report.id}`)
                        .addEventListener("click", ()=>{
                            if(user_report.id !== page) {
                                user_report_content.innerHTML = "<div class='spinner-border'></div>"
                                setContent(user_report)
                                page = user_report.id
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
    load_user_reports()
}

function suspend_user(user){
    let modal = new Modal("modal-wrapper", {heading: "Suspend Account"}, "large")
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

    modal.Button("banUserBtn", "Suspend", "btn-warning").addEventListener("click", (e)=>{
        e.preventDefault()
        if((!ban_until.value && !ban_inf.checked) || !ban_message.value) return
        $.ajax({
            method: "POST",
            data: {
                suspend_user: user,
                suspend_until: ban_inf.checked ? -1 : new Date(ban_until.value).getTime(),
                suspend_message: ban_message.value
            },
            success: ()=>{
                modal.destroy()
                delete_all_user_reports(user)
            }
        })
    })
    modal.show()
}
function delete_user(username){
    let modal = new Modal("modal-wrapper", {heading: "Delete User"}, "large")
    modal.Custom(`
        Are you sure that you want to delete this user?
    `)
    modal.Button(
        "form_submit",
        "Yes, delete",
        "btn-outline-danger",
    ).addEventListener("click", _ => {
        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("remove_user", username)

        request.addEventListener("load", _ => {
            modal.destroy()
            load_user_reports()
            setContent(null)
        })

        request.open("POST", "/acp/users")
        request.send(data)
    })
    modal.show()
}
function delete_user_report(id){
    let data = new FormData()
    let request = new XMLHttpRequest()

    data.append("remove_report", id)

    request.addEventListener("load", _ => {
        load_user_reports()
        setContent(null)
    })

    request.open("POST", "/acp/users")
    request.send(data)
}
function delete_all_user_reports(username){
    let data = new FormData()
    let request = new XMLHttpRequest()

    data.append("remove_reports", username)

    request.addEventListener("load", _ => {
        load_user_reports()
        setContent(null)
    })

    request.open("POST", "/acp/users")
    request.send(data)
}