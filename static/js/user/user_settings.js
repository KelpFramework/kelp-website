function ValidateEmail(mail){
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)
}



function change_avatar(e){
    let username = e.target.getAttribute("data-user")
    let modal = new Modal("modal-wrapper", {heading: "Change Avatar"}, "large")

    modal.Custom(`<img id="avatar-preview" src="/user?avatar=${username}" height="256px" width="256px" class="border border-primary">`)

    let input = modal.FileInput("avatar-input", false, "btn btn-outline-primary ml-5", "image/png,image/jpeg,image/gif")
    let preview = document.querySelector("#avatar-preview")

    input.addEventListener("change", (e) => {
        if (e.target.files.length !== 1){
            preview.src = `/user?avatar=${username}`
            return
        }
        if(e.target.files[0].size < 2000000){
            let reader = new FileReader()
            let file = e.target.files[0]

            reader.readAsDataURL(file)
            reader.onload = e2 => {
                preview.src = e2.target.result
            }
        }else{
            e.target.value = ""
            preview.src = `/user?avatar=${username}`
            alert("Max file size is 2MB!")
        }
    })

    modal.FunctionButton("confirm-btn", "Upload and change", "btn btn-outline-warning", "click", e => {
        if (input.files.length !== 1){
            return
        }

        e.target.hidden = true
        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("change_avatar", null)
        data.append("avatar", input.files[0])

        request.open("POST", "/profile/settings")
        request.send(data)

        request.addEventListener("load", e => {
            modal.destroy()
            location.reload()
        })
    })

    modal.show()
}

function edit_description(){
    let current = document.querySelector(`.description-raw`).innerHTML
    let modal = new Modal("modal-wrapper", {heading: "Change Description"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sg_a21" method="post">
                <textarea type="text" class="form-control" name="description" placeholder="Description">${current}</textarea>
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

        e.preventDefault()

        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("edit_description", null)
        data.append("description", description.value)

        request.addEventListener("load", _ => {
            location.reload()
        })

        request.open("POST", "/profile/settings")
        request.send(data)
    })
    modal.show()
}
function change_email(current){
    let modal = new Modal("modal-wrapper", {heading: "Change E-Mail"}, "large")
    modal.Custom(`
        <div>
            <form id="form_sg_a51" method="post">
                <input type="email" value="${current}" class="form-control" name="mail" placeholder="E-Mail" required>
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
        let email = wrapper.querySelector("input[name='mail']")

        if(email.value!=="" && ValidateEmail(email.value)){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("change_email", null)
            data.append("email", email.value)

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/profile/settings")
            request.send(data)
        }
    })
    modal.show()
}

function change_password(){
    let modal = new Modal("modal-wrapper", {heading: "Change Password"}, "large")
    modal.Custom(`
        <input type="password" class="form-control" placeholder="Current password" id="pwd_old" pattern="[A-Za-z0-9-_+%€/]{6,}" title="At least 6 characters"> <br>
        <input type="password" class="form-control" placeholder="New password" id="pwd_new" pattern="[A-Za-z0-9-_+%€/]{6,}" title="At least 6 characters"> <br>
        <input type="password" class="form-control" placeholder="Repeat new password" id="pwd_new2" pattern="[A-Za-z0-9-_+%€/]{6,}" title="At least 6 characters"> <br>
        <span class="text-danger" id="pwd_err"></span>
    `)

    let confirm_btn = modal.Button("pwd_confirm", "Change Password", "btn-outline-warning w-100")
    let pwd_old = document.getElementById("pwd_old")
    let pwd_new = document.getElementById("pwd_new")
    let pwd_new2 = document.getElementById("pwd_new2")
    let pwd_err = document.getElementById("pwd_err")

    function errorOut(err){
        pwd_err.innerText = err
    }

    confirm_btn.addEventListener("click", ev => {
        let form = /[A-Za-z0-9-_+%€/]{6,}/
        let old = pwd_old.value
        let new1 = pwd_new.value
        let new2 = pwd_new2.value

        if(old === "" | new1 === "" | new2 === "") {
            errorOut("Please fill out every input")
            return
        }
        if(!form.test(old)){
            errorOut("Current password does not match regex: A-Za-z0-9-_+%€/")
            return
        }
        if(!form.test(new1) | !form.test(new2)){
            errorOut("New password does not match regex: A-Za-z0-9-_+%€/")
            return
        }
        if(!(new1 === new2)){
            errorOut("New passwords do not match")
            return
        }

        confirm_btn.disabled = true
        pwd_old.disabled = true
        pwd_new.disabled = true
        pwd_new2.disabled = true
        $.post(document.location.href, {
            change_password: null,
            old_password: pwd_old.value,
            new_password: pwd_new.value
        }, r => {
            console.log(r)
            if (r.state) {
                location.href = "/logout"
            } else {
                confirm_btn.disabled = false
                pwd_old.disabled = false
                pwd_new.disabled = false
                pwd_new2.disabled = false
                errorOut("Current Password wrong")
            }
        }).fail(err => {
            confirm_btn.disabled = false
            pwd_old.disabled = false
            pwd_new.disabled = false
            pwd_new2.disabled = false
            errorOut(err.description)
        })
    })
    modal.show()
}

function change_email_settings(){
    let modal = new Modal("modal-wrapper", {heading: "Email settings"}, "large")
    modal.Custom(`
        <form id="form_sg_a123" method="post">
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="email-switch1" name="email_visible">
                <label class="custom-control-label" for="email-switch1">Visible for other users</label>
            </div>
        </form>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-warning",
        "Save changes",
        `form="form_sg_a123"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sg_a123")
        let inputs = wrapper.querySelectorAll("input[class='custom-control-input']")

        e.preventDefault()

        let settings = {}
        let data = new FormData()
        let request = new XMLHttpRequest()

        inputs.forEach(elem => {
            settings[elem.getAttribute("name")] = elem.checked
        })
        data.append("email_settings", JSON.stringify(settings))

        request.addEventListener("load", _ => {
            location.reload()
        })

        request.open("POST", "/profile/settings")
        request.send(data)
    })
    modal.show()
}

function delete_data(mode){
    function random(length){
        return Math.random().toString(16).substr(2, length)
    }

    let modal = new Modal("modal-wrapper", {heading: "Are you sure"}, "large")
    let code = random(6)
    modal.Custom(`
        <h5>Are you sure you want to continue?</h5>
        <span class="mt-3">Please enter the following to proceed: ${code}</span>
        <div>
            <form id="form_sg_a55" method="post">
                <input type="text" class="form-control" name="verify" placeholder="${code}" required>
            </form>
        </div>
    `)
    modal.Input_footer(
        "form_submit",
        "submit",
        "Save",
        "",
        "btn btn-danger",
        "Delete",
        `form="form_sg_a55"`
    ).addEventListener("click", e => {
        let wrapper = document.querySelector("#form_sg_a55")
        let verify = wrapper.querySelector("input[name='verify']")

        if(verify.value === code){
            e.preventDefault()

            let data = new FormData()
            let request = new XMLHttpRequest()

            data.append("delete_data", mode)

            request.addEventListener("load", _ => {
                location.reload()
            })

            request.open("POST", "/profile/settings")
            request.send(data)
        }
    })
    modal.show()
}


{
    document.querySelector(".user-img-change").addEventListener("click", change_avatar)

    document.querySelector("#cookies-allowed").innerText = getCookie("acceptCookies") === "true" ? "Yes" : "No*"
    document.querySelector("#cookies-count").innerText = getCookieCount() + "*"
}