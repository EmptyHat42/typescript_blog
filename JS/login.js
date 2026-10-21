// Vi sätter ett par tomma referens-parametrar för att komma åt senare. //
let formRef;
let wrongRef;

// Vi sätter två konstanter som vi kollar emot senare för att se om det är rätt användarnamn och lösenord. //
const namn = "Kalle";
const lösenord = "qwe123";

// Basic init funktion tillsammans med window.onload = init; lite längre ner i koden. //
// Gör så att allt på sidan laddar innan vi kör det som är inuti kodblocket //
function init(){
    formRef = document.querySelector("form"); // Vi plockar datan från vårat formsobjekt. Går att specifiera men vi har endast en just nu så detta funkar. //
    wrongRef = document.querySelector("#wrongDetails"); // Vi plockar datan från en specefik paragraf med id wrongDetails. //

    formRef.addEventListener("submit", event=>{ // Kör kodblocket när vi trycker på submit. //
        event.preventDefault(); // Ser till att submit inte kör webbläsarens standard utan vad vi säger med JS i stället. //
        userAndPass(); // Kör funktionen userAndPass(). //
    });
}
window.onload = init; // // Basic window.onload funktion tillsammans med function init lite längre upp i koden. //



// Vår funktion som läser den sparade localStorage datan och kollar den emot våra konstanter satta längst upp i dokumentet. //
function userAndPass(){
    const name = formRef.elements.name.value; // Vi hämtar input från name.value och sparar som en konstant. //
    const password = formRef.elements.password.value; // Vi hämtar input från password.value och sparar som en konstant. //

    // OM input för användarnamn OCH input för lösenord stämmer överens med våra konstanter längst upp i dokumentet, kör: //
    if(name === namn && password === lösenord){ 
        localStorage.setItem("loginName", name); // Vi sparar konstanten name i localStorage. //
        localStorage.setItem("correctPassword", true); // Vi sparar en flagga för rätt lösenord i localStorage. //
        window.location.href = "index.html";
    }
    else{
        wrongRef.hidden = false; // Visar wrongRef. //
    }
}