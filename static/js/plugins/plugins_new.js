const plugin_name = document.querySelector("input[name=plugin_name]")
const plugin_short_description = document.querySelector("input[name=plugin_short_description]")
const plugin_icon = document.querySelector("input[name=plugin_icon]")
const plugin_banner = document.querySelector("input[name=plugin_banner]")
const plugin_tags = document.querySelectorAll(".plugin_tag")
const plugin_description = document.querySelector("textarea[name=plugin_description]")
const plugin_description_preview = document.querySelector(".description-preview-div")

const accept_1 = document.querySelector("#check_1")
const accept_2 = document.querySelector("#check_2")

{
    plugin_name.addEventListener("keyup", e => {
        document.querySelector("#plugin-name-preview").innerText = e.target.value !== "" ? e.target.value : "Plugin Banner"
    })

    plugin_icon.addEventListener("change", e => {
        let reader = new FileReader()

        let filename = e.target.value.split("\\").pop()
        let file = e.target.files[0]

        if(filename !== ""){
            if(file.size > 5000000){
                e.preventDefault()
                document.querySelector(".icon-label").classList.remove("selected")
                document.querySelector(".icon-label").innerText = "No file chosen"
                document.querySelector(".custom-file-preview").src = "/static/img/no_img.png"
                alert("Maximum filesize is 5 MB")
                e.target.value = ""
            }else{
                document.querySelector(".icon-label").classList.add("selected")
                document.querySelector(".icon-label").innerText = `Selected: ${filename}`
                reader.readAsDataURL(file)
            }
        }else{
            document.querySelector(".icon-label").classList.remove("selected")
            document.querySelector(".icon-label").innerText = "No file chosen"
        }

        reader.onload = e => {
            document.querySelector(".custom-file-preview").src = e.target.result
        }

    })

    plugin_banner.addEventListener("change", e => {
        let reader = new FileReader()

        let filename = e.target.value.split("\\").pop()
        let file = e.target.files[0]

        if(filename !== ""){
            if(file.size > 5000000){
                e.preventDefault()
                document.querySelector(".banner-label").classList.remove("selected")
                document.querySelector(".banner-label").innerText = "No file chosen"
                document.querySelector(".jumbotron").style.backgroundImage = "none"
                alert("Maximum filesize is 5 MB")
                e.target.value = ""
            }else{
                document.querySelector(".banner-label").classList.add("selected")
                document.querySelector(".banner-label").innerText = `Selected: ${filename}`
                reader.readAsDataURL(file)
            }
        }else{
            document.querySelector(".banner-label").classList.remove("selected")
            document.querySelector(".banner-label").innerText = "No file chosen"
            document.querySelector(".jumbotron").style.backgroundImage = "none"
        }

        reader.onload = e => {
            document.querySelector(".jumbotron").style.backgroundImage = `url("${e.target.result}")`
        }

    })

    plugin_description.addEventListener("change", e => {
        let md = new remarkable.Remarkable({
            html:         true,
            xhtmlOut:     false,
            breaks:       true,
            langPrefix:   'language-',
            typographer:  false,
            quotes: '“”‘’',
            highlight: function (/*str, lang*/) { return ''; }
        })
        plugin_description_preview.innerHTML = md.render(e.target.value)
    })
}

document.querySelector("#submit-btn").addEventListener("click", e => {
    if(plugin_name.value !== "" && plugin_short_description.value !== "" && plugin_icon.files.length === 1 && plugin_banner.files.length === 1 && plugin_description.value !== "" && accept_1.checked && accept_2.checked){
        e.preventDefault()

        let plugin_tags_li = []
        for(let tag of plugin_tags){
            if(tag.checked){
                plugin_tags_li.push(tag.name)
            }
        }

        let data = new FormData()
        let request = new XMLHttpRequest()

        data.append("plugin_create", null)
        data.append("plugin_name", plugin_name.value)
        data.append("plugin_short_description", plugin_short_description.value)
        data.append("plugin_icon", plugin_icon.files[0])
        data.append("plugin_banner", plugin_banner.files[0])
        data.append("plugin_tags", plugin_tags_li.join(","))
        data.append("plugin_description", plugin_description.value)

        request.addEventListener("load", _ => {
            location.href = `/plugins/${request.response.data}`
        })

        request.open("POST", "/plugins/new")
        request.responseType = "json"
        request.send(data)
    }
})