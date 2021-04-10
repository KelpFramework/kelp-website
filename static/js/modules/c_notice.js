(function () {
    "use strict";
    let cookieAlert = document.querySelector(".cookiealert");
    let acceptCookies = document.querySelector(".acceptcookies");
    if (!cookieAlert) {
       return;
    }
    cookieAlert.offsetHeight;
    if (!getCookie("acceptCookies")) {
        cookieAlert.classList.add("show");
    }
    acceptCookies.addEventListener("click", function () {
        setCookie("acceptCookies", true, 365);
        cookieAlert.classList.remove("show");
        window.dispatchEvent(new Event("cookieAlertAccept"))
    });
    function setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    document.querySelector(".cookie-options").addEventListener("click", _ => {
        let modal = new Modal("modal-wrapper", {heading: "Cookie Info"}, "large")
        modal.Custom(`
            <p>
                We use cookies to perform various functions on our webpage. <br>
                Thus they are vital for this site to function. <br><br>
                If you want to know more about what cookies do, you can watch the <a class="text-primary" href="http://cookiesandyou.com/" target="_blank">Cookie Video</a>.
            </p>
            <p>
                Should you not want to receive our cookies, you may have to leave this website.<br>
                You can also refer to our <a href="/legal/privacy" target="_blank">Privacy Policy</a> for more info on how we in particular use cookies.
            </p>
        `)
        modal.FunctionButton("cl_btn", "I understand and Accept", "btn btn-primary", "click", _ => {
            modal.destroy()
            document.querySelector(".acceptcookies").click()
        })
        modal.FunctionButton("cl_btn2", "Leave this page", "btn btn-danger", "click", _ => {
            modal.destroy()
            document.head.innerHTML = ""
            document.body.innerText = "You may close this tab now."
        })
        modal.show()
    })

})();
