{
    const top_link = document.querySelector(".link-top")
    $(top_link).fadeOut(0)

    document.addEventListener("scroll", _=>{
        if(document.body.scrollTop > 800) $(top_link).fadeIn(200)
        else $(top_link).fadeOut(200)
    })
    top_link.querySelector("button").addEventListener("click", _ => {
        $("html,body").animate({scrollTop: 0}, 500)
    })
}
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
        for(let entry of elem.classList){
            let exclude = ["card-link", "stretched-link", "btn", "list-group-item", "list-group-item-action", "dropdown-item", "nav-link"]
            if(exclude.includes(entry)) return
        }
        if(elem.href.includes(`${location.host}${location.pathname}#`)){
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