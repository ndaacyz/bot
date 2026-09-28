require('dotenv').config();

module.exports = {
    botName: "MyBot",
    ownerNumber: ["6281234567890"],
    ownerName: "Admin",
    prefix: ".",
    sessionName: "auth",
    databasePath: "./database",
    autoRead: false,
    autoTyping: false,
    publicMode: true,
    footerMenu: "Powered by Baileys",
    linkPreview: false,
    timezone: "Asia/Jakarta",
    autoSaveInterval: 30000,
    
    // ==== AI Configuration ====
    ai: {
        apiKey: process.env.ATRIA_API_KEY,
        model: "Atria-Dawn-Preview",
        maxHistoryLength: 10, // Jumlah history percakapan yang disimpan per user
        systemPrompt: "Kamu adalah asisten AI yang ramah dan membantu dalam Bahasa Indonesia."
    },

    defaultUser: {
        name: "",
        level: 1,
        exp: 0,
        money: 0,
        banned: false,
        registered: false,
        registeredAt: null,
        aiHistory: [] // Menyimpan history percakapan AI
    },
    defaultGroup: {
        name: "",
        welcome: true,
        antilink: false,
        muted: false,
        createdAt: null
    }
};