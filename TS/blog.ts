const createBlogRef = document.querySelector<HTMLFormElement>("#createBlog");
let postBlogRef = document.querySelector<HTMLElement>("#allBlogPosts");

// Init funktionen kollar ifall element existerar då vi använder koden på två sidor samtidigt //
function init(): void {
    if (createBlogRef) {
        createBlogRef.addEventListener("submit", saveBlog);
    }
    if (postBlogRef) {
        displayBlog();
    }
}
window.onload = init;

// Funktion för att spara blogginlägg via submit-knappen på skapa_blogg.html //
function saveBlog(event: SubmitEvent): void {
    event.preventDefault();
    const maxPosts: number = 5; // Vår limit på antal posts //
    
    /*
    Hämtar data från localStorage
    OM data finns omvandlas JSON-strängen till en array
    med objekt som har samma struktur som BlogPost
    ANNARS spara som tom array att fylla
    */
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

    // Hämtar data från htlm. <HTMLInputElement>/<HTMLTextAreaElement> används för att TS ska förstå vad det är för typ av element som hämtas //
    const titleInput = document.querySelector<HTMLInputElement>("#Title");
    const textInput = document.querySelector<HTMLTextAreaElement>("#blogText");

    /* 
    Så länge det inte finns fler blogginlägg än maxPosts
    och OM det finns både title- och text-input
    Spara datan som BlogPost objekt, pusha till vår BlogPost array,
    gör om arrayen till en JSON-string, och spara detta i localStorage
    sist skickar den tillbaka till blogg.html
    */
    if (blogPosts.length < maxPosts) {
        if (titleInput && textInput) {
            const title = titleInput.value;
            const text = textInput.value;
            const newPost = new BlogPost(title, text);

            blogPosts.push(newPost);

            try {
                localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
                window.location.href = "blogg.html";
            } catch (error) {
                console.error("Could not save blog post:", error);
                alert("Kunde inte spara blogginlägget.");
            }
        }
    }
    else {
        alert("Du kan inte skapa fler blogginlägg. Ta bort några och försök igen.");
    }
}

// Funktion för att ta bort blogginlägg //
function deleteBlog(postId: string): void {
    // Se rad 20 //
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

    /* 
    .filter används för att ta bort BlogPost objektet med samma id som den fått via postId: string
    den skapar då en helt ny array utan objektet med det id't
    den sparar sen den nya arrayen i localStorage
    sidan uppdateras för att vi ska se den nya strukturen direkt
    knappen byggs senare inuti displayBlog
    */
    blogPosts = blogPosts.filter(post => {
        return post.id !== postId;
    });

    try {
        localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
        window.location.reload();
    } catch (error) {
        console.error("Could not remove post:", error);
        alert("Kunde inte ta bort blogginlägget.");
    }

}

/* 
Funktion för att spara kommentarer  
den väntar på eventListener och ett id-värde för att kommentaren ska sparas i rätt objekt
*/
function saveComment(event: Event, postId: string): void {
    event.preventDefault();
    const maxComments: number = 5;

    // Se rad 20 //
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

    /*
    event.currentTarget hämtar formuläret som knappen är kopplad till
    as HTMLFormElement berätta för TS att det är ett form-element
    */
    const form = event.currentTarget as HTMLFormElement;
    /*
    Söker efter textarea i just det formuläret så rätt kommentarstext
    hämtas även om det finns fler formulär på sidan
    */
    const textInput = form.querySelector("textarea")

    /*
    .find används på liknande sätt som .filter på rad 84
    letar igenom vår BlogPost array efter id som matchar postId: string
    */
    const selectedPost = blogPosts.find(post => {
        return post.id === postId;
    });

    /*
    OM den hittar rätt id
    och OM det inte finns för många kommentarer
    och OM det finns en textarea
    skapa ett Comment objekt och pusha till BlogPost med rätt id
    Spara sen i localStorage och ladda om sidan för att se kommentaren
    */
    if (selectedPost) {
        if (selectedPost.comments.length < maxComments) {
            if (textInput) {
                const text = textInput.value;
                const newComment = new Comment(text);

                selectedPost.comments.push(newComment);

                try {
                    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
                    window.location.reload();
                } catch (error) {
                    console.error("Could not save Comment:", error);
                    alert("Kunde inte spara blogginlägget.");
                }

            }
        }
        else {
            alert("Du kan inte lägga till fler kommentarer på det här inlägget.");
        }
    }
}

