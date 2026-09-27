module.exports = {
    name: "restart",
    alias: ["reboot"],
    category: "owner",
    description: "Restart bot",
    ownerOnly: true,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        await sock.sendMessage(msg.chatId, {
            text: "🔄 Bot sedang restart..."
        }, { quoted: msg.raw });

        ctx.db.saveDatabase();

        setTimeout(() => {
            process.exit(0); // Gunakan PM2/forever untuk auto restart
        }, 1000);
    }
};