{
    let scroll_down_btn = document.querySelector(".scroll-down button")
    let title_bg_blur = document.querySelector(".parallax.first .bg-blur-first")
    let scroll_save = 0

    document.addEventListener("scroll", _=>{
        function change_bigger_than(value, previous, max_change){
            if(value>previous){
                // scrolling down
                if(value >= previous + max_change) return true
            }else{
                // scrolling up
                if(value <= previous - max_change) return true
            }
            return false
        }

        let scroll_position = document.body.scrollTop

        if(scroll_position > 20) scroll_down_btn.classList.add("hide")
        else scroll_down_btn.classList.remove("hide")

        if(scroll_position < 500) {
            if (change_bigger_than(scroll_position, scroll_save, 75)) {
                title_bg_blur.style.backdropFilter = `blur(${scroll_position / 75}px)`
                scroll_save = scroll_position
            }
        }
    })
}


function scrollToElement(pageElement) {
    if(typeof pageElement === "string"){
        pageElement = document.querySelector(pageElement)
    }

    let positionY = -85;
    while(pageElement != null){
        positionY += pageElement.offsetTop;
        pageElement = pageElement.offsetParent;
        $("html,body").animate({scrollTop: positionY}, 500)
    }
}
{
    hljs.initHighlightingOnLoad()
}