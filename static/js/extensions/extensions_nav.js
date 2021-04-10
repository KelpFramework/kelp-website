let end_reached = false

let dynamic_counter = 1
let delay_time = 0

const loading_amount = 12

const wrapper_normal = document.querySelector(".row-normal")
const wrapper_pinned = document.querySelector(".row-pinned")
const loader = document.querySelector(".spinner-holder .spinner-border")

const card_template = `
    <div class="col-3 ext-card">
        <div class="card">
            <div class="card-body">
                <small class="material-icons {{hidden}}">push_pin</small>
                <img src="/extensions?picture={{uuid}}" alt="{{title}}">
                <div class="spinner">
                    <div class="spinner-border"></div>
                </div>
                <a href="/extensions/{{uuid}}" class="stretched-link"></a>
            </div>
            <div class="card-footer">
                <h4>{{title}}</h4>
                <span>{{description}}</span>
            </div>
        </div>
    </div>
`

{
    load_modules()
    document.addEventListener("scroll", _ => {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 200){
            load_modules()
        }
    })
}

function load_modules(){
    if(new Date().getTime() > delay_time + 1000 && !end_reached) {
        loader.hidden = false
        delay_time = new Date().getTime()
        let position = document.body.scrollTop
        $.ajax({
            url: `?get_modules&page=${dynamic_counter}&amount=${loading_amount}`,
            success: (response) => {
                for (let extension of response.data) {
                    // window.scrollTo(0, position)
                    let template = extension.pinned ? wrapper_pinned : wrapper_normal
                    template.innerHTML += card_template
                        .replaceAll("{{title}}", extension.module_name)
                        .replaceAll("{{description}}", extension.short_description)
                        .replaceAll("{{uuid}}", extension.uuid)
                        .replaceAll("{{hidden}}", extension.pinned ? "" : "hidden")
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