const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "items.json";
const CATEGORIES = ["youtubers", "games", "drinks", "music", "sports", "other"];

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([
        { id: 1, name: "MrBeast", votes: 10, category: "youtubers" },
        { id: 2, name: "IShowSpeed", votes: 8, category: "youtubers" },
        { id: 3, name: "Kai Cenat", votes: 7, category: "youtubers" },
        { id: 4, name: "Fortnite", votes: 15, category: "games" },
        { id: 5, name: "Minecraft", votes: 20, category: "games" },
        { id: 6, name: "GTA 6", votes: 18, category: "games" },
        { id: 7, name: "Blue Raspberry Prime", votes: 12, category: "drinks" },
        { id: 8, name: "Red Bull", votes: 9, category: "drinks" },
        { id: 9, name: "Monster", votes: 7, category: "drinks" },
        { id: 10, name: "Drake", votes: 11, category: "music" },
        { id: 11, name: "Kendrick Lamar", votes: 14, category: "music" },
        { id: 12, name: "Messi", votes: 25, category: "sports" },
        { id: 13, name: "Ronaldo", votes: 23, category: "sports" }
    ]));
}

// API Routes
app.get("/api/items", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const category = req.query.category;
    let filtered = data;
    if (category && category !== "all") {
        filtered = data.filter(item => item.category === category);
    }
    filtered.sort((a, b) => b.votes - a.votes);
    res.json(filtered);
});

app.post("/api/vote", (req, res) => {
    const { id } = req.body;
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    const item = data.find(i => i.id === id);
    if (item) {
        item.votes += 1;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json(item);
    } else {
        res.status(404).send("Not found");
    }
});

app.post("/api/add", (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) return res.status(400).send("Missing fields");
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    const newItem = { 
        id: Date.now(), 
        name, 
        category: CATEGORIES.includes(category) ? category : "other",
        votes: 1 
    };
    data.push(newItem);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
});

// Category page route - MUST come after API routes
app.get("/:category", (req, res) => {
    const category = req.params.category;
    if (CATEGORIES.includes(category)) {
        res.sendFile(path.join(__dirname, "public", "category.html"));
    } else {
        res.redirect("/");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 RANKER READY on port ${PORT}`));