// Funktion för att visa blogginläggen på blogg.html //
function displayBlog(): void {
    // Se rad 20 //
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

    // OM det inte finns några sparade inlägg så visa detta meddelande //
    if (blogPosts.length === 0) {
        const noPosts = createCustomElement("p", "Det finns inga blogginlägg. Logga in och skapa några!")
        postBlogRef?.appendChild(noPosts);
        return;
    }

    /*
    Går igenom alla BlogPost objekt i våran BlogPost array
    skapar sedan dynamiskt ett element i taget med createCustomElement funktionen

    PS. Kom på nu när jag skriver kommentarer att jag hade kunnat ha ett till värde
        i createCustomElement för att appenda också. Men kände på slutet att jag inte
        hade ork att fixa detta.
    */
    blogPosts.forEach(post => {
        const sectionOne = createCustomElement("section", "", "blog-post");

        const sectionTwo = createCustomElement("section", "", "text-section");
        sectionOne.appendChild(sectionTwo);

        const divOne = createCustomElement("div", "", "separator-two");
        sectionTwo.appendChild(divOne);

        let element = createCustomElement("h3", post.title);
        divOne.appendChild(element);

        element = createCustomElement("h4", post.user);
        divOne.appendChild(element);

        element = createCustomElement("p", post.text);
        sectionTwo.appendChild(element);

        element = createCustomElement("p", post.date, "dateOnRight");
        sectionTwo.appendChild(element);

        element = createCustomElement("hr");
        sectionOne.appendChild(element);

        const sectionThree = createCustomElement("section");
        sectionOne.appendChild(sectionThree);

        element = createCustomElement("h3", "Kommentarer:");
        sectionThree.appendChild(element);

        /*
        Då kommentarer är en egen array inuti BlogPost så
        loopar den igenom dessa för att skapas korrekt och
        så att alla kommentarer kommer med
        */
        post.comments.forEach(comment => {

            const sectionFour = createCustomElement("section", "", "text-section");
            sectionThree.appendChild(sectionFour);

            const divTwo = createCustomElement("div", "", "separator-two");
            sectionFour.appendChild(divTwo);

            element = createCustomElement("h3", comment.user);
            divTwo.appendChild(element);

            element = createCustomElement("p", comment.date);
            divTwo.appendChild(element);

            element = createCustomElement("p", comment.text);
            sectionFour.appendChild(element);
        });

        element = createCustomElement("hr");
        sectionOne.appendChild(element);

        const sectionFive = createCustomElement("section");
        sectionOne.appendChild(sectionFive);

        /*
        OM man är inloggad så skapas dessa element för att kunna kommentera.
        ANNARS så visas en text som säger att man måste vara inloggad
        */
        if (isLoggedIn()) {
            element = createCustomElement("h3", "Lämna en kommentar");
            sectionFive.appendChild(element);

            /*
            skapar funktionalitet för submit-knappen inuti createCommentForm funktionen
            för att spara kommentarer
            sparar ett unikt id för kommentarsfältet baserat på blogginläggets
            id så att varje formulär har ett eget textarea-id
            detta just för att vi sätter ett id på textarean och vi vill inte
            använda samma id för flera element, samt att label kopplas till rätt textarea
            */
            const commentForm = createCommentForm(`comment-${post.id}`, 20);
            commentForm.addEventListener("submit", event => {
                saveComment(event, post.id);
            });
            sectionOne.appendChild(commentForm);

            element = createCustomElement("hr");
            sectionOne.appendChild(element);

            /*
            I princip samma funktionalitet som ovanstående EventListener
            bara att vi tar det på click i stället då vi går på en knapp
            och inte en submit inuti en form.
            */
            const deleteButton = createCustomElement("button", "Ta bort inlägg", "deleteBtn")
            deleteButton.addEventListener("click", () => {
                deleteBlog(post.id);
            });
            sectionOne.appendChild(deleteButton);
        } else {
            element = createCustomElement("h3", "Du måste vara inloggad för att kommentera och skapa inlägg.");
            sectionOne.appendChild(element);
        }
        // prepend används i stället för appendChild för att nya bloginlägg ska hamna längst upp //
        postBlogRef?.prepend(sectionOne);
    });
}

