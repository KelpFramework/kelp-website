{
    const input = document.querySelector(".navbar form .search-input input")
    const form = document.querySelector(".navbar form")
    const form_all = document.querySelectorAll(".navbar form *")
    const wrapper = document.querySelector(".navbar")
    const box = wrapper.querySelector(".autocomplete-box")

    function focus_change(e){
        if(e.type === "focusout" && e.relatedTarget === null){
            input.style.width = ""
            input.value = ""
            box.classList.remove("active")
            input.classList.remove("using")
        }else{
            input.style.width = "350px"
        }
    }
    for(let fm of form_all){
        form.addEventListener("focusin", focus_change)
        form.addEventListener("focusout", focus_change)
    }


    input.onkeyup = (e)=>{
        let userData = e.target.value
        let emptyArray = []

        if(userData.length > 2){
            $.ajax({
                url: `/search_engine?search=${userData}`,
                success: (response) => {
                    let suggestions = response.data

                    for(let suggestion of suggestions){
                        emptyArray.push(`
                            <a class="list-group-item list-group-item-action" href="${suggestion.link}">
                                <img src="${suggestion.icon}" alt="${suggestion.name}">
                                <div>
                                    <small>${suggestion.type.toLocaleUpperCase()}</small>
                                    <h6>&nbsp; ${suggestion.name}</h6>
                                </div>
                            </a>
                        `)
                    }

                    showSuggestions(emptyArray)
                }
            })

            box.classList.add("active")
            input.classList.add("using")
        }else{
            box.classList.remove("active")
            input.classList.remove("using")
        }
    }

    function showSuggestions(list){
        let listData
        if(!list.length){
            let userValue = input.value
            listData = `<a class="list-group-item list-group-item-action" href="?search=${userValue}">Search for "${userValue}"</a>`
        }else{
            listData = list.join('')
        }
        box.innerHTML = listData
    }
}
