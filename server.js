const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "items.json";

// Create the file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([
        { id: 1, name: "MrBeast", votes: 10 },
        { id: 2, name: "IShowSpeed", votes: 8 },
        { id: 3, name: "Blue Raspberry Prime", votes: 5 }
    ]));
}

// Get all items (sorted by votes)
app.get("/api/items", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.sort((a, b) => b.votes - a.votes);
    res.json(data);
});

// Vote for an item
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

// Add a new item
app.post("/api/add", (req, res) => {
    const { name } = req.body;
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    const newItem = { id: Date.now(), name, votes: 1 };
    data.push(newItem);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
});

app.listen(3000, () => console.log("🔥 RANKER READY: http://localhost:3000"));