/* 
Funktion för att skapa element inuti blogginlägget
Text och css klasser har basvärden av tomma strängar
då dessa inte behövs för alla element
*/
function createCustomElement(elementType: string, addText: string = "", addClass: string = "") {
    const element = document.createElement(elementType);
    element.textContent = addText;
    element.className = addClass;
    return element;
}

/*
Kanske lite onödig funktion då denna endast körs en gång per 
blog post men den skapar upp vårt form-objekt för att snygga
till displayBlog funktionen något

funkar som createCustomElement bara att den behöver mer
och mer specifika attribut
*/
function createCommentForm(labelIdName: string, rows: number) {
    const form = document.createElement("form");

    const paraOne = document.createElement("p");
    form.appendChild(paraOne);

    let labelElement = document.createElement("label");
    labelElement.htmlFor = labelIdName;
    paraOne.appendChild(labelElement);

    let textAreaElement = document.createElement("textarea");
    textAreaElement.id = labelIdName;
    textAreaElement.name = labelIdName;
    textAreaElement.rows = rows;
    textAreaElement.placeholder = "Skriv din kommentar här...";
    textAreaElement.required = true;
    paraOne.appendChild(textAreaElement);

    const paraTwo = document.createElement("p");
    form.appendChild(paraTwo);
    const submitElement = document.createElement("input");
    submitElement.type = "submit";
    submitElement.value = "Lämna kommentar";
    paraTwo.appendChild(submitElement);

    return form;
}

// Funktion för att kolla om man är inloggad så sidan dynamiskt kan visa/dölja element //
function isLoggedIn(): boolean {
    const name = localStorage.getItem("loginName");
    const password = localStorage.getItem("correctPassword");

    if (name === "Kalle" && password === "true") {
        return true;
    } else {
        return false;
    }
}

// Klass för BlogPost objekt //
class BlogPost {
    title: string;
    user: string;
    text: string;
    date: string;
    comments: Comment[];

    id: string;

    /* 
    Konstruktorn behöver enbart ta två värden då de andra skapas beroende på annat
    De ända värdena som hämtas från skapa_blogg.html är titel och text

    user hämtas direkt från localStorage

    date hämtar datum från browsern och formaterar detta enligt svensk standard
    alltså YYYY-MM-DD

    comments skapas som en tom array och datan från våra Comment objekt

    id skapas som randomUUID för att lätt kunna urskilja olika blogginlägg från varandra
    */
    constructor(title: string, text: string) {
        this.title = title;
        this.user = localStorage.getItem("loginName") ?? "Okänd användare";
        this.text = text;
        this.date = new Date().toLocaleDateString("sv-SE");
        this.comments = [];
        this.id = crypto.randomUUID();
    }
}

/*
Klass för Comment objekt
samma funktionalitet som ovan fast med mindre värden.

PS: kanske skulle kunna byggt det genom att ärva BlogPost
    men inte helt hundra på hur man jobbar med arv så
    det fick bli så här
*/
class Comment {
    user: string;
    text: string;
    date: string;

    constructor(text: string) {
        this.user = localStorage.getItem("loginName") ?? "Okänd användare";
        this.text = text;
        this.date = new Date().toLocaleDateString("sv-SE");
    }
}