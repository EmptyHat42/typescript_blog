const createBlogRef = document.querySelector("#createBlog");
function init() {
    if (createBlogRef) {
        createBlogRef.addEventListener("submit", saveBlog);
    }
}
window.onload = init;
const maxPosts = 5;
function saveBlog(event) {
    event.preventDefault();
    const savedPosts = localStorage.getItem("blogPosts");
    const blogPosts = savedPosts ? JSON.parse(savedPosts) : [];
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
                console.log("Blog post saved!", blogPosts);
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