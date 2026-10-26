const createBlogRef = document.querySelector<HTMLFormElement>("#createBlog");
let postBlogRef = document.querySelector<HTMLElement>("#allBlogPosts");

function init(): void {
    if (createBlogRef) {
        createBlogRef.addEventListener("submit", saveBlog);
    }
    if (postBlogRef) {
        displayBlog();
    }
}
window.onload = init;


const maxPosts: number = 5;
function saveBlog(event: SubmitEvent): void {
    event.preventDefault();
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];

    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }
    const titleInput = document.querySelector<HTMLInputElement>("#Title");
    const textInput = document.querySelector<HTMLTextAreaElement>("#blogText");
    console.log(blogPosts);

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

function deleteBlog(postId: string): void {
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

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

const maxComments: number = 5;
function saveComment(event: Event, postId: string): void {
    event.preventDefault();

    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

    const form = event.currentTarget as HTMLFormElement;
    const textInput = form.querySelector("textarea")

    const selectedPost = blogPosts.find(post => {
        return post.id === postId;
    });

    if (selectedPost) {
        if (selectedPost.comments.length < maxComments) {
            if (textInput) {
                const text = textInput?.value;
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

function displayBlog(): void {
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts: BlogPost[];
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [];
    }

    if(blogPosts.length === 0){
        const noPosts = createCustomElement ("p", "Det finns inga blogginlägg. Logga in och skapa några!")
        postBlogRef?.appendChild(noPosts);
        return;
    }

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
        if (isLoggedIn()) {
            element = createCustomElement("h3", "Lämna en kommentar");
            sectionFive.appendChild(element);

            const commentForm = createCommentForm(`comment-${post.id}`, 20);
            commentForm.addEventListener("submit", event => {
                saveComment(event, post.id);
            });
            sectionOne.appendChild(commentForm);
        } else {
            element = createCustomElement("h3", "Du måste vara inloggad för att kommentera och skapa inlägg.");
            sectionOne.appendChild(element);
        }

        if (isLoggedIn()) {
            const deleteButton = createCustomElement("button", "Ta bort inlägg", "deleteBtn")
            deleteButton.addEventListener("click", () => {
                deleteBlog(post.id);
            });
            sectionOne.appendChild(deleteButton);
        }
        postBlogRef?.appendChild(sectionOne);
    });
}

function createCustomElement(elementType: string, addText: string = "", addClass: string = "") {
    const element = document.createElement(elementType);
    element.textContent = addText;
    element.className = addClass;
    return element;
}

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

function isLoggedIn(): boolean {
    const name = localStorage.getItem("loginName");
    const password = localStorage.getItem("correctPassword");

    if (name === "Kalle" && password === "true") {
        return true;
    } else {
        return false;
    }
}

class BlogPost {
    title: string;
    user: string;
    text: string;
    date: string;
    comments: Comment[];

    id: string;

    constructor(title: string, text: string) {
        this.title = title;
        this.user = localStorage.getItem("loginName") ?? "Okänd användare";
        this.text = text;
        this.date = new Date().toLocaleDateString("sv-SE");
        this.comments = [];
        this.id = crypto.randomUUID();
    }
}

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