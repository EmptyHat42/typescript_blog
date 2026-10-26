const createBlogRef = document.querySelector("#createBlog");
let postBlogRef = document.querySelector("#allBlogPosts");
function init() {
    if (createBlogRef) {
        createBlogRef.addEventListener("submit", saveBlog);
    }
    if (postBlogRef) {
        displayBlog();
    }
}
window.onload = init;
const maxPosts = 5;
function saveBlog(event) {
    event.preventDefault();
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts;
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    }
    else {
        blogPosts = [];
    }
    const titleInput = document.querySelector("#Title");
    const textInput = document.querySelector("#blogText");
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
            }
            catch (error) {
                console.error("Could not save blog post:", error);
                alert("Kunde inte spara blogginlägget.");
            }
        }
    }
    else {
        alert("Du kan inte skapa fler blogginlägg. Ta bort några och försök igen.");
    }
}
function deleteBlog(postId) {
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts;
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    }
    else {
        blogPosts = [];
    }
    blogPosts = blogPosts.filter(post => {
        return post.id !== postId;
    });
    try {
        localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
        window.location.reload();
    }
    catch (error) {
        console.error("Could not remove post:", error);
        alert("Kunde inte ta bort blogginlägget.");
    }
}
const maxComments = 5;
function saveComment(event, postId) {
    event.preventDefault();
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts;
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    }
    else {
        blogPosts = [];
    }
    const form = event.currentTarget;
    const textInput = form.querySelector("textarea");
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
                }
                catch (error) {
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
function displayBlog() {
    const savedPosts = localStorage.getItem("blogPosts");
    let blogPosts;
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    }
    else {
        blogPosts = [];
    }
    if (blogPosts.length === 0) {
        const noPosts = createCustomElement("p", "Det finns inga blogginlägg. Logga in och skapa några!");
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
        }
        else {
            element = createCustomElement("h3", "Du måste vara inloggad för att kommentera och skapa inlägg.");
            sectionOne.appendChild(element);
        }
        if (isLoggedIn()) {
            const deleteButton = createCustomElement("button", "Ta bort inlägg", "deleteBtn");
            deleteButton.addEventListener("click", () => {
                deleteBlog(post.id);
            });
            sectionOne.appendChild(deleteButton);
        }
        postBlogRef?.appendChild(sectionOne);
    });
}
function createCustomElement(elementType, addText = "", addClass = "") {
    const element = document.createElement(elementType);
    element.textContent = addText;
    element.className = addClass;
    return element;
}
function createCommentForm(labelIdName, rows) {
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
function isLoggedIn() {
    const name = localStorage.getItem("loginName");
    const password = localStorage.getItem("correctPassword");
    if (name === "Kalle" && password === "true") {
        return true;
    }
    else {
        return false;
    }
}
class BlogPost {
    constructor(title, text) {
        this.title = title;
        this.user = localStorage.getItem("loginName") ?? "Okänd användare";
        this.text = text;
        this.date = new Date().toLocaleDateString("sv-SE");
        this.comments = [];
        this.id = crypto.randomUUID();
    }
}
class Comment {
    constructor(text) {
        this.user = localStorage.getItem("loginName") ?? "Okänd användare";
        this.text = text;
        this.date = new Date().toLocaleDateString("sv-SE");
    }
}
export {};
//# sourceMappingURL=blog.js.map