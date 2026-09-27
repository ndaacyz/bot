module.exports = {
    botName: "MyBot",
    ownerNumber: ["6281234567890"], // Ganti dengan nomor owner (tanpa + dan spasi)
    ownerName: "Admin",
    prefix: ".", // Bisa diganti array: [".", "!", "#"]
    sessionName: "auth",
    databasePath: "./database",
    autoRead: false,
    autoTyping: false,
    publicMode: true, // false = hanya owner yang bisa pakai bot
    footerMenu: "Powered by Baileys",
    linkPreview: false,
    timezone: "Asia/Jakarta",
    autoSaveInterval: 30000, // 30 detik
    defaultUser: {
        name: "",
        level: 1,
        exp: 0,
        money: 0,
        banned: false,
        registered: false,
        registeredAt: null
    },
    defaultGroup: {
        name: "",
        welcome: true,
        antilink: false,
        muted: false,
        createdAt: null
    }
};