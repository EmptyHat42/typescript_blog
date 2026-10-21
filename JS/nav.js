function init(){
    checkLogin();
    console.log(localStorage);
}
window.addEventListener("load", init);


function checkLogin(){
    const loginBtn = document.querySelector("#loginBtn");

    const name = localStorage.getItem("loginName");
    const password = localStorage.getItem("correctPassword")

    if (name === "Kalle" && password === "true"){
        loginBtn.textContent = "Logga Ut";

        loginBtn.addEventListener("click", event => {
            event.preventDefault();

            localStorage.removeItem("loginName");
            localStorage.removeItem("correctPassword");

            window.location.reload();
        })
    }
}