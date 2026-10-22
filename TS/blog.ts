const createBlogRef = document.querySelector<HTMLFormElement>("#createBlog");

function init(): void {
    if (createBlogRef) {
        createBlogRef.addEventListener("submit", saveBlog);
    }
}
window.onload = init;


const maxPosts: number = 5;
function saveBlog(event: SubmitEvent): void {
    event.preventDefault();
    const savedPosts = localStorage.getItem("blogPosts");
    const blogPosts: BlogPost[] = savedPosts ? JSON.parse(savedPosts) : [];
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
                console.log("Blog post saved!", blogPosts);
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