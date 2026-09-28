module.exports = {
    name: "resetai",
    alias: ["clearai", "resetchat"],
    category: "ai",
    description: "Reset history percakapan AI",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const { db, sender } = ctx;

        db.setUser(sender, { aiHistory: [] });

        await sock.sendMessage(msg.chatId, {
            text: "✅ History percakapan AI berhasil direset!"
        }, { quoted: msg.raw });
    }
};