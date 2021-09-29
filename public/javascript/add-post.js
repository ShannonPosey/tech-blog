async function addNewPost(event) {
    event.preventDefault();

    const title = document.querySelector("#post-title").value.trim();
    const text = document.querySelector("post-text").value.trim();

    const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
            title,
            text
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        document.location.replace("/dashboard")
    }
    else {
        alert(response.statusText);
    }
};

document.querySelector(".add-post").addEventListener("submit", addNewPost);