function init() {
    checkLogin();
    console.log(localStorage);
}
window.addEventListener("load", init); // Kör en EventListener i stället för onload här för att inte krocka med andra JS dokument //


function checkLogin() {
    const loginBtn = document.querySelector("#loginBtn");
    const redirectBtn = document.querySelector("#redirectButton")

    const name = localStorage.getItem("loginName");
    const password = localStorage.getItem("correctPassword");

    // Kollar om localStorage stämmer för att starta inloggad om man är det //
    if (name === "Kalle" && password === "true") {
        loginBtn.textContent = "Logga ut";
        // Ändrar så man loggar ut med knappen i stället för att logga in //
        loginBtn.addEventListener("click", event => {
            event.preventDefault();

            localStorage.removeItem("loginName");
            localStorage.removeItem("correctPassword");

            window.location.reload(); // Laddar om sidan //
        })
    } else if (redirectBtn){
        redirectBtn.style.display = "none";
    }
}