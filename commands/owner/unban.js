module.exports = {
    name: "unban",
    alias: [],
    category: "owner",
    description: "Unban user",
    ownerOnly: true,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const target = ctx.extractTarget(msg, args);

        if (!target) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Tag/reply/sertakan nomor user yang ingin di-unban!"
            }, { quoted: msg.raw });
        }

        ctx.db.setUser(target, { banned: false });

        await sock.sendMessage(msg.chatId, {
            text: `✅ User @${target.split('@')[0]} berhasil di-unban.`,
            mentions: [target]
        }, { quoted: msg.raw });
    }
};