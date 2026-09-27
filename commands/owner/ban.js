module.exports = {
    name: "ban",
    alias: [],
    category: "owner",
    description: "Ban user dari menggunakan bot",
    ownerOnly: true,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const target = ctx.extractTarget(msg, args);

        if (!target) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Tag/reply/sertakan nomor user yang ingin di-ban!"
            }, { quoted: msg.raw });
        }

        ctx.db.setUser(target, { banned: true });

        await sock.sendMessage(msg.chatId, {
            text: `✅ User @${target.split('@')[0]} berhasil di-ban dari bot.`,
            mentions: [target]
        }, { quoted: msg.raw });
    }
};