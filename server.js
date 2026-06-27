const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "items.json";
const CATEGORIES = ["youtubers", "games", "drinks", "music", "sports", "other"];

// REAL-LOOKING DATA with stats
const SEED_DATA = [
    // YouTubers - real subscriber counts (approx)
    { id: 1, name: "MrBeast", votes: 1247, category: "youtubers", stat: 343000000, statLabel: "subscribers", image: "🎬", weeklyChange: 12 },
    { id: 2, name: "IShowSpeed", votes: 892, category: "youtubers", stat: 38500000, statLabel: "subscribers", image: "⚡", weeklyChange: 28 },
    { id: 3, name: "Kai Cenat", votes: 678, category: "youtubers", stat: 12100000, statLabel: "subscribers", image: "🎙️", weeklyChange: 15 },
    { id: 4, name: "PewDiePie", votes: 1102, category: "youtubers", stat: 110000000, statLabel: "subscribers", image: "👊", weeklyChange: -2 },
    { id: 5, name: "Markiplier", votes: 534, category: "youtubers", stat: 36800000, statLabel: "subscribers", image: "🎮", weeklyChange: 3 },
    { id: 6, name: "Logan Paul", votes: 423, category: "youtubers", stat: 24000000, statLabel: "subscribers", image: "🥊", weeklyChange: 5 },
    { id: 7, name: "KSI", votes: 612, category: "youtubers", stat: 25200000, statLabel: "subscribers", image: "🎤", weeklyChange: 9 },
    { id: 8, name: "Dream", votes: 389, category: "youtubers", stat: 31800000, statLabel: "subscribers", image: "💚", weeklyChange: -5 },
    { id: 9, name: "Sidemen", votes: 567, category: "youtubers", stat: 23500000, statLabel: "subscribers", image: "👥", weeklyChange: 7 },
    { id: 10, name: "Ninja", votes: 298, category: "youtubers", stat: 24100000, statLabel: "subscribers", image: "🥷", weeklyChange: -8 },

    // Games - approx active players (millions)
    { id: 11, name: "Fortnite", votes: 1456, category: "games", stat: 250000000, statLabel: "monthly players", image: "🌪️", weeklyChange: 18 },
    { id: 12, name: "Minecraft", votes: 2103, category: "games", stat: 170000000, statLabel: "monthly players", image: "⛏️", weeklyChange: 5 },
    { id: 13, name: "GTA 5", votes: 1892, category: "games", stat: 195000000, statLabel: "copies sold", image: "🚗", weeklyChange: 22 },
    { id: 14, name: "Roblox", votes: 1234, category: "games", stat: 380000000, statLabel: "monthly players", image: "🟥", weeklyChange: 14 },
    { id: 15, name: "Call of Duty", votes: 987, category: "games", stat: 100000000, statLabel: "monthly players", image: "🔫", weeklyChange: -3 },
    { id: 16, name: "Valorant", votes: 765, category: "games", stat: 30000000, statLabel: "monthly players", image: "🎯", weeklyChange: 11 },
    { id: 17, name: "League of Legends", votes: 1145, category: "games", stat: 150000000, statLabel: "monthly players", image: "⚔️", weeklyChange: 4 },
    { id: 18, name: "Among Us", votes: 423, category: "games", stat: 60000000, statLabel: "monthly players", image: "👨‍🚀", weeklyChange: -12 },
    { id: 19, name: "Counter-Strike 2", votes: 876, category: "games", stat: 32000000, statLabel: "monthly players", image: "💣", weeklyChange: 8 },
    { id: 20, name: "Apex Legends", votes: 654, category: "games", stat: 130000000, statLabel: "monthly players", image: "🎯", weeklyChange: -1 },

    // Drinks
    { id: 21, name: "Prime Hydration", votes: 1567, category: "drinks", stat: 1200000000, statLabel: "bottles sold", image: "💧", weeklyChange: 25 },
    { id: 22, name: "Red Bull", votes: 1234, category: "drinks", stat: 12100000000, statLabel: "cans sold/year", image: "🐂", weeklyChange: 3 },
    { id: 23, name: "Monster Energy", votes: 987, category: "drinks", stat: 6800000000, statLabel: "cans sold/year", image: "👹", weeklyChange: 5 },
    { id: 24, name: "Gatorade", votes: 765, category: "drinks", stat: 8000000000, statLabel: "bottles sold/year", image: "⚡", weeklyChange: 2 },
    { id: 25, name: "Coca-Cola", votes: 1876, category: "drinks", stat: 1900000000, statLabel: "cans daily", image: "🥤", weeklyChange: -1 },
    { id: 26, name: "Pepsi", votes: 1432, category: "drinks", stat: 1100000000, statLabel: "cans daily", image: "🔵", weeklyChange: 0 },
    { id: 27, name: "Sprite", votes: 678, category: "drinks", stat: 5500000000, statLabel: "cans sold/year", image: "🍋", weeklyChange: 4 },
    { id: 28, name: "Fanta", votes: 523, category: "drinks", stat: 4200000000, statLabel: "cans sold/year", image: "🍊", weeklyChange: 1 },
    { id: 29, name: "Bang Energy", votes: 345, category: "drinks", stat: 1800000000, statLabel: "cans sold/year", image: "💥", weeklyChange: -7 },
    { id: 30, name: "Celsius", votes: 489, category: "drinks", stat: 900000000, statLabel: "cans sold/year", image: "🔥", weeklyChange: 19 },

    // Music
    { id: 31, name: "Drake", votes: 1245, category: "music", stat: 95000000, statLabel: "monthly Spotify listeners", image: "🦉", weeklyChange: 6 },
    { id: 32, name: "Taylor Swift", votes: 2134, category: "music", stat: 108000000, statLabel: "monthly Spotify listeners", image: "🌟", weeklyChange: 14 },
    { id: 33, name: "Kendrick Lamar", votes: 1678, category: "music", stat: 65000000, statLabel: "monthly Spotify listeners", image: "👑", weeklyChange: 32 },
    { id: 34, name: "The Weeknd", votes: 1456, category: "music", stat: 110000000, statLabel: "monthly Spotify listeners", image: "🌙", weeklyChange: 8 },
    { id: 35, name: "Bad Bunny", votes: 1543, category: "music", stat: 78000000, statLabel: "monthly Spotify listeners", image: "🐰", weeklyChange: 11 },
    { id: 36, name: "Travis Scott", votes: 1234, category: "music", stat: 56000000, statLabel: "monthly Spotify listeners", image: "🌵", weeklyChange: 5 },
    { id: 37, name: "Eminem", votes: 1876, category: "music", stat: 80000000, statLabel: "monthly Spotify listeners", image: "🎤", weeklyChange: 4 },
    { id: 38, name: "Billie Eilish", votes: 1345, category: "music", stat: 75000000, statLabel: "monthly Spotify listeners", image: "💚", weeklyChange: 7 },
    { id: 39, name: "Post Malone", votes: 987, category: "music", stat: 62000000, statLabel: "monthly Spotify listeners", image: "🎸", weeklyChange: -2 },
    { id: 40, name: "Ariana Grande", votes: 1123, category: "music", stat: 70000000, statLabel: "monthly Spotify listeners", image: "🎀", weeklyChange: 3 },

    // Sports
    { id: 41, name: "Lionel Messi", votes: 2876, category: "sports", stat: 506000000, statLabel: "Instagram followers", image: "🇦🇷", weeklyChange: 9 },
    { id: 42, name: "Cristiano Ronaldo", votes: 2945, category: "sports", stat: 645000000, statLabel: "Instagram followers", image: "🇵🇹", weeklyChange: 12 },
    { id: 43, name: "LeBron James", votes: 1876, category: "sports", stat: 161000000, statLabel: "Instagram followers", image: "🏀", weeklyChange: 7 },
    { id: 44, name: "Michael Jordan", votes: 2134, category: "sports", stat: 32000000, statLabel: "Instagram followers", image: "🐐", weeklyChange: 3 },
    { id: 45, name: "Stephen Curry", votes: 1567, category: "sports", stat: 56000000, statLabel: "Instagram followers", image: "🎯", weeklyChange: 5 },
    { id: 46, name: "Kylian Mbappé", votes: 1234, category: "sports", stat: 124000000, statLabel: "Instagram followers", image: "⚡", weeklyChange: 18 },
    { id: 47, name: "Neymar Jr", votes: 987, category: "sports", stat: 230000000, statLabel: "Instagram followers", image: "🇧🇷", weeklyChange: 2 },
    { id: 48, name: "Tom Brady", votes: 1456, category: "sports", stat: 15800000, statLabel: "Instagram followers", image: "🏈", weeklyChange: 1 },
    { id: 49, name: "Serena Williams", votes: 876, category: "sports", stat: 17000000, statLabel: "Instagram followers", image: "🎾", weeklyChange: 4 },
    { id: 50, name: "Kobe Bryant", votes: 2345, category: "sports", stat: 22000000, statLabel: "Instagram followers", image: "🐍", weeklyChange: 6 }
];

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA));
}

// API Routes
app.get("/api/items", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const category = req.query.category;
    let filtered = data;
    if (category && category !== "all") {
        filtered = data.filter(item => item.category === category);
    }
    // Sort by combined score: stat weight + vote weight
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
        votes: 1,
        stat: 0,
        statLabel: "community pick",
        image: "🐐",
        weeklyChange: 0,
        isNew: true
    };
    data.push(newItem);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
});

// Category page route
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