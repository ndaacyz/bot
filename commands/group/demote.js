module.exports = {
    name: "demote",
    alias: ["turunkanadmin"],
    category: "group",
    description: "Turunkan admin menjadi member biasa",
    ownerOnly: false,
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args, ctx) => {
        const target = ctx.extractTarget(msg, args);

        if (!target) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Tag/reply admin yang ingin diturunkan!"
            }, { quoted: msg.raw });
        }

        try {
            await sock.groupParticipantsUpdate(msg.chatId, [target], 'demote');
            await sock.sendMessage(msg.chatId, {
                text: `✅ Berhasil menurunkan @${target.split('@')[0]} dari admin`,
                mentions: [target]
            }, { quoted: msg.raw });
        } catch (e) {
            await sock.sendMessage(msg.chatId, {
                text: `❌ Gagal demote: ${e.message}`
            }, { quoted: msg.raw });
        }
    }
};