async function loadList() {
    const res = await fetch("/api/items");
    const items = await res.json();
    const list = document.getElementById("rankList");
    list.innerHTML = "";

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item-card";
        div.innerHTML = `
            <div class="left-side">
                <span class="rank-num">#${index + 1}</span>
                <span class="item-name">${item.name}</span>
            </div>
            <div class="right-side">
                <span class="vote-count">${item.votes}</span>
                <div class="upvote-btn" onclick="vote(${item.id})">🔺</div>
            </div>
        `;
        list.appendChild(div);
    });
}

async function vote(id) {
    await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    loadList();
}

async function addItem() {
    const input = document.getElementById("nameInput");
    const name = input.value.trim();
    if (!name) return;

    await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });

    input.value = "";
    loadList();
}

// Enter key submits
document.getElementById("nameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addItem();
});

loadList();