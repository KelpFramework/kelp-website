{
    document.querySelectorAll(".link-expander-card .link-expander").forEach(elem => {
        elem.innerHTML += '<span class="material-icons">expand_more</span>'
    })
    function toggle(e){
        e.target.parentElement.querySelector(".link-expander-card .link-expander span.material-icons").classList.toggle("expanded")
    }
    $(".link-expander-card .collapse").on("show.bs.collapse", toggle).on("hide.bs.collapse", toggle)
}
{
    document.querySelectorAll("a").forEach(elem => {
        if (elem.target === "_blank") return
        if (elem.hasAttribute("onclick")) return
        if (elem.hasAttribute("data-toggle")) return
        if (elem.href === (location.protocol + "//" + location.host + "/#")) return
        for(let entry of elem.classList){
            let exclude = ["card-link", "stretched-link", "btn", "list-group-item", "list-group-item-action", "dropdown-item", "nav-link"]
            if(exclude.includes(entry)) return
        }
        if(elem.href.includes(`#`)){
            elem.addEventListener("click", e => {
                e.preventDefault()
                let linked = document.getElementById(elem.href.split("#").pop())
                $("html, body").animate({ scrollTop: $($(elem).attr("href")).offset().top-90 }, 500, _ => {
                    linked.style.transition = "color .3s"
                    linked.classList.add("text-warning")
                    setTimeout(_ => {
                        linked.classList.remove("text-warning")
                    }, 500)
                })
            })
        }
    })
}