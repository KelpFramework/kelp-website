function reset_password(e){
    e.preventDefault()

    let entry = document.querySelector("input[name=username]").value
    let modal = new Modal("modal-wrapper", {heading: "Reset Password"}, "extralarge")

    modal.Text("Please enter your account's Username so we can send you a message to your linked E-Mail address!")
    modal.Linebreak()
    modal.Input("username_input", "text", "Username", "", entry !== "" ? entry : undefined)
    modal.Custom(`
        <span id="modal-error" class="text-danger"></span>
        <div class="container text-center">
            <br>
            You will receive an email containing a link.
            <br>
            This link will take you to a page on which you can set a new password.
        </div>
    `)
    let error = document.querySelector("#modal-error")
    modal.FunctionButton("submit_btn", "Send Message", "btn btn-outline-warning w-100", "click", (btn) => {
        let inp = document.querySelector("#username_input")
        if(inp.value==="") return
        btn.target.hidden = true
        error.innerText = ""
        $.ajax({
            url: "?reset_password",
            method: "POST",
            data: {username: inp.value},
            success: (response) => {
                if(response.data.successful){
                    modal.wrapper_body.innerHTML = ""
                    modal.wrapper_footer.innerHTML = ""
                    modal.Text("Please check your Inbox. You should have received an E-Mail from us!")
                }else{
                    error.innerText = "There is no account with this username!"
                    btn.target.hidden = false
                }
            }
        })
    })

    modal.show()
}

{
    document.querySelector(".passwd-reset").addEventListener("click", reset_password)
}